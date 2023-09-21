import { useEffect, useState, useRef } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputWithIcon,
	InputDate,
	InputArea,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import provinceJson from "../../../assets/data/kodepos.json";
import { employeSchema } from "../../../schema/master-data/employe/employeSchema";
import { Disclosure } from "@headlessui/react";
import { Plus, Trash2 } from "react-feather";
import { GetListYear } from "../../../utils";
import {
	EditEmploye,
	EditEmployeChild,
	EditEmployeCertificate,
	EditEmployeEdu,
	DeleteEmployeCertificate,
	DeleteEmployeChild,
	DeleteEmployeEdu,
} from "../../../services";
import { toast } from "react-toastify";

interface props {
	content: string;
	dataEmploye: any;
	listDepartement: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface dataEmploye {
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
	position: string;
	ec_postalcode: string;
	phone_number: string;
	start_join: Date;
	remaining_days_of: string;
	marital_status: string;
	subdepartId: string;
	employee_status: string;
	email: string;
	spouse_name: any;
	gender_spouse: any;
	spouse_birth_place: any;
	spouse_birth_date: Date | null;
}

interface dataChild {
	Employee_Child: [
		{
			id: string;
			employeeId: string;
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
			id: string;
			employeeId: string;
			school_name: string;
			last_edu: string;
			graduation: string;
			ijazah: any;
			action: string;
		}
	];
}

interface dataCertificate {
	Certificate_Employee: [
		{
			id: string;
			employeeId: string;
			certificate_name: string | null;
			certificate_img: any;
			end_date: Date | null;
			action: string;
		}
	];
}

export const FormEditEmploye = ({
	content,
	dataEmploye,
	listDepartement,
	showModal,
}: props) => {
	const hiddenFileInput: any = useRef(null);
	const dataTabs = ["Employe", "Child", "Education", "Certificate"];

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listProvince, setListProvince] = useState<any>([]);
	const [listCity, setListCity] = useState<any>([]);
	const [listDistrict, setListDistrict] = useState<any>([]);
	const [listSubDistrict, setListSubDistrict] = useState<any>([]);
	const [activeTabs, setActiveTabs] = useState<any>(dataTabs[0]);
	const [certiFiles, setCertiFiles] = useState<any>([]);
	const [eduFiles, setEduFiles] = useState<any>([]);
	const [data, setData] = useState<dataEmploye>({
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
		position: "",
		sub_districts: "",
		ec_postalcode: "",
		phone_number: "",
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
	});
	const [dataChild, setDataChild] = useState<dataChild>({
		Employee_Child: [
			{
				id: "",
				employeeId: "",
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
				id: "",
				employeeId: "",
				school_name: "",
				last_edu: "",
				graduation: "",
				ijazah: "",
				action: "",
			},
		],
	});
	const [dataCerti, setDataCerti] = useState<dataCertificate>({
		Certificate_Employee: [
			{
				id: "",
				employeeId: "",
				certificate_name: null,
				certificate_img: null,
				end_date: null,
				action: "",
			},
		],
	});

	useEffect(() => {
		getProvince();
		setingData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const json: any = provinceJson;

	const setingData = () => {
		let listChild: any = [];
		let listEdu: any = [];
		let listCerti: any = [];

		if (dataEmploye.Employee_Child.length > 0) {
			dataEmploye.Employee_Child.map((res: any) => {
				listChild.push({
					id: res.id,
					employeeId: dataEmploye.id,
					name: res.name,
					gender_child: res.gender_child,
					child_birth_place: res.child_birth_place,
					child_birth_date: res.child_birth_date,
				});
			});
		} else {
			listChild.push({
				id: "",
				employeeId: dataEmploye.id,
				name: "",
				gender_child: "",
				child_birth_place: "",
				child_birth_date: null,
			});
		}

		if (dataEmploye.Educational_Employee.length > 0) {
			dataEmploye.Educational_Employee.map((res: any) => {
				listEdu.push({
					id: res.id,
					employeeId: dataEmploye.id,
					school_name: res.school_name,
					last_edu: res.last_edu,
					graduation: res.graduation,
					ijazah: res.ijazah,
					action: "not upload",
				});
			});
		} else {
			listEdu.push({
				id: "",
				employeeId: dataEmploye.id,
				school_name: "",
				last_edu: "",
				graduation: "",
				ijazah: null,
				action: "not upload",
			});
		}

		if (dataEmploye.Certificate_Employee.length > 0) {
			dataEmploye.Certificate_Employee.map((res: any) => {
				listCerti.push({
					id: res.id,
					employeeId: dataEmploye.id,
					certificate_name: res.certificate_name,
					certificate_img: res.certificate_img,
					end_date: new Date(res.end_date),
					action: "not upload",
				});
			});
		} else {
			listCerti.push({
				id: "",
				employeeId: dataEmploye.id,
				certificate_name: "",
				certificate_img: "",
				end_date: new Date(),
				action: "not upload",
			});
		}

		setData({
			NIP: dataEmploye.NIP,
			NIK: dataEmploye.NIK,
			employee_name: dataEmploye.employee_name,
			nick_name: dataEmploye.nick_name,
			gender: dataEmploye.gender,
			id_card: dataEmploye.id_card,
			NPWP: dataEmploye.NPWP,
			birth_place: dataEmploye.birth_place,
			birth_date: new Date(dataEmploye.birth_date),
			address: dataEmploye.address,
			province: dataEmploye.province,
			city: dataEmploye.city,
			position: dataEmploye.position,
			districts: dataEmploye.districts,
			sub_districts: dataEmploye.sub_districts,
			ec_postalcode: dataEmploye.ec_postalcode,
			phone_number: dataEmploye.phone_number,
			start_join: new Date(dataEmploye.start_join),
			remaining_days_of: dataEmploye.remaining_days_of,
			marital_status: dataEmploye.marital_status,
			subdepartId: dataEmploye.sub_depart.id,
			employee_status: dataEmploye.employee_status,
			email: dataEmploye.email,
			spouse_name: dataEmploye.spouse_name,
			gender_spouse: dataEmploye.gender_spouse,
			spouse_birth_date: dataEmploye.spouse_birth_date,
			spouse_birth_place: dataEmploye.spouse_birth_place,
		});

		setDataChild({
			Employee_Child: listChild,
		});

		setDataCerti({
			Certificate_Employee: listCerti,
		});

		setDataEdu({
			Educational_Employee: listEdu,
		});

		getCity(dataEmploye.province);
		getDistrict(dataEmploye.city);
		getSubDistrict(dataEmploye.districts);
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

	const showUpload = (id: any) => {
		const inputan = document.getElementById(id);
		inputan?.click();
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name.includes("provinces")) {
			getCity(event.target.value);
		} else if (event.target.name.includes("cities")) {
			getDistrict(event.target.value);
		} else if (event.target.name.includes("districts")) {
			getSubDistrict(event.target.value);
		} else if (event.target.name.includes("certificate_img")) {
			if (certiFiles.length === 0) {
				setCertiFiles([event.target.files[0]]);
			} else {
				let dataUpload: any = certiFiles;
				dataUpload.push(event.target.files[0]);
				setCertiFiles(dataUpload);
			}
		} else if (event.target.name.includes("ijazah")) {
			if (eduFiles.length === 0) {
				setEduFiles([event.target.files[0]]);
			} else {
				let dataUpload: any = eduFiles;
				dataUpload.push(event.target.files[0]);
				setEduFiles(dataUpload);
			}
		}
	};

	const editEmploye = async (data: any) => {
		setIsLoading(true);
		try {
			const response = await EditEmploye(data, dataEmploye.id);
			if (response.data) {
				toast.success("Edit Employe Success", {
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
			toast.error("Edit Employe Failed", {
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

	const editEmployeChild = async (data: any) => {
		setIsLoading(true);
		try {
			const response = await EditEmployeChild(data.Employee_Child);
			if (response.data) {
				toast.success("Edit Employe Child Success", {
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
			toast.error("Edit Employe Child Failed", {
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

	const editEmployeCertificate = async (data: any) => {
		setIsLoading(true);
		const form = new FormData();
		let ads: any = [];
		let indexFile = 0;
		certiFiles.map((res: any, i: number) => {
			form.append("certificate_img", certiFiles[i]);
		});
		data.Certificate_Employee.map((a: any) => {
			ads.push({
				id: a.id,
				employeeId: a.employeeId,
				certificate_name: a.certificate_name,
				certificate_img: a.certificate_img,
				end_date: new Date(a.end_date),
				action: a.action === "not upload" ? a.action : `upload.${indexFile}`,
			});
			if (a.action !== "not upload") {
				indexFile = indexFile + 1;
			}
		});

		form.append("Certificate_Employee", JSON.stringify(ads));

		try {
			const response = await EditEmployeCertificate(form);
			if (response.data) {
				toast.success("Edit Certificate Success", {
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
			toast.error("Edit Certificate Failed", {
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

	const editEmployeEdu = async (data: any) => {
		setIsLoading(true);
		const form = new FormData();
		let ads: any = [];
		let indexFile = 0;
		eduFiles.map((res: any, i: number) => {
			form.append("ijazah", eduFiles[i]);
		});
		data.Educational_Employee.map((a: any) => {
			ads.push({
				id: a.id,
				employeeId: dataEmploye.id,
				school_name: a.school_name,
				last_edu: a.last_edu,
				graduation: a.graduation,
				ijazah: a.ijazah,
				action: a.action === "not upload" ? a.action : `upload.${indexFile}`,
			});
			if (a.action !== "not upload") {
				indexFile = indexFile + 1;
			}
		});

		form.append("educational_Employee", JSON.stringify(ads));

		try {
			const response = await EditEmployeEdu(form);
			if (response.data) {
				toast.success("Edit Education Success", {
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
			toast.error("Edit Education Failed", {
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

	const deleteEmployeCertificate = async (id: string) => {
		try {
			const response = await DeleteEmployeCertificate(id);
			if (response.data) {
				toast.success("Delete Certificate Success", {
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
			toast.error("Delete Certificate Failed", {
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

	const deleteEmployeChild = async (id: string) => {
		try {
			const response = await DeleteEmployeChild(id);
			if (response.data) {
				toast.success("Delete Certificate Success", {
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
			toast.error("Delete Certificate Failed", {
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

	const deleteEmployeEdu = async (id: string) => {
		try {
			const response = await DeleteEmployeEdu(id);
			if (response.data) {
				toast.success("Delete Delete Success", {
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
			toast.error("Delete Delete Failed", {
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
			{activeTabs === "Employe" ? (
				<Formik
					initialValues={{ ...data }}
					validationSchema={employeSchema}
					onSubmit={(values) => {
						editEmploye(values);
					}}
					enableReinitialize
					key={0}
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
										onChange={handleChange}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									>
										<option
											defaultValue='Male'
											selected={values.gender === "Male" ? true : false}
										>
											Male
										</option>
										<option
											value='Female'
											selected={values.gender === "Female" ? true : false}
										>
											Female
										</option>
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
												<option defaultValue=''>Choose a Departemen</option>
												{listDepartement.map((res: any, i: number) => {
													return (
														<option
															value={res.id}
															key={i}
															selected={
																res.id === values.subdepartId ? true : false
															}
														>
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
										<option value='Operator' selected={ values.position === 'Operator' }>Operator</option>
										<option value='Staff' selected={ values.position === 'Staff' }>Staff</option>
										<option value='Supervisor' selected={ values.position === 'Supervisor' }>Supervisor</option>
										<option value='Manager' selected={ values.position === 'Manager' }>Manager</option>
										<option value='Director' selected={ values.position === 'Director' }>Director</option>
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
							<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-3'>
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
									<InputSelect
										id='province'
										name='province'
										placeholder='Province'
										label='Province'
										value={values.province}
										onChange={handleChange}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									>
										<option defaultValue='' selected>
											Choose Province
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
									{touched.province && errors.province && (
										<span className='mt-2 text-xs text-red-500 font-semibold'>
											{errors.province}
										</span>
									)}
								</div>
							</Section>
							<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2'>
								<div className='w-full'>
									<InputSelect
										id='city'
										name='city'
										placeholder='City'
										label='City'
										value={values.city}
										onChange={handleChange}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									>
										<option defaultValue='' selected>
											Choose City
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
									{touched.city && errors.city && (
										<span className='mt-2 text-xs text-red-500 font-semibold'>
											{errors.city}
										</span>
									)}
								</div>
								<div className='w-full'>
									<InputSelect
										id='districts'
										name='districts'
										placeholder='District'
										label='Districts'
										value={values.districts}
										onChange={handleChange}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									>
										<option defaultValue='' selected>
											Choose District
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
									{touched.districts && errors.districts && (
										<span className='mt-2 text-xs text-red-500 font-semibold'>
											{errors.districts}
										</span>
									)}
								</div>
								<div className='w-full'>
									<InputSelect
										id='sub_districts'
										name='sub_districts'
										placeholder='Sub District'
										label='Sub District'
										value={values.sub_districts}
										onChange={handleChange}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									>
										<option defaultValue='' selected>
											Choose Sub District
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
										values.gender_spouse === null ? null : values.gender_spouse
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
							{/* <h1 className='text-xl font-bold'>Child</h1>
							<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
								<FieldArray
									name='Employee_Child'
									render={(arrayChild) =>
										values.Employee_Child.map((res, i) => (
											<div>
												<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
													<div className='w-full'>
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
													</div>
													<div className='w-full'>
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
													</div>
													<div className='w-full'>
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
													</div>
												</Section>
												{i === values.Employee_Child.length - 1 ? (
													<a
														className='inline-flex text-green-500 mr-6 cursor-pointer'
														onClick={() => {
															arrayChild.push({
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
															arrayChild.remove(i);
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
							</Section> */}
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
											"Edit Employe"
										)}
									</button>
								</div>
							</div>
						</Form>
					)}
				</Formik>
			) : activeTabs === "Education" ? (
				<div>
					<p className='hidden'>{JSON.stringify(dataEdu)}</p>
					<Formik
						initialValues={{ ...dataEdu }}
						// validationSchema={eduSchema}
						onSubmit={(values) => {
							editEmployeEdu(values);
						}}
						enableReinitialize
						key={1}
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
										render={(arrayEdu) =>
											values.Educational_Employee.map((res, i) => (
												<div key={i}>
													<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
														<div className='w-full'>
															<InputSelect
																id={`Educational_Employee.${i}.last_edu`}
																name={`Educational_Employee.${i}.last_edu`}
																placeholder='Education'
																label='Education'
																onChange={handleChange}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
															>
																<option defaultValue='' selected>
																	Choose Education
																</option>
																<option
																	value='Elementary_School'
																	selected={
																		res.last_edu === "Elementary_School"
																			? true
																			: false
																	}
																>
																	Elementary School
																</option>
																<option
																	value='Junior_High_School'
																	selected={
																		res.last_edu === "Junior_High_School"
																			? true
																			: false
																	}
																>
																	Junior High School
																</option>
																<option
																	value='Senior_High_School'
																	selected={
																		res.last_edu === "Senior_High_School"
																			? true
																			: false
																	}
																>
																	Senior High School
																</option>
																<option
																	value='Bachelor_Degree'
																	selected={
																		res.last_edu === "Bachelor_Degree"
																			? true
																			: false
																	}
																>
																	Bachelor Degree
																</option>
																<option
																	value='Magister'
																	selected={
																		res.last_edu === "Magister" ? true : false
																	}
																>
																	Magister
																</option>
																<option
																	value='Postgraduate'
																	selected={
																		res.last_edu === "Postgraduate"
																			? true
																			: false
																	}
																>
																	Postgraduate
																</option>
															</InputSelect>
														</div>
														<div className='w-full'>
															<Input
																id={`Educational_Employee.${i}.school_name`}
																name={`Educational_Employee.${i}.school_name`}
																placeholder='School Name'
																label='School Name'
																type='text'
																value={
																	res.school_name === null
																		? ""
																		: res.school_name
																}
																onChange={handleChange}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
															/>
														</div>
													</Section>
													<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
														<div className='w-full'>
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
																		<option
																			key={value.id}
																			value={value.name}
																			selected={
																				res.graduation === value.name.toString()
																					? true
																					: false
																			}
																		>
																			{value.name}
																		</option>
																	);
																})}
															</InputSelect>
														</div>
														<div className='w-full'>
															{res.ijazah !== null &&
															res.ijazah.includes(
																"https://res.cloudinary.com/"
															) ? (
																<div>
																	<label className='block mb-2 text-sm font-medium text-gray-900'>
																		Certificate Image
																	</label>
																	<div className='flex'>
																		<a
																			href={res.ijazah}
																			target='_blank'
																			className='justify-center rounded-full border border-transparent bg-green-500 px-4 py-1 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mt-2 mr-2'
																		>
																			Show File
																		</a>
																		<p
																			className='justify-center rounded-full border border-transparent bg-orange-500 px-4 py-1 text-sm font-medium text-white hover:bg-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mt-2 cursor-pointer'
																			onClick={() =>
																				showUpload(
																					`Educational_Employee.${i}.ijazah`
																				)
																			}
																		>
																			Change File
																		</p>
																		<input
																			id={`Educational_Employee.${i}.ijazah`}
																			name={`Educational_Employee.${i}.ijazah`}
																			placeholder='Certificate Image'
																			type='file'
																			ref={hiddenFileInput}
																			className='hidden'
																			onChange={() =>
																				setFieldValue(
																					`Educational_Employee.${i}.action`,
																					`upload.${i}`
																				)
																			}
																		/>
																	</div>
																</div>
															) : (
																<Input
																	id={`Educational_Employee.${i}.ijazah`}
																	name={`Educational_Employee.${i}.ijazah`}
																	placeholder='Degree'
																	label='Degree'
																	type='file'
																	onChange={() =>
																		setFieldValue(
																			`Educational_Employee.${i}.action`,
																			`upload.${i}`
																		)
																	}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															)}
														</div>
													</Section>
													{i === values.Educational_Employee.length - 1 ? (
														<a
															className='inline-flex text-green-500 mr-6 cursor-pointer'
															onClick={() => {
																arrayEdu.push({
																	id: "",
																	employeeId: dataEmploye.id,
																	school_name: "",
																	last_edu: "",
																	graduation: "",
																	ijazah: null,
																	action: "not upload",
																});
															}}
														>
															<Plus size={18} className='mr-1 mt-1' /> Add
															Education
														</a>
													) : null}
													{values.Educational_Employee.length !== 1 ? (
														<a
															className='inline-flex text-red-500 cursor-pointer mt-1'
															onClick={() => {
																res.id !== "" ? deleteEmployeEdu(res.id) : null;
																arrayEdu.remove(i);
															}}
														>
															<Trash2 size={18} className='mr-1 mt-1' /> Remove
															Education
														</a>
													) : null}
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
												"Edit Education"
											)}
										</button>
									</div>
								</div>
							</>
						)}
					</Formik>
				</div>
			) : activeTabs === "Child" ? (
				<>
					<p className='hidden'>{JSON.stringify(dataChild)}</p>
					<Formik
						initialValues={{ ...dataChild }}
						// validationSchema={employeSchema}
						onSubmit={(values) => {
							editEmployeChild(values);
						}}
						enableReinitialize
						key={0}
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
								<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<FieldArray
										name='Employee_Child'
										render={(arrayChild) =>
											values.Employee_Child.map((res, i) => (
												<div key={i}>
													<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
														<div className='w-full'>
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
														</div>
														<div className='w-full'>
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
																<option
																	defaultValue='Male'
																	selected={
																		res.gender_child === "Male" ? true : false
																	}
																>
																	Male
																</option>
																<option
																	value='Female'
																	selected={
																		res.gender_child === "Female" ? true : false
																	}
																>
																	Female
																</option>
															</InputSelect>
														</div>
														<div className='w-full'>
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
														</div>
														<div className='w-full'>
															<InputDate
																id={`Employee_Child.${i}.child_birth_date`}
																label='Birthdate'
																value={
																	values.Employee_Child[i].child_birth_date ===
																	null
																		? null
																		: values.Employee_Child[i].child_birth_date
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
													</Section>
													{i === values.Employee_Child.length - 1 ? (
														<a
															className='inline-flex text-green-500 mr-6 cursor-pointer'
															onClick={() => {
																arrayChild.push({
																	id: "",
																	employeeId: dataEmploye.id,
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
																res.id !== ""
																	? deleteEmployeChild(res.id)
																	: null;
																arrayChild.remove(i);
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
												"Edit Child"
											)}
										</button>
									</div>
								</div>
							</Form>
						)}
					</Formik>
				</>
			) : (
				<div>
					<p className='hidden'>{JSON.stringify(dataCerti)}</p>
					<Formik
						initialValues={{ ...dataCerti }}
						// validationSchema={eduSchema}
						onSubmit={(values) => {
							editEmployeCertificate(values);
						}}
						enableReinitialize
						key={2}
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
										render={(arrayCerti) =>
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
															{res.certificate_img !== null &&
															res.certificate_img.includes(
																"https://res.cloudinary.com/"
															) ? (
																<div>
																	<label className='block mb-2 text-sm font-medium text-gray-900'>
																		Certificate Image
																	</label>
																	<div className='flex'>
																		<a
																			href={res.certificate_img}
																			target='_blank'
																			className='justify-center rounded-full border border-transparent bg-green-500 px-4 py-1 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mt-2 mr-2'
																		>
																			Show File
																		</a>
																		<p
																			className='justify-center rounded-full border border-transparent bg-orange-500 px-4 py-1 text-sm font-medium text-white hover:bg-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mt-2 cursor-pointer'
																			onClick={() =>
																				showUpload(
																					`Certificate_Employee.${i}.certificate_img`
																				)
																			}
																		>
																			Change File
																		</p>
																		<input
																			id={`Certificate_Employee.${i}.certificate_img`}
																			name={`Certificate_Employee.${i}.certificate_img`}
																			placeholder='Certificate Image'
																			type='file'
																			ref={hiddenFileInput}
																			className='hidden'
																			onChange={() =>
																				setFieldValue(
																					`Certificate_Employee.${i}.action`,
																					`upload.${i}`
																				)
																			}
																		/>
																	</div>
																</div>
															) : (
																<Input
																	id={`Certificate_Employee.${i}.certificate_img`}
																	name={`Certificate_Employee.${i}.certificate_img`}
																	placeholder='Certificate Image'
																	label='Certificate Image'
																	type='file'
																	onChange={() =>
																		setFieldValue(
																			`Certificate_Employee.${i}.action`,
																			`upload.${i}`
																		)
																	}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															)}
														</div>
													</Section>
													{i === values.Certificate_Employee.length - 1 ? (
														<a
															className='inline-flex text-green-500 mr-6 cursor-pointer'
															onClick={() => {
																arrayCerti.push({
																	id: "",
																	employeeId: dataEmploye.id,
																	certificate_name: null,
																	certificate_img: null,
																	end_date: null,
																	action: "not upload",
																});
															}}
														>
															<Plus size={18} className='mr-1 mt-1' /> Add
															Certificate
														</a>
													) : null}
													{values.Certificate_Employee.length !== 1 ? (
														<a
															className='inline-flex text-red-500 cursor-pointer mt-1'
															onClick={() => {
																res.id !== ""
																	? deleteEmployeCertificate(res.id)
																	: null;
																arrayCerti.remove(i);
															}}
														>
															<Trash2 size={18} className='mr-1 mt-1' /> Remove
															Certificate
														</a>
													) : null}
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
												"Edit Certificate"
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
