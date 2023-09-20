import { useState } from "react";
import { Section, Input, InputSelect } from "../../components";
import { Formik, Form, FieldArray } from "formik";
import { changePasswordSchema } from "../../schema/user/changePasswordSchema";
import { EditPassword } from "../../services";
import { Plus, Trash2 } from "react-feather";
import { toast } from "react-toastify";

interface props {
    id: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	id: string;
	hashed_password: string;
	passwordnew: string;
	passwordnew2: string;
}

export const FormChangePassword = ({ id,showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [data, setData] = useState<data>({
		id: "",
		hashed_password: "",
		passwordnew: "",
		passwordnew2: "",
	});

	const editPassword = async (payload: any) => {
		setIsLoading(true);
        if( payload.passwordnew === payload.passwordnew2 ){

            let data = {
                id: id,
                hashed_password: payload.hashed_password,
                passwordnew: payload.passwordnew,
            };
            try {
                const response = await EditPassword(data);
                if (response) {
                    toast.success("Edit Password Success", {
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
                    showModal(false, "view", true);
                }
            } catch (error) {
                toast.error("Edit Password Failed", {
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
        }else{
            toast.warning("new password and repeat new password are not the same", {
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

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<Formik
				initialValues={data}
				validationSchema={changePasswordSchema}
				onSubmit={(values) => {
					editPassword(values);
				}}
				enableReinitialize
			>
				{({ handleChange, handleSubmit, errors, touched, values }) => (
					<Form>
						<div className='w-full'>
							<Section className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2'>
								<div className='w-full'>
									<Input
										id='oldPassword'
										name='hashed_password'
										placeholder='Old Password'
										label='Old Password'
										type='password'
										required={true}
										disabled={isLoading}
										withLabel={true}
										value={values.hashed_password}
										onChange={handleChange}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
									{errors.hashed_password && touched.hashed_password ? (
										<span className='text-red-500 text-xs'>
											{errors.hashed_password}
										</span>
									) : null}
								</div>
								<div className='w-full'>
									<Input
										id='newPassword'
										name='passwordnew'
										placeholder='New Password'
										label='New Password'
										type='password'
										required={true}
										disabled={isLoading}
										withLabel={true}
										value={values.passwordnew}
										onChange={handleChange}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
									{errors.passwordnew && touched.passwordnew ? (
										<span className='text-red-500 text-xs'>
											{errors.passwordnew}
										</span>
									) : null}
								</div>
								<div className='w-full'>
									<Input
										id='passwordnew2'
										name='passwordnew2'
										placeholder='Repeat New Password'
										label='Repeat New Password'
										type='password'
										required={true}
										disabled={isLoading}
										withLabel={true}
										value={values.passwordnew2}
										onChange={handleChange}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
							</Section>
						</div>
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
