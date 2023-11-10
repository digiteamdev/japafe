import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelectSearch,
	InputDate,
	InputSelect,
} from "../../../components";
import { Formik, Form } from "formik";
import { activitySchema } from "../../../schema/master-data/activity/activitySchema";
import { GetPurchaseReceive } from "../../../services";
import { toast } from "react-toastify";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	name: string;
}

export const FormCreateKontraBon = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [data, setData] = useState<data>({
		name: "",
	});

	useEffect(() => {
		getPurchase();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getPurchase = async () => {
		setIsLoading(true);
		try {
			const response = await GetPurchaseReceive();
			if (response.data) {
				console.log(response.data);
			}
		} catch (error: any) {
			// setData([]);
		}
		setIsLoading(false);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<Formik
				initialValues={data}
				validationSchema={activitySchema}
				onSubmit={(values) => {
					console.log(values);
				}}
				enableReinitialize
			>
				{({ handleChange, handleSubmit, errors, touched, values }) => (
					<Form>
						<Section className='grid md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='name'
									name='name'
									placeholder='Id'
									label='Id'
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
							</div>
							<div className='w-full'>
								<Input
									id='name'
									name='name'
									placeholder='Date'
									label='Date'
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
							</div>
							<div className='w-full'>
								<InputSelectSearch
									datas={[]}
									id='job_no'
									name='job_no'
									placeholder='Job No'
									label='Job No'
									onChange={(e: any) => {
										// getCity(e.value);
										// setFieldValue("province", e.value);
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='suplier'
									name='suplier'
									placeholder='Suplier/Vendor'
									label='Suplier/Vendor'
									type='text'
									required={true}
									disabled={isLoading}
									withLabel={true}
									value={values.name}
									onChange={handleChange}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='invoice'
									name='invoice'
									placeholder='Invoice Number'
									label='Invoice Number'
									type='text'
									required={true}
									disabled={isLoading}
									withLabel={true}
									value={values.name}
									onChange={handleChange}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='do'
									name='do'
									placeholder='DO'
									label='DO'
									type='text'
									required={true}
									disabled={isLoading}
									withLabel={true}
									value={values.name}
									onChange={handleChange}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='term'
									name='term'
									placeholder='Term Of Condition'
									label='Term Of Condition'
									type='text'
									required={true}
									disabled={isLoading}
									withLabel={true}
									value={values.name}
									onChange={handleChange}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='bill'
									name='bill'
									placeholder='Bill Amount'
									label='Bill Amount'
									type='text'
									required={true}
									disabled={isLoading}
									withLabel={true}
									value={values.name}
									onChange={handleChange}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='discount'
									name='discount'
									placeholder='Discount'
									label='Discount'
									type='text'
									required={true}
									disabled={isLoading}
									withLabel={true}
									value={values.name}
									onChange={handleChange}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='PPN'
									name='PPN'
									placeholder='PPN'
									label='PPN'
									type='text'
									required={true}
									disabled={isLoading}
									withLabel={true}
									value={values.name}
									onChange={handleChange}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='PPH'
									name='PPH'
									placeholder='PPH'
									label='PPH'
									type='text'
									required={true}
									disabled={isLoading}
									withLabel={true}
									value={values.name}
									onChange={handleChange}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='Installment'
									name='Installment'
									placeholder='Installment'
									label='Installment'
									type='text'
									required={true}
									disabled={isLoading}
									withLabel={true}
									value={values.name}
									onChange={handleChange}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='cash ADV'
									name='cash ADV'
									placeholder='Cash ADV'
									label='Cash ADV'
									type='text'
									required={true}
									disabled={isLoading}
									withLabel={true}
									value={values.name}
									onChange={handleChange}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputDate
									id='payDate'
									label='PayDate'
									value={new Date()}
									// onChange={(value: any) => setFieldValue("birth_date", value)}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								<InputSelect
									id='tax'
									name='tax'
									placeholder='Pay Tax'
									label='Pay Tax'
									// value={values.gender}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option defaultValue='yes' selected>
										Pay With Tax
									</option>
									<option value='no'>Pay No Tax</option>
								</InputSelect>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='bankName'
									name='bankName'
									placeholder='Bank Name'
									label='Bank Name'
									type='text'
									required={true}
									disabled={isLoading}
									withLabel={true}
									value={values.name}
									onChange={handleChange}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='accName'
									name='accName'
									placeholder='Account Name'
									label='Account Name'
									type='text'
									required={true}
									disabled={isLoading}
									withLabel={true}
									value={values.name}
									onChange={handleChange}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='accNumber'
									name='accNumber'
									placeholder='Account Number'
									label='Account Number'
									type='text'
									required={true}
									disabled={isLoading}
									withLabel={true}
									value={values.name}
									onChange={handleChange}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputSelectSearch
									datas={[]}
									id='acc'
									name='acc'
									placeholder='Acc Name'
									label='Acc Name'
									onChange={(e: any) => {
										// getCity(e.value);
										// setFieldValue("province", e.value);
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='totalAmount'
									name='totalAmount'
									placeholder='Total Amount'
									label='Total Amount'
									type='text'
									required={true}
									disabled={isLoading}
									withLabel={true}
									value={values.name}
									onChange={handleChange}
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
