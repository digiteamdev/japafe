import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputSelectSearch,
	InputArea,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { billOfMaterialSchema } from "../../../schema/engineering/bill-0f-material/billOfMaterial";
import {
	GetSummaryBillOfMaterial,
	AddBillOfMaterial,
	GetAllMaterial,
	GetAllMaterialNew,
	GetAllMaterialType,
	GetAllPart,
} from "../../../services";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "react-feather";
import { FormCreateMaterial } from "./formCreateMaterial";
import moment from "moment";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	srId: string;
	customer: string;
	subject: string;
	model: string;
	qty: number;
	equipment: string;
	bom_detail: any;
}

export const FormCreateBillOfMaterial = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isFormMaterial, setIsFormMaterial] = useState<boolean>(false);
	const [listSummary, setListSummary] = useState<any>([]);
	const [listMaterial, setListMaterial] = useState<any>([]);
	const [listMaterialType, setListMaterialType] = useState<any>([]);
	const [part, setPart] = useState<string>("");
	const [partId, setPartId] = useState<string>("");
	const [customerName, setCustomerName] = useState<string>("");
	const [dateSummary, setDateSummary] = useState<string>("");
	const [subject, setSubject] = useState<string>("");
	const [equipment, setEquipment] = useState<string>("");
	const [listPart, setListPart] = useState<any>([]);
	const [data, setData] = useState<data>({
		srId: "",
		customer: "",
		subject: "",
		model: "",
		qty: 0,
		equipment: "",
		bom_detail: [],
	});

	useEffect(() => {
		getSummary();
		getMaterial();
		getMaterialType();
		getPart();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleOnChanges = (event: any) => {
		if (event.target.name === "srId") {
			if (event.target.value !== "Choose Id Summary") {
				let data = JSON.parse(event.target.value);
				let equipment: any = [];
				let part: any = [];
				let listPartDetail: any = [];
				setCustomerName(
					data.timeschedule.wor.customerPo.quotations.Customer.name
				);
				setDateSummary(moment(data.date_of_summary).format("DD-MM-YYYY"));
				setSubject(data.timeschedule.wor.subject);
				data.timeschedule.wor.customerPo.quotations.eqandpart.map(
					(res: any) => {
						if (!equipment.includes(res.equipment.nama)) {
							equipment.push(res.equipment.nama);
						}
					}
				);
				data.srimgdetail.map((res: any) => {
					part.push({
						id: res.id,
						name: res.name_part,
					});
					listPartDetail.push({
						partId: res.id,
						part: res.name_part,
						materialId: "",
						material: "",
						satuan: "",
						jumlah: res.qty,
						dimensi: "",
					});
				});
				setEquipment(equipment);
				setListPart(part);
				// setData({
				// 	srId: data.id,
				// 	bom_detail: listPartDetail,
				// });
			} else {
				setCustomerName("");
				setDateSummary("");
				setSubject("");
				setEquipment("");
				setListPart([]);
			}
		}
	};

	const selectSummary = (datas: any) => {
		// setCustomerName(datas.timeschedule.wor.customerPo.quotations.Customer.name);
		// setDateSummary(moment(datas.date_of_summary).format("DD-MM-YYYY"));
		// setSubject(datas.timeschedule.wor.subject);
		// datas.timeschedule.wor.customerPo.quotations.eqandpart.map((res: any) => {
		// 	if (!equipment.includes(res.equipment.nama)) {
		// 		equipment.push(res.equipment.nama);
		// 	}
		// });
		// datas.srimgdetail.map((res: any) => {
		// 	part.push({
		// 		id: res.id,
		// 		name: res.name_part,
		// 	});
		// 	listPartDetail.push({
		// 		partId: res.id,
		// 		part: res.name_part,
		// 		materialId: "",
		// 		material: "",
		// 		satuan: "",
		// 		jumlah: res.qty,
		// 		dimensi: "",
		// 	});
		// });
		// setEquipment(equipment);
		// setListPart(part);
		setData({
			srId: datas.id,
			customer: datas.timeschedule.wor.customerPo.quotations.Customer.name,
			subject: datas.timeschedule.wor.customerPo.quotations.subject,
			model: datas.model,
			qty: datas.qty,
			equipment: datas.equipment,
			bom_detail: [
				{
					partId: "",
					materialId: "",
					satuan: "",
					jumlah: 0,
					dimanesi: "",
				},
			],
		});
	};

	const getSummary = async () => {
		let datasSummary: any = [];
		try {
			const response = await GetSummaryBillOfMaterial();
			if (response.data) {
				response.data.result.map((res: any) => {
					datasSummary.push({
						value: res,
						label: `${res.timeschedule.wor.job_no} - ${res.timeschedule.wor.customerPo.quotations.Customer.name}`,
					});
				});
				setListSummary(datasSummary);
			}
		} catch (error) {
			setListSummary(datasSummary);
		}
	};

	const getMaterial = async () => {
		let listMaterials: any = [];
		try {
			const response = await GetAllMaterialNew();
			if (response.data) {
				response.data.result.map((res: any) => {
					listMaterials.push({
						label: `${res.name} ${res.spesifikasi}`,
						value: res,
					});
				});
			}
			setListMaterial(listMaterials);
		} catch (error) {
			setListMaterial([]);
		}
	};

	const getPart = async () => {
		let listParts: any = [];
		try {
			const response = await GetAllPart();
			if (response.data) {
				response.data.result.map((res: any) => {
					listParts.push({
						label: `${res.nama_part} (${res.keterangan_part})`,
						value: res,
					});
				});
			}
			setListPart(listParts);
		} catch (error) {
			setListPart([]);
		}
	};

	const addDetail = (data: any) => {
		let newDetail: any = data.bom_detail;
		newDetail.push({
			partId: partId,
			part: part,
			materialId: "",
			material: "",
			satuan: "",
			jumlah: "",
			dimensi: "",
		});
		setData({
			srId: data.srId,
			customer: "",
			subject: "",
			model: "",
			qty: 0,
			equipment: "",
			bom_detail: newDetail,
		});
	};

	const addBillOfMaterial = async (payload: data) => {
		setIsLoading(true);
		let listDetail: any = [];
		payload.bom_detail.map((res: any) => {
			listDetail.push({
				// partId: res.partId,
				materialId: res.materialId,
				dimensi: res.dimensi,
				qty: parseInt(res.jumlah)
			});
		});
		let body = {
			srId: payload.srId,
			bom_detail: listDetail,
		};
		try {
			const response = await AddBillOfMaterial(body);
			if (response.data) {
				toast.success("Add Bill Of Material Success", {
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
			toast.error("Add Bill Of Material Failed", {
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

	const getMaterialType = async () => {
		try {
			const response = await GetAllMaterialType();
			if (response.data) {
				setListMaterialType(response.data.result);
			}
		} catch (error: any) {
			setListMaterialType([]);
		}
	};

	const showFormMaterial = (data: any) => {
		setData(data);
		setIsFormMaterial(true);
	};

	const hideFormMaterial = () => {
		getMaterial();
		setIsFormMaterial(false);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			{isFormMaterial ? (
				<FormCreateMaterial content={content} showModal={hideFormMaterial} />
			) : (
				<Formik
					initialValues={{ ...data }}
					validationSchema={billOfMaterialSchema}
					onSubmit={(values) => {
						addBillOfMaterial(values);
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
							<h1 className='text-xl font-bold mt-3'>Bill Of Material</h1>
							<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<InputSelectSearch
										datas={listSummary}
										id='srId'
										name='srId'
										placeholder='Job No'
										label='Job No'
										onChange={(e: any) => {
											selectSummary(e.value);
											setFieldValue("srId", e.value.id);
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
										placeholder='Customer Name'
										label='Customer'
										type='text'
										value={values.customer}
										disabled={true}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
								<div className='w-full'>
									<InputArea
										id='subject'
										name='subject'
										placeholder='Subject'
										label='Subject'
										type='text'
										value={values.subject}
										onChange={handleChange}
										disabled={true}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
							</Section>
							<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<Input
										id='equipment'
										name='equipment'
										placeholder='Equipment'
										label='Equipment'
										type='text'
										value={values.equipment}
										disabled={true}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
								<div className='w-full'>
									<Input
										id='model'
										name='model'
										placeholder='Model'
										label='Model'
										type='text'
										value={values.model}
										disabled={true}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
								<div className='w-full'>
									<Input
										id='quantity'
										name='quantity'
										placeholder='Quantity'
										label='Quantity'
										type='text'
										value={values.qty.toString()}
										disabled={true}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
							</Section>
							<FieldArray
								name='bom_detail'
								render={(arrayPart) => (
									<>
										{values.bom_detail.map((res: any, i: number) => (
											<div key={i}>
												<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
													<div className='w-full'>
														<InputSelectSearch
															datas={listMaterial}
															id={`bom_detail.${i}.materialId`}
															name={`bom_detail.${i}.materialId`}
															placeholder='Material'
															label='Material'
															onChange={(e: any) => {
																setFieldValue(
																	`bom_detail.${i}.materialId`,
																	e.value.id
																);
																setFieldValue(
																	`bom_detail.${i}.satuan`,
																	e.value.satuan
																);
															}}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`bom_detail.${i}.satuan`}
															name={`bom_detail.${i}.satuan`}
															placeholder='Satuan'
															label='Satuan'
															type='text'
															value={res.satuan}
															disabled={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`bom_detail.${i}.jumlah`}
															name={`bom_detail.${i}.jumlah`}
															placeholder='Jumlah'
															label='Jumlah'
															type='text'
															pattern='\d*'
															value={res.jumlah}
															onChange={(e: any) => {
																setFieldValue(
																	`bom_detail.${i}.jumlah`,
																	e.target.value
																);
															}}
															disabled={false}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`bom_detail.${i}.dimensi`}
															name={`bom_detail.${i}.dimensi`}
															placeholder='Dimensi'
															label='Dimensi'
															type='text'
															value={res.dimensi}
															onChange={(e: any) => {
																setFieldValue(
																	`bom_detail.${i}.dimensi`,
																	e.target.value
																);
															}}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
												</Section>
												<Section className='w-full'>
													{i === values.bom_detail.length - 1 ? (
														<a
															className='inline-flex text-green-500 mr-6 cursor-pointer'
															onClick={() => {
																arrayPart.push({
																	materialId: "",
																	satuan: "",
																	jumlah: 0,
																	dimanesi: "",
																},);
															}}
														>
															<Plus size={18} className='mr-1 mt-1' /> Add
															Material
														</a>
													) : null}
													{values.bom_detail.length !== 1 ? (
														<a
															className='inline-flex text-red-500 cursor-pointer mt-1'
															onClick={() => {
																arrayPart.remove(i);
															}}
														>
															<Trash2 size={18} className='mr-1 mt-1' /> Remove
															Detail
														</a>
													) : null}
												</Section>
											</div>
										))}
									</>
								)}
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
										) : (
											"Save"
										)}
									</button>
								</div>
							</div>
						</Form>
					)}
				</Formik>
			)}
		</div>
	);
};
