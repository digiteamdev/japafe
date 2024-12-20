import { useState, useEffect } from "react";
import { Section, Input, InputSelect, InputSelectSearch } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { departemenSchema } from "../../../schema/master-data/departement/departementSchema";
import {
	GetEmployeById,
	GetBom,
	EditMR,
	DeleteMRDetail,
	GetAllMaterial,
	GetAllMaterialNew,
	AddMaterialNew,
} from "../../../services";
import { Plus, Trash2 } from "react-feather";
import { toast } from "react-toastify";
import moment from "moment";
import { getIdUser } from "../../../configs/session";

interface props {
	content: string;
	dataSelected: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	userId: string;
	date_mr: any;
	detailMr: [
		{
			isInput: boolean,
			bomId: string;
			material: string;
			satuan: string;
			qty: string;
			id: string;
			note: string;
			mrId: string;
		}
	];
}

export const FormEditMr = ({ content, dataSelected, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isCreate, setIsCreate] = useState<boolean>(false);
	const [user, setUser] = useState<string>("");
	const [userId, setUserId] = useState<string>("");
	const [departement, setDepartement] = useState<string>("");
	const [jobNo, setJobNo] = useState<string>("");
	const [listWor, setListWor] = useState<any>([]);
	const [WorId, setWorId] = useState<any>(null);
	const [dateMR, setDateMR] = useState<any>(new Date());
	const [listMaterial, setListMaterial] = useState<any>([]);
	const [listMaterialStock, setListMaterialStock] = useState<any>([]);
	const [listDetail, setListDetail] = useState<any>([]);
	const [listMRdelete, setListMRdelete] = useState<any>([]);
	const [data, setData] = useState<data>({
		userId: "",
		date_mr: "",
		detailMr: [
			{
				isInput: false,
				bomId: "",
				material: "",
				satuan: "",
				qty: "",
				id: "",
				note: "",
				mrId: "",
			},
		],
	});

	useEffect(() => {
		if(!isCreate){
			getEmploye();
			getBom();
			dataSetting();
		}else{
			editMr(listDetail)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isCreate]);

	const dataSetting = () => {
		let newDetail: any = [];
		dataSelected.detailMr.map((res: any) => {
			console.log(res)
			newDetail.push({
				bomId: res.bomIdD,
				material: res.Material_Main.id,
				name_material: res.name_material,
				spesifikasi: res.spesifikasi,
				satuan: res.Material_Main.satuan,
				selectMaterial: {
					label: res.name_material + " " + res.spesifikasi,
					value: res.Material_Main,
				},
				qty: res.qty,
				id: res.id,
				note: res.note,
				mrId: dataSelected.id,
			});
		});
		setWorId(dataSelected.worId)
		setJobNo(dataSelected.job_no);
		getMaterial();
		setData({
			userId: dataSelected.userId,
			date_mr: dataSelected.date_mr,
			detailMr: newDetail,
		});
		setDateMR(dataSelected.date_mr);
	};

	const getMaterial = async () => {
		try {
			let list_material: any = [];
			let list_material_stock: any = [];
			const response = await GetAllMaterialNew();
			list_material.push({
				label: "Input",
				value: null,
			});
			if (response) {
				response.data.result.map((res: any) => {
					list_material.push({
						label: `${res.name} ${res.spesifikasi ? res.spesifikasi : ''}`,
						value: res,
					});
				});
			}
			setListMaterialStock(list_material_stock);
			setListMaterial(list_material);
		} catch (error) {}
	};

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

	const getBom = async () => {
		let listBom: any = [];
		try {
			const response = await GetBom();
			if (response) {
				listBom.push(dataSelected.bom);
				response.data.result.map((res: any) => {
					listBom.push(res);
				});
			}
			setListWor(listBom);
		} catch (error) {}
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name === "worId") {
			if (event.target.value !== "no data") {
				let data = JSON.parse(event.target.value);
				let list_material: any = [];
				let material: any = [];
				let list_material_stock: any = [];
				let materialStock: any = [];
				data.bom_detail.map((res: any) => {
					if (!material.includes(res.materialId)) {
						material.push(res.materialId);
						list_material.push({
							id: res.materialId,
							bomId: res.id,
							satuan: res.Material_master.satuan,
							name: res.Material_master.material_name,
						});
					}
					res.Material_master.Material_Stock.map((spec: any, i: number) => {
						if (!materialStock.includes(spec.id)) {
							materialStock.push(spec.id);
							list_material_stock.push({
								material: res.materialId,
								id: spec.id,
								name: spec.spesifikasi,
							});
						}
					});
				});
				setListMaterial(list_material);
				setListMaterialStock(list_material_stock);
				setJobNo(data.job_no);
			} else {
				setListMaterial([]);
				setListMaterialStock([]);
				setJobNo("");
			}
		}
	};

	const addMaterial = (payload: data) => {
		setIsLoading(true);
		let listDetail: any = [];
		payload.detailMr.map( (res: any, i: number) => {
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
				AddMaterialNew(dataBody).then((resp:any) => {
					listDetail.push({
						id: res.id,
						mrId: dataSelected.id,
						bomIdD: res.bomId,
						materialId: resp.data.results.id,
						name_material: res.material,
						qty: parseInt(res.qty),
						note: res.note,
					});
					if(payload.detailMr.length === listDetail.length){
						let data = {
							userId: getIdUser(),
							date_mr: new Date(),
							bomIdU: res.bomId,
							worId: WorId,
							job_no: jobNo,
							detailMr: listDetail,
						};
						setListDetail(data)
						setIsCreate(true)
					}
				})
			} else {
				listDetail.push({
					id: res.id,
					mrId: dataSelected.id,
					bomIdD: res.bomId,
					materialId: res.material,
					name_material: res.name_material,
					qty: parseInt(res.qty),
					note: res.note,
				});
				if(payload.detailMr.length === listDetail.length){
					let data = {
						userId: getIdUser(),
						date_mr: new Date(),
						bomIdU: res.bomId,
						worId: WorId,
						job_no: jobNo,
						detailMr: listDetail,
					};
					setListDetail(data)
					setIsCreate(true)
				}
			}
		});
		setIsLoading(false);
	};

	const editMr = async (payload: any) => {
		setIsLoading(true);
		listMRdelete.map((res: any) => {
			deleteMr(res);
		});
		try {
			const response = await EditMR(payload.detailMr);
			if (response.data) {
				toast.success("Edit Material Request Success", {
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
			toast.error("Edit Material Request Failed", {
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

	const deleteMr = async (id: string) => {
		try {
			await DeleteMRDetail(id);
			return false;
		} catch (error) {
			return false;
		}
	};

	const removeDetail = (data: any) => {
		let listDelete: any = listMRdelete;
		if (data.id !== "") {
			listDelete.push(data.id);
		}
		setListMRdelete(listDelete);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<Formik
				initialValues={data}
				// validationSchema={departemenSchema}
				onSubmit={(values) => {
					addMaterial(values);
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
						<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
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
								<Input
									id='user'
									name='user'
									placeholder='User'
									label='User'
									type='text'
									value={user}
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
									value={moment(dateMR).format("DD-MMMM-YYYY")}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								{/* <InputSelect
									id='worId'
									name='worId'
									placeholder='Job No'
									label='Job No'
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
												<option value={JSON.stringify(res)} key={i} selected={ res.id === dataSelected.bomIdU }>
													{res.srimg.timeschedule.wor.job_no}
												</option>
											);
										})
									)}
								</InputSelect> */}
								<Input
									id='date'
									name='date'
									placeholder='Job No'
									label='Job No'
									type='text'
									value={jobNo}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<h5 className='text-xl font-bold mt-3'>Material</h5>
						<FieldArray
							name='detailMr'
							render={(arrayMr) =>
								values.detailMr.map((result: any, i: number) => {
									return (
										<div key={i}>
											<Section className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2'>
												<div className='w-full'>
													<Input
														id='job No'
														name='job No'
														placeholder='Job No'
														label='Job No'
														type='text'
														value={jobNo}
														disabled={true}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													{ result.isInput ? (
														<Input
														id={`detailMr.${i}.material`}
														name={`detailMr.${i}.material`}
														placeholder='Material'
														label='Material'
														type='text'
														onChange={(e: any) => {
															setFieldValue(
																`detailMr.${i}.name_material`,
																e.target.value
															);
															setFieldValue(
																`detailMr.${i}.material`,
																e.target.value
															);
														}}
														disabled={false}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
													) : (
														<InputSelectSearch
															datas={listMaterial}
															id={`detailMr.${i}.name_material`}
															name={`detailMr.${i}.name_material`}
															placeholder='Material'
															label='Material'
															value={result.selectMaterial}
															onChange={(e: any) => {
																if(e.value === null){
																	setFieldValue(
																		`detailMr.${i}.isInput`,
																		true
																	);
																	setFieldValue(
																		`detailMr.${i}.bomId`,
																		null
																	);
																	setFieldValue(
																		`detailMr.${i}.detail`,
																		e
																	);
																	setFieldValue(
																		`detailMr.${i}.satuan`,
																		""
																	);
																}else{
																	setFieldValue(
																		`detailMr.${i}.selectMaterial`,
																		e
																	);
																	setFieldValue(
																		`detailMr.${i}.material`,
																		e.value.id
																	);
																	setFieldValue(
																		`detailMr.${i}.name_material`,
																		e.label
																	);
																	setFieldValue(
																		`detailMr.${i}.bomId`,
																		e.value.bomId ? e.value.bomId : null
																	);
																	setFieldValue(
																		`detailMr.${i}.satuan`,
																		e.value.satuan
																	);
																}
															}}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
														/>
													) }
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
														value={result.qty}
														type='number'
														onChange={(e: any) =>
															setFieldValue(`detailMr.${i}.qty`, e.target.value)
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
														value={result.note}
														type='text'
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
											</Section>
											<div className='flex w-full'>
												{i + 1 === values.detailMr.length ? (
													<a
														className='flex mt-2 text-[20px] text-blue-600 cursor-pointer hover:text-blue-400'
														onClick={() =>
															arrayMr.push({
																bomId: "",
																materialStockId: "",
																satuan: "",
																qty: "",
																id: "",
																mrId: dataSelected.id,
															})
														}
													>
														<Plus size={23} className='mt-1' />
														Add
													</a>
												) : null}
												{i === 0 && values.detailMr.length === 1 ? null : (
													<a
														className='flex ml-4 mt-2 text-[20px] text-red-600 w-full hover:text-red-400 cursor-pointer'
														onClick={() => {
															removeDetail(result);
															arrayMr.remove(i);
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
					</Form>
				)}
			</Formik>
		</div>
	);
};
