import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelectSearch,
	InputDate,
} from "../../../components";
import { Formik, Form } from "formik";
import { permitSchema } from "../../../schema/public/permit/permitSchema";
import {
	GetEmployeById,
	GetPermit,
	AddPermitEmployee,
	GetEmployeeById
} from "../../../services";
import { Plus, Trash2 } from "react-feather";
import { toast } from "react-toastify";
import moment from "moment";
import { getGender, getIdUser } from "../../../configs/session";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	type_permitId: string;
	desc: string;
	date: any;
	upload: any;
}

export const FormCreatePermitEmployee = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listPermit, setListPermit] = useState<any>([]);
	const [data, setData] = useState<data>({
		type_permitId: "",
		desc: "",
		date: new Date(),
		upload: null,
	});

	useEffect(() => {
		getPermit();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getPermit = async () => {
		try {
			const response = await GetPermit(undefined, undefined, "");
			if (response) {
                let genderEmployee: any = getGender();
				let dataListPermit: any = [];
				response.data.result.map((res: any) => {
					if(res.gender === 'All' || res.gender === genderEmployee){
						dataListPermit.push({
							label: res.name_permit,
							value: res,
						});
					}
				});
				setListPermit(dataListPermit);
			}
		} catch (error) {
			setListPermit([]);
		}
	};

    const addPermit = async (payload:any) => {
        setIsLoading(true)
        const formData = new FormData();
		formData.append("type_permitId", payload.type_permitId);
        formData.append("desc", payload.desc);
        formData.append("date", payload.date);
        formData.append("upload", payload.upload);
        try {
            const response = await AddPermitEmployee(formData);
			if (response.data) {
				toast.success("Add Permit Success", {
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
            toast.error("Add Permit Failed", {
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
    };

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			<Formik
				initialValues={{ ...data }}
				validationSchema={permitSchema}
				onSubmit={(values) => {
					addPermit(values);
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
					<Form>
						<h1 className='text-xl font-bold mt-3'>Permit</h1>
						<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputDate
									id='date'
									label='Date'
									value={values.date}
									onChange={(value: any) => setFieldValue("date", value)}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								<InputSelectSearch
									datas={listPermit}
									id='permit'
									name='permit'
									placeholder='Permit'
									label='Permit'
									onChange={(e: any) => {
										setFieldValue("type_permitId", e.value.id);
										setFieldValue("desc", e.value.name_permit);
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
								{touched.type_permitId && errors.type_permitId && (
									<span className='mt-2 text-xs text-red-500 font-semibold'>
										{errors.type_permitId}
									</span>
								)}
							</div>
							<div className='w-full'>
								<Input
									id='upload'
									name='upload'
									placeholder='File'
									label='File'
									type='file'
									accept='image/*, .pdf'
									onChange={(e: any) =>
										setFieldValue("upload", e.target.files[0])
									}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
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
									) : (
										"Save"
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
