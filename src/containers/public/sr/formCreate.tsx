import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputSelectSearch,
	InputArea,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { srSchema } from "../../../schema/public/sr/srSchema";
import {
	AddMaterialStockOne,
	GetAllDispatch,
	GetAllWorkerCenter,
	AddSr,
	GetAllEquipment,
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
	job_no: string;
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

export const FormCreateSr = ({ content, showModal }: props) => {
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
	const [data, setData] = useState<data>({
		dispacthIDS: "",
		userId: "",
		worId: "",
		job_no: "",
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
		getWorkCenter();
		getPart();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getDispatch = async () => {
		var dateObj = new Date();
		var year = dateObj.getUTCFullYear();
		let datasWor: any = [
			{
				value: [
					{
						job_no: "Internal",
					},
				],
				label: "Internal",
			},
		];
		try {
			const response = await GetAllDispatch();
			if (response) {
				response.data.result.map((res: any) => {
					datasWor.push({
						value: res,
						internal: false,
						label: `${res.srimg.timeschedule.wor.job_no} - ${res.srimg.timeschedule.wor.customerPo.quotations.Customer.name}`,
					});
				});
				setListWor(datasWor);
			}
		} catch (error) {}
	};

	const getWorkCenter = async () => {
		try {
			const response = await GetAllWorkerCenter();
			if (response) {
				let listWork: any = [];
				response.data.result.map((result: any) => {
					listWork.push({
						label: result.name,
						value: result,
					});
				});
				setListWorkCenter(listWork);
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
						newlistPart.push({
							value: result,
							label: result.nama_part,
						});
					});
				});
				setListPart(newlistPart);
			}
		} catch (error) {}
	};

	const addSr = async (payload: data) => {
		setIsLoading(true);
		let listService: any = [];
		payload.SrDetail.map((res: any) => {
			listService.push({
				dispacthdetailId: res.dispacthdetailId,
				desc: res.description,
				note: res.note,
				qty: parseInt(res.qty),
				unit: res.unit,
			});
		});
		let data = {
			dispacthIDS: payload.dispacthIDS === "" ? null : payload.dispacthIDS,
			userId: payload.userId,
			worId: payload.worId === "" ? null : payload.worId,
			job_no: jobNo,
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
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
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
						validationSchema={srSchema}
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
							<Form>
								<h1 className='text-xl font-bold mt-3'>Service Request</h1>
								<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<Input
											id='date_sr'
											name='date_sr'
											placeholder='Date Service Material'
											label='Date Service Material'
											type='text'
											value={moment(new Date()).format("DD-MMMM-YYYY")}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<InputSelectSearch
											datas={listWor}
											id='worId'
											name='worId'
											placeholder='Job No'
											label='Job No'
											onChange={(e: any) => {
												let list_service: any = [];
												let list_part: any = [];
												let userID = getIdUser();
												if (e.label === 'Internal') {
													setJobNo(e.value[0].job_no);
													setSubject("-");
													setCustomer("-");
													list_service.push({
														dispacthdetailId: null,
														workCenterId: "",
														description: "",
														part: "",
														unit: "",
														qty: 0,
														note: "",
													});
													setIsOperasional(true);
												} else {
													setJobNo(e.value.srimg.timeschedule.wor.job_no);
													setSubject(e.value.srimg.timeschedule.wor.subject);
													setCustomer(
														e.value.srimg.timeschedule.wor.customerPo.quotations
															.Customer.name
													);
													e.value.dispatchDetail.map((res: any) => {
														if(res.aktivitas.so){
															console.log(res)
															list_service.push({
																dispacthdetailId: res.id,
																workCenterId: null,
																description: res.aktivitas.work_scope_item.item,
																part: null,
																unit: res.aktivitas.work_scope_item.unit,
																qty: res.aktivitas.work_scope_item.qty,
																note: "",
															})
														}
													})
													setFieldValue("dispacthIDS", e.value.id);
													setFieldValue(
														"worId",
														e.value.srimg.timeschedule.worId
													);
													setListPartDispatch(list_part);
													setIsService(true);
												}
												setFieldValue("userId", userID);
												setFieldValue("SrDetail", list_service);
												setIsService(true);
											}}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
										/>
									</div>
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
															<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-4'>
																<div className='w-full'>
																	<InputArea
																		id={`SrDetail.${i}.description`}
																		name={`SrDetail.${i}.description`}
																		placeholder='Descripsi'
																		label='Descripsi'
																		value={result.description}
																		required={true}
																		onChange={(e:any) => {
																			setFieldValue(`SrDetail.${i}.description`, e.target.value)
																		}}
																		row={2}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
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
																		disabled={false}
																		value={result.qty}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	<Input
																		id={`SrDetail.${i}.unit`}
																		name={`SrDetail.${i}.unit`}
																		placeholder='Unit'
																		label='Unit'
																		type='text'
																		value={result.unit}
																		onChange={(e: any) =>
																			setFieldValue(
																				`SrDetail.${i}.unit`,
																				e.target.value
																			)
																		}
																		disabled={false}
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
																		value={result.note}
																		onChange={(e: any) =>
																			setFieldValue(
																				`SrDetail.${i}.note`,
																				e.target.value
																			)
																		}
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
																		onClick={() => arraySr.remove(i)}
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
