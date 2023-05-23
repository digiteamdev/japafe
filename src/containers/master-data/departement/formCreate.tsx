import { useEffect, useState } from "react";
import { Section, Input } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { departemenSchema } from "../../../schema/master-data/departement/departementSchema";
import { AddDepartement, EditDepartement } from "../../../services/master-data";
import { Plus, Trash2 } from "react-feather";
import { toast } from "react-toastify";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	id: string;
	name: string;
	sub_depart: [
		{
			id: string
			id_depart: string
			name: string
		}
	]
}

export const FormCreateDepartement = ({
	dataSelected,
	content,
	showModal,
}: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [data, setData] = useState<data>({ 
		id: "",
		name: "",
		sub_depart: [
			{
				id: "",
				id_depart: "",
				name: ""
			}
		]
	});

	useEffect(() => {
		if(dataSelected){
			settingData()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		let sub_depart: any = [];
		
		dataSelected.sub_depart.map((res: any) => {
			sub_depart.push({
				id: res.id,
				id_depart: dataSelected.id,
				name: res.name
			});
		});
		setData({
			id: dataSelected.id,
			name: dataSelected.name,
			sub_depart
		});
	};

	const addDepartemen = async (data: { name: string }) => {
		setIsLoading(true);
		try {
			const response = await AddDepartement(data);
			if (response) {
				toast.success("Add Departement Success", {
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
				showModal(false, content, true);
			}
		} catch (error) {
			toast.error("Add Departement Failed", {
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

	const editDepartemen = async (data: { name: string }) => {
		setIsLoading(true);
		try {
			const response = await EditDepartement(data, dataSelected.id);
			if (response) {
				toast.success("Edit Departement Success", {
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
				showModal(false, content, true);
			}
		} catch (error) {
			toast.error("Edit Departement Failed", {
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
				validationSchema={departemenSchema}
				onSubmit={(values) => {
					content === "add" ? addDepartemen(values) : editDepartemen(values);
				}}
				enableReinitialize
			>
				{({ handleChange, handleSubmit, errors, touched, values }) => (
					<Form>
						<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<Input
								id='name'
								name='name'
								placeholder='Departement Name'
								label='Departement Name'
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
						</Section>
						<FieldArray
							name='sub_depart'
							render={(arraySub) =>
								values.sub_depart.map((res, i) => (
									<div key={i}>
										<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2 divide-y'>
											<Input
												id={`sub_depart.${i}.name`}
												name={`sub_depart.${i}.name`}
												placeholder='Sub Departemen Name'
												label='Sub Departemen Name'
												type='text'
												value={res.name}
												onChange={handleChange}
												required={false}
												withLabel={true}
												className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
											/>
										</Section>
										{i === values.sub_depart.length - 1 ? (
											<a
												className='inline-flex text-green-500 mr-6 cursor-pointer'
												onClick={() => {
													arraySub.push({
														name: null
													});
												}}
											>
												<Plus size={18} className='mr-1 mt-1' /> Add Sub Departemen
											</a>
										) : null}
										{values.sub_depart.length !== 1 ? (
											<a
												className='inline-flex text-red-500 cursor-pointer mt-1'
												onClick={() => {
													arraySub.remove(i);
												}}
											>
												<Trash2 size={18} className='mr-1 mt-1' /> Remove Sub Departemen
											</a>
										) : null}
									</div>
								))
							}
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
