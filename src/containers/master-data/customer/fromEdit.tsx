import { useEffect, useState } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputWithIcon,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import provinceJson from "../../../assets/data/kodepos.json";
import { customerSchema } from "../../../schema/master-data/customer/customerSchema";
import { Disclosure } from "@headlessui/react";
import { Plus, Trash2 } from "react-feather";
import {
	EditCustomer,
	EditCustomerContact,
	EditCustomerAddress,
} from "../../../services";
import { toast } from "react-toastify";

interface props {
	content: string;
	dataCustomer: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface dataCustomer {
	id_custom: string;
	name: string;
	email: string;
	ppn: string;
	pph: string;
	phone: string;
	fax: string;
}

interface dataContact {
	contact: [
		{
			id: string;
			customerId: string;
			contact_person: string;
			email_person: string;
			phone: string;
		}
	];
}

interface dataAddress {
	address: [
		{
			id: string;
			customerID: string;
			address_person: string;
			address_workshop: string;
			recipient_address: string;
			provinces: string;
			cities: string;
			districts: string;
			sub_districts: string;
			ec_postalcode: string;
		}
	];
}

export const FormEditCustomer = ({
	content,
	dataCustomer,
	showModal,
}: props) => {
	const dataTabs = ["Customer", "Address", "Contact"];

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listProvince, setListProvince] = useState<any>([]);
	const [listCity, setListCity] = useState<any>([]);
	const [listDistrict, setListDistrict] = useState<any>([]);
	const [listSubDistrict, setListSubDistrict] = useState<any>([]);
	const [activeTabs, setActiveTabs] = useState<any>(dataTabs[0]);
	const [data, setData] = useState<dataCustomer>({
		id_custom: "",
		name: "",
		email: "",
		ppn: "0",
		pph: "0",
		phone: "",
		fax: "",
	});
	const [dataContact, setDataContact] = useState<dataContact>({
		contact: [
			{
				id: "",
				customerId: "",
				contact_person: "",
				email_person: "",
				phone: "",
			},
		],
	});
	const [dataAddress, setDataAddress] = useState<dataAddress>({
		address: [
			{
				id: "",
				customerID: "",
				address_person: "",
				address_workshop: "",
				recipient_address: "",
				provinces: "",
				cities: "",
				districts: "",
				sub_districts: "",
				ec_postalcode: "",
			},
		],
	});

	useEffect(() => {
		getProvince();
		settingData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const json: any = provinceJson;

	const settingData = () => {
		let listContact: any = [];
		let listAddress: any = [];
		setData({
			id_custom: dataCustomer.id_custom,
			name: dataCustomer.name,
			email: dataCustomer.email,
			phone: dataCustomer.phone,
			fax: dataCustomer.fax,
			ppn: dataCustomer.ppn,
			pph: dataCustomer.pph,
		});

		if (dataCustomer.contact.length > 0) {
			dataCustomer.contact.map((res: any) => {
				listContact.push({
					id: res.id,
					customerID: dataCustomer.id,
					contact_person: res.contact_person,
					email_person: res.email_person,
					phone: res.phone,
				});
			});
		} else {
			listContact.push({
				id: "",
				customerID: dataCustomer.id,
				contact_person: "",
				email_person: "",
				phone: "",
			});
		}

		if (dataCustomer.address.length > 0) {
			dataCustomer.address.map((res: any) => {
				listAddress.push({
					id: res.id,
					customerID: dataCustomer.id,
					address_person: res.address_person,
					address_workshop: res.address_workshop,
					recipient_address: res.recipient_address,
					provinces: res.provinces,
					cities: res.cities,
					districts: res.districts,
					sub_districts: res.sub_districts,
					ec_postalcode: res.ec_postalcode,
				});
			});
		} else {
			listAddress.push({
				id: "",
				customerID: dataCustomer.id,
				address_person: "",
				address_workshop: "",
				recipient_address: "",
				provinces: "",
				cities: "",
				districts: "",
				sub_districts: "",
				ec_postalcode: "",
			});
		}

		setDataAddress({
			address: listAddress,
		});
		setDataContact({
			contact: listContact,
		});
	};

	const getProvince = () => {
		const keys = ["province"];
		const filtered = json.filter(
			(
				(s) => (o: any) =>
					((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join("|"))
			)(new Set())
		);
		const provinces = filtered.filter((res: any) => {
			return res.province !== "province";
		});
		setListProvince(provinces);
		setListCity([]);
		setListDistrict([]);
		setListSubDistrict([]);
	};

	const getCity = (province: string) => {
		const filtered = json.filter((res: any) => {
			return res.province === province;
		});
		const keys = ["city"];
		const city = filtered.filter(
			(
				(s) => (o: any) =>
					((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join("|"))
			)(new Set())
		);
		setListCity(city);
		setListDistrict([]);
		setListSubDistrict([]);
	};

	const getDistrict = (city: string) => {
		const filtered = json.filter((res: any) => {
			return res.city === city;
		});
		const keys = ["district"];
		const district = filtered.filter(
			(
				(s) => (o: any) =>
					((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join("|"))
			)(new Set())
		);
		setListDistrict(district);
		setListSubDistrict([]);
	};

	const getSubDistrict = (district: string) => {
		const filtered = json.filter((res: any) => {
			return res.district === district;
		});
		const keys = ["subdistrict"];
		const subdistrict = filtered.filter(
			(
				(s) => (o: any) =>
					((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join("|"))
			)(new Set())
		);
		setListSubDistrict(subdistrict);
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name.includes("provinces")) {
			getCity(event.target.value);
		} else if (event.target.name.includes("cities")) {
			getDistrict(event.target.value);
		} else if (event.target.name.includes("districts")) {
			getSubDistrict(event.target.value);
		}
	};

	const editCustomer = async (data: any) => {
		setIsLoading(true);
		try {
			const response = await EditCustomer(data, dataCustomer.id);
			if (response) {
				toast.success("Edit Customer Success", {
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
			toast.error("Edit Customer Failed", {
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

	const editCustomerContact = async (data: any) => {
		setIsLoading(true);
		try {
			const response = await EditCustomerContact(data.contact);
			if (response) {
				toast.success("Edit Customer Contact Success", {
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
			toast.error("Edit Customer Contact Failed", {
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

	const editCustomerAddress = async (data: any) => {
		setIsLoading(true);
		try {
			const response = await EditCustomerAddress(data.address);
			if (response) {
				toast.success("Edit Customer Address Success", {
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
			toast.error("Edit Customer Address Failed", {
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
			{activeTabs === "Customer" ? (
				<Formik
					initialValues={{ ...data }}
					// validationSchema={customerSchema}
					onSubmit={(values) => {
						editCustomer(values);
					}}
					enableReinitialize
					key={0}
				>
					{({ handleChange, handleSubmit, errors, touched, values }) => (
						<Form>
							<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<Input
										id='name'
										name='name'
										placeholder='Customer Name'
										label='Customer Name'
										type='text'
										required={true}
										disabled={isLoading}
										withLabel={true}
										value={values.name}
										onChange={handleChange}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
									{errors.name && touched.name ? (
										<span className='text-red-500 text-xs'>{errors.name}</span>
									) : null}
								</div>
								<div className='w-full'>
									<Input
										id='email'
										name='email'
										placeholder='Email'
										label='Email'
										type='text'
										required={true}
										disabled={isLoading}
										withLabel={true}
										value={values.email}
										onChange={handleChange}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
									{errors.email && touched.email ? (
										<span className='text-red-500 text-xs'>{errors.email}</span>
									) : null}
								</div>
							</Section>
							<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<InputWithIcon
										id='phone'
										name='phone'
										placeholder='Phone'
										type='text'
										label='Phone'
										onChange={handleChange}
										value={values.phone}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
										icon='+62'
										classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3'
									/>
								</div>
								<div className='w-full'>
									<Input
										id='fax'
										name='fax'
										placeholder='Fax'
										label='Fax'
										type='text'
										required={true}
										disabled={isLoading}
										withLabel={true}
										value={values.fax}
										onChange={handleChange}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
							</Section>
							<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<Input
										id='ppn'
										name='ppn'
										placeholder='PPN'
										label='PPN'
										type='number'
										required={true}
										disabled={isLoading}
										withLabel={true}
										value={values.ppn}
										onChange={handleChange}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
								<div className='w-full'>
									<Input
										id='pph'
										name='pph'
										placeholder='PPH'
										label='PPH'
										type='number'
										required={true}
										disabled={isLoading}
										withLabel={true}
										value={values.pph}
										onChange={handleChange}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
									{errors.email && touched.email ? (
										<span className='text-red-500 text-xs'>{errors.email}</span>
									) : null}
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
											"Edit Customer"
										)}
									</button>
								</div>
							</div>
						</Form>
					)}
				</Formik>
			) : activeTabs === "Contact" ? (
				<>
					<p className='hidden'>{JSON.stringify(dataContact)}</p>
					<Formik
						initialValues={{ ...dataContact }}
						// validationSchema={customerSchema}
						onSubmit={(values) => {
							editCustomerContact(values);
						}}
						enableReinitialize
						key={1}
					>
						{({ handleChange, handleSubmit, errors, touched, values }) => (
							<Form>
								<FieldArray
									name='contact'
									render={(arrayContact) => (
										<div>
											{values.contact.map((res, i) => (
												<div key={i}>
													<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
														<div className='w-full'>
															<Input
																id={`contact.${i}.contact_person`}
																name={`contact.${i}.contact_person`}
																placeholder='Name'
																label='Name'
																type='text'
																value={res.contact_person}
																onChange={handleChange}
																required={true}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
															/>
														</div>
														<div className='w-full'>
															<InputWithIcon
																id={`contact.${i}.phone`}
																name={`contact.${i}.phone`}
																placeholder='Phone'
																type='text'
																label='Phone'
																value={res.phone}
																onChange={handleChange}
																required={true}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
																icon='+62'
																classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3'
															/>
														</div>
														<div className='w-full'>
															<Input
																id={`contact.${i}.email_person`}
																name={`contact.${i}.email_person`}
																type='email'
																placeholder='Email'
																label='Email'
																value={res.email_person}
																onChange={handleChange}
																required={true}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
															/>
														</div>
													</Section>
													{i === values.contact.length - 1 ? (
														<a
															className='inline-flex text-green-500 mr-6 cursor-pointer'
															onClick={() => {
																arrayContact.push({
																	id: "",
																	customerID: dataCustomer.id,
																	contact_person: "",
																	email_person: "",
																	phone: "",
																});
															}}
														>
															<Plus size={18} className='mr-1 mt-1' /> Add
															Contact
														</a>
													) : null}
													{values.contact.length !== 1 ? (
														<a
															className='inline-flex text-red-500 cursor-pointer mt-1'
															onClick={() => {
																arrayContact.remove(i);
															}}
														>
															<Trash2 size={18} className='mr-1 mt-1' /> Remove
															Contact
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
												"Edit Customer"
											)}
										</button>
									</div>
								</div>
							</Form>
						)}
					</Formik>
				</>
			) : (
				<>
					<p className='hidden'>{JSON.stringify(dataAddress)}</p>
					<Formik
						initialValues={{ ...dataAddress }}
						// validationSchema={customerSchema}
						onSubmit={(values) => {
							editCustomerAddress(values);
						}}
						enableReinitialize
						key={2}
					>
						{({ handleChange, handleSubmit, errors, touched, values }) => (
							<Form onChange={handleOnChanges}>
								<FieldArray
									name='address'
									render={(arrayAddress) => (
										<div>
											{values.address.map((res, i) => (
												<div key={i}>
													<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
														<div className='w-full'>
															<InputSelect
																id={`address.${i}.provinces`}
																name={`address.${i}.provinces`}
																placeholder='Province'
																label='Province'
																onChange={handleChange}
																required={true}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
															>
																<option defaultValue='' selected>
																	{res.provinces !== ""
																		? res.provinces
																		: "Choose Province"}
																</option>
																{listProvince.length === 0 ? (
																	<option value=''>No Data Province</option>
																) : (
																	listProvince.map((res: any, i: number) => {
																		return (
																			<option value={res.province} key={i}>
																				{res.province}
																			</option>
																		);
																	})
																)}
															</InputSelect>
														</div>
														<div className='w-full'>
															<InputSelect
																id={`address.${i}.cities`}
																name={`address.${i}.cities`}
																placeholder='City'
																label='City'
																onChange={handleChange}
																required={true}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
															>
																<option defaultValue='' selected>
																	{res.cities !== ""
																		? res.cities
																		: "Choose City"}
																</option>
																{listCity.length === 0 ? (
																	<option>No Data City</option>
																) : (
																	listCity.map((res: any, i: number) => {
																		return (
																			<option value={res.city} key={i}>
																				{res.city}
																			</option>
																		);
																	})
																)}
															</InputSelect>
														</div>
													</Section>
													<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
														<div className='w-full'>
															<InputSelect
																id={`address.${i}.districts`}
																name={`address.${i}.districts`}
																placeholder='District'
																label='District'
																onChange={handleChange}
																required={true}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
															>
																<option defaultValue='' selected>
																	{res.districts !== ""
																		? res.districts
																		: "Choose District"}
																</option>
																{listDistrict.length === 0 ? (
																	<option>No Data District</option>
																) : (
																	listDistrict.map((res: any, i: number) => {
																		return (
																			<option value={res.district} key={i}>
																				{res.district}
																			</option>
																		);
																	})
																)}
															</InputSelect>
														</div>
														<div className='w-full'>
															<InputSelect
																id={`address.${i}.sub_districts`}
																name={`address.${i}.sub_districts`}
																placeholder='Sub District'
																label='Sub District'
																onChange={handleChange}
																required={true}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
															>
																<option defaultValue='' selected>
																	{res.sub_districts !== ""
																		? res.sub_districts
																		: "Choose Sub District"}
																</option>
																{listSubDistrict.length === 0 ? (
																	<option>No Data Sub District</option>
																) : (
																	listSubDistrict.map((res: any, i: number) => {
																		return (
																			<option value={res.subdistrict} key={i}>
																				{res.subdistrict}
																			</option>
																		);
																	})
																)}
															</InputSelect>
														</div>
														<div className='w-full'>
															<Input
																id={`address.${i}.ec_postalcode`}
																name={`address.${i}.ec_postalcode`}
																placeholder='Postal Code'
																label='Postal Code'
																type='number'
																value={res.ec_postalcode}
																onChange={handleChange}
																required={true}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
															/>
														</div>
													</Section>
													<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
														<Input
															id={`address.${i}.address_workshop`}
															name={`address.${i}.address_workshop`}
															placeholder='Address Workshop'
															label='Address Workshop'
															type='text'
															value={res.address_workshop}
															onChange={handleChange}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
														<Input
															id={`address.${i}.recipient_address`}
															name={`address.${i}.recipient_address`}
															placeholder='Recipient Address'
															label='Recipient Address'
															type='text'
															value={res.recipient_address}
															onChange={handleChange}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</Section>
													{i === values.address.length - 1 ? (
														<a
															className='inline-flex text-green-500 mr-6 cursor-pointer'
															onClick={() => {
																arrayAddress.push({
																	id: "",
																	customerID: dataCustomer.id,
																	address_person: "",
																	address_workshop: "",
																	recipient_address: "",
																	provinces: "",
																	cities: "",
																	districts: "",
																	sub_districts: "",
																	ec_postalcode: "",
																});
															}}
														>
															<Plus size={18} className='mr-1 mt-1' /> Add
															Address
														</a>
													) : null}
													{values.address.length !== 1 ? (
														<a
															className='inline-flex text-red-500 cursor-pointer mt-1'
															onClick={() => {
																arrayAddress.remove(i);
															}}
														>
															<Trash2 size={18} className='mr-1 mt-1' /> Remove
															Address
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
												"Edit Address"
											)}
										</button>
									</div>
								</div>
							</Form>
						)}
					</Formik>
				</>
			)}
		</div>
	);
};
