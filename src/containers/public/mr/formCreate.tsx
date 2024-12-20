import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputSelectSearch,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import {
	GetEmployeById,
	GetBom,
	AddMr,
	AddMaterialNew,
	AddMaterialStockOne,
	GetAllMaterial,
	GetAllMaterialNew,
} from "../../../services";
import { Plus, Trash2 } from "react-feather";
import { toast } from "react-toastify";
import moment from "moment";
import { getIdUser } from "../../../configs/session";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	userId: string;
	date_mr: any;
	detailMr: [
		{
			isInput: boolean;
			bomId: string;
			material: string;
			name_material: string;
			spesifikasi: string;
			materialStockId: string;
			satuan: string;
			note: string;
			qty: string;
			detail: any;
			file: any;
		}
	];
}

export const FormCreateMr = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isMaterial, setIsMaterial] = useState<boolean>(false);
	const [isCreate, setIsCreate] = useState<boolean>(false);
	const [isFormAddSpesifikasi, setIsFormAddSpesifikasi] =
		useState<boolean>(false);
	const [user, setUser] = useState<string>("");
	const [userId, setUserId] = useState<string>("");
	const [departement, setDepartement] = useState<string>("");
	const [jobNo, setJobNo] = useState<string>("");
	const [bomId, setBomId] = useState<any>("");
	const [search, setSearch] = useState<string>("");
	const [worID, setWorID] = useState<string>("");
	const [materialID, setMaterialID] = useState<string>("");
	const [satuan, setSatuan] = useState<string>("");
	const [listWor, setListWor] = useState<any>([]);
	const [listMaterial, setListMaterial] = useState<any>([]);
	const [listDetail, setListDetail] = useState<any>([]);
	const [listMaterialStock, setListMaterialStock] = useState<any>([]);
	const [listSpesification, setListSpesification] = useState<any>([]);
	const [data, setData] = useState<data>({
		userId: "",
		date_mr: "",
		detailMr: [
			{
				isInput: false,
				bomId: "",
				material: "",
				name_material: "",
				spesifikasi: "",
				satuan: "",
				materialStockId: "",
				note: "",
				qty: "",
				detail: [],
				file: null,
			},
		],
	});
	const [dataSpesifikasi, setDataSpesifikasi] = useState<any>({
		spesifikasi: "",
	});

	useEffect(() => {
		if (!isCreate) {
			getEmploye();
			getBom();
			getMaterial();
		} else {
			createMR(listDetail);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isCreate]);

	const getEmploye = async () => {
		try {
			const id = getIdUser();
			const response = await GetEmployeById(id);
			if (response) {
				setUser(response.data.result.employee.employee_name);
				setUserId(response.data.result.employee.id);
				setDepartement(response.data.result.employee.sub_depart.name);
			}
		} catch (error) {}
	};

	const getMaterial = async () => {
		try {
			let list_material: any = [];
			let list_material_stock: any = [];
			const response = await GetAllMaterialNew();
			if (response) {
				response.data.result.map((res: any) => {
					list_material.push({
						label: `${res.name} ${res.spesifikasi ? res.spesifikasi : ""}`,
						value: res,
					});
				});
			}
			setBomId(null);
			setListMaterialStock(list_material_stock);
			setListMaterial(list_material);
		} catch (error) {}
	};

	const getBom = async () => {
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
			const response = await GetBom();
			if (response) {
				response.data.result.map((res: any) => {
					datasWor.push({
						value: res,
						label: `${res.job_no} - ${res.customerPo.quotations.Customer.name}`,
					});
				});
				setListWor(datasWor);
			}
		} catch (error) {
			setListWor(datasWor);
		}
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name === "worId") {
			if (event.target.value !== "no data") {
				let data = JSON.parse(event.target.value);
				let list_material: any = [];
				let material: any = [];
				let list_material_stock: any = [];
				let materialStock: any = [];
				if (data.srimg === undefined) {
					setWorID(data.id);
					getMaterial();
				} else {
					data.bom_detail.map((res: any) => {
						if (!material.includes(res.materialId)) {
							material.push(res.materialId);
							list_material.push({
								id: res.materialId,
								bomId: res.id,
								satuan: res.Material_master.satuan,
								name: res.Material_master.material_name,
								grup_material: res.Material_master.grup_material.material_name,
							});
						}
						res.Material_master.Material_Stock.map((spec: any, i: number) => {
							if (!materialStock.includes(spec.id)) {
								materialStock.push(spec.id);
								list_material_stock.push({
									material: res.materialId,
									id: spec.id,
									bomId: res.id,
									satuan: res.Material_master.satuan,
									name: spec.spesifikasi,
								});
							}
						});
					});
					setWorID(data.srimg.timeschedule.wor.id);
					setBomId(data.id);
					setListMaterial(list_material);
					setListMaterialStock(list_material_stock);
				}
				setJobNo(
					data.srimg === undefined
						? data.value.job_no
						: data.srimg.timeschedule.wor.job_no
				);
				setIsMaterial(true);
			} else {
				setListMaterial([]);
				setListMaterialStock([]);
				setWorID("");
				setJobNo("");
				setIsMaterial(false);
			}
		}
	};

	const addMr = (payload: data) => {
		setIsLoading(true);
		let listDetail: any = [];
		payload.detailMr.map((res: any, i: number) => {
			if (res.isInput) {
				let dataBody: any = {
					name: res.material,
					spesifikasi: null,
					satuan: res.satuan,
					jumlah_Stock: 0,
					harga: 0,
					note: res.note,
					date_in: new Date(),
					date_out: null,
				};
				AddMaterialNew(dataBody).then((resp: any) => {
					listDetail.push({
						bomIdD: res.bomId,
						materialId: resp.data.results.id,
						name_material: res.material,
						qty: parseInt(res.qty),
						note: res.note,
					});
					if (payload.detailMr.length === listDetail.length) {
						let data = {
							userId: getIdUser(),
							date_mr: new Date(),
							bomIdU: bomId,
							worId: worID === "" ? null : worID,
							job_no: jobNo,
							detailMr: listDetail,
						};
						setListDetail(data);
						setIsCreate(true);
					}
				});
			} else {
				listDetail.push({
					bomIdD: res.bomId,
					materialId: res.material,
					name_material: res.name_material,
					qty: parseInt(res.qty),
					note: res.note,
					file: res.file,
				});
				if (payload.detailMr.length === listDetail.length) {
					let data = {
						userId: getIdUser(),
						date_mr: new Date(),
						bomIdU: bomId,
						worId: worID === "" ? null : worID,
						job_no: jobNo,
						file: "",
						detailMr: listDetail,
					};
					setListDetail(data);
					setIsCreate(true);
				}
			}
		});
		setIsLoading(false);
	};

	const createMR = async (data: any) => {
		setIsLoading(true);
		let listDetail: any = [];
		let userId: any = getIdUser() || "";
		let date: any = new Date();
		data?.detailMr.map((res: any) => {
			listDetail.push({
				bomIdD: res.bomId,
				materialId: res.material,
				name_material: res.name_material,
				spesifikasi: res.spesifikasi,
				qty: parseInt(res.qty),
				note: res.note,
			});
		});
		const formData = new FormData();
		formData.append("userId", userId);
		formData.append("date_mr", date);
		formData.append("bomIdU", bomId);
		formData.append("worId", worID === "" ? "null" : worID);
		formData.append("job_no", jobNo);
		formData.append("detailMr", JSON.stringify(listDetail));
		data?.detailMr.map((res: any) => {
			if (res.file) {
				formData.append("file", res.file);
			}
		});
		try {
			const response = await AddMr(formData);
			if (response.data) {
				toast.success("Add Material Request Success", {
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
			toast.error("Add Material Request Failed", {
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
						// validationSchema={departemenSchema}
						onSubmit={(values) => {
							createMR(values);
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
								<h1 className='text-xl font-bold mt-3'>Material Request</h1>
								<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<Input
											id='departement'
											name='departement'
											placeholder='Unit Of Departement'
											label='Unit Of Departement'
											type='text'
											value={departement}
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
												if (e.value.job_no === undefined) {
													setWorID("");
													setBomId(null);
													setJobNo("Internal");
													setFieldValue("detailMr", [
														{
															bomId: "",
															material: "",
															satuan: "",
															materialStockId: "",
															note: "",
															qty: "",
															detail: [],
														},
													]);
												} else {
													setWorID(e.value.id);
													setBomId(null);
													setJobNo(e.value.job_no);
													setFieldValue("detailMr", [
														{
															bomId: "",
															material: "",
															satuan: "",
															materialStockId: "",
															note: "",
															qty: "",
															detail: [],
														},
													]);
												}
												setIsMaterial(true);
											}}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
										/>
									</div>
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
								</Section>
								{isMaterial ? (
									<div>
										<p className='mt-4 '>
											Note: Jika tidak ada material yang dicari harap hubungi
											purchasing atau gudang
										</p>
										<FieldArray
											name='detailMr'
											render={(arrayMr) =>
												values.detailMr.map((result: any, i: number) => {
													return (
														<div key={i}>
															<Section className='grid md:grid-cols-6 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-4'>
																<div className='w-full'>
																	<InputSelectSearch
																		datas={listMaterial}
																		id={`detailMr.${i}.material`}
																		name={`detailMr.${i}.material`}
																		placeholder='Material'
																		label='Material'
																		value={result.detail}
																		onChange={(e: any) => {
																			let listSpesifications: any = [
																				{
																					label: "Input",
																				},
																			];
																			e.value?.Material_Master?.map(
																				(result: any) => {
																					listSpesifications.push({
																						label: result?.name,
																					});
																				}
																			);
																			setListSpesification(listSpesifications);
																			setFieldValue(
																				`detailMr.${i}.isInput`,
																				false
																			);
																			setFieldValue(
																				`detailMr.${i}.material`,
																				e.value.id
																			);
																			setFieldValue(
																				`detailMr.${i}.bomId`,
																				e.value.bomId ? e.value.bomId : null
																			);
																			setFieldValue(
																				`detailMr.${i}.satuan`,
																				e.value.satuan
																			);
																			setFieldValue(`detailMr.${i}.detail`, e);
																			setFieldValue(
																				`detailMr.${i}.name_material`,
																				e.label
																			);
																		}}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	{result.isInput ? (
																		<Input
																			id={`detailMr.${i}.spesifikasi`}
																			name={`detailMr.${i}.spesifikasi`}
																			placeholder='Spesifikasi'
																			label='Spesifikasi'
																			type='text'
																			value={result.spesifikasi}
																			onChange={(e: any) => {
																				setFieldValue(
																					`detailMr.${i}.spesifikasi`,
																					e.target.value
																				);
																			}}
																			required={true}
																			withLabel={true}
																			className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																		/>
																	) : (
																		<InputSelectSearch
																			datas={listSpesification}
																			id={`detailMr.${i}.spesifikasi`}
																			name={`detailMr.${i}.spesifikasi`}
																			placeholder='Spesifikasi'
																			label='Spesifikasi'
																			// value={result.detail}
																			onChange={(e: any) => {
																				console.log(e);
																				if (e.label === "Input") {
																					setFieldValue(
																						`detailMr.${i}.isInput`,
																						true
																					);
																				} else {
																					setFieldValue(
																						`detailMr.${i}.spesifikasi`,
																						e.label
																					);
																				}
																			}}
																			required={true}
																			withLabel={true}
																			className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
																		/>
																	)}
																</div>
																<div className='w-full'>
																	<Input
																		id={`detailMr.${i}.satuan`}
																		name={`detailMr.${i}.satuan`}
																		placeholder='Satuan'
																		label='Satuan'
																		type='text'
																		value={result.satuan}
																		onChange={(e: any) => {
																			setFieldValue(
																				`detailMr.${i}.satuan`,
																				e.target.value
																			);
																		}}
																		disabled={!result.isInput}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	<Input
																		id={`detailMr.${i}.qty`}
																		name={`detailMr.${i}.qty`}
																		placeholder='Jumlah'
																		label='Jumlah'
																		type='number'
																		value={result.qty}
																		onChange={(e: any) =>
																			setFieldValue(
																				`detailMr.${i}.qty`,
																				e.target.value
																			)
																		}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	<Input
																		id={`detailMr.${i}.note`}
																		name={`detailMr.${i}.note`}
																		placeholder='Note'
																		label='Note'
																		type='text'
																		value={result.note}
																		onChange={(e: any) =>
																			setFieldValue(
																				`detailMr.${i}.note`,
																				e.target.value
																			)
																		}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	<Input
																		id={`detailMr.${i}.file`}
																		name={`detailMr.${i}.file`}
																		placeholder='File'
																		label='File'
																		type='file'
																		accept='image/*, .pdf'
																		onChange={(e: any) =>
																			setFieldValue(
																				`detailMr.${i}.file`,
																				e.target.files[0]
																			)
																		}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
															</Section>
															<div className='flex w-full'>
																{i + 1 === values.detailMr.length ? (
																	<a
																		className='flex mt-2 text-[20px] text-blue-600 cursor-pointer hover:text-blue-400'
																		onClick={() =>
																			arrayMr.push({
																				bomId: "",
																				material: "",
																				satuan: "",
																				materialStockId: "",
																				note: "",
																				qty: "",
																				detail: [],
																			})
																		}
																	>
																		<Plus size={23} className='mt-1' />
																		Add
																	</a>
																) : null}
																{i === 0 &&
																values.detailMr.length === 1 ? null : (
																	<a
																		className='flex ml-4 mt-2 text-[20px] text-red-600 w-full hover:text-red-400 cursor-pointer'
																		onClick={() => arrayMr.remove(i)}
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
