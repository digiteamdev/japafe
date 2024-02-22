import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputWithIcon,
	InputSelectSearch,
	InputArea,
	MultipleSelect,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { quotationSchema } from "../../../schema/marketing/quotation/quotationSchema";
import {
	AddQuotation,
	GetAllEquipment,
	GetAllCustomer,
} from "../../../services";
import { toast } from "react-toastify";
import { FormCreateEquipment } from "./formCreateEquipment";
import { FormCreateCustomer } from "./formCreateCustomer";
import { Plus, Trash2 } from "react-feather";
import { formatRupiah } from "@/src/utils";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	quo_num: string;
	quo_auto: string;
	customerId: string;
	customercontactId: string;
	subject: string;
	attention: string;
	estimated_delivery: string;
	waranti: string;
	quo_img: string;
	date: Date;
	note_payment: string;
	term_payment: string;
	Quotations_Detail: string;
	parts: [
		{
			id: string;
			qty: string;
			keterangan: string;
		}
	];
	price_quotation: [
		{
			description: string;
			qty: number;
			unit: string;
			unit_price: number;
			total_price: number;
		}
	];
}

export const FormCreateQuotation = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isUnitInput, setIsUnitInput] = useState<boolean>(false);
	const [isCreateEquipment, setIsCreateEquipment] = useState<boolean>(false);
	const [isCreateCustomer, setIsCreateCustomer] = useState<boolean>(false);
	const [listContact, setListContact] = useState<any>([]);
	const [dataCustomer, setDataCustomer] = useState<any>([]);
	const [cityCustomer, setCityCustomer] = useState<string>("");
	const [AddressCustomer, setCustomerAddress] = useState<string>("");
	const [equipment, setEquipment] = useState<any>([]);
	const [listParts, setListParts] = useState<any>([]);
	const [datasUnit, setDatasUnit] = useState<any>([]);
	const [parts, setParts] = useState<any>([]);
	const [equipmentSelected, setEquipmentSelected] = useState<string>("");
	const [searchCustomer, setSearchCustomer] = useState<string>("");
	const [imgQuotation, setImgQuotation] = useState<any>(null);
	const [idAutoNum, setIdAutoNum] = useState<string>("");
	const [data, setData] = useState<data>({
		quo_num: "",
		quo_auto: "",
		customerId: "",
		customercontactId: "",
		subject: "",
		estimated_delivery: "",
		attention: "",
		waranti: "",
		quo_img: "",
		date: new Date(),
		note_payment: "",
		term_payment: "",
		Quotations_Detail: "",
		parts: [
			{
				id: "",
				qty: "",
				keterangan: "",
			},
		],
		price_quotation: [
			{
				description: "",
				qty: 0,
				unit: "",
				unit_price: 0,
				total_price: 0,
			},
		],
	});

	useEffect(() => {
		getEquipment();
		generateIdNum();
		getCustomer();
		let data: any = [
			{
				label: "each",
				value: "each",
			},
			{
				label: "set",
				value: "set",
			},
			{
				label: "lot",
				value: "lot",
			},
			{
				label: "unit",
				value: "unit",
			},
			{
				label: "Input",
				value: "Input",
			},
		];
		setDatasUnit(data);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = dateObj.getUTCMonth() + 1;
		var year = dateObj.getUTCFullYear();
		const id =
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 10000) +
			1;
		setIdAutoNum(`QU${id}`);
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name === "customerId") {
			if (
				event.target.value !== "Choose Customer" &&
				event.target.value !== "create"
			) {
				let data = JSON.parse(event.target.value);
				setListContact(data.contact);
				setCityCustomer(data.address[0].cities);
				setCustomerAddress(data.address[0].address_workshop);
			} else {
				setListContact([]);
				setCityCustomer("");
				setCustomerAddress("");
			}
		}
		// else if (event.target.name === "equipment") {
		// 	if (event.target.value !== "Choose Equipment") {
		// 		let data = JSON.parse(event.target.value);
		// 		setEquipmentSelected(data.id);
		// 		setListParts(data.eq_part);
		// 	} else {
		// 		setEquipmentSelected("");
		// 		setListParts([]);
		// 	}
		// }
		else if (event.target.name === "quo_img") {
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

	const addQuotation = async (payload: any) => {
		setIsLoading(true);
		const form = new FormData();

		form.append("quo_num", payload.quo_num);
		form.append("quo_auto", idAutoNum);
		form.append("customerId", payload.customerId);
		form.append("customercontactId", payload.customercontactId);
		form.append("subject", payload.subject);
		form.append("attention", payload.attention);
		form.append("warranty", payload.waranti);
		form.append("estimated_delivery", payload.estimated_delivery);
		form.append("send_by", "Wa");
		form.append("quo_img", imgQuotation);
		form.append("date", new Date().toUTCString());
		form.append("Quotations_Detail", payload.Quotations_Detail);
		form.append("price_quotation", JSON.stringify(payload.price_quotation));
		form.append("note_payment", payload.note_payment);
		form.append("term_payment", payload.term_payment);

		try {
			const response = await AddQuotation(form);
			if (response) {
				toast.success("Add Quotation Success", {
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
			toast.error("Add Quotation Failed", {
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

	const getEquipment = async () => {
		try {
			const response = await GetAllEquipment();
			if (response.data) {
				setEquipment(response.data.result);
			}
		} catch (error) {
			setEquipment([]);
		}
	};

	const getCustomer = async () => {
		let dataCustomers: any = [];
		try {
			const response = await GetAllCustomer();
			if (response.data) {
				response.data.result.map((res: any) => {
					dataCustomers.push({
						...res,
						label: res.name,
					});
				});
				setDataCustomer(dataCustomers);
			}
		} catch (error) {
			setDataCustomer(dataCustomers);
		}
	};

	const formCreateCustomer = (data: any, show: boolean) => {
		if (data === null) {
			getCustomer();
			setIsCreateCustomer(false);
		} else {
			setData(data);
			setIsCreateCustomer(true);
		}
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			{isCreateEquipment ? (
				<FormCreateEquipment showModal={setIsCreateEquipment} />
			) : isCreateCustomer ? (
				<FormCreateCustomer content={content} showModal={formCreateCustomer} />
			) : (
				<Formik
					initialValues={{ ...data }}
					validationSchema={quotationSchema}
					onSubmit={(values) => {
						addQuotation(values);
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
							<h1 className='text-xl font-bold mt-3'>Quotation</h1>
							<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<Input
										id='quo_num'
										name='quo_num'
										placeholder='Qoutation Number'
										label='Qoutation Number'
										type='text'
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
										value={idAutoNum}
										disabled={true}
										required={true}
										withLabel={false}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600 mt-6'
									/>
								</div>
								<div className='w-full'>
									<InputSelectSearch
										datas={dataCustomer}
										id='customerId'
										name='customerId'
										placeholder='Customer'
										label='Customer'
										onChange={(input: any) => {
											let dataContacts: any = [];
											// if (input.target.value === "create") {
											// 	formCreateCustomer(values, true);
											// } else if (input.target.value === "Choose Customer") {
											// 	setFieldValue("customerId", "");
											// } else if (input.target.value === "no data") {
											// 	setFieldValue("customerId", "");
											// } else {
											// }
											input.contact.map((res: any) => {
												dataContacts.push({
													...res,
													label: `${res.contact_person} - ${res.phone}`,
												});
											});
											setListContact(dataContacts);
											setCityCustomer(input.address[0].cities);
											setCustomerAddress(input.address[0].address_workshop);
											setFieldValue("customerId", input.id);
										}}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
									/>
									{/* <option defaultValue='' selected>
											Choose Customer
										</option>
										{dataCustomer.length === 0 ? (
											<option value='no data'>No Data Customer</option>
										) : (
											dataCustomer.map((res: any, i: number) => {
												return (
													<option value={JSON.stringify(res)} key={i}>
														{res.name}
													</option>
												);
											})
										)}
										<option value='create'>Add New Customer</option>
									</InputSelect> */}
									{errors.customerId && touched.customerId ? (
										<span className='text-red-500 text-xs'>
											{errors.customerId}
										</span>
									) : null}
								</div>
								<div className='w-full'>
									<InputSelectSearch
										datas={listContact}
										id='customercontactId'
										name='customercontactId'
										placeholder='contact person'
										label='Contact person'
										onChange={(input: any) => {
											setFieldValue("customercontactId", input.id);
										}}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full  outline-primary-600'
									/>
									{/* <option defaultValue='' selected>
											Choose Contact Person
										</option>
										{listContact.length === 0 ? (
											<option value=''>No Data Contact Person</option>
										) : (
											listContact.map((res: any, i: number) => {
												return (
													<option value={res.id} key={i}>
														{res.contact_person} - +62{res.phone}
													</option>
												);
											})
										)}
									</InputSelect> */}
									{errors.customercontactId && touched.customercontactId ? (
										<span className='text-red-500 text-xs'>
											{errors.customercontactId}
										</span>
									) : null}
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
										onChange={handleChange}
										row={2}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
									{errors.subject && touched.subject ? (
										<span className='text-red-500 text-xs'>
											{errors.subject}
										</span>
									) : null}
								</div>
								<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<Input
											id='waranti'
											name='waranti'
											placeholder='Waranti'
											label='Waranti'
											type='text'
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<Input
											id='quo_img'
											name='quo_img'
											placeholder='Quotation File'
											label='Quotation File'
											type='file'
											accept='image/*, .pdf'
											onChange={handleChange}
											required={false}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
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
										onChange={handleChange}
										row={4}
										withLabel={false}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600 resize-y'
									/>
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
															onChange={handleChange}
															row={1}
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
																qty = parseInt(
																	e.target.value.replace(/\./g, "")
																);
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
																placeholder='Unit'
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
							<Section className='grid lg:grid-cols-2 sm:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<InputArea
										id='note_payment'
										name='note_payment'
										placeholder='Note Payment'
										label='Note Payment'
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
										required={true}
										onChange={handleChange}
										row={2}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
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
											"Edit"
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
