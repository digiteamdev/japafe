import { useState, useEffect } from "react";
import { Section, Input, InputSelect, InputDate } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { billOfMaterialSchema } from "../../../schema/engineering/bill-0f-material/billOfMaterial";
import {
	GetSummaryBillOfMaterial,
	AddBillOfMaterial,
	GetAllMaterial,
} from "../../../services";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "react-feather";
import moment from "moment";

interface props {
	content: string;
    dataSelected: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	srId: string;
	bom_detail: [
		{
			partId: string;
			part: string;
			materialId: string;
			material: string;
			satuan: string;
			jumlah: string;
			dimensi: string;
		}
	];
}

export const FormEditBillOfMaterial = ({ content, dataSelected, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listSummary, setListSummary] = useState<any>([]);
	const [listMaterial, setListMaterial] = useState<any>([]);
	const [customerName, setCustomerName] = useState<string>("");
	const [dateSummary, setDateSummary] = useState<string>("");
	const [subject, setSubject] = useState<string>("");
	const [equipment, setEquipment] = useState<string>("");
	const [listPart, setListPart] = useState<any>([]);
	const [data, setData] = useState<data>({
		srId: "",
		bom_detail: [
			{
				partId: "",
				part: "",
				materialId: "",
				material: "",
				satuan: "",
				jumlah: "",
				dimensi: "",
			},
		],
	});

	useEffect(() => {
		getSummary();
		getMaterial();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleOnChanges = (event: any) => {
		if (event.target.name === "srId") {
			if (event.target.value !== "Choose Id Summary") {
				let data = JSON.parse(event.target.value);
				let equipment: any = [];
				let part: any = [];
				let listPartDetail: any = [];
				setCustomerName(data.wor.customerPo.quotations.Customer.name);
				setDateSummary(moment(data.date_of_summary).format("DD-MM-YYYY"));
				setSubject(data.wor.subject);
				data.wor.customerPo.quotations.eqandpart.map((res: any) => {
					if (!equipment.includes(res.equipment.nama)) {
						equipment.push(res.equipment.nama);
					}
				});
				data.srimgdetail.map((res: any) => {
					part.push(res.name_part);
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
				setData({
					srId: data.id,
					bom_detail: listPartDetail,
				});
			} else {
				setCustomerName("");
				setDateSummary("");
				setSubject("");
				setEquipment("");
				setListPart([]);
			}
		}
	};

	const getSummary = async () => {
		try {
			const response = await GetSummaryBillOfMaterial();
			if (response.data) {
				setListSummary(response.data.result);
			}
		} catch (error) {
			setListSummary([]);
		}
	};

	const getMaterial = async () => {
		try {
			const response = await GetAllMaterial();
			if (response.data) {
				setListMaterial(response.data.result);
			}
		} catch (error) {
			setListMaterial([]);
		}
	};

	const addBillOfMaterial = async (payload: data) => {
		setIsLoading(true);
		let listDetail: any = [];
		payload.bom_detail.map((res: any) => {
			listDetail.push({
				partId: res.partId,
				materialId: res.materialId,
				dimensi: res.dimensi,
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

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
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
						<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputSelect
									id='srId'
									name='srId'
									placeholder='id Summary'
									label='Id Summary'
									onChange={(event: any) => {
										if (event.target.value !== "Choose Id Summary") {
											let data = JSON.parse(event.target.value);
											setFieldValue("srId", data.id);
										}
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option defaultValue='' selected>
										Choose Id Summary
									</option>
									{listSummary.length === 0 ? (
										<option value=''>No Data Summary</option>
									) : (
										listSummary.map((res: any, i: number) => {
											return (
												<option value={JSON.stringify(res)} key={i}>
													{res.wor.job_no}
												</option>
											);
										})
									)}
								</InputSelect>
							</div>
							<div className='w-full'>
								<Input
									id='date_wor'
									name='date_wor'
									placeholder='Date Of Summary'
									label='Date Of Summary'
									type='text'
									value={dateSummary}
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
									id='customer'
									name='customer'
									placeholder='Customer Name'
									label='Customer'
									type='text'
									value={customerName}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='customer'
									name='customer'
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
						<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='customer'
									name='customer'
									placeholder='Equipment'
									label='Equipment'
									type='text'
									value={equipment.toString()}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputSelect
									id='timeschId'
									name='timeschId'
									placeholder='Part'
									label='Part'
									onChange={(event: any) => {
										if (event.target.value !== "Choose Part") {
											let data = JSON.parse(event.target.value);
											setFieldValue("timeschId", data.id);
										}
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option defaultValue='' selected>
										Choose Part
									</option>
									{listPart.length === 0 ? (
										<option value=''>No Data Part</option>
									) : (
										listPart.map((res: any, i: number) => {
											return (
												<option value={JSON.stringify(res)} key={i}>
													{res}
												</option>
											);
										})
									)}
								</InputSelect>
							</div>
							<div className='w-full'>
								<a className='inline-flex text-green-500 pt-8 pl-4 text-lg cursor-pointer'>
									<Plus size={18} className='mr-1 mt-1' /> Add Part
								</a>
							</div>
						</Section>
						<FieldArray
							name='bom_detail'
							render={(arrayPart) => (
								<>
									{values.bom_detail.map((res: any, i: number) => (
										<Section
											key={i}
											className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2'
										>
											<div className='w-full'>
												<Input
													id={`bom_detail.${i}.part`}
													name={`bom_detail.${i}.part`}
													placeholder='Part'
													label='Part'
													type='text'
													value={res.part}
													disabled={true}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												/>
											</div>
											<div className='w-full'>
												<InputSelect
													id={`bom_detail.${i}.materialId`}
													name={`bom_detail.${i}.materialId`}
													placeholder='Material'
													label='Material'
													onChange={(event: any) => {
														if (event.target.value !== "Choose Material") {
															let data = JSON.parse(event.target.value);
															setFieldValue(
																`bom_detail.${i}.materialId`,
																data.id
															);
															setFieldValue(
																`bom_detail.${i}.material`,
																data.material_name
															);
															setFieldValue(
																`bom_detail.${i}.satuan`,
																data.satuan
															);
														} else {
															setFieldValue(`bom_detail.${i}.materialId`, "");
															setFieldValue(`bom_detail.${i}.material`, "");
															setFieldValue(`bom_detail.${i}.satuan`, "");
														}
													}}
													required={true}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												>
													<option defaultValue='' selected>
														Choose Material
													</option>
													{listMaterial.length === 0 ? (
														<option value=''>No Data Material</option>
													) : (
														listMaterial.map((res: any, i: number) => {
															return (
																<option value={JSON.stringify(res)} key={i}>
																	{res.material_name} ({" "}
																	{res.grup_material.material_name} )
																</option>
															);
														})
													)}
												</InputSelect>
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
													value={res.jumlah}
													disabled={true}
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
													onChange={handleChange}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												/>
											</div>
										</Section>
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
		</div>
	);
};