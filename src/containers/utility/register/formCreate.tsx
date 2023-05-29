import { useEffect, useState } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputWithIcon,
	MultipleSelect,
} from "../../../components";
import { Formik, Form } from "formik";
import { registerSchema } from "../../../schema/utility/register/registerSchema";
import { GetAllEmploye, GetRole, AddUser } from "../../../services";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "react-feather";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	employeeId: string;
	username: string;
	hashed_password: string;
	confirm_password: string;
}

export const FormCreateUser = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [data, setData] = useState<data>({
		employeeId: '',
		username: "",
		hashed_password: "",
		confirm_password: "",
	});
    const [employeID, setEmployeId] = useState<string>('');
	const [userRole, setUserRole] = useState<any>([]);
	const [dataEmploye, setDataEmploye] = useState<any>([]);
	const [dataRole, setDataRole] = useState<any>([]);
	const [departement, setDepartement] = useState<string>("");
	const [typePassword, setTypePassword] = useState<string>("password");
	const [typeConfirmPassword, setTypeConfirmPassword] =
		useState<string>("password");

	useEffect(() => {
		getEmploye();
		getRole();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const showPassword = () => {
		if (typePassword === "password") {
			setTypePassword("text");
		} else {
			setTypePassword("password");
		}
	};

	const showConfirmPassword = () => {
		if (typeConfirmPassword === "password") {
			setTypeConfirmPassword("text");
		} else {
			setTypeConfirmPassword("password");
		}
	};

	const getEmploye = async () => {
		try {
			const response = await GetAllEmploye();
			if (response.data) {
				setDataEmploye(response.data.result);
			}
		} catch (error) {
			setDataEmploye([]);
		}
	};

	const getRole = async () => {
		try {
			const response = await GetRole();
			if (response.data) {
				setDataRole(response.data.result);
			}
		} catch (error) {
			setDataRole([]);
		}
	};

    const addUser = async (payload: any) => {
        setIsLoading(true)
        let role: any = []
        userRole.map( (item: any) => {
            role.push({roleId : item.id})
        })
        let dataPayload = {
            username: payload.username,
            hashed_password: payload.hashed_password,
            employeeId: employeID,
            userRole: role
        }
        try{
            const response = await AddUser(dataPayload);
			if (response.data) {
                toast.success("Add User Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
                showModal(false, "add", true);
			}
		} catch (error) {
			toast.error("Add User Failed", {
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
        setIsLoading(false)
    }

	const handleOnChanges = (event: any) => {
		if (event.target.name === "employeeId") {
			if (event.target.value !== "Choose a employe") {
                let employe = JSON.parse(event.target.value)
				setDepartement(employe.sub_depart.name);
                setEmployeId(employe.id)
			} else {
				setDepartement("");
                setEmployeId("");
			}
		}
	};

	const onSelect = (value: any) => {
		setUserRole(value);
	};

	const onRemove = (value: any) => {
		setUserRole(value);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<Formik
				initialValues={{ ...data }}
				validationSchema={registerSchema}
				onSubmit={(values) => {
					addUser(values);
				}}
				enableReinitialize
			>
				{({ handleChange, handleSubmit, errors, touched, values }) => (
					<Form onChange={handleOnChanges}>
						<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputSelect
									id='employe'
									name='employeeId'
									placeholder='Full Name'
									label='Full Name'
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option defaultValue='' selected>
										Choose a employe
									</option>
									{dataEmploye.map((res: any, i: number) => {
										return (
											<option value={JSON.stringify(res)} key={i}>
												{res.employee_name}
											</option>
										);
									})}
								</InputSelect>
								{errors.employeeId && touched.employeeId ? (
									<span className='text-red-500 text-xs'>{errors.employeeId}</span>
								) : null}
							</div>
							<div className='w-full'>
								<Input
									id='departement'
									placeholder='Departement'
									label='Departement'
									type='text'
									value={departement}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='username'
									placeholder='Username'
									label='Username'
									type='text'
									value={values.username}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{errors.username && touched.username ? (
									<span className='text-red-500 text-xs'>
										{errors.username}
									</span>
								) : null}
							</div>
							<div className='w-full'>
								<MultipleSelect
									label='Access Right'
									listdata={dataRole}
									placeholder='Choose Access Right'
									selectedValue={userRole}
									onSelect={onSelect}
									onRemove={onRemove}
									displayValue="role_name"
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<div className='relative mt-2'>
									<InputWithIcon
										disabled={isLoading ? true : false}
										type={typePassword}
										name='hashed_password'
										id='password'
										placeholder='Password'
										withLabel={true}
										label='Password'
										value={values.hashed_password}
										onChange={handleChange}
										className={`bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pr-11 outline-primary-600`}
										classNameIcon='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer'
										max=''
										icon={
											typePassword === "password" ? (
												<Eye color='gray' size={28} />
											) : (
												<EyeOff color='gray' size={28} />
											)
										}
										onAction={showPassword}
									/>
								</div>
								{errors.hashed_password && touched.hashed_password ? (
									<span className='text-red-500 text-xs'>
										{errors.hashed_password}
									</span>
								) : null}
							</div>
							<div className='w-full'>
								<div className='relative mt-2'>
									<InputWithIcon
										disabled={isLoading ? true : false}
										type={typeConfirmPassword}
										name='confirm_password'
										id='confirm_password'
										placeholder='Confirm Password'
										withLabel={true}
										label='Confirm Password'
										value={values.confirm_password}
										onChange={handleChange}
										className={`bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pr-11 outline-primary-600`}
										classNameIcon='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer'
										max=''
										icon={
											typeConfirmPassword === "password" ? (
												<Eye color='gray' size={28} />
											) : (
												<EyeOff color='gray' size={28} />
											)
										}
										onAction={showConfirmPassword}
									/>
								</div>
								{errors.confirm_password && touched.confirm_password ? (
									<span className='text-red-500 text-xs'>
										{errors.confirm_password}
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
