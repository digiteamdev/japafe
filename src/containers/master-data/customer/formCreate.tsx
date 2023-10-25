import { useEffect, useState } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputSelectSearch,
	InputWithIcon,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { customerSchema } from "../../../schema/master-data/customer/customerSchema";
import { Disclosure } from "@headlessui/react";
import { Plus, Trash2 } from "react-feather";
import provinceJson from "../../../assets/data/kodepos.json";
import { AddCustomer } from "../../../services";
import { toast } from "react-toastify";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	id_custom: string;
	// customerType: string;
	name: string;
	email: string;
	ppn: string;
	pph: string;
	contact: [
		{
			contact_person: string;
			email_person: string;
			phone: string;
		}
	];
	address: [
		{
			address_person: string;
			address_workshop: string;
			recipient_address: string;
			provinces: string;
			cities: string;
			districts: string;
			sub_districts: string;
			ec_postalcode: number | null;
		}
	];
}

export const FormCreateCustomer = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listProvince, setListProvince] = useState<any>([]);
	const [listCity, setListCity] = useState<any>([]);
	const [listDistrict, setListDistrict] = useState<any>([]);
	const [listSubDistrict, setListSubDistrict] = useState<any>([]);
	const [data, setData] = useState<data>({
		id_custom: "",
		name: "",
		// customerType: "PT.",
		email: "",
		ppn: "",
		pph: "",
		contact: [
			{
				contact_person: "",
				email_person: "",
				phone: "",
			},
		],
		address: [
			{
				address_person: "",
				address_workshop: "",
				recipient_address: "",
				provinces: "",
				cities: "",
				districts: "",
				sub_districts: "",
				ec_postalcode: null,
			},
		],
	});

	useEffect(() => {
		getProvince();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const json: any = provinceJson;

	const getProvince = () => {
		const keys = ["province"];
		const dataProvince: any = []
		const filtered = json.filter(
			(
				(s) => (o: any) =>
					((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join("|"))
			)(new Set())
		);
		filtered.filter((res: any) => {
			return res.province !== "province";
		}).map( (prov: any) => {
			dataProvince.push({
				type: 'province',
				value: prov.province,
				label: prov.province
			})
		});

		setListProvince(dataProvince);
		setListCity([]);
		setListDistrict([]);
		setListSubDistrict([]);
	};

	const getCity = (province: string) => {
		let dataCity: any = []
		const filtered = json.filter((res: any) => {
			return res.province === province;
		});
		const keys = ["city"];
		filtered.filter(
			(
				(s) => (o: any) =>
					((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join("|"))
			)(new Set())
		).map(( res: any ) => {
			dataCity.push({
				value: res.city,
				label: res.city
			})
		});

		setListCity(dataCity);
		setListDistrict([]);
		setListSubDistrict([]);
	};

	const getDistrict = (city: string) => {
		let dataDistrict: any = []
		const filtered = json.filter((res: any) => {
			return res.city === city;
		});
		const keys = ["district"];
		filtered.filter(
			(
				(s) => (o: any) =>
					((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join("|"))
			)(new Set())
		).map( (res: any) => {
			dataDistrict.push({
				value: res.district,
				label: res.district
			})
		});
		setListDistrict(dataDistrict);
		setListSubDistrict([]);
	};

	const getSubDistrict = (district: string) => {
		let dataSubDistrict: any = []
		const filtered = json.filter((res: any) => {
			return res.district === district;
		});
		const keys = ["subdistrict"];
		filtered.filter(
			(
				(s) => (o: any) =>
					((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join("|"))
			)(new Set())
		).map( (res: any) => {
			dataSubDistrict.push({
				value: res.subdistrict,
				label: res.subdistrict,
				postal_code: res.postal_code
			})
		});
		setListSubDistrict(dataSubDistrict);
	};

	const handleOnChanges = (event: any) => {
		if (event.type === "province") {
			getCity(event.value);
		} else if (event.target.name === "address.0.cities") {
			getDistrict(event.target.value);
		} else if (event.target.name === "address.0.districts") {
			getSubDistrict(event.target.value);
		}
	};

	const addCustomer = async (payload: any) => {
		setIsLoading(true);
		let dataEmpty: boolean = false;
		payload.contact.map((res: any) => {
			if (res.contact_person === "") {
				dataEmpty = true;
				toast.warning("Contact Person Not Empty", {
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
		});
		payload.address.map((res: any) => {
			if (res.address_workshop === "") {
				dataEmpty = true;
				toast.warning("Workshop Address Not Empty", {
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
		});
		
		if (!dataEmpty) {
			try {
				const response = await AddCustomer(payload);
				if (response) {
					toast.success("Add Customer Success", {
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
				toast.error("Add Customer Failed", {
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
		}
		setIsLoading(false);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<Formik
				initialValues={{ ...data }}
				validationSchema={customerSchema}
				onSubmit={(values) => {
					addCustomer(values);
				}}
				enableReinitialize
			>
				{({ handleChange, handleSubmit, setFieldValue, errors, touched, values }) => (
					<Form onChange={handleOnChanges}>
						<h1 className='text-xl font-bold mt-3'>Customer</h1>
						<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<div className='flex w-full'>
									{/* <div className='w-[30%]'>
										<InputSelect
											id='customerType'
											name='customerType'
											placeholder='Customer type'
											label='Customer type'
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										>
											<option defaultValue='PT.' selected>
												PT
											</option>
											<option value='CV.'>
												CV
											</option>
											<option value='Persero'>
												Persero
											</option>
											<option value='Koperasi'>
												Koperasi
											</option>
											<option value=''>
												Other
											</option>
										</InputSelect>
									</div> */}
									<div className='w-full'>
										<Input
											id='name'
											name='name'
											placeholder='Name'
											label='Customer Name'
											type='text'
											value={values.name}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
								</div>
								{errors.name && touched.name ? (
									<span className='text-red-500 text-xs'>{errors.name}</span>
								) : null}
							</div>
							<div className='w-full'>
								<Input
									id='email'
									name='email'
									type='email'
									placeholder='Office Email'
									label='Office Email'
									value={values.email}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{errors.email && touched.email ? (
									<span className='text-red-500 text-xs'>{errors.email}</span>
								) : null}
							</div>
						</Section>
						<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='ppn'
									name='ppn'
									placeholder='PPN'
									label='PPN'
									type='number'
									value={values.ppn}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{errors.ppn && touched.ppn ? (
									<span className='text-red-500 text-xs'>{errors.ppn}</span>
								) : null}
							</div>
							<div className='w-full'>
								<Input
									id='pph'
									name='pph'
									type='number'
									placeholder='PPH'
									label='PPH'
									value={values.pph}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{errors.pph && touched.pph ? (
									<span className='text-red-500 text-xs'>{errors.pph}</span>
								) : null}
							</div>
						</Section>
						<FieldArray
							name='address'
							render={(arrayAddress) => (
								<div>
									{values.address.map((res: any, i: number) => (
										<div key={i}>
											<Disclosure defaultOpen>
												<h1 className='text-xl font-bold mt-3'>
													Workshop Address
												</h1>
												<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
													<div className='w-full'>
														<InputSelectSearch
															datas={listProvince}
															id={`address.${i}.provinces`}
															name={`address.${i}.provinces`}
															placeholder='Province'
															label='Province'
															onChange={ (e: any) => {
																getCity(e.value)
																setFieldValue(`address.${i}.provinces`, e.value)
															}}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<InputSelectSearch
															datas={listCity}
															id={`address.${i}.cities`}
															name={`address.${i}.cities`}
															placeholder='City'
															label='City'
															onChange={ (e: any) => {
																getDistrict(e.value)
																setFieldValue(`address.${i}.cities`, e.value)
															}}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
														/>
													</div>
												</Section>
												<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
													<div className='w-full'>
														<InputSelectSearch
															datas={listDistrict}
															id={`address.${i}.districts`}
															name={`address.${i}.districts`}
															placeholder='District'
															label='District'
															onChange={ (e: any) => {
																getSubDistrict(e.value)
																setFieldValue(`address.${i}.districts`, e.value)
															}}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<InputSelectSearch
														datas={listSubDistrict}
															id={`address.${i}.sub_districts`}
															name={`address.${i}.sub_districts`}
															placeholder='Sub District'
															label='Sub District'
															onChange={ (e: any) => {
																setFieldValue(`address.${i}.sub_districts`, e.value)
																setFieldValue(`address.${i}.ec_postalcode`, e.postal_code)
															}}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
														/>
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
														onChange={handleChange}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</Section>
											</Disclosure>
											{i === values.address.length - 1 ? (
												<a
													className='inline-flex text-green-500 mr-6 cursor-pointer'
													onClick={() => {
														arrayAddress.push({
															address_person: "",
															address_workshop: "",
															recipient_address: "",
															provinces: "",
															cities: "",
															districts: "",
															sub_districts: "",
															ec_postalcode: null,
														});
													}}
												>
													<Plus size={18} className='mr-1 mt-1' /> Add Address
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
						<FieldArray
							name='contact'
							render={(arrayContact) => (
								<div>
									{values.contact.map((res, i) => (
										<div key={i}>
											<Disclosure defaultOpen>
												{({ open }) => (
													<>
														<Disclosure.Button className='flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 mt-2'>
															<h1 className='text-xl font-bold'>
																Contact Person #{i + 1}
															</h1>
														</Disclosure.Button>
														<Disclosure.Panel>
															<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
																<div className='w-full'>
																	<Input
																		id={`contact.${i}.contact_person`}
																		name={`contact.${i}.contact_person`}
																		placeholder='Name'
																		label='Name'
																		type='text'
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
																		onChange={handleChange}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
															</Section>
														</Disclosure.Panel>
													</>
												)}
											</Disclosure>
											{i === values.contact.length - 1 ? (
												<a
													className='inline-flex text-green-500 mr-6 cursor-pointer'
													onClick={() => {
														arrayContact.push({
															contact_person: "",
															email_person: "",
															phone: "",
														});
													}}
												>
													<Plus size={18} className='mr-1 mt-1' /> Add Contact
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
