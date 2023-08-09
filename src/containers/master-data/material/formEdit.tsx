import { useEffect, useState } from "react";
import { Section, Input, InputSelect } from "../../../components";
import { Formik, Form } from "formik";
import { materialSchema } from "../../../schema/master-data/material/materialSchema";
import { GetAllMaterialType, EditMaterial } from "../../../services";
import { toast } from "react-toastify";

interface data {
	material_name: string;
	kd_group: string;
	satuan: string;
	detail: string;
}

interface props {
	content: string;
	dataSelected: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const FormEditMaterial = ({
	content,
	showModal,
	dataSelected,
}: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listMaterialType, setListMaterialType] = useState<any>([]);
	const [data, setData] = useState<data>({
		material_name: "",
		kd_group: "",
		satuan: "",
		detail: "",
	});

	useEffect(() => {
		getMaterialType();
        settingData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		setData({
			material_name: dataSelected.material_name,
			kd_group: dataSelected.kd_group,
			satuan: dataSelected.satuan,
			detail: dataSelected.detail,
		});
	};

	const getMaterialType = async () => {
		try {
			const response = await GetAllMaterialType();
			if (response.data) {
				setListMaterialType(response.data.result);
			}
		} catch (error: any) {
			setListMaterialType([]);
		}
	};

	const editMaterial = async (data: any) => {
		setIsLoading(true);
		try {
			const response = await EditMaterial(data, dataSelected.id);
			if (response) {
				toast.success("Edit Material Success", {
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
			toast.error("Edit Material Failed", {
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
			<Formik
				initialValues={{ ...data }}
				validationSchema={materialSchema}
				onSubmit={(values) => {
					editMaterial(values);
				}}
				enableReinitialize
			>
				{({ handleChange, handleSubmit, errors, touched, values }) => (
					<Form>
						<h1 className='text-xl font-bold'>Material</h1>
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='material_name'
									name='material_name'
									placeholder='Material Name'
									label='Material Name'
									type='text'
									value={values.material_name}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{errors.material_name && touched.material_name ? (
									<span className='text-red-500 text-xs'>
										{errors.material_name}
									</span>
								) : null}
							</div>
							<div className='w-full'>
								<InputSelect
									id='kd_group'
									name='kd_group'
									placeholder='Material Type'
									label='Material Type'
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option defaultValue='' selected>
										Choose a Material type
									</option>
									{listMaterialType.length === 0 ? (
										<option value='no data'>No data</option>
									) : (
										listMaterialType.map((res: any, i: number) => {
											return (
												<option value={res.id} selected={ res.id === dataSelected.kd_group } key={i}>{res.material_name}</option>
											);
										})
									)}
								</InputSelect>
								{errors.kd_group && touched.kd_group ? (
									<span className='text-red-500 text-xs'>
										{errors.kd_group}
									</span>
								) : null}
							</div>
							<div className='w-full'>
								<Input
									id='satuan'
									name='satuan'
									type='text'
									placeholder='Satuan'
									label='Satuan'
									value={values.satuan}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{errors.satuan && touched.satuan ? (
									<span className='text-red-500 text-xs'>{errors.satuan}</span>
								) : null}
							</div>
							<div className='w-full'>
								<Input
									id='detail'
									name='detail'
									type='text'
									placeholder='Detail'
									label='Detail'
									value={values.detail}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{errors.detail && touched.detail ? (
									<span className='text-red-500 text-xs'>{errors.detail}</span>
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
