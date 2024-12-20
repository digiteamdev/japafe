import { useEffect, useState } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputSelectSearch,
	InputWithIcon,
	InputArea,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { supplierSchema } from "../../../schema/master-data/supplier/supplierSchema";
import { Disclosure } from "@headlessui/react";
import { Plus, Trash2 } from "react-feather";
import provinceJson from "../../../assets/data/kodepos.json";
import { AddSupplier } from "../../../services";
import { toast } from "react-toastify";

interface data {
	type_supplier: string;
	customerType: string;
	id_sup: string;
	supplier_name: string;
	addresses_sup: string;
	provinces: string;
	cities: string;
	districts: string;
	sub_districts: string;
	ec_postalcode: any;
	office_email: string;
	NPWP: string;
	ppn: string;
	pph: string;
	SupplierContact: [
		{
			contact_person: string;
			email_person: string;
			phone: string;
		}
	];
	SupplierBank: [
		{
			account_name: string;
			bank_name: string;
			rekening: string;
		}
	];
}

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const FormCreateSupplier = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listProvince, setListProvince] = useState<any>([]);
	const [listCity, setListCity] = useState<any>([]);
	const [listDistrict, setListDistrict] = useState<any>([]);
	const [listSubDistrict, setListSubDistrict] = useState<any>([]);
	const [data, setData] = useState<data>({
		type_supplier: "",
		id_sup: "",
		customerType: "PT.",
		supplier_name: "",
		addresses_sup: "",
		provinces: "",
		cities: "",
		districts: "",
		sub_districts: "",
		ec_postalcode: "",
		office_email: "",
		NPWP: "",
		ppn: "",
		pph: "",
		SupplierContact: [
			{
				contact_person: "",
				email_person: "",
				phone: "",
			},
		],
		SupplierBank: [
			{
				account_name: "",
				bank_name: "",
				rekening: "",
			},
		],
	});

	useEffect(() => {
		// getProvince();
		getCity();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const json: any = provinceJson;

	const getProvince = () => {
		const keys = ["province"];
		const dataProvince: any = [];
		const filtered = json.filter(
			(
				(s) => (o: any) =>
					((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join("|"))
			)(new Set())
		);
		filtered
			.filter((res: any) => {
				return res.province !== "province";
			})
			.map((prov: any) => {
				dataProvince.push({
					type: "province",
					value: prov.province,
					label: prov.province,
				});
			});

		setListProvince(dataProvince);
		setListCity([]);
		setListDistrict([]);
		setListSubDistrict([]);
	};

	const getCity = () => {
		let dataCity: any = [];
		// const filtered = json.filter((res: any) => {
		// 	return res.province === province;
		// });
		// const keys = ["city"];
		// filtered
		// 	.filter(
		// 		(
		// 			(s) => (o: any) =>
		// 				((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join("|"))
		// 		)(new Set())
		// 	)
		// 	.map((res: any) => {
		// 		dataCity.push({
		// 			value: res.city,
		// 			label: res.city,
		// 		});
		// 	});
		json.map((res: any) => {
			dataCity.push({
				value: res.city,
				label: res.city,
			});
		});
		setListCity(dataCity);
		setListDistrict([]);
		setListSubDistrict([]);
	};

	const getDistrict = (city: string) => {
		let dataDistrict: any = [];
		const filtered = json.filter((res: any) => {
			return res.city === city;
		});
		const keys = ["district"];
		filtered
			.filter(
				(
					(s) => (o: any) =>
						((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join("|"))
				)(new Set())
			)
			.map((res: any) => {
				dataDistrict.push({
					value: res.district,
					label: res.district,
				});
			});
		setListDistrict(dataDistrict);
		setListSubDistrict([]);
	};

	const getSubDistrict = (district: string) => {
		let dataSubDistrict: any = [];
		const filtered = json.filter((res: any) => {
			return res.district === district;
		});
		const keys = ["subdistrict"];
		filtered
			.filter(
				(
					(s) => (o: any) =>
						((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join("|"))
				)(new Set())
			)
			.map((res: any) => {
				dataSubDistrict.push({
					value: res.subdistrict,
					label: res.subdistrict,
					postal_code: res.postal_code,
				});
			});
		setListSubDistrict(dataSubDistrict);
	};

	const handleOnChanges = (event: any) => {
		// if (event.target.name === "provinces") {
		// 	getCity(event.target.value);
		// } else if (event.target.name === "cities") {
		// 	getDistrict(event.target.value);
		// } else if (event.target.name === "districts") {
		// 	getSubDistrict(event.target.value);
		// }
	};

	const addSupplier = async (payload: any) => {
		setIsLoading(true);
		let bankEmpty: boolean = false;
		// payload.SupplierBank.map((res: any) => {
		// 	if (res.account_name === "") {
		// 		bankEmpty = true;
		// 		toast.warning("Bank Account Not Empty", {
		// 			position: "top-center",
		// 			autoClose: 5000,
		// 			hideProgressBar: true,
		// 			closeOnClick: true,
		// 			pauseOnHover: true,
		// 			draggable: true,
		// 			progress: undefined,
		// 			theme: "colored",
		// 		});
		// 	}
		// });
		// payload.SupplierContact.map((res: any) => {
		// 	if (res.contact_person === "") {
		// 		bankEmpty = true;
		// 		toast.warning("Contact Person Not Empty", {
		// 			position: "top-center",
		// 			autoClose: 5000,
		// 			hideProgressBar: true,
		// 			closeOnClick: true,
		// 			pauseOnHover: true,
		// 			draggable: true,
		// 			progress: undefined,
		// 			theme: "colored",
		// 		});
		// 	}
		// });
		if (!bankEmpty) {
			let dataBody: any = {
				type_supplier: payload.type_supplier,
				id_sup: payload.id_sup,
				supplier_name:
					payload.customerType !== ""
						? `${payload.customerType} ${payload.supplier_name}`
						: payload.supplier_name,
				addresses_sup: payload.addresses_sup,
				provinces: payload.provinces,
				cities: payload.cities,
				districts: payload.districts,
				sub_districts: payload.sub_districts,
				ec_postalcode: payload.ec_postalcode,
				office_email: payload.office_email,
				NPWP: payload.NPWP,
				ppn: payload.ppn,
				pph: payload.pph,
				SupplierContact: payload.SupplierContact,
				SupplierBank: payload.SupplierBank,
			};
			try {
				const response = await AddSupplier(dataBody);
				if (response) {
					toast.success("Add Supplier Success", {
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
				toast.error("Add Supplier Failed", {
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
				validationSchema={supplierSchema}
				onSubmit={(values) => {
					addSupplier(values);
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
						<h1 className='text-xl font-bold'>Supplier</h1>
						<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<div className='flex w-full'>
									<div className='w-[20%]'>
										<InputSelect
											id='customerType'
											name='customerType'
											placeholder='Customer type'
											label='type'
											onChange={handleChange}
											required={true}
											withLabel={false}
											className='bg-white mt-7 border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										>
											<option defaultValue='PT' selected>
												PT
											</option>
											<option value='CV'>CV</option>
											<option value='Koperasi'>Koperasi</option>
											<option value=''>Other</option>
										</InputSelect>
									</div>
									<div className='w-[80%] ml-2'>
										<Input
											id='supplier_name'
											name='supplier_name'
											placeholder='Name'
											label='Supplier Name'
											type='text'
											value={values.supplier_name}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
								</div>
								{errors.supplier_name && touched.supplier_name ? (
									<span className='text-red-500 text-xs'>
										{errors.supplier_name}
									</span>
								) : null}
							</div>
							<div className='w-full'>
								<InputSelect
									id='type_supplier'
									name='type_supplier'
									placeholder='Suplier Type'
									label='Supplier Type'
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option defaultValue='' selected>
										Choose a Supplier type
									</option>
									<option value='Material_Supplier'>Material Supplier</option>
									<option value='Service_Vendor'>Service Vendor</option>
									<option value='Toserba'>Toserba</option>
									<option value='Ecommerce'>E-Commerce</option>
								</InputSelect>
								{errors.type_supplier && touched.type_supplier ? (
									<span className='text-red-500 text-xs'>
										{errors.type_supplier}
									</span>
								) : null}
							</div>
							<div className='w-full'>
								<Input
									id='office_email'
									name='office_email'
									type='email'
									placeholder='Office Email'
									label='Office Email'
									value={values.office_email}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{errors.office_email && touched.office_email ? (
									<span className='text-red-500 text-xs'>
										{errors.office_email}
									</span>
								) : null}
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							{/* <div className='w-full'>
								<Input
									id='npwp'
									name='NPWP'
									placeholder='NPWP'
									label='NPWP'
									type='text'
									value={values.NPWP}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{errors.NPWP && touched.NPWP ? (
									<span className='text-red-500 text-xs'>{errors.NPWP}</span>
								) : null}
							</div> */}
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
									<span className='text-red-500 text-xs'>{errors.NPWP}</span>
								) : null}
							</div>
							<div className='w-full'>
								<Input
									id='PPH'
									name='pph'
									placeholder='PPH'
									label='PPH'
									type='number'
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
						<h1 className='text-xl font-bold mt-3'>Address</h1>
						<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							{/* <div className='w-full'>
								<InputSelectSearch
									datas={listProvince}
									id='provinces'
									name='provinces'
									placeholder='Province'
									label='Province'
									onChange={(e: any) => {
										getCity(e.value);
										setFieldValue("provinces", e.value);
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
								{errors.provinces && touched.provinces ? (
									<span className='text-red-500 text-xs'>
										{errors.provinces}
									</span>
								) : null}
							</div> */}
							{/* <div className='w-full'>
								<InputSelectSearch
									datas={listCity}
									id='cities'
									name='cities'
									placeholder='City'
									label='City'
									onChange={(e: any) => {
										getDistrict(e.value);
										setFieldValue("cities", e.value);
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
								{errors.cities && touched.cities ? (
									<span className='text-red-500 text-xs'>{errors.cities}</span>
								) : null}
							</div> */}
							<Input
								id='cities'
								name='cities'
								placeholder='City'
								label='City'
								type='text'
								value={values.cities}
								onChange={handleChange}
								required={true}
								withLabel={true}
								className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
							/>
							<div className='w-full'>
								<Input
									id='ec_postalcode'
									name='ec_postalcode'
									placeholder='Postal Code'
									label='Postal Code'
									type='number'
									value={values.ec_postalcode}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputArea
									id='addresses_sup'
									name='addresses_sup'
									placeholder='Address'
									label='Address'
									type='text'
									value={values.addresses_sup}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{errors.addresses_sup && touched.addresses_sup ? (
									<span className='text-red-500 text-xs'>
										{errors.addresses_sup}
									</span>
								) : null}
							</div>
							{/* <div className='w-full'>
								<InputSelectSearch
									datas={listDistrict}
									id='districts'
									name='districts'
									placeholder='District'
									label='District'
									onChange={(e: any) => {
										getSubDistrict(e.value);
										setFieldValue("districts", e.value);
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
								{errors.districts && touched.districts ? (
									<span className='text-red-500 text-xs'>
										{errors.districts}
									</span>
								) : null}
							</div> */}
						</Section>
						{/* <Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'> */}
						{/* <div className='w-full'>
								<InputSelectSearch
									datas={listSubDistrict}
									id='sub_districts'
									name='sub_districts'
									placeholder='Sub District'
									label='Sub District'
									onChange={(e: any) => {
										setFieldValue("sub_districts", e.value);
										setFieldValue("ec_postalcode", parseInt(e.postal_code));
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
								{errors.sub_districts && touched.sub_districts ? (
									<span className='text-red-500 text-xs'>
										{errors.sub_districts}
									</span>
								) : null}
							</div> */}
						{/* <div className='w-full'>
								<Input
									id='ec_postalcode'
									name='ec_postalcode'
									placeholder='Postal Code'
									label='Postal Code'
									type='number'
									value={values.ec_postalcode}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div> */}
						{/* <div className='w-full'>
								<Input
									id='addresses_sup'
									name='addresses_sup'
									placeholder='Address'
									label='Address'
									type='text'
									value={values.addresses_sup}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{errors.addresses_sup && touched.addresses_sup ? (
									<span className='text-red-500 text-xs'>
										{errors.addresses_sup}
									</span>
								) : null}
							</div> */}
						{/* </Section> */}
						{/* <FieldArray
							name='SupplierBank'
							render={(arrayBank) => (
								<>
									{values.SupplierBank.map((res, i) => (
										<div key={i}>
											<Disclosure defaultOpen>
												{({ open }) => (
													<>
														<Disclosure.Button className='flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 mt-2'>
															<h1 className='text-xl font-bold'>
																Bank Account #{i + 1}
															</h1>
														</Disclosure.Button>
														<Disclosure.Panel>
															<Section className='grid md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2'>
																<div className='w-full'>
																	<Input
																		id={`SupplierBank.${i}.bank_name`}
																		name={`SupplierBank.${i}.bank_name`}
																		placeholder='Bank Name'
																		label='Bank Name'
																		type='text'
																		value={res.bank_name}
																		onChange={handleChange}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	<Input
																		id={`SupplierBank.${i}.rekening`}
																		name={`SupplierBank.${i}.rekening`}
																		placeholder='Account Number'
																		label='Account Number'
																		type='text'
																		value={res.rekening}
																		onChange={handleChange}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	<Input
																		id={`SupplierBank.${i}.account_name`}
																		name={`SupplierBank.${i}.account_name`}
																		placeholder='Account Name'
																		label='Account Name'
																		type='text'
																		value={res.account_name}
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
											{i === values.SupplierBank.length - 1 ? (
												<a
													className='inline-flex text-green-500 mr-6 cursor-pointer mt-1'
													onClick={() => {
														arrayBank.push({
															account_name: "",
															bank_name: "",
															rekening: "",
														});
													}}
												>
													<Plus size={18} className='mr-1 mt-1' /> Add Bank
												</a>
											) : null}
											{values.SupplierBank.length !== 1 ? (
												<a
													className='inline-flex text-red-500 cursor-pointer mt-1'
													onClick={() => {
														arrayBank.remove(i);
													}}
												>
													<Plus size={18} className='mr-1 mt-1' /> Remove Bank
												</a>
											) : null}
										</div>
									))}
								</>
							)}
						/> */}
						<FieldArray
							name='SupplierContact'
							render={(arrayContact) => (
								<>
									{values.SupplierContact.map((res, i) => (
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
															<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
																<div className='w-full'>
																	<Input
																		id={`SupplierContact.${i}.contact_person`}
																		name={`SupplierContact.${i}.contact_person`}
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
																		id={`SupplierContact.${i}.phone`}
																		name={`SupplierContact.${i}.phone`}
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
																{/* <div className='w-full'>
																	<Input
																		id={`SupplierContact.${i}.email_person`}
																		name={`SupplierContact.${i}.email_person`}
																		type='email'
																		placeholder='Email'
																		label='Email'
																		value={res.email_person}
																		onChange={handleChange}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div> */}
															</Section>
														</Disclosure.Panel>
													</>
												)}
											</Disclosure>
											{i === values.SupplierContact.length - 1 ? (
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
											{values.SupplierContact.length !== 1 ? (
												<a
													className='inline-flex text-red-500 cursor-pointer'
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
