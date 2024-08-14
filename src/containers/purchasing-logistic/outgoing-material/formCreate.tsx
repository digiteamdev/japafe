import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputSelectSearch,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import {
	GetAllMaterial,
	GetAllEmploye,
	GetAllCoa,
	AddOutgoingMaterial,
	GetOutgoingMaterialAll,
	GetAllMaterialNew,
} from "../../../services";
import { toast } from "react-toastify";
import moment from "moment";
import { getIdUser } from "../../../configs/session";
import { Trash2, Plus } from "react-feather";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	date_outgoing_material: any;
	id_outgoing_material: string;
	mr: any;
	pb: any;
}

export const FormCreateOutgoingMaterial = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isType, setType] = useState<string>("dirrect");
	const [listRecieve, setListRecieve] = useState<any>([]);
	const [listCoa, setListCoa] = useState<any>([]);
	const [listEmploye, setListEmploye] = useState<any>([]);
	const [listMaterial, setListMaterial] = useState<any>([]);
	const [idPR, setIdPR] = useState<string>("");
	const [data, setData] = useState<data>({
		date_outgoing_material: new Date(),
		id_outgoing_material: "",
		mr: [
			{
				poandsoId: "",
				no_mr: "",
				idMr: "",
				materialName: "",
				job_no: "",
				requestBy: "",
				qty_out: 0,
				stock: 0,
			},
		],
		pb: [
			{
				coa_id: null,
				materialStockId: null,
				employeeId: null,
				qty_out: 0,
				stock: 0,
			},
		],
	});

	useEffect(() => {
		setIdPR(generateIdNum());
		getPurchaseRecieve();
		getMaterial();
		getEmploye();
		getCoa();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getPurchaseRecieve = async () => {
		try {
			let dataRecieve: any = [];
			const response = await GetOutgoingMaterialAll();
			if (response) {
				response.data.result.map((res: any) => {
					dataRecieve.push({
						label: res.id_so
							? res.id_so
							: res.idPurchase
							? res.idPurchase
							: res.no_mr,
						value: res,
						type: res.no_mr ? "mr" : "purchase",
					});
				});
			}
			setListRecieve(dataRecieve);
		} catch (error) {
			setListRecieve([]);
		}
	};

	const getCoa = async () => {
		try {
			let dataCoa: any = [];
			const response = await GetAllCoa();
			if (response) {
				response.data.result.map((res: any) => {
					dataCoa.push({
						label: `${res.coa_code} - ${res.coa_name}`,
						value: res,
					});
				});
			}
			setListCoa(dataCoa);
		} catch (error) {
			setListCoa([]);
		}
	};

	const getMaterial = async () => {
		try {
			let list_material: any = [];
			const response = await GetAllMaterialNew();
			if (response) {
				response.data.result.map((res: any) => {
					list_material.push({
						label: `${res.name} - ${res.spesifikasi}`,
						value: res,
					});
				});
			}
			setListMaterial(list_material);
		} catch (error) {
			setListMaterial([]);
		}
	};

	const getEmploye = async () => {
		try {
			let list_employe: any = [];
			const response = await GetAllEmploye();
			if (response) {
				response.data.result.map((res: any) => {
					list_employe.push({
						label: res.employee_name,
						value: res,
					});
				});
			}
			setListEmploye(list_employe);
		} catch (error) {
			setListEmploye([]);
		}
	};

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		var year = dateObj.getUTCFullYear();
		const id =
			"MO" +
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 10000);
		return id;
	};

	const addOutgoingMaterial = async (payload: data) => {
		setIsLoading(true);
		let listDetail: any = [];
		let data: any = null;
		if (isType === "dirrect") {
			payload.pb.map((res: any) => {
				listDetail.push({
					coa_id: res.coa_id,
					qty_out: parseInt(res.qty_out),
					employeeId: res.employeeId,
					materialStockId: res.materialStockId,
				});
			});
			data = {
				id_outgoing_material: idPR,
				date_outgoing_material: payload.date_outgoing_material,
				pb: listDetail,
			};
		} else {
			payload.mr.map((res: any) => {
				listDetail.push({
					poandsoId: res.poandsoId,
					mrId: res.idMr,
					qty_out: parseInt(res.qty_out),
				});
			});
			data = {
				id_outgoing_material: idPR,
				date_outgoing_material: payload.date_outgoing_material,
				mr: listDetail,
			};
		}
		try {
			const response = await AddOutgoingMaterial(data);
			if (response.data) {
				toast.success("Outgoing Material Success", {
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
			toast.error("Outgoing Material Failed", {
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
				// validationSchema={departemenSchema}
				onSubmit={(values) => {
					addOutgoingMaterial(values);
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
					<Form>
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2 border-b border-gray-400 pb-4'>
							<div className='w-full'>
								<Input
									id='id_outgoing_material'
									name='id_outgoing_material'
									placeholder='ID Outgoing Material'
									label='ID Outgoing Material'
									type='text'
									value={idPR}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='date_outgoing_material'
									name='date_outgoing_material'
									placeholder='Date Of Outgoing Material'
									label='Date Of Outgoing Material'
									type='text'
									value={moment(new Date()).format("DD-MMMM-YYYY")}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputSelect
									id='type'
									name='type'
									placeholder='Type Outgoing'
									label='Type Outgoing'
									onChange={(e: any) => {
										setType(e.target.value);
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option value='dirrect'>Dirrect</option>
									<option value='mr'>Material Request</option>
								</InputSelect>
							</div>
							<div className='w-full'>
								<InputSelectSearch
									datas={isType === "dirrect" ? [] : listRecieve}
									id='idPurchase'
									name='idPurchase'
									placeholder='ID Purchase Recieve'
									label='ID Purchase Recieve'
									onChange={(e: any) => {
										if (e.type === "mr") {
											setFieldValue("mr", []);
											e.value.detailMr.map((res: any, i: number) => {
												setFieldValue("pb", [
													{
														coa_id: null,
														materialStockId: null,
														employeeId: null,
														qty_out: 0,
														stock: 0,
													},
												]);
												setFieldValue(`mr.${i}.poandsoId`, res.poandsoId);
												setFieldValue(`mr.${i}.no_mr`, e.value.no_mr);
												setFieldValue(`mr.${i}.idMr`, e.value.id);
												setFieldValue(
													`mr.${i}.materialName`,
													`${res.Material_Master.name} ${
														res.Material_Master.spesifikasi
															? res.Material_Master.spesifikasi
															: ""
													}`
												);
												setFieldValue(`mr.${i}.job_no`, e.value.job_no);
												setFieldValue(
													`mr.${i}.requestBy`,
													e.value.user.employee.employee_name
												);
												setFieldValue(`mr.${i}.qty_out`, res.qtyAppr);
												setFieldValue(
													`mr.${i}.stock`,
													res.Material_Master.jumlah_Stock
												);
											});
										} else {
											setFieldValue("mr", []);
											e.value.detailMr.map((res: any, i: number) => {
												setFieldValue("pb", [
													{
														coa_id: null,
														materialStockId: null,
														employeeId: null,
														qty_out: 0,
														stock: 0,
													},
												]);
												setFieldValue(`mr.${i}.poandsoId`, res.poandsoId);
												setFieldValue(`mr.${i}.no_mr`, res.mr.no_mr);
												setFieldValue(`mr.${i}.idMr`, res.mr.id);
												setFieldValue(
													`mr.${i}.materialName`,
													`${res.Material_Master.name} ${
														res.Material_Master.spesifikasi
															? res.Material_Master.spesifikasi
															: ""
													}`
												);
												setFieldValue(`mr.${i}.job_no`, res.mr.job_no);
												setFieldValue(
													`mr.${i}.requestBy`,
													res.mr.user.employee.employee_name
												);
												setFieldValue(`mr.${i}.qty_out`, res.qtyAppr);
												setFieldValue(
													`mr.${i}.stock`,
													res.Material_Master.jumlah_Stock
												);
											});
										}
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
							</div>
						</Section>
						{isType === "dirrect" ? (
							<FieldArray
								name='pb'
								render={(arrayPb) =>
									values.pb.map((result: any, i: number) => {
										return (
											<div key={i}>
												<Section className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-4'>
													<div className='w-full'>
														<InputSelectSearch
															datas={listCoa}
															id={`pb.${i}.coa_id`}
															name={`pb.${i}.coa_id`}
															placeholder='Akun'
															label='Akun'
															onChange={(e: any) => {
																setFieldValue(`pb.${i}.coa_id`, e.value.id);
															}}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<InputSelectSearch
															datas={listMaterial}
															id={`pb.${i}.materialStockId`}
															name={`pb.${i}.materialStockId`}
															placeholder='Material Name'
															label='Material Name'
															onChange={(e: any) => {
																setFieldValue(
																	`pb.${i}.stock`,
																	e.value.jumlah_Stock
																);
																setFieldValue(`pb.${i}.qty_out`, 0);
																setFieldValue(
																	`pb.${i}.materialStockId`,
																	e.value.id
																);
															}}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<InputSelectSearch
															datas={listEmploye}
															id={`pb.${i}.employeeId`}
															name={`pb.${i}.employeeId`}
															placeholder='Request By'
															label='Request By'
															onChange={(e: any) => {
																setFieldValue(`pb.${i}.employeeId`, e.value.id);
															}}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`pb.${i}.qty_out`}
															name={`pb.${i}.qty_out`}
															placeholder='Quantity'
															label='Quantity'
															type='text'
															onChange={(e: any) => {
																if (e.target.value < result.stock) {
																	setFieldValue(
																		`pb.${i}.qty_out`,
																		e.target.value
																	);
																} else {
																	setFieldValue(
																		`pb.${i}.qty_out`,
																		result.stock
																	);
																}
															}}
															value={result.qty_out}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`pb.${i}.stock`}
															name={`pb.${i}.stock`}
															placeholder='Stock'
															label='Stock'
															type='text'
															value={result.stock}
															disabled={true}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='flex w-full'>
														{i + 1 === values.pb.length ? (
															<a
																className='flex mr-4 mt-8 text-[20px] text-blue-600 cursor-pointer hover:text-blue-400'
																onClick={() =>
																	arrayPb.push({
																		coa_id: null,
																		materialStockId: null,
																		employeeId: null,
																		qty_out: 0,
																		stock: 0,
																	})
																}
															>
																<Plus size={23} className='mt-1' />
																Add
															</a>
														) : null}
														{i === 0 && values.pb.length === 1 ? null : (
															<a
																className='flex mt-8 text-[20px] text-red-600 w-full hover:text-red-400 cursor-pointer'
																onClick={() => arrayPb.remove(i)}
															>
																<Trash2 size={22} className='mt-1 mr-1' />
																Remove
															</a>
														)}
													</div>
												</Section>
											</div>
										);
									})
								}
							/>
						) : (
							<FieldArray
								name='mr'
								render={(arrayMr) =>
									values.mr.map((result: any, i: number) => {
										return (
											<div key={i}>
												<Section className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-4 border-b-[3px] border-b-red-500 pb-2'>
													<div className='w-full'>
														<Input
															id={`mr.${i}.no_mr`}
															name={`mr.${i}.no_mr`}
															placeholder='No Mr'
															label='No Mr'
															type='text'
															value={result?.no_mr}
															disabled={true}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`mr.${i}.materialName`}
															name={`mr.${i}.materialName`}
															placeholder='Material Name'
															label='Material Name'
															type='text'
															value={result?.materialName}
															disabled={true}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`mr.${i}.job_no`}
															name={`mr.${i}.job_no`}
															placeholder='Job No'
															label='Job No'
															type='text'
															value={result?.job_no}
															disabled={true}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`mr.${i}.requestBy`}
															name={`mr.${i}.requestBy`}
															placeholder='Request By'
															label='Request By'
															type='text'
															value={result?.requestBy}
															disabled={true}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`mr.${i}.qty_out`}
															name={`mr.${i}.qty_out`}
															placeholder='Quantity'
															label='Quantity'
															type='text'
															value={result?.qty_out}
															disabled={true}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`mr.${i}.stock`}
															name={`mr.${i}.stock`}
															placeholder='Stock'
															label='Stock'
															type='text'
															value={result?.stock}
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
						)}
						<div
							className={`${
								values.pb.length > 3 ? `mt-8` : `mt-32`
							} flex justify-end`}
						>
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
										"Save"
									)}
								</button>
							</div>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};
