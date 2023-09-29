import { useState, useEffect } from "react";
import { Section, Input, InputSelect } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { srSchema } from "../../../schema/public/sr/srSchema";
import {
	AddMaterialStockOne,
	GetAllDispatch,
	GetAllWorkerCenter,
	AddSr,
	GetAllEquipment,
	GetAllSupplier
} from "../../../services";
import { getIdUser } from "../../../configs/session";
import { Plus, Trash2 } from "react-feather";
import { toast } from "react-toastify";
import moment from "moment";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	dispacthIDS: string;
	userId: any;
	worId: string;
	date_sr: any;
	SrDetail: [
		{
			dispacthdetailId: any;
			workCenterId: string;
			description: string;
			part: string;
			unit: string;
			qty: string;
			note: string;
		}
	];
}

export const FormCreateApprovalSr = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listSupplier, setListSupplier] = useState<any>([]);

	const [isService, setIsService] = useState<boolean>(false);
	const [isOperasional, setIsOperasional] = useState<boolean>(false);
	const [isFormAddSpesifikasi, setIsFormAddSpesifikasi] =
		useState<boolean>(false);
	const [customer, setCustomer] = useState<string>("");
	const [subject, setSubject] = useState<string>("");
	const [jobNo, setJobNo] = useState<string>("");
	const [materialID, setMaterialID] = useState<string>("");
	const [satuan, setSatuan] = useState<string>("");
	const [listWor, setListWor] = useState<any>([]);
	const [listWorkCenter, setListWorkCenter] = useState<any>([]);
	const [listPart, setListPart] = useState<any>([]);
	const [listPartDispatch, setListPartDispatch] = useState<any>([]);
	const [listMaterialStock, setListMaterialStock] = useState<any>([]);
	const [data, setData] = useState<data>({
		dispacthIDS: "",
		userId: "",
		worId: "",
		date_sr: new Date(),
		SrDetail: [
			{
				dispacthdetailId: null,
				workCenterId: "",
				description: "",
				part: "",
				unit: "",
				qty: "",
				note: "",
			},
		],
	});
	const [dataSpesifikasi, setDataSpesifikasi] = useState<any>({
		spesifikasi: "",
	});

	useEffect(() => {
		getDispatch();
		getSupplier();
		getPart();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getDispatch = async () => {
		try {
			const response = await GetAllDispatch();
			if (response) {
				setListWor(response.data.result);
			}
		} catch (error) {}
	};

	const getSupplier = async () => {
		try {
			const response = await GetAllSupplier();
			if (response) {
				setListSupplier(response.data.result);
			}
		} catch (error) {}
	};

	const getPart = async () => {
		try {
			const response = await GetAllEquipment();
			if (response) {
				let newlistPart: any = [];
				response.data.result.map((res: any) => {
					res.eq_part.map((result: any) => {
						newlistPart.push(result);
					});
				});
				setListPart(newlistPart);
			}
		} catch (error) {}
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name === "worId") {
			if (event.target.value !== "no data") {
				let data = JSON.parse(event.target.value);
				let userID = getIdUser();
				let list_service: any = [];
				let list_part: any = [];
				if (data.srimg === undefined) {
					list_service.push({
						dispacthdetailId: null,
						workCenterId: "",
						description: "",
						part: "",
						unit: "",
						qty: 0,
						note: "",
					});
					setJobNo(data.job_no_mr);
					setSubject(data.subject);
					setCustomer(data.customerPo.quotations.Customer.name);
					setIsOperasional(true);
				} else {
					data.dispatchDetail.map((res: any) => {
						if (res.so) {
							data.srimg.srimgdetail.map((srimg: any) => {
								if (!list_part.includes(srimg.name_part)) {
									list_part.push(srimg.name_part);
								}
								if (srimg.name_part === res.part) {
									list_service.push({
										dispacthdetailId: res.id,
										workCenterId: res.workId,
										description: res.workCenter.name,
										part: res.part,
										unit: data.srimg.timeschedule.wor.unit,
										qty: srimg.qty,
										note: "",
									});
								}
							});
						}
					});
					setJobNo(data.srimg.timeschedule.wor.job_no);
					setSubject(data.srimg.timeschedule.wor.subject);
					setCustomer(
						data.srimg.timeschedule.wor.customerPo.quotations.Customer.name
					);
					setIsOperasional(false);
				}
				setData({
					dispacthIDS: data.id,
					userId: userID,
					worId:
						data.srimg === undefined ? data.id : data.srimg.timeschedule.wor.id,
					date_sr: new Date(),
					SrDetail: list_service,
				});
				setListPartDispatch(list_part);
				setIsService(true);
			} else {
				setJobNo("");
				setSubject("");
				setCustomer("");
				setListPartDispatch([]);
				setIsOperasional(false);
				setIsService(false);
			}
		}
	};

	const addSr = async (payload: data) => {
		setIsLoading(true);
		let listService: any = [];
		payload.SrDetail.map((res: any) => {
			listService.push({
				dispacthdetailId: res.dispacthdetailId,
				description: res.workCenterId,
				note: res.note,
				part: res.part,
				qty: parseInt(res.qty),
				unit: res.unit,
			});
		});
		let data = {
			dispacthIDS: payload.dispacthIDS,
			userId: payload.userId,
			worId: payload.worId,
			date_sr: payload.date_sr,
			SrDetail: listService,
		};

		try {
			const response = await AddSr(data);
			if (response.data) {
				toast.success("Add Service Request Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				showModal(false, content, true);
			}
		} catch (error) {
			toast.error("Add Service Request Failed", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		}
		setIsLoading(false);
	};

	const addMaterialStock = async (payload: any) => {
		setIsLoading(true);
		let listDetail: any = {
			materialId: materialID,
			spesifikasi: payload.spesifikasi,
			jumlah_Stock: 0,
			harga: 0,
		};
		try {
			const response = await AddMaterialStockOne(listDetail);
			if (response.data) {
				let newListMaterialStock: any = [];
				toast.success("Add Material Spesifikasi Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				listMaterialStock.map((res: any) => {
					newListMaterialStock.push(res);
				});
				newListMaterialStock.push({
					id: response.data.results.id,
					material: materialID,
					name: payload.spesifikasi,
					satuan: satuan,
				});
				setListMaterialStock(newListMaterialStock);
				setSatuan("");
				setMaterialID("");
				setIsFormAddSpesifikasi(false);
			}
		} catch (error) {
			toast.error("Add Material Spesifikasi Failed", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		}
		setIsLoading(false);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<Formik
				initialValues={{ ...data }}
				// validationSchema={srSchema}
				onSubmit={(values) => {
					addSr(values);
				}}
				enableReinitialize
			>
				{({
					handleChange,
					handleSubmit,
					setFieldValue,
					errors,
					touched,
					values,
				}) => (
					<Form onChange={handleOnChanges}>
						<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputSelect
									id='no_sr'
									name='no_sr'
									placeholder='No SR'
									label='No SR'
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option value='no data' selected>
										Choose No SR
									</option>
									{listWor.length === 0 ? (
										<option value='no data'>No Data</option>
									) : (
										listWor.map((res: any, i: number) => {
											return (
												<option
													value={JSON.stringify(res)}
													key={i}
													selected={
														res.srimg === undefined
															? res.job_no_mr === jobNo
															: res.srimg.timeschedule.wor.job_no === jobNo
													}
												>
													{res.srimg === undefined
														? res.job_no_mr
														: res.srimg.timeschedule.wor.job_no}
												</option>
											);
										})
									)}
								</InputSelect>
							</div>
							<div className='w-full'>
								<Input
									id='jobNo'
									name='jobNo'
									placeholder='Job No'
									label='Job No'
									type='text'
									value='22.222'
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='date'
									name='date'
									placeholder='Date Request Material'
									label='Date Request Material'
									type='text'
									value={moment(new Date()).format("DD-MMMM-YYYY")}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='requestBy'
									name='requestBy'
									placeholder='Request By'
									label='Request By'
									type='text'
									value=''
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<FieldArray
							name='SrDetail'
							render={(arraySr) =>
								values.SrDetail.map((result: any, i: number) => {
									return (
										<div key={i}>
											<Section className='grid md:grid-cols-6 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-4'>
												<div className='w-full'>
													<InputSelect
														id={`detailSr.${i}.type`}
														name={`detailSr.${i}.type`}
														placeholder='Type'
														label='Type'
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													>
														<option defaultValue='no data' selected>
															Choose Type
														</option>
														<option value='SO' selected>
															SO
														</option>
														<option value='DSO' selected>
															DSO
														</option>
													</InputSelect>
												</div>
												<div className='w-full'>
													<InputSelect
														id={`detailMr.${i}.suplier`}
														name={`detailMr.${i}.suplier`}
														placeholder='Suplier'
														label='Suplier'
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													>
														<option value='no data' selected>
															Choose Suplier
														</option>
														{listSupplier.length === 0 ? (
															<option value='no data'>No data</option>
														) : (
															listSupplier.map((res: any, i: number) => {
																return (
																	<option
																		value={JSON.stringify(res)}
																		key={i}
																		// selected={res.id === result.material}
																	>
																		{res.supplier_name}
																	</option>
																);
															})
														)}
													</InputSelect>
												</div>
												<div className='w-full'>
													<Input
														id={`SrDetail.${i}.part`}
														name={`SrDetail.${i}.part`}
														placeholder='Part/item'
														label='Part/item'
														type='text'
														disabled={true}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<Input
														id={`SrDetail.${i}.description`}
														name={`SrDetail.${i}.description`}
														placeholder='Service Description'
														label='Service Description'
														type='text'
														disabled={true}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<Input
														id={`SrDetail.${i}.qty`}
														name={`SrDetail.${i}.qty`}
														placeholder='Qty'
														label='Qty'
														type='text'
														disabled={true}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<Input
														id={`SrDetail.${i}.note`}
														name={`SrDetail.${i}.note`}
														placeholder='Note'
														label='Note'
														type='text'
														disabled={true}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
											</Section>
										</div>
									);
								})
							}
						/>
					</Form>
				)}
			</Formik>
		</div>
	);
};
