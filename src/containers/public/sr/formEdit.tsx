import { useState, useEffect } from "react";
import { Section, Input, InputSelect } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { srSchema } from "../../../schema/public/sr/srSchema";
import {
	AddMaterialStockOne,
	GetAllDispatch,
	GetAllWorkerCenter,
	EditSR,
	GetAllEquipment,
	DeleteSRDetail
} from "../../../services";
import { getIdUser } from "../../../configs/session";
import { Plus, Trash2 } from "react-feather";
import { toast } from "react-toastify";
import moment from "moment";

interface props {
	content: string;
	dataSelected: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	dispacthIDS: string;
	userId: any;
	worId: string;
	date_sr: any;
	SrDetail: [
		{
			id: string;
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

export const FormEditSr = ({ content, dataSelected, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
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
	const [listDeleteSR, setListDeleteSR] = useState<any>([]);
	const [data, setData] = useState<data>({
		dispacthIDS: "",
		userId: "",
		worId: "",
		date_sr: new Date(),
		SrDetail: [
			{
				id: "",
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
		getWorkCenter();
		getPart();
		settingData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		let listDetail: any = [];
		dataSelected.SrDetail.map((res: any) => {
			let part: any = res.part.split(" - ");
			listDetail.push({
				id: res.id,
				dispacthdetailId: res.dispacthdetailId,
				workCenterId: res.workCenter.id,
				description: res.workCenter.name,
				part: part[0],
				unit: res.unit,
				qty: res.qty,
				note: res.unit,
			});
		});
		getDispatch(
			dataSelected.dispacth === null ? dataSelected.wor : dataSelected.dispacth
		);
		setData({
			dispacthIDS: dataSelected.dispacthIDS,
			userId: dataSelected.userId,
			worId: dataSelected.worId,
			date_sr: dataSelected.date_sr,
			SrDetail: listDetail,
		});
		setIsService(true);
		setCustomer(
			dataSelected.wor.customerPo.quotations.Customer.name
		);
		setJobNo(dataSelected.job_no)
		setSubject(dataSelected.wor.subject);
	};

	const getDispatch = async (data: any) => {
		try {
			const response = await GetAllDispatch();
			if (response) {
				let wor: any = [];
				wor.push(data);
				response.data.result.map((res: any) => {
					wor.push(res);
				});
				setListWor(wor);
			}
		} catch (error) {}
	};

	const getWorkCenter = async () => {
		try {
			const response = await GetAllWorkerCenter();
			if (response) {
				setListWorkCenter(response.data.result);
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
					} else {
						list_service.push({
							dispacthdetailId: null,
							workCenterId: "",
							description: "",
							part: "",
							unit: "",
							qty: 0,
							note: "",
						});
					}
				});
				setJobNo(data.srimg.timeschedule.wor.job_no);
				setSubject(data.srimg.timeschedule.wor.subject);
				setCustomer(
					data.srimg.timeschedule.wor.customerPo.quotations.Customer.name
				);
				setData({
					dispacthIDS: data.id,
					userId: userID,
					worId: dataSelected.worId,
					date_sr: new Date(),
					SrDetail: list_service,
				});
				setIsOperasional(data.srimg.timeschedule.wor.job_operational);
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

	const editSr = async (payload: data) => {
		setIsLoading(true);
		let listService: any = [];
		payload.SrDetail.map((res: any) => {
			listService.push({
				id: res.id,
				srId: dataSelected.id,
				dispacthdetailId: res.dispacthdetailId,
				description: res.workCenterId,
				note: res.note,
				part: res.part,
				qty: parseInt(res.qty),
				unit: res.unit,
			});
		});

		listDeleteSR.map( (data:any) => {
			deleteSr(data)
		})

		try {
			const response = await EditSR(listService);
			if (response.data) {
				toast.success("Edit Service Request Success", {
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
			toast.error("Edit Service Request Failed", {
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

	const removeDetail = (data: any) => {
        let listDelete: any = listDeleteSR
        if(data.id !== ""){
            listDelete.push(data.id)
        }
		setListDeleteSR(listDelete)
    }

	const deleteSr = async (id: string) => {
		try {
			await DeleteSRDetail(id);
            return false
		} catch (error) {
            return false
		}
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{isFormAddSpesifikasi ? (
				<Formik
					initialValues={dataSpesifikasi}
					onSubmit={(values) => {
						addMaterialStock(values);
					}}
					enableReinitialize
				>
					{({ handleChange, handleSubmit, errors, touched, values }) => (
						<Form>
							<Section className='grid md:grid-cols-1 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<Input
										id='spesifikasi'
										name='spesifikasi'
										type='text'
										placeholder='Spesifikasi'
										label='Spesifikasi'
										onChange={handleChange}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
								<div className='mt-8 flex justify-end'>
									<div className='flex gap-2 items-center'>
										<button
											type='button'
											className='inline-flex justify-center rounded-full border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
											disabled={isLoading}
											onClick={() => {
												handleSubmit();
											}}
										>
											{isLoading ? (
												<>
													<svg
														role='status'
														className='inline mr-3 w-4 h-4 text-white animate-spin'
														viewBox='0 0 100 101'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<path
															d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
															fill='#E5E7EB'
														/>
														<path
															d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
															fill='currentColor'
														/>
													</svg>
													Loading
												</>
											) : (
												"save"
											)}
										</button>
										<button
											type='button'
											className='inline-flex justify-center rounded-full border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
											disabled={isLoading}
											onClick={() => {
												setIsFormAddSpesifikasi(false);
											}}
										>
											{isLoading ? (
												<>
													<svg
														role='status'
														className='inline mr-3 w-4 h-4 text-white animate-spin'
														viewBox='0 0 100 101'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<path
															d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
															fill='#E5E7EB'
														/>
														<path
															d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
															fill='currentColor'
														/>
													</svg>
													Loading
												</>
											) : (
												"cancel"
											)}
										</button>
									</div>
								</div>
							</Section>
						</Form>
					)}
				</Formik>
			) : (
				<div>
					<p className='hidden'>{JSON.stringify(data)}</p>
					<Formik
						initialValues={{ ...data }}
						// validationSchema={srSchema}
						onSubmit={(values) => {
							editSr(values);
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
								<h1 className='text-xl font-bold mt-3'>Service Request</h1>
								<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<Input
											id='date_sr'
											name='date_sr'
											placeholder='Date Service Material'
											label='Date Service Material'
											type='text'
											value={moment(values.date_sr).format("DD-MMMM-YYYY")}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<Input
											id='job_no'
											name='job_no'
											placeholder='Job No'
											label='Job No'
											type='text'
											value={jobNo}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
										{/* <InputSelect
											id='worId'
											name='worId'
											placeholder='Job No'
											label='Job No'
											onChange={(e: any) => {
												if (e.target.value === "no data") {
													setFieldValue("dispacthIDS", "");
												} else {
													let data = JSON.parse(e.target.value);
													setFieldValue("dispacthIDS", data.id);
												}
											}}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										>
											<option value='no data' selected>
												Choose Job No WOR
											</option>
											{listWor.length === 0 ? (
												<option value='no data'>No Data</option>
											) : (
												listWor.map((res: any, i: number) => {
													return (
														<option
															value={JSON.stringify(res)}
															key={i}
															selected={res.id === values.dispacthIDS}
														>
															{res.srimg === undefined
																? res.job_no_mr
																: res.srimg.timeschedule.wor.job_no}
														</option>
													);
												})
											)}
										</InputSelect> */}
									</div>
								</Section>
								<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<Input
											id='customer'
											name='customer'
											placeholder='Customer'
											label='Customer'
											type='text'
											value={customer}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<Input
											id='subject'
											name='subject'
											placeholder='Subject'
											label='Subject'
											type='text'
											value={subject}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
								</Section>
								{isService ? (
									<div>
										<FieldArray
											name='SrDetail'
											render={(arraySr) =>
												values.SrDetail.map((result: any, i: number) => {
													return (
														<div key={i}>
															<Section className='grid md:grid-cols-5 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-4'>
																<div className='w-full'>
																	<InputSelect
																		id={`detailSr.${i}.part`}
																		name={`detailSr.${i}.part`}
																		placeholder='Part'
																		label='Part'
																		onChange={(e: any) =>
																			setFieldValue(
																				`SrDetail.${i}.part`,
																				e.target.value
																			)
																		}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	>
																		<option value='no data' selected>
																			Choose Part
																		</option>
																		{listPart.map((res: any, idx: number) => {
																			return (
																				<option
																					value={res.nama_part}
																					key={idx}
																					selected={
																						res.nama_part === result.part
																					}
																				>
																					{res.nama_part} - {res.equipment.nama}
																				</option>
																			);
																		})}
																	</InputSelect>
																</div>
																<div className='w-full'>
																	<InputSelect
																		id={`detailSr.${i}.workCenterId`}
																		name={`detailSr.${i}.workCenterId`}
																		placeholder='Deskription'
																		label='Deskription'
																		onChange={(e: any) => {
																			if (e.target.value === "no data") {
																				setFieldValue(
																					`SrDetail.${i}.workCenterId`,
																					null
																				);
																			} else {
																				setFieldValue(
																					`SrDetail.${i}.workCenterId`,
																					e.target.value
																				);
																			}
																		}}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	>
																		<option value='no data' selected>
																			Choose Deskription
																		</option>
																		{listWorkCenter.map(
																			(res: any, idx: number) => {
																				return (
																					<option
																						value={res.id}
																						selected={
																							res.id === result.workCenterId
																						}
																						key={idx}
																					>
																						{res.name}
																					</option>
																				);
																			}
																		)}
																	</InputSelect>
																</div>
																<div className='w-full'>
																	<Input
																		id={`detailMr.${i}.qty`}
																		name={`detailMr.${i}.qty`}
																		placeholder='Quantity'
																		label='Quantity'
																		type='number'
																		onChange={(e: any) =>
																			setFieldValue(
																				`SrDetail.${i}.qty`,
																				e.target.value
																			)
																		}
																		disabled={
																			result.dispacthdetailId === null
																				? false
																				: true
																		}
																		value={result.qty}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	<Input
																		id={`detailMr.${i}.unit`}
																		name={`detailMr.${i}.unit`}
																		placeholder='Unit'
																		label='Unit'
																		type='text'
																		onChange={(e: any) =>
																			setFieldValue(
																				`SrDetail.${i}.unit`,
																				e.target.value
																			)
																		}
																		disabled={
																			result.dispacthdetailId === null
																				? false
																				: true
																		}
																		value={result.unit}
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
																		onChange={(e: any) =>
																			setFieldValue(
																				`SrDetail.${i}.note`,
																				e.target.value
																			)
																		}
																		value={result.note}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
															</Section>
															<div className='flex w-full'>
																{i + 1 === values.SrDetail.length ? (
																	<a
																		className='flex mt-2 text-[20px] text-blue-600 cursor-pointer hover:text-blue-400'
																		onClick={() =>
																			arraySr.push({
																				id: "",
																				dispacthdetailId: null,
																				workCenterId: "",
																				description: "",
																				part: "",
																				unit: "",
																				qty: "",
																				note: "",
																			})
																		}
																	>
																		<Plus size={23} className='mt-1' />
																		Add
																	</a>
																) : null}
																{i === 0 &&
																values.SrDetail.length === 1 ? null : (
																	<a
																		className='flex ml-4 mt-2 text-[20px] text-red-600 hover:text-red-400 cursor-pointer'
																		onClick={() => {
																			removeDetail(result);
																			arraySr.remove(i)
																		}}
																	>
																		<Trash2 size={22} className='mt-1 mr-1' />
																		Remove
																	</a>
																)}
															</div>
														</div>
													);
												})
											}
										/>
										<div className='mt-8 flex justify-end'>
											<div className='flex gap-2 items-center'>
												<button
													type='button'
													className='inline-flex justify-center rounded-full border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
													disabled={isLoading}
													onClick={() => {
														handleSubmit();
													}}
												>
													{isLoading ? (
														<>
															<svg
																role='status'
																className='inline mr-3 w-4 h-4 text-white animate-spin'
																viewBox='0 0 100 101'
																fill='none'
																xmlns='http://www.w3.org/2000/svg'
															>
																<path
																	d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
																	fill='#E5E7EB'
																/>
																<path
																	d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
																	fill='currentColor'
																/>
															</svg>
															Loading
														</>
													) : content === "add" ? (
														"Save"
													) : (
														"Edit"
													)}
												</button>
											</div>
										</div>
									</div>
								) : null}
							</Form>
						)}
					</Formik>
				</div>
			)}
		</div>
	);
};
