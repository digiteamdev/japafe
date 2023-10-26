import { useEffect, useState } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputSelectSearch,
	InputWithIcon,
	InputDate,
	InputArea,
	Button,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { employeSchema } from "../../../schema/master-data/employe/employeSchema";
import provinceJson from "../../../assets/data/kodepos.json";
import { GetListYear } from "../../../utils";
import { Plus, Trash2 } from "react-feather";
import {
	AddEmploye,
	AddEmployeEdu,
	AddEmployeCertificate,
} from "../../../services";
import { toast } from "react-toastify";

interface props {
	listDepartement: {
		id: string;
		name: string;
		createdAt: string;
		updatedAt: string;
		deleted: string;
	}[];
	content: string;
	showModal: (val: boolean, content: string, isModal: boolean) => void;
}

interface data {
	NIP: string;
	NIK: string;
	employee_name: string;
	nick_name: string;
	gender: string;
	id_card: string;
	NPWP: string;
	birth_place: string;
	birth_date: Date;
	address: string;
	province: string;
	city: string;
	districts: string;
	sub_districts: string;
	ec_postalcode: string;
	phone_number: string;
	start_join: Date;
	remaining_days_of: string;
	marital_status: string;
	subdepartId: string;
	position: string;
	employee_status: string;
	email: string;
	spouse_name: any;
	gender_spouse: any;
	spouse_birth_place: any;
	spouse_birth_date: Date | null;
	Employee_Child: [
		{
			name: string | null;
			gender_child: string | null;
			child_birth_place: string | null;
			child_birth_date: Date | null;
		}
	];
}

interface dataEducation {
	Educational_Employee: [
		{
			school_name: string | null;
			last_edu: string | null;
			graduation: string | null;
			ijazah: any;
		}
	];
}

interface dataCertificate {
	Certificate_Employee: [
		{
			certificate_name: string | null;
			certificate_img: any;
			end_date: Date | null;
		}
	];
}

export const FormCreateEmploye = ({
	listDepartement,
	content,
	showModal,
}: props) => {
	const dataTabs = [
		{ id: 1, name: "Employe" },
		{ id: 2, name: "Education" },
		{ id: 3, name: "Certificate" },
		{ id: 4, name: "Family" },
	];

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [employeeID, setEmployeeID] = useState<string>("");
	const [activeTab, setActiveTab] = useState<any>(dataTabs[0]);
	const [listProvince, setListProvince] = useState<any>([]);
	const [files, setFiles] = useState<any>([]);
	const [data, setData] = useState<data>({
		NIP: "",
		NIK: "",
		employee_name: "",
		nick_name: "",
		gender: "Male",
		id_card: "",
		NPWP: "",
		birth_place: "",
		birth_date: new Date(),
		address: "",
		province: "",
		city: "",
		districts: "",
		sub_districts: "",
		ec_postalcode: "",
		phone_number: "",
		position: "",
		start_join: new Date(),
		remaining_days_of: "",
		marital_status: "Single",
		subdepartId: "",
		employee_status: "Contract",
		email: "",
		spouse_name: null,
		gender_spouse: null,
		spouse_birth_date: null,
		spouse_birth_place: null,
		Employee_Child: [
			{
				name: null,
				gender_child: null,
				child_birth_place: null,
				child_birth_date: null,
			},
		],
	});
	const [dataEdu, setDataEdu] = useState<dataEducation>({
		Educational_Employee: [
			{
				school_name: null,
				last_edu: null,
				graduation: null,
				ijazah: null,
			},
		],
	});
	const [dataCerti, setDataCerti] = useState<dataCertificate>({
		Certificate_Employee: [
			{
				certificate_name: null,
				certificate_img: null,
				end_date: null,
			},
		],
	});
	const [listCity, setListCity] = useState<any>([]);
	const [listDistrict, setListDistrict] = useState<any>([]);
	const [listSubDistrict, setListSubDistrict] = useState<any>([]);

	useEffect(() => {
		getProvince();
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

	const getCity = (province: string) => {
		let dataCity: any = [];
		const filtered = json.filter((res: any) => {
			return res.province === province;
		});
		const keys = ["city"];
		filtered
			.filter(
				(
					(s) => (o: any) =>
						((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join("|"))
				)(new Set())
			)
			.map((res: any) => {
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
		if (event.target.name === "province") {
			getCity(event.target.value);
		} else if (event.target.name === "city") {
			getDistrict(event.target.value);
		} else if (event.target.name === "districts") {
			getSubDistrict(event.target.value);
		} else if (event.target.name === "file") {
			if (files.length === 0) {
				setFiles([event.target.files[0]]);
			} else {
				let dataUpload = files;
				dataUpload.push(event.target.files[0]);
				setFiles(dataUpload);
			}
		}
	};

	const addEmploye = async (payload: data) => {
		setIsLoading(true);
		let dataPayload: any = payload;
		if (
			payload.Employee_Child.length === 1 &&
			payload.Employee_Child[0].name === null
		) {
			const { Employee_Child, ...newObj } = payload;
			dataPayload = newObj;
		}
		try {
			const response = await AddEmploye(dataPayload);
			if (response.data) {
				toast.success("Add Employe Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});

				setEmployeeID(response.data.results.id);
				setActiveTab(dataTabs[1]);
				showModal(true, "add", true);
			}
		} catch (error) {
			toast.error("Add Employe Failed", {
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

	const addEmployeEdu = async (payload: any) => {
		setIsLoading(true);
		const form = new FormData();
		const ads: any = [];
		payload.Educational_Employee.map((a: any, s: number) => {
			ads.push({
				employeeId: employeeID,
				school_name: a.school_name,
				last_edu: a.last_edu,
				graduation: a.graduation,
			});
			form.append("ijazah", files[s]);
		});
		form.append("Educational_Employee", JSON.stringify(ads));
		try {
			const response = await AddEmployeEdu(form);
			if (response.data) {
				toast.success("Add Education Employe Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				setFiles([]);
				setActiveTab(dataTabs[2]);
				showModal(true, "add", true);
			}
		} catch (error) {
			toast.error("Add Education Employe Failed", {
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

	const addEmployeCertificate = async (payload: any) => {
		setIsLoading(true);
		const form = new FormData();
		const ads: any = [];
		payload.Certificate_Employee.map((a: any, s: number) => {
			ads.push({
				employeeId: employeeID,
				certificate_name: a.certificate_name,
				end_date: a.end_date,
			});
			form.append("certificate_img", files[s]);
		});
		form.append("Certificate_Employee", JSON.stringify(ads));
		try {
			const response = await AddEmployeCertificate(form);
			if (response.data) {
				toast.success("Add Certificate Employe Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				setFiles([]);
				showModal(false, "add", true);
			}
		} catch (error) {
			toast.error("Add Certificate Employe Failed", {
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
			{activeTab.name === "Employe" ? (
				<Formik
					initialValues={{ ...data }}
					validationSchema={employeSchema}
					onSubmit={(values) => {
						addEmploye(values);
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
							<h1 className='text-xl font-bold'>Employe</h1>
							<div>
								<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<Input
											id='nik'
											name='NIK'
											placeholder='nik'
											label='NIK'
											type='text'
											value={values.NIK}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
										{touched.NIK && errors.NIK && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.NIK}
											</span>
										)}
									</div>
									<div className='w-full'>
										<Input
											id='nip'
											name='NIP'
											placeholder='nip'
											label='NIP'
											type='text'
											value={values.NIP}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
										{touched.NIP && errors.NIP && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.NIP}
											</span>
										)}
									</div>
									<div className='w-full'>
										<Input
											id='employee_name'
											name='employee_name'
											placeholder='employe name'
											label='Employe Name'
											type='text'
											value={values.employee_name}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
										{touched.employee_name && errors.employee_name && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.employee_name}
											</span>
										)}
									</div>
								</Section>
								<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-3'>
									<div className='w-full'>
										<Input
											id='nick_name'
											name='nick_name'
											placeholder='nick name'
											label='Nick Name'
											type='text'
											value={values.nick_name}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
										{touched.nick_name && errors.nick_name && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.nick_name}
											</span>
										)}
									</div>
									<div className='w-full'>
										<InputSelect
											id='gender'
											name='gender'
											placeholder='Gender'
											label='Gender'
											value={values.gender}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										>
											<option defaultValue='Male' selected>
												Male
											</option>
											<option value='Female'>Female</option>
										</InputSelect>
										{touched.gender && errors.gender && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.gender}
											</span>
										)}
									</div>
									<div className='w-full'>
										<Input
											id='idCard'
											name='id_card'
											placeholder='ID Card'
											label='ID Card'
											type='text'
											value={values.id_card}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
										{touched.id_card && errors.id_card && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.id_card}
											</span>
										)}
									</div>
								</Section>
								<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-3'>
									<div className='w-full'>
										<InputSelect
											id='subdepartId'
											name='subdepartId'
											placeholder='Departement'
											label='Departement'
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										>
											{listDepartement.length === 0 ? (
												<option>No Data Departemen</option>
											) : (
												<>
													<option>Select Departement</option>
													{listDepartement.map((res, i) => {
														return (
															<option value={res.id} key={i}>
																{res.name}
															</option>
														);
													})}
												</>
											)}
										</InputSelect>
										{touched.subdepartId && errors.subdepartId && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.subdepartId}
											</span>
										)}
									</div>
									<div className='w-full'>
										<InputSelect
											id='position'
											name='position'
											placeholder='Position'
											label='Position'
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										>
											<option defaultValue='' selected>
												Select Posision
											</option>
											<option value='Operator'>Operator</option>
											<option value='Staff'>Staff</option>
											<option value='Supervisor'>Supervisor</option>
											<option value='Manager'>Manager</option>
											<option value='Director'>Director</option>
										</InputSelect>
										{touched.position && errors.position && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.position}
											</span>
										)}
									</div>
									<div className='w-full'>
										<Input
											id='email'
											name='email'
											placeholder='Email'
											label='Email'
											type='email'
											value={values.email}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
										{touched.email && errors.email && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.email}
											</span>
										)}
									</div>
								</Section>
								<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-3'>
									<div className='w-full'>
										<InputWithIcon
											id='phone_number'
											name='phone_number'
											placeholder='Phone'
											type='text'
											label='Phone'
											value={values.phone_number}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
											icon='+62'
											classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3'
										/>
										{touched.phone_number && errors.phone_number && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.phone_number}
											</span>
										)}
									</div>
									<div className='w-full'>
										<Input
											id='remainingDayOff'
											name='remaining_days_of'
											placeholder='Remaining Day Off'
											label='Remaining Day Off'
											type='number'
											value={values.remaining_days_of}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
										{touched.remaining_days_of && errors.remaining_days_of && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.remaining_days_of}
											</span>
										)}
									</div>
									<div className='w-full'>
										<Input
											id='birth_place'
											name='birth_place'
											placeholder='Birthplace'
											label='Birthplace'
											type='text'
											value={values.birth_place}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
										{touched.birth_place && errors.birth_place && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.birth_place}
											</span>
										)}
									</div>
								</Section>
								<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2'>
									<div className='w-full'>
										<InputDate
											id='birthDate'
											label='Birtdate'
											value={values.birth_date}
											onChange={(value: any) =>
												setFieldValue("birth_date", value)
											}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
											classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
										/>
										{touched.birth_date && errors.birth_date && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{/* {errors.birth_date} */}
											</span>
										)}
									</div>
									<div className='w-full'>
										<InputSelect
											id='matirialStatus'
											name='marital_status'
											placeholder='Matirial Status'
											label='Matirial Status'
											value={values.marital_status}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										>
											<option defaultValue='Single' selected>
												Single
											</option>
											<option value='Married'>Married</option>
											<option value='Divorce'>Divorce</option>
										</InputSelect>
										{touched.marital_status && errors.marital_status && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.marital_status}
											</span>
										)}
									</div>
									<div className='w-full'>
										<InputSelect
											id='employeStatus'
											name='employee_status'
											placeholder='Employe Status'
											label='Employe Status'
											value={values.employee_status}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										>
											<option defaultValue='Contract' selected>
												Contract
											</option>
											<option value='Permanent'>Permanent</option>
											<option value='OJT'>OJT</option>
										</InputSelect>
										{touched.employee_status && errors.employee_status && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.employee_status}
											</span>
										)}
									</div>
								</Section>
								<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2'>
									<div className='w-full'>
										<Input
											id='NPWP'
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
										{touched.NPWP && errors.NPWP && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.NPWP}
											</span>
										)}
									</div>
									<div className='w-full'>
										<InputDate
											id='start_join'
											label='Start Joining'
											value={values.start_join}
											onChange={(value: any) =>
												setFieldValue("start_join", value)
											}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
											classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
										/>
										{touched.start_join && errors.start_join && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{/* {errors.start_join} */}
											</span>
										)}
									</div>
									<div className='w-full'>
										<InputSelectSearch
											datas={listProvince}
											id='province'
											name='province'
											placeholder='Province'
											label='Province'
											onChange={(e: any) => {
												getCity(e.value);
												setFieldValue("province", e.value);
											}}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
										/>
										{touched.province && errors.province && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.province}
											</span>
										)}
									</div>
								</Section>
								<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2'>
									<div className='w-full'>
										<InputSelectSearch
											datas={listCity}
											id='city'
											name='city'
											placeholder='City'
											label='City'
											onChange={(e: any) => {
												getDistrict(e.value);
												setFieldValue("city", e.value);
											}}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
										/>
										{touched.city && errors.city && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.city}
											</span>
										)}
									</div>
									<div className='w-full'>
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
										{touched.districts && errors.districts && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.districts}
											</span>
										)}
									</div>
									<div className='w-full'>
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
										{touched.sub_districts && errors.sub_districts && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.sub_districts}
											</span>
										)}
									</div>
								</Section>
								<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-3'>
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
										{touched.ec_postalcode && errors.ec_postalcode && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.ec_postalcode}
											</span>
										)}
									</div>
									<div className='w-full'>
										<InputArea
											id='address'
											name='address'
											placeholder='Address'
											label='Address'
											type='text'
											row={2}
											value={values.address}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
										{touched.address && errors.address && (
											<span className='mt-2 text-xs text-red-500 font-semibold'>
												{errors.address}
											</span>
										)}
									</div>
								</Section>
								<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-3'>
									<Input
										id='spouseName'
										name='spouse_name'
										placeholder='Spouse Name'
										label='Spouse Name'
										type='text'
										value={
											values.spouse_name === null ? null : values.spouse_name
										}
										onChange={handleChange}
										required={false}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
									<InputSelect
										id='genderSpouse'
										name='gender_spouse'
										placeholder='Gender'
										label='Gender'
										value={
											values.gender_spouse === null
												? null
												: values.gender_spouse
										}
										onChange={handleChange}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									>
										<option defaultValue='Male' selected>
											Male
										</option>
										<option value='Female'>Female</option>
									</InputSelect>
									<Input
										id='BirthplaceSpouse'
										name='spouse_birth_place'
										placeholder='Birthplace'
										label='Birthplace'
										type='text'
										value={
											values.spouse_birth_place === null
												? null
												: values.spouse_birth_place
										}
										onChange={handleChange}
										required={false}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
									<InputDate
										id='birthDateSpouse'
										label='Birthdate'
										value={
											values.spouse_birth_date === null
												? null
												: values.spouse_birth_date
										}
										onChange={(value: any) =>
											setFieldValue("spouse_birth_date", value)
										}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
										classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
									/>
								</Section>
								<h1 className='text-xl font-bold'>Child</h1>
								<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<FieldArray
										name='Employee_Child'
										render={(arrayHelpers) =>
											values.Employee_Child.map((res, i) => (
												<div key={i}>
													<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2 divide-y'>
														<Input
															id={`Employee_Child.${i}.name`}
															name={`Employee_Child.${i}.name`}
															placeholder='Child Name'
															label='Child Name'
															type='text'
															value={res.name === null ? "" : res.name}
															onChange={handleChange}
															required={false}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
														<InputSelect
															id={`Employee_Child.${i}.gender_child`}
															name={`Employee_Child.${i}.gender_child`}
															placeholder='Gender'
															label='Gender'
															onChange={handleChange}
															required={false}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														>
															<option defaultValue='Male' selected>
																Male
															</option>
															<option value='Female'>Female</option>
														</InputSelect>
														<Input
															id={`Employee_Child.${i}.child_birth_place`}
															name={`Employee_Child.${i}.child_birth_place`}
															placeholder='Birthplace'
															label='Birthplace'
															type='text'
															value={
																res.child_birth_place === null
																	? ""
																	: res.child_birth_place
															}
															onChange={handleChange}
															required={false}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
														<div className='w-full flex'>
															<div className='w-full'>
																<InputDate
																	id={`Employee_Child.${i}.child_birth_date`}
																	label='Birthdate'
																	value={
																		values.Employee_Child[i]
																			.child_birth_date === null
																			? null
																			: values.Employee_Child[i]
																					.child_birth_date
																	}
																	onChange={(value: any) =>
																		setFieldValue(
																			`Employee_Child.${i}.child_birth_date`,
																			value
																		)
																	}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
																	classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
																/>
															</div>
														</div>
													</Section>
													{i === values.Employee_Child.length - 1 ? (
														<a
															className='inline-flex text-green-500 mr-6 cursor-pointer'
															onClick={() => {
																arrayHelpers.push({
																	name: null,
																	gender_child: null,
																	child_birth_place: null,
																	child_birth_date: null,
																});
															}}
														>
															<Plus size={18} className='mr-1 mt-1' /> Add Child
														</a>
													) : null}
													{values.Employee_Child.length !== 1 ? (
														<a
															className='inline-flex text-red-500 cursor-pointer mt-1'
															onClick={() => {
																arrayHelpers.remove(i);
															}}
														>
															<Trash2 size={18} className='mr-1 mt-1' /> Remove
															Child
														</a>
													) : null}
												</div>
											))
										}
									/>
								</Section>
							</div>
							<div className='mt-8 flex justify-end'>
								<div className='flex gap-2 items-center'>
									<button
										type='button'
										className={`inline-flex justify-center rounded-full border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 ${
											isLoading ? "disabled" : ""
										}`}
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
			) : activeTab.name === "Education" ? (
				<div>
					<h1 className='text-xl font-bold'>Education</h1>
					<Formik
						initialValues={{ ...dataEdu }}
						// validationSchema={eduSchema}
						onSubmit={(values) => {
							addEmployeEdu(values);
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
							<>
								<Form onChange={handleOnChanges}>
									<FieldArray
										name='Educational_Employee'
										render={(arrayHelpers) =>
											values.Educational_Employee.map((res, i) => (
												<div key={i}>
													<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
														<InputSelect
															id={`Educational_Employee.${i}.last_edu`}
															name={`Educational_Employee.${i}.last_edu`}
															placeholder='Education'
															label='Education'
															onChange={handleChange}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														>
															<option defaultValue='l' selected>
																Choose Education
															</option>
															<option value='Elementary_School'>
																Elementary School
															</option>
															<option value='Junior_High_School'>
																Junior High School
															</option>
															<option value='Senior_High_School'>
																Senior High School
															</option>
															<option value='Bachelor_Degree'>
																Bachelor Degree
															</option>
															<option value='Magister'>Magister</option>
															<option value='Postgraduate'>Postgraduate</option>
														</InputSelect>
														<Input
															id={`Educational_Employee.${i}.school_name`}
															name={`Educational_Employee.${i}.school_name`}
															placeholder='School Name'
															label='School Name'
															type='text'
															value={
																res.school_name === null ? "" : res.school_name
															}
															onChange={handleChange}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
														<InputSelect
															id={`Educational_Employee.${i}.graduation`}
															name={`Educational_Employee.${i}.graduation`}
															placeholder='Gradution Year'
															label='Gradution Year'
															onChange={handleChange}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														>
															<option defaultValue='' selected>
																Choose Graduation
															</option>
															{GetListYear().map((value) => {
																return (
																	<option key={value.id} value={value.name}>
																		{value.name}
																	</option>
																);
															})}
														</InputSelect>
													</Section>
													<table className='w-full mt-2'>
														<tr>
															<td className='w-[80%]'>
																<Input
																	id={`Educational_Employee.${i}.ijazah`}
																	name='file'
																	placeholder='Degree'
																	label='Degree'
																	type='file'
																	accept='image/*, .pdf'
																	onChange={handleOnChanges}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</td>
															<td className='w-[20%] pt-5'>
																{i ===
																values.Educational_Employee.length - 1 ? (
																	<button
																		type='button'
																		className='mx-1 bg-orange-500 hover:bg-orange-700 text-white py-2 px-2 rounded-md'
																		onClick={() => {
																			arrayHelpers.push({
																				school_name: null,
																				last_edu: null,
																				graduation: null,
																				ijazah: null,
																			});
																		}}
																	>
																		<Plus color='white' />
																	</button>
																) : (
																	""
																)}
																{i !== 0 ? (
																	<button
																		type='button'
																		className='mx-1 bg-red-500 hover:bg-red-700 text-white py-2 px-2 rounded-md'
																		onClick={() => {
																			arrayHelpers.remove(i);
																		}}
																	>
																		<Trash2 color='white' />
																	</button>
																) : (
																	""
																)}
															</td>
														</tr>
													</table>
													<div className='border-dashed border-b-2 my-2 border-primary-300 w-full'></div>
												</div>
											))
										}
									/>
								</Form>
								<div className='mt-8 flex justify-end'>
									<div className='flex gap-2 items-center'>
										<button
											type='button'
											className={`inline-flex justify-center rounded-full border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 ${
												isLoading ? "disabled" : ""
											}`}
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
							</>
						)}
					</Formik>
				</div>
			) : (
				<div>
					<h1 className='text-xl font-bold'>Certificate</h1>
					<p className='hidden'>{JSON.stringify(dataCerti)}</p>
					<Formik
						initialValues={dataCerti}
						// validationSchema={eduSchema}
						onSubmit={(values) => {
							addEmployeCertificate(values);
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
							<>
								<Form onChange={handleOnChanges}>
									<FieldArray
										name='Certificate_Employee'
										render={(arrayHelpers) =>
											values.Certificate_Employee.map((res, i) => (
												<div key={i}>
													<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
														<Input
															id={`Certificate_Employee.${i}.certificate_name`}
															name={`Certificate_Employee.${i}.certificate_name`}
															placeholder='Certificate Name'
															label='Certificate Name'
															type='text'
															value={
																res.certificate_name === null
																	? ""
																	: res.certificate_name
															}
															onChange={handleChange}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
														<InputDate
															id={`Certificate_Employee.${i}.end_date`}
															label='End date'
															value={
																res.end_date === null
																	? new Date()
																	: res.end_date
															}
															onChange={(value: any) =>
																setFieldValue(
																	`Certificate_Employee.${i}.end_date`,
																	value
																)
															}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
															classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
														/>
														<div className='w-full flex'>
															<Input
																id={`Certificate_Employee.${i}.certificate_img`}
																name='file'
																placeholder='Certificate Image'
																label='Certificate Image'
																type='file'
																accept='image/*, .pdf'
																onChange={(e: any) =>
																	setFieldValue(
																		`Certificate_Employee.${i}.certificate_img`,
																		e.target.value
																	)
																}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
															/>
															{i === values.Certificate_Employee.length - 1 ? (
																<button
																	type='button'
																	className='mx-1 my-7 bg-orange-500 hover:bg-orange-700 text-white py-2 px-2 rounded-md'
																	onClick={() => {
																		arrayHelpers.push({
																			certificate_name: null,
																			certificate_img: null,
																			end_date: null,
																		});
																	}}
																>
																	<Plus color='white' />
																</button>
															) : (
																""
															)}
															{i !== 0 ? (
																<button
																	type='button'
																	className='mx-1 my-7 bg-red-500 hover:bg-red-700 text-white py-2 px-2 rounded-md'
																	onClick={() => {
																		arrayHelpers.remove(i);
																	}}
																>
																	<Trash2 color='white' />
																</button>
															) : (
																""
															)}
														</div>
													</Section>
													<div className='border-dashed border-b-2 my-2 border-primary-300 w-full'></div>
												</div>
											))
										}
									/>
								</Form>
								<div className='mt-8 flex justify-end'>
									<div className='flex gap-2 items-center'>
										<button
											type='button'
											className={`inline-flex justify-center rounded-full border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 ${
												isLoading ? "disabled" : ""
											}`}
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
							</>
						)}
					</Formik>
				</div>
			)}
		</div>
	);
};
