import { useEffect, useState } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputArea,
	InputSelectSearch,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { quotationSchema } from "../../../schema/marketing/quotation/quotationSchema";
import { Plus, Trash2 } from "react-feather";
import { EditQuotation } from "../../../services";
import { toast } from "react-toastify";
import { formatRupiah } from "@/src/utils";
import Editor from 'react-simple-wysiwyg';

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
	attention: string;
	waranti: string;
	subject: string;
	send_by: string;
	estimated_delivery: string;
	Quotations_Detail: string;
	deskription: string;
	note_payment: string;
	note: string;
	term_payment: string;
	quo_img: any;
	price_quotation: any;
	delete: any;
	date: Date;
}

export const FormEditQuotation = ({
	content,
	dataQuotation,
	dataCustomer,
	showModal,
}: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isUnitInput, setIsUnitInput] = useState<boolean>(false);
	const [cityCustomer, setCityCustomer] = useState<string>("");
	const [AddressCustomer, setCustomerAddress] = useState<string>("");
	const [listContact, setListContact] = useState<any>([]);
	const [datasUnit, setDatasUnit] = useState<any>([]);
	const [equipment, setEquipment] = useState<any>([]);
	const [listParts, setListParts] = useState<any>([]);
	const [equipmentSelected, setEquipmentSelected] = useState<string>("");
	const [imgQuotation, setImgQuotation] = useState<any>(null);
	const [data, setData] = useState<dataQuotation>({
		quo_num: "",
		quo_auto: "",
		customerId: "",
		customercontactId: "",
		attention: "",
		estimated_delivery: "",
		waranti: "",
		subject: "",
		send_by: "",
		Quotations_Detail: "",
		note_payment: "",
		note: "",
		term_payment: "",
		deskription: "",
		quo_img: null,
		date: new Date(),
		price_quotation: [],
		delete: [],
	});

	useEffect(() => {
		settingData();
		let data: any = [
			{
				label: "Days",
				value: "Days",
			},
			{
				label: "Ea",
				value: "Ea",
			},
			{
				label: "Hours",
				value: "Hours",
			},
			{
				label: "Kg",
				value: "Kg",
			},
			{
				label: "Lot",
				value: "Lot",
			},
			{
				label: "Set",
				value: "Set",
			},
			{
				label: "Spot",
				value: "Spot",
			},
			{
				label: "Pads",
				value: "Pads",
			},
			{
				label: "Trip",
				value: "Trip",
			},
			{
				label: "Unit",
				value: "Unit",
			},
			{
				label: "Input",
				value: "Input",
			},
		];
		setDatasUnit(data);
		// getEquipment();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		let dataPrice: any = [];
		dataQuotation.price_quotation.map((res: any) => {
			dataPrice.push(res);
		});
		setData({
			quo_num: dataQuotation.quo_num,
			quo_auto: dataQuotation.quo_auto,
			customerId: dataQuotation.customerId,
			customercontactId: dataQuotation.customerContactId,
			attention: dataQuotation.attention,
			send_by: dataQuotation.send_by,
			waranti: dataQuotation.warranty,
			estimated_delivery: dataQuotation.estimated_delivery,
			subject: dataQuotation.subject,
			Quotations_Detail: dataQuotation.Quotations_Detail,
			deskription: dataQuotation.deskription,
			note: dataQuotation.note,
			note_payment: dataQuotation.note_payment,
			term_payment: dataQuotation.term_payment,
			quo_img: dataQuotation.quo_img,
			date: new Date(dataQuotation.date),
			price_quotation: dataPrice,
			delete: [],
		});

		setCustomerAddress(dataQuotation.Customer.address[0].address_workshop);
		setCityCustomer(dataQuotation.Customer.address[0].cities);
		dataCustomer.map((res: any) => {
			if (res.id === dataQuotation.customerId) {
				setListContact(res.contact);
			}
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

	const editQuotation = async (payload: any) => {
		setIsLoading(true);
		const form = new FormData();
		let listPrice: any = [];
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

		payload.price_quotation.map((res: any) => {
			listPrice.push({
				id: res.id,
				quo_id: res.quo_id,
				qty: res.qty,
				description: res.description,
				unit_price: res.unit_price,
				total_price: res.total_price,
				unit: res.unit,
			});
		});

		form.append("quo_num", payload.quo_num);
		form.append("quo_auto", payload.quo_auto);
		form.append("customercontactId", payload.customercontactId);
		form.append("attention", payload.attention);
		form.append("estimated_delivery", payload.estimated_delivery);
		form.append("waranti", payload.waranti);
		form.append("subject", payload.subject);
		form.append("Quotations_Detail", payload.Quotations_Detail);
		form.append("note_payment", payload.note_payment);
		form.append("term_payment", payload.term_payment);
		form.append("send_by", payload.send_by);
		form.append("revision_desc", "");
		form.append("date", new Date(payload.date).toUTCString());
		form.append("price_quotation", JSON.stringify(listPrice));
		form.append("delete", JSON.stringify(payload.delete));

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

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			<Formik
				initialValues={{ ...data }}
				validationSchema={quotationSchema}
				onSubmit={(values) => {
					editQuotation(values);
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
						<h1 className='text-xl font-bold mt-3'>Customer PO</h1>
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
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
							</div>
							<div className='w-full'>
								<Input
									id='quo_auto'
									name='quo_auto'
									type='text'
									label='ID Quotations'
									value={values.quo_auto}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
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
													selected={res.id === values.customerId ? true : false}
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
														res.id === values.customercontactId ? true : false
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
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
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
							<div className='w-full'>
								<Input
									id='attention'
									name='attention'
									placeholder='Attention'
									label='Attention'
									type='text'
									value={values.attention}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='estimated_delivery'
									name='estimated_delivery'
									placeholder='Estimate Delivery'
									label='Estimate Delivery'
									type='text'
									value={values.estimated_delivery}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputArea
									id='subject'
									name='subject'
									placeholder='Subject'
									label='Subject'
									required={true}
									value={values.subject}
									onChange={handleChange}
									row={2}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<Input
										id='waranti'
										name='waranti'
										placeholder='Waranti'
										label='Waranti'
										type='text'
										value={values.waranti}
										onChange={handleChange}
										required={true}
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
						</Section>
						<h1 className='text-xl font-bold mt-3'>Workscope Description</h1>
						<Section className='grid grid-cols-1'>
							<div className='w-full'>
								<InputArea
									id='Quotations_Detail'
									name='Quotations_Detail'
									placeholder='Scope of Work'
									label='Scope of work'
									required={true}
									value={values.Quotations_Detail}
									onChange={handleChange}
									row={4}
									withLabel={false}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600 resize-y'
								/>
								{/* <Editor value={values.Quotations_Detail} onChange={(e:any) => {
									setFieldValue('Quotations_Detail', e.target.value)
								}}/> */}
							</div>
						</Section>
						<h1 className='text-xl font-bold mt-3'>
							Price And Term Of Payment
						</h1>
						<FieldArray
							name='price_quotation'
							render={(arrayPrice) => (
								<>
									{values.price_quotation.map((res: any, i: number) => {
										return (
											<Section
												className='grid lg:grid-cols-6 sm:grid-cols-3 gap-2 mt-2'
												key={i}
											>
												<div className='w-full'>
													<InputArea
														id={`price_quotation.${i}.description`}
														name={`price_quotation.${i}.description`}
														placeholder='Description'
														label='Description'
														required={true}
														value={res.description}
														onChange={handleChange}
														row={2}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<Input
														id={`price_quotation.${i}.qty`}
														name={`price_quotation.${i}.qty`}
														placeholder='Quantity'
														label='Quantity'
														type='text'
														pattern='\d*'
														onChange={(e: any) => {
															let qty: number = 0;
															qty = parseInt(e.target.value.replace(/\./g, ""));
															setFieldValue(`price_quotation.${i}.qty`, qty);
															setFieldValue(
																`price_quotation.${i}.total_price`,
																qty * res.unit_price
															);
														}}
														value={formatRupiah(res.qty.toString())}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													{isUnitInput ? (
														<Input
															id={`price_quotation.${i}.unit`}
															name={`price_quotation.${i}.unit`}
															placeholder='Unit'
															label='Unit'
															type='text'
															onChange={(e: any) => {
																setFieldValue(
																	`price_quotation.${i}.unit`,
																	e.target.value
																);
															}}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													) : (
														<InputSelectSearch
															datas={datasUnit}
															id={`price_quotation.${i}.unit`}
															name={`price_quotation.${i}.unit`}
															placeholder={res.unit}
															label='Unit'
															onChange={(input: any) => {
																if (input.value === "Input") {
																	setIsUnitInput(true);
																} else {
																	setIsUnitInput(false);
																	setFieldValue(
																		`price_quotation.${i}.unit`,
																		input.value
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
														id={`price_quotation.${i}.unit_price`}
														name={`price_quotation.${i}.unit_price`}
														placeholder='Unit Price'
														label='Unit Price'
														type='text'
														pattern='\d*'
														onChange={(e: any) => {
															let unit_price: number = 0;
															unit_price = parseInt(
																e.target.value.replace(/\./g, "")
															);
															setFieldValue(
																`price_quotation.${i}.unit_price`,
																unit_price
															);
															setFieldValue(
																`price_quotation.${i}.total_price`,
																unit_price * res.qty
															);
														}}
														value={formatRupiah(res.unit_price.toString())}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<Input
														id={`price_quotation.${i}.total_price`}
														name={`price_quotation.${i}.total_price`}
														placeholder='Total Price'
														label='Total Price'
														type='text'
														pattern='\d*'
														value={formatRupiah(res.total_price.toString())}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='flex w-full'>
													{i === values.price_quotation.length - 1 ? (
														<a
															className='flex mt-8 text-[20px] text-blue-600 cursor-pointer hover:text-blue-400'
															onClick={() =>
																arrayPrice.push({
																	id: "",
																	quo_id: dataQuotation.id,
																	description: "",
																	qty: 0,
																	unit: "",
																	unit_price: 0,
																	total_price: 0,
																})
															}
														>
															<Plus size={23} className='mt-1' />
															Add
														</a>
													) : null}
													{values.price_quotation.length !== 1 ? (
														<a
															className='flex ml-4 mt-8 text-[20px] text-red-600 w-full hover:text-red-400 cursor-pointer'
															onClick={() => {
																let priceDelete: any = values.delete;
																if (res.id !== "") {
																	priceDelete.push({
																		id: res.id,
																	});
																}
																setFieldValue("delete", priceDelete);
																arrayPrice.remove(i);
															}}
														>
															<Trash2 size={22} className='mt-1 mr-1' />
															Remove
														</a>
													) : null}
												</div>
											</Section>
										);
									})}
								</>
							)}
						/>
						{dataQuotation.job_operational === "S" ? (
							<Section className='grid grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<InputArea
										id='note'
										name='note'
										placeholder='Note'
										label='Note'
										required={true}
										value={values.note}
										onChange={handleChange}
										row={2}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600 resize-y'
									/>
								</div>
							</Section>
						) : (
							<Section className='grid lg:grid-cols-2 sm:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<InputArea
										id='note_payment'
										name='note_payment'
										placeholder='Note Payment'
										label='Note Payment'
										value={values.note_payment}
										required={true}
										onChange={handleChange}
										row={2}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
								<div className='w-full'>
									<InputArea
										id='term_payment'
										name='term_payment'
										placeholder='Term Payment'
										label='Term Payment'
										value={values.term_payment}
										required={true}
										onChange={handleChange}
										row={2}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
							</Section>
						)}
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
	);
};
