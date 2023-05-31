import { useState, useEffect } from "react";
import { Section, Input, InputSelect, InputArea, MultipleSelect } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { quotationSchema } from "../../../schema/marketing/quotation/quotationSchema";
import { AddQuotation, GetAllEquipment } from "../../../services";
import { toast } from "react-toastify";

interface props {
	content: string;
	dataCustomer: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	quo_num: string;
	quo_auto: string;
	customerId: string;
	customercontactId: string;
	deskription: string;
	quo_img: string;
	date: Date;
	Quotations_Detail: [
		{
			item_of_work: string;
			volume: string;
			unit: string;
		}
	];
	parts: [
		{
			id: string;
			qty: string;
			keterangan: string;
		}
	];
}

export const FormCreateQuotation = ({
	content,
	dataCustomer,
	showModal,
}: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listContact, setListContact] = useState<any>([]);
	const [cityCustomer, setCityCustomer] = useState<string>("");
	const [AddressCustomer, setCustomerAddress] = useState<string>("");
	const [equipment, setEquipment] = useState<any>([]);
	const [listParts, setListParts] = useState<any>([]);
	const [parts, setParts] = useState<any>([]);
	const [equipmentSelected, setEquipmentSelected] = useState<string>("");
	const [imgQuotation, setImgQuotation] = useState<any>(null);
	const [idAutoNum, setIdAutoNum] = useState<string>("");
	const [data, setData] = useState<data>({
		quo_num: "",
		quo_auto: "",
		customerId: "",
		customercontactId: "",
		deskription: "",
		quo_img: "",
		date: new Date(),
		Quotations_Detail: [
			{
				item_of_work: "",
				volume: "",
				unit: "",
			},
		],
		parts: [
			{
				id: "",
				qty: "",
				keterangan: "",
			},
		],
	});

	useEffect(() => {
		getEquipment();
		generateIdNum();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = dateObj.getUTCMonth() + 1;
		var year = dateObj.getUTCFullYear();
		const id =
			year.toString() + month.toString() + Math.floor(Math.random() * 100) + 1;
		setIdAutoNum(`QU${id}`);
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
		let list: any = []
		data.map( (res:any) => {
			res.eq_part.map( (dataPart: any) => {
				list.push(dataPart)
			})
		})
		setListParts(list)
	}

	const addQuotation = async (payload: any) => {
		setIsLoading(true);
		const form = new FormData();
		const dataCustomer = JSON.parse(payload.customerId);
		const eqandpart: any = [];
		payload.parts.map((res: any) => {
			listParts.map( (eq: any) => {
				if(eq.id === res.id){
					const dataPart = {
						id_equipment: eq.id_equipment,
						id_part: res.id,
						qty: res.qty,
						keterangan: res.keterangan
					};
					eqandpart.push(dataPart);
				}
			})
		});
		form.append("quo_num", payload.quo_num);
		form.append("quo_auto", idAutoNum);
		form.append("customerId", dataCustomer.id);
		form.append("customercontactId", payload.customercontactId);
		form.append("deskription", payload.deskription);
		form.append("quo_img", imgQuotation);
		form.append("date", new Date().toUTCString());
		form.append("Quotations_Detail", JSON.stringify(payload.Quotations_Detail));
		form.append("eqandpart", JSON.stringify(eqandpart));

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
				setIsLoading(false);
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
			setIsLoading(false);
		}
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

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<Formik
				initialValues={{ ...data }}
				validationSchema={quotationSchema}
				onSubmit={(values) => {
					addQuotation(values);
				}}
				enableReinitialize
			>
				{({ handleChange, handleSubmit, errors, touched, values }) => (
					<Form onChange={handleOnChanges}>
						<h1 className='text-xl font-bold mt-3'>Quotation</h1>
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
												value={idAutoNum}
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
												<option value={JSON.stringify(res)} key={i}>
													{res.name}
												</option>
											);
										})
									)}
								</InputSelect>
								{errors.customerId && touched.customerId ? (
									<span className='text-red-500 text-xs'>{errors.customerId}</span>
								) : null}
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
												<option value={res.id} key={i}>
													{res.contact_person} - +62{res.phone}
												</option>
											);
										})
									)}
								</InputSelect>
								{errors.customercontactId && touched.customercontactId ? (
									<span className='text-red-500 text-xs'>{errors.customercontactId}</span>
								) : null}
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
									onChange={handleChange}
									row={2}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{errors.deskription && touched.deskription ? (
									<span className='text-red-500 text-xs'>{errors.deskription}</span>
								) : null}
							</div>
							<div className='w-full'>
								<Input
									id='quo_img'
									name='quo_img'
									placeholder='Quotation File'
									label='Quotation File'
									type='file'
									onChange={handleChange}
									required={false}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<h1 className='text-xl font-bold mt-3'>Scope Of work</h1>
						<FieldArray
							name='Quotations_Detail'
							render={(arrayDetails) => (
								<>
									{values.Quotations_Detail.map((res, i) => (
										<Section
											className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'
											key={i}
										>
											<div className='w-full'>
												<Input
													id={`Quotations_Detail.${i}.item_of_work`}
													name={`Quotations_Detail.${i}.item_of_work`}
													placeholder='Detail Quotation'
													label='Quotation Detail'
													onChange={handleChange}
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
													required={true}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												/>
											</div>
											<div className='flex w-full'>
												{i === values.Quotations_Detail.length - 1 ? (
													<div className='h-[80%] mt-7'>
														<button
															type='button'
															className='inline-flex justify-center rounded-lg border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mr-2'
															onClick={() => {
																arrayDetails.push({
																	item_of_work: "",
																	volume: "",
																	unit: "",
																});
															}}
														>
															{" "}
															Add
														</button>
													</div>
												) : null}
												{values.Quotations_Detail.length !== 1 ? (
													<div className='h-[80%] mt-7'>
														<button
															type='button'
															className='inline-flex justify-center rounded-lg border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
															onClick={() => {
																arrayDetails.remove(i);
															}}
														>
															Remove
														</button>
													</div>
												) : null}
											</div>
										</Section>
									))}
								</>
							)}
						/>
						<h1 className='text-xl font-bold mt-3'>Items Of Part</h1>
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
												<option value={JSON.stringify(res)} key={i}>
													{res.nama}
												</option>
											);
										})
									)}
								</InputSelect> */}
								<MultipleSelect 
									className="bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600"
									listdata={equipment}
									placeholder="Select Equipment"
									displayValue="nama"
									onSelect={selectEquipment}
									onRemove={selectEquipment}
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-1 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<FieldArray
									name='parts'
									render={(arrayParts) => (
										<>
											{values.parts.map((res, i) => (
												<Section
													className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'
													key={i}
												>
													<div>
														<InputSelect
															id={`parts.${i}.id`}
															name={`parts.${i}.id`}
															placeholder='Equipment'
															label='Equipment'
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
																listParts.map((res: any, i: number) => {
																	return (
																		<option value={res.id} key={i}>
																			{res.nama_part} ({res.equipment.nama})
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
															onChange={handleChange}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='flex w-full'>
														{i === values.parts.length - 1 ? (
															<div className='h-[80%] mt-7'>
																<button
																	type='button'
																	className='inline-flex justify-center rounded-lg border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mr-2'
																	onClick={() => {
																		arrayParts.push({
																			id: "",
																			qty: "",
																			keterangan: "",
																		});
																	}}
																>
																	Add
																</button>
															</div>
														) : null}
														{values.parts.length !== 1 ? (
															<div className='h-[80%] mt-7'>
																<button
																	type='button'
																	className='inline-flex justify-center rounded-lg border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
																	onClick={() => {
																		arrayParts.remove(i);
																	}}
																>
																	Remove
																</button>
															</div>
														) : null}
													</div>
												</Section>
											))}
										</>
									)}
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
		</div>
	);
};
