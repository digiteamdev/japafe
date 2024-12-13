import { useState } from "react";
import { Section, Input, InputArea } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { warehouseSchema } from "../../../schema/purchasing-logistic/warehouse/warehouseSchema";
import { AddMaterials } from "../../../services";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "react-feather";

interface data {
	name: string;
	satuan: string;
	Material_Master: [
		{
			name: string;
			satuan: string;
			jumlah_Stock: number;
		}
	];
}

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const FormCreateWarehouse = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [data, setData] = useState<data>({
		name: "",
		satuan: "",
		Material_Master: [
			{
				name: "",
				satuan: "",
				jumlah_Stock: 0,
			},
		],
	});

	const addMaterial = async (data: any) => {
		setIsLoading(true);
		// let dataBody: any = {
		// 	name: data.name,
		// 	spesifikasi: data.spesifikasi,
		// 	satuan: data.satuan,
		// 	jumlah_Stock: parseInt(data.jumlah_stock.toString().replaceAll(".", "")),
		// 	harga: parseInt(data.harga.toString().replaceAll(".", "")),
		// 	note: data.note,
		// 	date_in: new Date(),
		// 	date_out: null,
		// };
		try {
			const response = await AddMaterials(data);
			if (response.data) {
				toast.success("Add Material Success", {
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
			toast.error("Add Material Failed", {
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
				validationSchema={warehouseSchema}
				onSubmit={(values) => {
					addMaterial(values);
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
						<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='name'
									name='name'
									placeholder='Name'
									label='Name'
									type='text'
									value={values.name}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{errors.name && touched.name ? (
									<span className='text-red-500 text-xs'>{errors.name}</span>
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
						</Section>
						<FieldArray
							name='Material_Master'
							render={(arrayMaterial) =>
								values?.Material_Master?.map((res: any, i: number) => {
									return (
										<Section
											className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'
											key={i}
										>
											<Input
												id={`Material_Master.${i}.name`}
												name={`Material_Master.${i}.name`}
												type='text'
												placeholder='Name spesification'
												label='Name spesification'
												value={res.name}
												onChange={(e: any) => {
													setFieldValue(
														`Material_Master.${i}.name`,
														e.target.value
													);
												}}
												required={true}
												withLabel={true}
												className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
											/>
											<Input
												id={`Material_Master.${i}.jumlah_Stock`}
												name={`Material_Master.${i}.jumlah_Stock`}
												type='number'
												placeholder='Stock'
												label='Stock'
												value={res.jumlah_Stock}
												onChange={(e: any) => {
													setFieldValue(
														`Material_Master.${i}.jumlah_Stock`,
														parseInt(e.target.value)
													);
												}}
												required={true}
												withLabel={true}
												className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
											/>
											<div className='flex w-full mt-8'>
												{i + 1 === values.Material_Master.length ? (
													<a
														className='flex mt-2 text-[20px] text-blue-600 cursor-pointer hover:text-blue-400'
														onClick={() =>
															arrayMaterial.push({
																name: "",
																satuan: "",
																jumlah_Stock: 0,
															})
														}
													>
														<Plus size={23} className='mt-1' />
														Add
													</a>
												) : null}
												{i === 0 && values.Material_Master.length === 1 ? null : (
													<a
														className='flex ml-4 mt-2 text-[20px] text-red-600 w-full hover:text-red-400 cursor-pointer'
														onClick={() => arrayMaterial.remove(i)}
													>
														<Trash2 size={22} className='mt-1 mr-1' />
														Remove
													</a>
												)}
											</div>
										</Section>
									);
								})
							}
						/>
						{/* <Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='jumlah_stock'
									name='jumlah_stock'
									type='text'
									pattern='\d*'
									placeholder='Stock'
									label='Stock'
									value={formatRupiah(values.jumlah_stock.toString())}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{errors.jumlah_stock && touched.jumlah_stock ? (
									<span className='text-red-500 text-xs'>
										{errors.jumlah_stock}
									</span>
								) : null}
							</div>
							<div className='w-full'>
								<Input
									id='harga'
									name='harga'
									type='text'
									placeholder='Price'
									label='Price'
									pattern='\d*'
									value={formatRupiah(values.harga.toString())}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{errors.harga && touched.harga ? (
									<span className='text-red-500 text-xs'>{errors.harga}</span>
								) : null}
							</div>
							<div className='w-full'>
								<InputArea
									id='note'
									name='note'
									placeholder='Note'
									label='Note'
									type='text'
									value={values.note}
									onChange={handleChange}
									disabled={false}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{errors.note && touched.note ? (
									<span className='text-red-500 text-xs'>{errors.note}</span>
								) : null}
							</div>
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
