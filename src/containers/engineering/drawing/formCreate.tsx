import { useState, useEffect } from "react";
import { Section, Input, InputSelect, InputDate } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { sumarySchema } from "../../../schema/engineering/sumary-report/SumarySchema";
import {
	GetAllWorValid,
	GetSchedulleDrawing,
	AddDrawing,
} from "../../../services";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "react-feather";
import moment from "moment";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	date_drawing: any;
	timeschId: string;
	id_drawing: string;
	file: [
		{
			file_upload: string;
		}
	];
}

export const FormCreateDrawing = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listWor, setListWor] = useState<any>([]);
	const [customerName, setCustomerName] = useState<string>("");
	const [dateWor, setDateWor] = useState<string>("");
	const [subject, setSubject] = useState<string>("");
	const [data, setData] = useState<data>({
		date_drawing: new Date(),
		timeschId: "",
		id_drawing: "",
		file: [
			{
				file_upload: ""
			}
		]
	});

	useEffect(() => {
		getWor();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		var year = dateObj.getUTCFullYear();
		const id =
			"DRW" +
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 100) +
			1;
		return id;
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name === "timeschId") {
			if (event.target.value !== "Choose Job Number WOR") {
				let data = JSON.parse(event.target.value);
				setCustomerName(data.wor.customerPo.quotations.Customer.name);
				setDateWor(moment(data.wor.date_wor).format("DD-MM-YYYY"));
				setSubject(data.wor.subject);
			} else {
				setCustomerName("");
				setDateWor("");
				setSubject("");
			}
		}
	};

	const getWor = async () => {
		try {
			const response = await GetSchedulleDrawing();
			if (response.data) {
				setListWor(response.data.result);
			}
		} catch (error) {
			setListWor([]);
		}
	};

	const addDrawing = async (payload: data) => {
		setIsLoading(true);
		const formData = new FormData();
		formData.append("id_drawing", generateIdNum());
		formData.append("timeschId", payload.timeschId);
		formData.append("date_drawing", payload.date_drawing);
		formData.append("file_lenght", payload.file.length.toString());
		payload.file.map( (res: any, i: number) => {
			formData.append("file_upload", res.file_upload);
		})
		try {
			const response = await AddDrawing(formData);
			if (response.data) {
				toast.success("Add Drawing Success", {
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
			toast.error("Add Drawing Failed", {
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
				// validationSchema={sumarySchema}
				onSubmit={(values) => {
					addDrawing(values);
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
						<h1 className='text-xl font-bold mt-3'>Drawing</h1>
						<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputDate
									id='date_drawing'
									label='Date Drawing'
									value={
										values.date_drawing === null
											? new Date()
											: values.date_drawing
									}
									onChange={(value: any) =>
										setFieldValue("date_drawing", value)
									}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								<InputSelect
									id='timeschId'
									name='timeschId'
									placeholder='Job Number'
									label='Job Number'
									onChange={(event: any) => {
										if (event.target.value !== "Choose Job Number WOR") {
											let data = JSON.parse(event.target.value);
											setFieldValue("timeschId", data.id);
										}
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option defaultValue='' selected>
										Choose Job Number WOR
									</option>
									{listWor.length === 0 ? (
										<option value=''>No Data WOR</option>
									) : (
										listWor.map((res: any, i: number) => {
											return (
												<option value={JSON.stringify(res)} key={i}>
													{res.wor.job_no}
												</option>
											);
										})
									)}
								</InputSelect>
							</div>
							<div className='w-full'>
								<Input
									id='date_wor'
									name='date_wor'
									placeholder='Date Of WOR'
									label='Date Of WOR'
									type='text'
									value={dateWor}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='customer'
									name='customer'
									placeholder='Customer Name'
									label='Customer'
									type='text'
									value={customerName}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='customer'
									name='customer'
									placeholder='Subject'
									label='Subject'
									type='text'
									value={subject}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='jobDesk'
									name='jobDesk'
									placeholder='Job Description'
									label='Job Description'
									type='text'
									value={subject}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<FieldArray 
							name="file"
							render={(arrayFile) => (
								<>
									{
										values.file.map( (res: any, i: number) => (
											<Section key={i} className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
												<div className='flex w-full'>
													<div className='w-[75%]'>
														<Input
															id={`file.${i}.file_upload`}
															name={`file.${i}.file_upload`}
															placeholder='File'
															label='File'
															type='file'
															onChange={(value: any) =>
																setFieldValue(`file.${i}.file_upload`, value.target.files[0])
															}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='flex w-[25%]'>
														{ i === values.file.length - 1 ? (
															<a
																className='inline-flex text-green-500 pt-12 pl-4 cursor-pointer'
																onClick={() => {
																	arrayFile.push({
																		file_upload: ""
																	});
																}}
															>
																<Plus size={18} className='mr-1 mt-1' /> Add File
															</a>
														) : null }
														{
															values.file.length !== 1 ? (
																<a
																	className='inline-flex text-red-500 cursor-pointer pt-12 pl-4'
																	onClick={() => {
																		arrayFile.remove(i);
																	}}
																>
																	<Trash2 size={18} className='mr-1 mt-1' /> Remove File
																</a>
															) : null
														}
													</div>
												</div>
											</Section>
										))
									}
								</>
							)}
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
									) : "Save" }
								</button>
							</div>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};
