import { useEffect, useState } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputArea,
	MultipleSelect,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { quotationSchema } from "../../../schema/marketing/quotation/quotationSchema";
import { Plus, Trash2 } from "react-feather";
import {
	EditQuotation,
	EditQuotationDetail,
	DeleteQuotationDetail,
	GetAllEquipment,
	EditQuotationItem,
	DeleteQuotationItem,
} from "../../../services";
import { toast } from "react-toastify";

interface props {
	content: string;
	dataQuotation: any;
	dataCustomer: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface dataQuotation {
	quo_num: string;
	quo_auto: string;
	customerId: string;
	customercontactId: string;
	deskription: string;
	quo_img: any;
	date: Date;
}

interface dataDetail {
	Quotations_Detail: [
		{
			id: string;
			quo_id: string;
			item_of_work: string;
			volume: string;
			unit: string;
		}
	];
}

interface dataItem {
	parts: [
		{
			id: string;
			id_quotation: string;
			id_part: string;
			id_equipment: string;
			qty: string;
			keterangan: string;
		}
	];
}

export const FormEditQuotation = ({
	content,
	dataQuotation,
	dataCustomer,
	showModal,
}: props) => {
	const dataTabs = ["Quotation", "Quotation Detail", "Items Of Part"];

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [activeTabs, setActiveTabs] = useState<any>(dataTabs[0]);
	const [cityCustomer, setCityCustomer] = useState<string>("");
	const [AddressCustomer, setCustomerAddress] = useState<string>("");
	const [listContact, setListContact] = useState<any>([]);
	const [equipment, setEquipment] = useState<any>([]);
	const [listParts, setListParts] = useState<any>([]);
	const [equipmentSelected, setEquipmentSelected] = useState<string>("");
	const [imgQuotation, setImgQuotation] = useState<any>(null);
	const [data, setData] = useState<dataQuotation>({
		quo_num: "",
		quo_auto: "",
		customerId: "",
		customercontactId: "",
		deskription: "",
		quo_img: null,
		date: new Date(),
	});
	const [dataDetail, setDataDetail] = useState<dataDetail>({
		Quotations_Detail: [
			{
				id: "",
				quo_id: "",
				item_of_work: "",
				volume: "",
				unit: "",
			},
		],
	});
	const [dataItem, setDataItem] = useState<dataItem>({
		parts: [
			{
				id: "",
				id_quotation: "",
				id_part: "",
				id_equipment: "",
				qty: "",
				keterangan: "",
			},
		],
	});

	useEffect(() => {
		settingData();
		// getEquipment();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		let listDetail: any = [];
		let listPart: any = [];

		setData({
			quo_num: dataQuotation.quo_num,
			quo_auto: dataQuotation.quo_auto,
			customerId: dataQuotation.customerId,
			customercontactId: dataQuotation.customerContactId,
			deskription: dataQuotation.deskription,
			quo_img: dataQuotation.quo_img,
			date: new Date(dataQuotation.date),
		});

		setCustomerAddress(dataQuotation.Customer.address[0].address_workshop);
		setCityCustomer(dataQuotation.Customer.address[0].cities);
		dataCustomer.map((res: any) => {
			if (res.id === dataQuotation.customerId) {
				setListContact(res.contact);
			}
		});

		if (dataQuotation.Quotations_Detail.length > 0) {
			dataQuotation.Quotations_Detail.map((res: any) => {
				listDetail.push({
					id: res.id,
					quo_id: dataQuotation.id,
					item_of_work: res.item_of_work,
					volume: res.volume,
					unit: res.unit,
				});
			});
		} else {
			listDetail.push({
				item_of_work: "",
				volume: "",
				unit: "",
			});
		}

		// if (dataQuotation.eqandpart.length > 0) {
		// 	dataQuotation.eqandpart.map((res: any) => {
		// 		listPart.push({
		// 			id: res.id,
		// 			id_quotation: res.id_quotation,
		// 			id_part: res.id_part,
		// 			id_equipment: res.id_equipment,
		// 			qty: res.qty,
		// 			keterangan: res.keterangan,
		// 		});
		// 	});
		// } else {
		// 	listPart.push({
		// 		id: "",
		// 		id_quotation: "",
		// 		id_part: "",
		// 		id_equipment: "",
		// 		qty: "",
		// 		keterangan: "",
		// 	});
		// }

		setDataDetail({
			Quotations_Detail: listDetail,
		});

		setDataItem({
			parts: listPart,
		});
	};

	// const getEquipment = async () => {
	// 	try {
	// 		const response = await GetAllEquipment();
	// 		if (response.data) {
	// 			let list: any = [];
	// 			let listEquipment: any = [];
	// 			response.data.result.map((res: any) => {
	// 				if (dataQuotation.eqandpart.length > 0) {
	// 					dataQuotation.eqandpart.map((result: any) => {
	// 						res.eq_part.map((dataPart: any) => {
	// 							if (dataPart.id_equipment === result.id_equipment) {
	// 								list.push(dataPart);
	// 								listEquipment.push(res);
	// 								// setEquipmentSelected(res.id);
	// 							}
	// 						});
	// 					});
	// 				}
	// 			});
	// 			setListParts(list);
	// 			const keys = ["id"];
	// 			const eq = listEquipment.filter(
	// 				(
	// 					(s) => (o: any) =>
	// 						((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join("|"))
	// 				)(new Set())
	// 			);
	// 			setEquipment(eq);
	// 		}
	// 	} catch (error) {
	// 		setEquipment([]);
	// 	}
	// };

	const showUpload = (id: any) => {
		const inputan = document.getElementById(id);
		inputan?.click();
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name === "customerId") {
			if (event.target.value !== "Choose Customer") {
				let data = JSON.parse(event.target.value);
				setListContact(data.contact);
				setCityCustomer(data.address[0].cities);
				setCustomerAddress(data.address[0].address_workshop);
			} else {
				setListContact([]);
				setCityCustomer("");
				setCustomerAddress("");
			}
		} else if (event.target.name === "equipment") {
			if (event.target.value !== "Choose Equipment") {
				let data = JSON.parse(event.target.value);
				setEquipmentSelected(data.id);
				setListParts(data.eq_part);
			} else {
				setEquipmentSelected("");
				setListParts([]);
			}
		} else if (event.target.name === "quo_img") {
			setImgQuotation(event.target.files[0]);
		}
	};

	const selectEquipment = (data: any) => {
		let list: any = [];
		data.map((res: any) => {
			res.eq_part.map((dataPart: any) => {
				list.push(dataPart);
			});
		});
		setListParts(list);
	};

	const editQuotation = async (payload: any) => {
		setIsLoading(true);
		const form = new FormData();
		if (payload.customerId.startsWith("{")) {
			const dataCustomer = JSON.parse(payload.customerId);
			form.append("customerId", dataCustomer.id);
		} else {
			form.append("customerId", payload.customerId);
		}
		if (imgQuotation === null) {
			form.append("quo_img", payload.quo_img);
		} else {
			form.append("quo_img", imgQuotation);
		}
		form.append("quo_num", payload.quo_num);
		form.append("quo_auto", payload.quo_auto);
		form.append("customercontactId", payload.customercontactId);
		form.append("deskription", payload.deskription);
		form.append("date", new Date(payload.date).toUTCString());

		try {
			const response = await EditQuotation(form, dataQuotation.id);
			if (response) {
				toast.success("Edit Quotation Success", {
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
			toast.error("Edit Quotation Failed", {
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

	const editQuotationDetail = async (payload: any) => {
		setIsLoading(true);

		try {
			const response = await EditQuotationDetail(payload.Quotations_Detail);
			if (response) {
				toast.success("Edit Quotation Detail Success", {
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
			toast.error("Edit Quotation Detail Failed", {
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

	const deleteQuotationDetail = async (id: string) => {
		setIsLoading(true);

		try {
			const response = await DeleteQuotationDetail(id);
			if (response) {
				toast.success("Delete Quotation Detail Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				showModal(true, content, true);
			}
		} catch (error) {
			toast.error("Delete Quotation Detail Failed", {
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

	const editQuotationItem = async (payload: any) => {
		setIsLoading(true);
		let bodyForm: any = [];
		payload.parts.map((res: any) => {
			const dataPart = {
				id: res.id,
				id_quotation: res.id_quotation,
				id_part: res.id_part,
				id_equipment: res.id_equipment,
				qty: res.qty,
				keterangan: res.keterangan
			};
			bodyForm.push(dataPart);
		});

		try {
			const response = await EditQuotationItem(bodyForm);
			if (response) {
				toast.success("Edit Quotation Items Success", {
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
			toast.error("Edit Quotation Items Failed", {
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

	const deleteQuotationItem = async (id: string) => {
		try {
			const response = await DeleteQuotationItem(id);
			if (response.data) {
				toast.success("Delete Quotation Item Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				showModal(true, content, true);
			}
		} catch (error) {
			toast.error("Delete Quotation Item Failed", {
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
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<div className='flex items-center gap-4'>
				{dataTabs.map((res: any, i: number) => (
					<button
						key={i}
						className={`text-base font-semibold ${
							res === activeTabs
								? "text-[#66B6FF] border-b-4 border-[#66B6FF]"
								: "text-[#9A9A9A]"
						}`}
						onClick={() => setActiveTabs(res)}
					>
						{res}
					</button>
				))}
			</div>
			{activeTabs === "Quotation" ? (
				<div>
					<Formik
						initialValues={{ ...data }}
						validationSchema={quotationSchema}
						onSubmit={(values) => {
							editQuotation(values);
						}}
						key={activeTabs}
						enableReinitialize
					>
						{({ handleChange, handleSubmit, errors, touched, values }) => (
							<Form onChange={handleOnChanges}>
								<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<table className='w-full'>
											<tr>
												<td>
													<Input
														id='quo_num'
														name='quo_num'
														placeholder='Qoutation Number'
														label='Qoutation Number'
														type='text'
														value={values.quo_num}
														onChange={handleChange}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</td>
												<td>
													<Input
														id='quo_auto'
														name='quo_auto'
														type='text'
														value={values.quo_auto}
														disabled={true}
														required={true}
														withLabel={false}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600 mt-6'
													/>
												</td>
											</tr>
										</table>
									</div>
								</Section>
								<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<InputSelect
											id='customerId'
											name='customerId'
											placeholder='Customer'
											label='Customer'
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										>
											<option defaultValue='' selected>
												Choose Customer
											</option>
											{dataCustomer.length === 0 ? (
												<option value=''>No Data Customer</option>
											) : (
												dataCustomer.map((res: any, i: number) => {
													return (
														<option
															value={JSON.stringify(res)}
															key={i}
															selected={
																res.id === values.customerId ? true : false
															}
														>
															{res.name}
														</option>
													);
												})
											)}
										</InputSelect>
									</div>
									<div className='w-full'>
										<InputSelect
											id='customercontactId'
											name='customercontactId'
											placeholder='contact person'
											label='Contact person'
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										>
											<option defaultValue='' selected>
												Choose Contact Person
											</option>
											{listContact.length === 0 ? (
												<option value=''>No Data Contact Person</option>
											) : (
												listContact.map((res: any, i: number) => {
													return (
														<option
															value={res.id}
															key={i}
															selected={
																res.id === values.customercontactId
																	? true
																	: false
															}
														>
															{res.contact_person} - +62{res.phone}
														</option>
													);
												})
											)}
										</InputSelect>
									</div>
								</Section>
								<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<Input
											id='city'
											name='city'
											placeholder='City'
											label='City'
											value={cityCustomer}
											required={true}
											disabled={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<Input
											id='address'
											name='address'
											placeholder='Address'
											label='Address'
											value={AddressCustomer}
											required={true}
											disabled={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
								</Section>
								<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<InputArea
											id='deskription'
											name='deskription'
											placeholder='Quotation Description'
											label='Quotation Description'
											required={true}
											value={values.deskription}
											onChange={handleChange}
											row={2}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										{values.quo_img !== null &&
										values.quo_img.includes("https://res.cloudinary.com/") ? (
											<div>
												<label className='block mb-2 text-sm font-medium text-gray-900'>
													Quotation File
												</label>
												<div className='flex'>
													<a
														href={values.quo_img}
														target='_blank'
														className='justify-center rounded-full border border-transparent bg-green-500 px-4 py-1 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mt-2 mr-2'
													>
														Show File
													</a>
													<p
														className='justify-center rounded-full border border-transparent bg-orange-500 px-4 py-1 text-sm font-medium text-white hover:bg-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mt-2 cursor-pointer'
														onClick={() => showUpload("quo_img")}
													>
														Change File
													</p>
													<input
														id='quo_img'
														name='quo_img'
														placeholder='Certificate Image'
														type='file'
														className='hidden'
													/>
												</div>
											</div>
										) : (
											<Input
												id='quo_img'
												name='quo_img'
												placeholder='Quotation File'
												label='Quotation File'
												type='file'
												onChange={handleChange}
												required={true}
												withLabel={true}
												className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
											/>
										)}
									</div>
								</Section>
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
												"Edit Quotation"
											)}
										</button>
									</div>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			) : activeTabs === "Quotation Detail" ? (
				<div>
					<Formik
						initialValues={dataDetail}
						// validationSchema={quotationSchema}
						onSubmit={(values) => {
							editQuotationDetail(values);
						}}
						enableReinitialize
						key={activeTabs}
					>
						{({ handleChange, handleSubmit, errors, touched, values }) => (
							<Form>
								<FieldArray
									name='Quotations_Detail'
									render={(arrayDetails) => (
										<>
											{values.Quotations_Detail.map((res, i) => (
												<div key={i}>
													<Section
														className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'
														key={i}
													>
														<div className='w-full'>
															<Input
																id={`Quotations_Detail.${i}.item_of_work`}
																name={`Quotations_Detail.${i}.item_of_work`}
																placeholder='Detail Quotation'
																label='Quotation Detail'
																onChange={handleChange}
																value={res.item_of_work}
																required={true}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
															/>
														</div>
														<div className='w-full'>
															<Input
																id={`Quotations_Detail.${i}.volume`}
																name={`Quotations_Detail.${i}.volume`}
																placeholder='Volume'
																label='Volume'
																onChange={handleChange}
																value={res.volume}
																type='number'
																required={true}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
															/>
														</div>
														<div className='w-full'>
															<Input
																id={`Quotations_Detail.${i}.unit`}
																name={`Quotations_Detail.${i}.unit`}
																placeholder='Unit'
																label='Unit'
																onChange={handleChange}
																value={res.unit}
																required={true}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
															/>
														</div>
													</Section>
													{i === values.Quotations_Detail.length - 1 ? (
														<a
															className='inline-flex text-green-500 mr-6 mt-1 cursor-pointer'
															onClick={() => {
																arrayDetails.push({
																	id: "",
																	quo_id: dataQuotation.id,
																	item_of_work: "",
																	volume: "",
																	unit: "",
																});
															}}
														>
															<Plus size={18} className='mr-1 mt-1' /> Add
															Detail
														</a>
													) : null}
													{values.Quotations_Detail.length !== 1 ? (
														<a
															className='inline-flex text-red-500 cursor-pointer mt-1'
															onClick={() => {
																res.id !== ""
																	? deleteQuotationDetail(res.id)
																	: null;
																arrayDetails.remove(i);
															}}
														>
															<Trash2 size={18} className='mr-1 mt-1' />
															Remove Detail
														</a>
													) : null}
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
											) : content === "add" ? (
												"Save"
											) : (
												"Edit Quotation Detail"
											)}
										</button>
									</div>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			) : (
				<div>
					<Formik
						initialValues={dataItem}
						// validationSchema={quotationSchema}
						onSubmit={(values) => {
							editQuotationItem(values);
						}}
						enableReinitialize
						key={activeTabs}
					>
						{({ handleChange, handleSubmit, errors, touched, values }) => (
							<Form onChange={handleOnChanges}>
								<Section className='grid md:grid-cols-1 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										{/* <InputSelect
											id='equipment'
											name='equipment'
											placeholder='Equipment'
											label='Equipment'
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										>
											<option defaultValue='' selected>
												Choose Equipment
											</option>
											{equipment.length === 0 ? (
												<option value=''>No Data Equipment</option>
											) : (
												equipment.map((res: any, i: number) => {
													return (
														<option
															value={JSON.stringify(res)}
															key={i}
															selected={
																res.id === equipmentSelected ? true : false
															}
														>
															{res.nama}
														</option>
													);
												})
											)}
										</InputSelect> */}
										<MultipleSelect
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
											listdata={equipment}
											placeholder='Select Equipment'
											displayValue='nama'
											selectedValue={equipment}
											onSelect={selectEquipment}
											onRemove={selectEquipment}
										/>
									</div>
								</Section>
								<FieldArray
									name='parts'
									render={(arrayParts) => (
										<div>
											{values.parts.map((res, i) => (
												<div key={i}>
													<Section
														className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'
														key={i}
													>
														<div>
															<InputSelect
																id={`parts.${i}.id_part`}
																name={`parts.${i}.id_part`}
																placeholder='Equipment'
																label='Part'
																onChange={handleChange}
																required={true}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
															>
																<option defaultValue='' selected>
																	Choose Part
																</option>
																{listParts.length === 0 ? (
																	<option value=''>No Data Part</option>
																) : (
																	listParts.map((part: any, i: number) => {
																		return (
																			<option
																				value={part.id}
																				key={i}
																				selected={
																					res.id_part === part.id ? true : false
																				}
																			>
																				{part.nama_part} ({part.equipment.nama})
																			</option>
																		);
																	})
																)}
															</InputSelect>
														</div>
														<div>
															<Input
																id={`parts.${i}.qty`}
																name={`parts.${i}.qty`}
																placeholder='Quantity'
																label='Quantity'
																type='number'
																value={res.qty}
																onChange={handleChange}
																required={true}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
															/>
														</div>
														<div>
															<Input
																id={`parts.${i}.keterangan`}
																name={`parts.${i}.keterangan`}
																placeholder='Keterangan'
																label='Keterangan'
																type='text'
																value={res.keterangan}
																onChange={handleChange}
																required={true}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
															/>
														</div>
													</Section>
													{i === values.parts.length - 1 ? (
														<a
															className='inline-flex text-green-500 mr-6 mt-1 cursor-pointer'
															onClick={() => {
																arrayParts.push({
																	id: "",
																	id_quotation: dataQuotation.id,
																	id_part: "",
																	id_equipment: equipmentSelected,
																	qty: "",
																	keterangan: "",
																});
															}}
														>
															<Plus size={18} className='mr-1 mt-1' /> Add Part
														</a>
													) : null}
													{values.parts.length !== 1 ? (
														<a
															className='inline-flex text-red-500 cursor-pointer mt-1'
															onClick={() => {
																res.id !== ""
																	? deleteQuotationItem(res.id)
																	: null;
																arrayParts.remove(i);
															}}
														>
															<Trash2 size={18} className='mr-1 mt-1' />
															Remove Part
														</a>
													) : null}
												</div>
											))}
										</div>
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
											) : content === "add" ? (
												"Save"
											) : (
												"Edit Quotation Item"
											)}
										</button>
									</div>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			)}
		</div>
	);
};
