import { useEffect, useState } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputWithIcon,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import provinceJson from "../../../assets/data/kodepos.json";
import { supplierSchema } from "../../../schema/master-data/supplier/supplierSchema";
import { Disclosure } from "@headlessui/react";
import { Plus, Trash2 } from "react-feather";
import { EditSupplier, EditSupplierBank, EditSupplierContact } from "../../../services";
import { toast } from "react-toastify";

interface props {
	content: string;
	dataSuplier: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	type_supplier: string;
	supplier_name: string;
	addresses_sup: string;
	provinces: string;
	cities: string;
	districts: string;
	sub_districts: string;
	ec_postalcode: string;
	office_email: string;
	NPWP: string;
	ppn: string;
	pph: string;
}

interface dataBank {
	SupplierBank: [
		{
			id: "";
			supplierId: "";
			account_name: "";
			bank_name: "";
			rekening: "";
		}
	];
}

interface dataContact {
	SupplierContact: [
		{
			id: string;
			supplierId: string;
			contact_person: string;
			email_person: string;
			phone: string;
		}
	];
}

export const FormEditSuplier = ({ content, dataSuplier, showModal }: props) => {
	const dataTabs = ["Supplier", "Bank Account", "Contact"];

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listProvince, setListProvince] = useState<any>([]);
	const [listCity, setListCity] = useState<any>([]);
	const [listDistrict, setListDistrict] = useState<any>([]);
	const [listSubDistrict, setListSubDistrict] = useState<any>([]);
	const [activeTabs, setActiveTabs] = useState<any>(dataTabs[0]);
	const [data, setData] = useState<data>({
		type_supplier: "",
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
	});
	const [dataBank, setDataBank] = useState<dataBank>({
		SupplierBank: [
			{
				id: "",
				supplierId: "",
				account_name: "",
				bank_name: "",
				rekening: "",
			},
		],
	});
	const [dataContact, setDataContact] = useState<dataContact>({
		SupplierContact: [
			{
				id: "",
				supplierId: "",
				contact_person: "",
				email_person: "",
				phone: "",
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
		let listBank: any = [];
		let listContact: any = [];
		setData({
			type_supplier: dataSuplier.type_supplier,
			supplier_name: dataSuplier.supplier_name,
			addresses_sup: dataSuplier.addresses_sup,
			provinces: dataSuplier.provinces,
			cities: dataSuplier.cities,
			districts: dataSuplier.districts,
			sub_districts: dataSuplier.sub_districts,
			ec_postalcode: dataSuplier.ec_postalcode,
			office_email: dataSuplier.office_email,
			NPWP: dataSuplier.NPWP,
			ppn: dataSuplier.ppn,
			pph: dataSuplier.pph,
		});
		getCity(dataSuplier.provinces);
		getDistrict(dataSuplier.cities);
		getSubDistrict(dataSuplier.districts);

		dataSuplier.SupplierBank.map((res: any) => {
			listBank.push({
				id: res.id,
				supplierId: dataSuplier.id,
				account_name: res.account_name,
				bank_name: res.bank_name,
				rekening: res.rekening,
			});
		});

		dataSuplier.SupplierContact.map((res: any) => {
			listContact.push({
				id: res.id,
				supplierId: dataSuplier.id,
				contact_person: res.contact_person,
				email_person: res.email_person,
				phone: res.phone,
			});
		});

		setDataBank({
			SupplierBank: listBank,
		});

		setDataContact({
			SupplierContact: listContact,
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

	const editSupplier = async (data: any) => {
		setIsLoading(true);
		try {
			const response = await EditSupplier(data, dataSuplier.id);
			if (response) {
				toast.success("Edit Supplier Success", {
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
			toast.error("Edit Supplier Failed", {
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

	const editSupplierBank = async (data: any) => {
		setIsLoading(true);
		try {
			const response = await EditSupplierBank(data.SupplierBank);
			if (response) {
				toast.success("Edit Bank Account Success", {
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
			toast.error("Edit Bank Failed", {
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

	const editSupplierContact = async (data: any) => {
		setIsLoading(true);
		try {
			const response = await EditSupplierContact(data.SupplierContact);
			if (response) {
				toast.success("Edit Contact Success", {
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
			toast.error("Edit Contact Failed", {
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
			{activeTabs === "Supplier" ? (
				<Formik
					initialValues={{ ...data }}
					validationSchema={supplierSchema}
					onSubmit={(values) => {
						editSupplier(values);
					}}
					enableReinitialize
				>
					{({ handleChange, handleSubmit, errors, touched, values }) => (
						<Form onChange={handleOnChanges}>
							<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
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
										<option defaultValue=''>Choose a Supplier type</option>
										<option
											value='Material_Supplier'
											selected={
												values.type_supplier === "Material_Supplier"
													? true
													: false
											}
										>
											Material Supplier
										</option>
										<option
											value='Service_Vendor'
											selected={
												values.type_supplier === "Service_Vendor" ? true : false
											}
										>
											Service Vendor
										</option>
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
								<div className='w-full'>
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
								</div>
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
							<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<InputSelect
										id='provinces'
										name='provinces'
										placeholder='Province'
										label='Province'
										onChange={handleChange}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									>
										<option defaultValue=''>Choose Province</option>
										{listProvince.length === 0 ? (
											<option value=''>No Data Province</option>
										) : (
											listProvince.map((res: any, i: number) => {
												return (
													<option
														value={res.province}
														key={i}
														selected={
															res.province === values.provinces ? true : false
														}
													>
														{res.province}
													</option>
												);
											})
										)}
									</InputSelect>
									{errors.provinces && touched.provinces ? (
										<span className='text-red-500 text-xs'>
											{errors.provinces}
										</span>
									) : null}
								</div>
								<div className='w-full'>
									<InputSelect
										id='cities'
										name='cities'
										placeholder='City'
										label='City'
										onChange={handleChange}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									>
										<option defaultValue=''>Choose City</option>
										{listCity.length === 0 ? (
											<option>No Data City</option>
										) : (
											listCity.map((res: any, i: number) => {
												return (
													<option
														value={res.city}
														key={i}
														selected={res.city === values.cities ? true : false}
													>
														{res.city}
													</option>
												);
											})
										)}
									</InputSelect>
									{errors.cities && touched.cities ? (
										<span className='text-red-500 text-xs'>
											{errors.cities}
										</span>
									) : null}
								</div>
								<div className='w-full'>
									<InputSelect
										id='districts'
										name='districts'
										placeholder='District'
										label='District'
										onChange={handleChange}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									>
										<option defaultValue=''>Choose District</option>
										{listDistrict.length === 0 ? (
											<option>No Data District</option>
										) : (
											listDistrict.map((res: any, i: number) => {
												return (
													<option
														value={res.district}
														key={i}
														selected={
															res.district === values.districts ? true : false
														}
													>
														{res.district}
													</option>
												);
											})
										)}
									</InputSelect>
									{errors.districts && touched.districts ? (
										<span className='text-red-500 text-xs'>
											{errors.districts}
										</span>
									) : null}
								</div>
							</Section>
							<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<InputSelect
										id='sub_districts'
										name='sub_districts'
										placeholder='Sub District'
										label='Sub District'
										onChange={handleChange}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									>
										<option defaultValue=''>Choose Sub District</option>
										{listSubDistrict.length === 0 ? (
											<option>No Data Sub District</option>
										) : (
											listSubDistrict.map((res: any, i: number) => {
												return (
													<option
														value={res.subdistrict}
														key={i}
														selected={res.subdistrict === values.sub_districts}
													>
														{res.subdistrict}
													</option>
												);
											})
										)}
									</InputSelect>
									{errors.sub_districts && touched.sub_districts ? (
										<span className='text-red-500 text-xs'>
											{errors.sub_districts}
										</span>
									) : null}
								</div>
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
									{errors.ec_postalcode && touched.ec_postalcode ? (
										<span className='text-red-500 text-xs'>
											{errors.ec_postalcode}
										</span>
									) : null}
								</div>
								<div className='w-full'>
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
											"Edit Supplier"
										)}
									</button>
								</div>
							</div>
						</Form>
					)}
				</Formik>
			) : activeTabs === "Contact" ? (
				<>
					<Formik
						initialValues={{ ...dataContact }}
						// validationSchema={customerSchema}
						onSubmit={(values) => {
							editSupplierContact(values);
						}}
						enableReinitialize
					>
						{({ handleChange, handleSubmit, errors, touched, values }) => (
							<Form>
								<p className='hidden'>{JSON.stringify(dataContact)}</p>
								<FieldArray
									name='SupplierContact'
									render={(arrayContact) => (
										<div>
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
																	<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
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
																		<div className='w-full'>
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
																		</div>
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
																	id: "",
																	supplierId: dataSuplier.id,
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
													{values.SupplierContact.length !== 1 ? (
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
												"Edit Contact"
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
					<p className='hidden'>{JSON.stringify(dataBank)}</p>
					<Formik
						initialValues={{ ...dataBank }}
						// validationSchema={customerSchema}
						onSubmit={(values) => {
							editSupplierContact(values);
						}}
						enableReinitialize
					>
						{({ handleChange, handleSubmit, errors, touched, values }) => (
							<Form onChange={handleOnChanges}>
								<FieldArray
									name='SupplierBank'
									render={(arrayBank) => (
										<div>
											{values.SupplierBank.map((res, i) => (
												<div key={i}>
													<Disclosure defaultOpen>
														{({ open }) => (
															<>
																<Disclosure.Button className='flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 mt-2'>
																	<h1 className='text-xl font-bold mt-3'>
																		Bank Account {i + 1}
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
															className='inline-flex text-green-500 mr-6 cursor-pointer'
															onClick={() => {
																arrayBank.push({
																	id: "",
																	supplierId: dataSuplier.id,
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
															<Trash2 size={18} className='mr-1 mt-1' /> Remove
															Bank
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
												"Edit Bank Account"
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
