import { useEffect, useState } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputDate,
	InputArea,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { sumarySchema } from "../../../schema/engineering/sumary-report/SumarySchema";
import moment from "moment";
import {
	GetAllWorValid,
	EditSummary,
	UploadImageSummary,
	EditSummaryDetail,
} from "../../../services";
import Image from "next/image";
import { Plus, Trash2 } from "react-feather";
import { toast } from "react-toastify";

interface props {
	content: string;
	dataSummary: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	job_no: string;
	date_of_summary: any;
	worId: string;
	quantity: string;
	ioem: string;
	isr: string;
	itn: string;
	introduction: string;
	inimg: any;
}

interface dataPart {
	srimgdetail: [
		{
			srId: string;
			id: string;
			name_part: string;
			qty: string;
			input_finding: string;
			choice: string;
			noted: string;
		}
	];
}

export const FormEditSummaryReport = ({
	content,
	dataSummary,
	showModal,
}: props) => {
	const dataTabs = ["Summary Report", "Detail Part"];
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isLoadingUpload, setIsLoadingUpload] = useState<boolean>(false);
	const [activeTabs, setActiveTabs] = useState<any>(dataTabs[0]);
	const [listWor, setListWor] = useState<any>([]);
	const [customerName, setCustomerName] = useState<string>("");
	const [dateWor, setDateWor] = useState<string>("");
	const [subject, setSubject] = useState<string>("");
	const [equipment, setEquipment] = useState<string>("");
	const [quantity, setQuantity] = useState<string>("");
	const [equipmentModel, setEquipmentModel] = useState<string>("");
	const [imgPreview, setImgPreview] = useState<string>("");
	const [part, setPart] = useState<any>([]);
	const [data, setData] = useState<data>({
		job_no: "",
		date_of_summary: new Date(),
		worId: "",
		quantity: "",
		ioem: "",
		isr: "",
		itn: "",
		introduction: "",
		inimg: "",
	});
	const [dataPart, setDataPart] = useState<dataPart>({
		srimgdetail: [
			{
				srId: "",
				id: "",
				name_part: "",
				qty: "",
				input_finding: "",
				choice: "",
				noted: "",
			},
		],
	});

	useEffect(() => {
		getWor();
		settingData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		let part: any = [];
		let detail: any = [];
		setData({
			job_no: dataSummary.job_no,
			date_of_summary: new Date(dataSummary.date_of_summary),
			worId: dataSummary.worId,
			quantity: dataSummary.wor.quantity,
			ioem: dataSummary.ioem,
			isr: dataSummary.isr,
			itn: dataSummary.itn,
			introduction: dataSummary.introduction,
			inimg: dataSummary.inimg,
		});
		setCustomerName(dataSummary.wor.customerPo.quotations.Customer.name);
		setDateWor(moment(dataSummary.wor.date_wor).format("DD-MM-YYYY"));
		setSubject(dataSummary.wor.subject);
		setEquipment(
			dataSummary.wor.customerPo.quotations.eqandpart[0].equipment.nama
		);
		setEquipmentModel(dataSummary.wor.eq_model);
		setQuantity(dataSummary.wor.qty);
		if (dataSummary.wor.customerPo.quotations.eqandpart.length > 0) {
			dataSummary.wor.customerPo.quotations.eqandpart.map((res: any) => {
				part.push(res.eq_part);
			});
		}
		setPart(part);
		if (dataSummary.srimgdetail.length > 0) {
			dataSummary.srimgdetail.map((res: any) => {
				detail.push({
					srId: dataSummary.id,
					id: res.id,
					name_part: res.name_part,
					qty: res.qty,
					input_finding: res.input_finding,
					choice: res.choice,
					noted: res.noted,
				});
			});
		}
		setDataPart({ srimgdetail: detail });
	};

	const showUpload = (id: any) => {
		const inputan = document.getElementById(id);
		inputan?.click();
	};

	const getWor = async () => {
		let wor: any = [];
		wor.push(dataSummary.wor);
		try {
			const response = await GetAllWorValid();
			if (response.data) {
				response.data.result.map((res: any) => {
					wor.push(res);
				});
			}
			setListWor(wor);
		} catch (error) {
			setListWor(wor);
		}
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name === "worId") {
			if (event.target.value !== "Choose Job Number WOR") {
				let data = JSON.parse(event.target.value);
				let part: any = [];
				setCustomerName(data.customerPo.quotations.Customer.name);
				setDateWor(moment(data.date_wor).format("DD-MM-YYYY"));
				setSubject(data.subject);
				setEquipment(data.customerPo.quotations.eqandpart[0].equipment.nama);
				setEquipmentModel(data.eq_model);
				if (data.customerPo.quotations.eqandpart.length > 0) {
					data.customerPo.quotations.eqandpart.map((res: any) => {
						part.push(res.eq_part);
					});
				}
				setQuantity(data.qty);
				setPart(part);
			} else {
				setCustomerName("");
				setDateWor("");
				setSubject("");
				setEquipment("");
				setEquipmentModel("");
				setQuantity("");
				setPart([]);
			}
		}
		if (event.target.name === "inimg") {
			setImgPreview(URL.createObjectURL(event.target.files[0]));
		}
	};

	const uploadImage = async (payload: any) => {
		setIsLoadingUpload(true);
		try {
			const form = new FormData();
			if (payload.length > 0) {
				for (let i: number = 0; i < payload.length; i++)
					form.append("img", payload[i]);
			}
			const response = await UploadImageSummary(form);
			if (response) {
				setIsLoadingUpload(false);
				return response.data.img;
			}
		} catch (error) {
			setIsLoadingUpload(false);
			return [];
		}
	};

	const editSummary = async (payload: any) => {
		setIsLoading(true);
		const form = new FormData();

		form.append("job_no", payload.job_no);
		form.append("date_of_summary", payload.date_of_summary);
		form.append("worId", payload.worId);
		form.append("quantity", payload.quantity);
		form.append("ioem", payload.ioem);
		form.append("isr", payload.isr);
		form.append("itn", payload.itn);
		form.append("introduction", payload.introduction);
		form.append("inimg", payload.inimg);
		try {
			const response = await EditSummary(form, dataSummary.id);
			if (response.data) {
				toast.success("Edit Summary Success", {
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
			toast.error("Edit Summary Part Failed", {
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

	const editSummaryDetail = async (payload: any) => {
		setIsLoading(true);

		try {
			const response = await EditSummaryDetail(payload.srimgdetail);
			if (response.data) {
				toast.success("Edit Summary Success", {
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
			toast.error("Edit Summary Part Failed", {
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
			{activeTabs === "Summary Report" ? (
				<div>
					<Formik
						initialValues={{ ...data }}
						validationSchema={sumarySchema}
						onSubmit={(values) => {
							editSummary(values);
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
								<h1 className='text-xl font-bold mt-3'>Summary Report</h1>
								<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<InputDate
											id='date_of_summary'
											label='Date Of Summary'
											value={
												values.date_of_summary === null
													? new Date()
													: values.date_of_summary
											}
											onChange={(value: any) =>
												setFieldValue("date_of_summary", value)
											}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
											classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
										/>
									</div>
									<div className='w-full'>
										<InputSelect
											id='worId'
											name='worId'
											placeholder='Job Number'
											label='Job Number'
											onChange={(event: any) => {
												if (event.target.value !== "Choose Job Number WOR") {
													let data = JSON.parse(event.target.value);
													setFieldValue("worId", data.id);
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
														<option
															value={JSON.stringify(res)}
															key={i}
															selected={res.id === values.worId}
														>
															{res.job_no}
														</option>
													);
												})
											)}
											{errors.worId && touched.worId ? (
												<span className='text-red-500 text-xs'>
													{errors.worId}
												</span>
											) : null}
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
								<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
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
								</Section>
								<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<table className='w-full'>
											<thead></thead>
											<tbody>
												<tr>
													<td className='w-[50%]'>
														<Input
															id='customer'
															name='customer'
															placeholder='Equipment'
															label='Equipment'
															type='text'
															value={equipment}
															disabled={true}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</td>
													<td className='w-[25%]'>
														<Input
															id='customer'
															name='customer'
															placeholder='Equipment'
															label='Model'
															type='text'
															value={equipmentModel}
															disabled={true}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</td>
													<td className='w-[25%]'>
														<Input
															id='quantity'
															name='quantity'
															placeholder='Quantity'
															label='Quantity'
															type='number'
															value={quantity}
															onChange={handleChange}
															disabled={true}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</Section>
								<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<table className='w-full'>
											<thead></thead>
											<tbody>
												<tr>
													<td className='w-[50%]'>
														<Input
															id='ioem'
															name='ioem'
															placeholder='O E M'
															label='O E M'
															type='text'
															value={values.ioem}
															onChange={handleChange}
															disabled={false}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</td>
													<td className='w-[25%]'>
														<Input
															id='isr'
															name='isr'
															placeholder='Serial Number'
															label='Serial Number'
															type='text'
															value={values.isr}
															onChange={handleChange}
															disabled={false}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</td>
													<td className='w-[25%]'>
														<Input
															id='itn'
															name='itn'
															placeholder='Tag Number'
															label='Tag Number'
															type='text'
															value={values.itn}
															onChange={handleChange}
															disabled={false}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</Section>
								<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<InputArea
											id='introduction'
											name='introduction'
											placeholder='Introduction'
											label='Introduction'
											type='text'
											value={values.introduction}
											onChange={handleChange}
											disabled={false}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										{values.inimg !== null ? (
											<div>
												<label className='block mb-2 text-sm font-medium text-gray-900'>
													Introduction Image
												</label>
												<div className='flex'>
													<Image
														src={
															values.inimg
																.toString()
																.includes("https://res.cloudinary.com/")
																? values.inimg
																: imgPreview
														}
														width={70}
														height={70}
														alt='Picture part'
														className='mr-2'
													/>
													<div>
														<p
															className='justify-center rounded-full border border-transparent bg-orange-500 px-4 py-1 text-sm font-medium text-white hover:bg-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mt-2 cursor-pointer'
															onClick={() => showUpload("inimg")}
														>
															Change Image
														</p>
													</div>
													<input
														id='inimg'
														name='inimg'
														placeholder='Certificate Image'
														type='file'
														onChange={(event: any) => {
															setFieldValue(
																"inimg",
																event.currentTarget.files[0]
															);
														}}
														className='hidden'
													/>
												</div>
											</div>
										) : (
											<Input
												id='inimg'
												name='inimg'
												placeholder='Introduction Image'
												label='Introduction Image'
												type='file'
												onChange={(event: any) => {
													setFieldValue("inimg", event.currentTarget.files[0]);
												}}
												required={true}
												withLabel={true}
												className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
											/>
										)}
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
			) : (
				<div>
					<p className='hidden'>{JSON.stringify(dataPart)}</p>
					<Formik
						initialValues={{ ...dataPart }}
						// validationSchema={sumarySchema}
						onSubmit={(values) => {
							editSummaryDetail(values);
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
								<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<h1 className='text-lg font-bold mt-3'>Part</h1>
									<FieldArray
										name='srimgdetail'
										render={(arrayHelper) => (
											<>
												{values.srimgdetail.map((result, i) => (
													<div key={i}>
														<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
															<div className='w-full'>
																<InputSelect
																	id={`srimgdetail.${i}.name_part`}
																	name={`srimgdetail.${i}.name_part`}
																	placeholder='Part Name'
																	label='Part Name'
																	onChange={(event: any) => {
																		setFieldValue(
																			`srimgdetail.${i}.name_part`,
																			event.target.value
																		);
																	}}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																>
																	<option defaultValue='' selected>
																		Choose Name Part
																	</option>
																	{part.length === 0 ? (
																		<option value=''>No Data Part</option>
																	) : (
																		part.map((res: any, i: number) => {
																			return (
																				<option
																					value={res.nama_part}
																					key={i}
																					selected={
																						res.nama_part === result.name_part
																							? true
																							: false
																					}
																				>
																					{res.nama_part}
																				</option>
																			);
																		})
																	)}
																</InputSelect>
															</div>
															<div className='w-full'>
																<Input
																	id={`srimgdetail.${i}.qty`}
																	name={`srimgdetail.${i}.qty`}
																	placeholder='Quantity'
																	label='Quantity'
																	type='number'
																	onChange={handleChange}
																	value={result.qty}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div>
															<div className='w-full'>
																<InputSelect
																	id={`srimgdetail.${i}.choice`}
																	name={`srimgdetail.${i}.choice`}
																	placeholder='Type'
																	label='Type'
																	onChange={(event: any) => {
																		setFieldValue(
																			`srimgdetail.${i}.choice`,
																			event.target.value
																		);
																	}}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																>
																	<option defaultValue='' selected>
																		Choose a type
																	</option>
																	<option
																		value='Repair'
																		selected={
																			result.choice === "Repair" ? true : false
																		}
																	>
																		Repair
																	</option>
																	<option
																		value='Manufacture_New'
																		selected={
																			result.choice === "Manufacture_New"
																				? true
																				: false
																		}
																	>
																		Manufacture New
																	</option>
																	<option
																		value='Supply_New'
																		selected={
																			result.choice === "Supply_New"
																				? true
																				: false
																		}
																	>
																		Supply New
																	</option>
																</InputSelect>
															</div>
														</Section>
														<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
															<div className='w-full'>
																<InputArea
																	id={`srimgdetail.${i}.input_finding`}
																	name={`srimgdetail.${i}.input_finding`}
																	placeholder='Input Finding'
																	label='Input Finding'
																	onChange={handleChange}
																	value={result.input_finding}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div>
															<div className='w-full'>
																<Input
																	id={`srimgdetail.${i}.noted`}
																	name={`srimgdetail.${i}.noted`}
																	placeholder='Note'
																	label='Note'
																	type='text'
																	onChange={handleChange}
																	value={result.noted}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div>
														</Section>
														{i === values.srimgdetail.length - 1 ? (
															<a
																className='inline-flex text-green-500 mr-6 cursor-pointer'
																onClick={() => {
																	arrayHelper.push({
																		srId: dataSummary.id,
																		id: "",
																		name_part: "",
																		qty: "",
																		input_finding: "",
																		choice: "",
																		noted: "",
																	});
																}}
															>
																<Plus size={18} className='mr-1 mt-1' /> Add
																Detail
															</a>
														) : null}
														{values.srimgdetail.length !== 1 ? (
															<a
																className='inline-flex text-red-500 cursor-pointer mt-1'
																onClick={() => {
																	arrayHelper.remove(i);
																}}
															>
																<Trash2 size={18} className='mr-1 mt-1' />{" "}
																Remove Detail
															</a>
														) : null}
													</div>
												))}
											</>
										)}
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
												"Edit"
											)}
										</button>
									</div>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			)}
		</div>
	);
};
