import { useState } from "react";
import { useRouter } from "next/router";
import Logo from "../../assets/logo/logo.png";
import Image from "next/image";
import { Formik, Form } from "formik";
import { loginSchema } from "../../schema/auth/loginSchema";
import { Input, InputWithIcon, Button } from "../../components";
import { Login } from '../../services';
import { Eye, EyeOff } from "react-feather";
import { token } from '../../configs/session';

export const CardLogin = () => {

	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [typePassword, setTypePassword] = useState<string>("password");

	const showPassword = () => {
		if (typePassword === "password") {
			setTypePassword("text");
		} else {
			setTypePassword("password");
		}
	};

	const login = async (val: any) => {
		setIsLoading(true);
		try {
			const response = await Login(val);
			if (response.data) {
				token(response.data.result)
				router.push('/dashboard')
			}
		} catch (error) {
			setIsError(true);
		}
		setIsLoading(false)
	};

	return (
		<div className='rounded-lg bg-white p-6 w-96'>
			<div className='w-full justify-center flex p-3'>
				<Image className='w-[70%] h-[60%] mr-2 mb-2' src={Logo} alt='logo' />
			</div>

			<Formik
				initialValues={{
					username: "",
					hashed_password: "",
				}}
				validationSchema={loginSchema}
				onSubmit={(values) => {
					login(values);
				}}
			>
				{({ handleChange, handleSubmit, errors, touched, values }) => (
					<Form>
						{isError ? (
							<span className='text-red-500 text-lg'>Username atau password salah</span>
						) : null}

						<div className='relative mt-2'>
							<Input
								disabled={ isLoading ? true : false }
								type='text'
								name='username'
								id='username'
								placeholder='Username'
								withLabel={true}
								label='Username'
								value={values.username}
								onChange={handleChange}
								className={`${
									errors.username && touched.username
										? "bg-white border border-red-500 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-red-600"
										: "bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600"
								}`}
								max=''
							/>
						</div>
						{errors.username && touched.username ? (
							<span className='text-red-500 text-xs'>{errors.username}</span>
						) : null}

						<div className='relative mt-2'>
							<InputWithIcon
								disabled={ isLoading ? true : false }
								type={typePassword}
								name='hashed_password'
								id='password'
								placeholder='Password'
								withLabel={true}
								label='Password'
								value={values.hashed_password}
								onChange={handleChange}
								className={`${
									errors.hashed_password && touched.hashed_password
										? "bg-white border border-red-500 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pr-11 outline-red-600"
										: "bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pr-11 outline-primary-600"
								}`}
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
							<span className='text-red-500 text-xs'>{errors.hashed_password}</span>
						) : null}

						<div className='mt-8 mb-3'>
							<Button
								onClick={() => handleSubmit()}
								disabled={isLoading}
								className={`w-full bg-red-500 py-2 rounded text-white font-semibold hover:bg-red-600 ${
									isLoading && "bg-red-600"
								}`}
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
									"Login"
								)}
							</Button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};
