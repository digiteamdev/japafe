import { useEffect, useState } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputDate,
	InputArea,
	InputSelectSearch,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { sumarySchema } from "../../../schema/engineering/sumary-report/SumarySchema";
import moment from "moment";
import {
	GetSummaryTimeSchedulle,
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
	timeschId: string;
	equipment: string;
	customer: string;
	subject: string;
	model: string;
	ca_number: "";
	qty: string;
	ioem: string;
	isr: string;
	itn: string;
	introduction: string;
	inimg: any;
	srimgdetail: any;
	delete: any;
	type_srimg: string;
	selectType: any;
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
		timeschId: "",
		customer: "",
		subject: "",
		equipment: "",
		ca_number: "",
		model: "",
		qty: "",
		ioem: "",
		isr: "",
		itn: "",
		introduction: "",
		inimg: "",
		type_srimg: "",
		srimgdetail: [],
		delete: [],
		selectType: []
	});

	const listType = [
		{
			label: "Incoming",
			value: "Incoming"
		},
		{
			label: "Final",
			value: "Final"
		}
	]
console.log(dataSummary)
	useEffect(() => {
		getWor();
		settingData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		let part: any = [];
		dataSummary.srimgdetail.map((res: any) => {
			part.push(res);
		});
		setData({
			job_no: dataSummary.wor.job_no,
			date_of_summary: new Date(dataSummary.date_of_summary),
			timeschId: dataSummary.timeschId,
			customer: dataSummary.wor.customerPo.quotations.Customer.name,
			subject: dataSummary.wor.customerPo.quotations.subject,
			equipment: dataSummary.equipment,
			model: dataSummary.model,
			ca_number: dataSummary.ca_number,
			qty: dataSummary.qty,
			ioem: dataSummary.ioem,
			isr: dataSummary.isr,
			itn: dataSummary.itn,
			introduction: dataSummary.introduction,
			inimg: dataSummary.inimg,
			type_srimg: dataSummary.type_srimg,
			srimgdetail: part,
			delete: [],
			selectType: { label: dataSummary.type_srimg, value: dataSummary.type_srimg }
		});
	};

	const showUpload = (id: any) => {
		const inputan = document.getElementById(id);
		inputan?.click();
	};

	const getWor = async () => {
		let wor: any = [];
		wor.push(dataSummary.wor);
		try {
			const response = await GetSummaryTimeSchedulle();
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
		if (event.target.name === "timeschId") {
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
		let detail: any = [];
		const form = new FormData();

		payload.srimgdetail.map((res: any) => {
			detail.push({
				id: res.id,
				srId: dataSummary.id,
				name_part: res.name_part,
				qty: res.qty,
				input_finding: res.input_finding,
				choice: res.choice,
				noted: res.noted,
			});
		});

		form.append("job_no", payload.job_no);
		form.append("date_of_summary", payload.date_of_summary);
		form.append("timeschId", payload.timeschId);
		form.append("quantity", payload.qty);
		form.append("ioem", payload.ioem);
		form.append("equipment", payload.equipment);
		form.append("model", payload.model);
		form.append("qty", payload.qty);
		form.append("isr", payload.isr);
		form.append("itn", payload.itn);
		form.append("ca_number", payload.ca_number);
		form.append("type_srimg", payload.type_srimg);
		form.append("introduction", payload.introduction);
		form.append("inimg", payload.inimg);
		form.append("sumarydetail", JSON.stringify(detail));
		form.append("delete", JSON.stringify(payload.delete));
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

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			<Formik
				initialValues={{ ...data }}
				// validationSchema={sumarySchema}
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
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
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
								<Input
									id='Jobno'
									name='Jobno'
									placeholder='Job No'
									label='Job No'
									type='text'
									value={values.job_no}
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
									placeholder='Customer Name'
									label='Customer'
									type='text'
									value={values.customer}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputArea
									id='subject'
									name='subject'
									placeholder='Subject'
									label='Subject'
									type='text'
									value={values.subject}
									onChange={handleChange}
									disabled={false}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='equipment'
									name='equipment'
									placeholder='Equipment'
									label='Equipment'
									type='text'
									value={values.equipment}
									onChange={handleChange}
									disabled={false}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='model'
									name='model'
									placeholder='Model'
									label='Model'
									type='text'
									value={values.model}
									onChange={handleChange}
									disabled={false}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='qty'
									name='qty'
									placeholder='Quantity'
									label='Quantity'
									type='number'
									value={values.qty}
									onChange={handleChange}
									disabled={false}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
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
							</div>
						</Section>
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='ca_number'
									name='ca_number'
									placeholder='Certificate Number'
									label='Certificate Number'
									type='text'
									value={values.ca_number}
									onChange={handleChange}
									disabled={false}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
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
							</div>
							<div className='w-full'>
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
							</div>
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
						</Section>
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								{values.inimg !== null &&
								values.inimg.includes("https://res.cloudinary.com/") ? (
									<div>
										<label className='block mb-2 text-sm font-medium text-gray-900'>
											Quotation File
										</label>
										<div className='flex'>
											<a
												href={values.inimg}
												target='_blank'
												className='justify-center rounded-full border border-transparent bg-green-500 px-4 py-1 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mt-2 mr-2'
											>
												Show File
											</a>
											<p
												className='justify-center rounded-full border border-transparent bg-orange-500 px-4 py-1 text-sm font-medium text-white hover:bg-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mt-2 cursor-pointer'
												onClick={() => showUpload("inimg")}
											>
												Change File
											</p>
											<input
												id='inimg'
												name='inimg'
												placeholder='Image'
												type='file'
												accept='image/*'
												className='hidden'
												onChange={(event: any) => {
													setFieldValue("inimg", event.currentTarget.files[0]);
												}}
											/>
										</div>
									</div>
								) : (
									<Input
										id='inimg'
										name='inimg'
										placeholder='Image'
										label='Image'
										type='file'
										accept='image/*'
										onChange={(event: any) => {
											setFieldValue("inimg", event.currentTarget.files[0]);
										}}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								)}
							</div>
							<div className='w-full'>
								<InputSelectSearch
									datas={listType}
									id='type_srimg'
									name='type_srimg'
									placeholder='Type Summary'
									label='Type Summary'
									onChange={(e: any) => {
										setFieldValue("selectType", e);
										setFieldValue("type_srimg", e.value);
									}}
									value={values.selectType}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<h1 className='text-lg font-bold mt-3'>Part</h1>
							<FieldArray
								name='srimgdetail'
								render={(arrayHelper) => (
									<>
										{values.srimgdetail.map((res: any, i: number) => (
											<div key={i}>
												<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
													<div className='w-full'>
														<Input
															id={`srimgdetail.${i}.name_part`}
															name={`srimgdetail.${i}.name_part`}
															placeholder='Name Part'
															label='Name Part'
															type='text'
															value={res.name_part}
															onChange={(event: any) => {
																setFieldValue(
																	`srimgdetail.${i}.name_part`,
																	event.target.value
																);
															}}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`srimgdetail.${i}.qty`}
															name={`srimgdetail.${i}.qty`}
															placeholder='Quantity'
															label='Quantity'
															type='number'
															value={res.qty}
															onChange={handleChange}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													{/* <div className='w-full'>
														<Input
															id={`srimgdetail.${i}.imgSummary`}
															name={`srimgdetail.${i}.imgSummary`}
															placeholder='File Image'
															label='File Image'
															type='file'
															accept='image/*'
															onChange={(event: any) => {
																uploadImage(event.target.files).then((res) => {
																	setFieldValue(
																		`srimgdetail.${i}.imgSummary`,
																		res
																	);
																});
															}}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div> */}
													<div className='w-full'>
														<InputArea
															id={`srimgdetail.${i}.input_finding`}
															name={`srimgdetail.${i}.input_finding`}
															placeholder='Input Finding'
															label='Input Finding'
															value={res.input_finding}
															onChange={handleChange}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
												</Section>
												<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
													<div className='w-full'>
														<InputSelect
															id={`srimgdetail.${i}.choice`}
															name={`srimgdetail.${i}.choice`}
															placeholder='Type'
															label='Type'
															value={res.choice}
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
															<option value='Repair'>Repair</option>
															<option value='Manufacture_New'>
																Manufacture New
															</option>
															<option value='Supply_New'>Supply New</option>
														</InputSelect>
													</div>
													<div className='w-full'>
														<Input
															id={`srimgdetail.${i}.noted`}
															name={`srimgdetail.${i}.noted`}
															placeholder='Note'
															label='Note'
															type='text'
															value={res.noted}
															onChange={handleChange}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														{i === values.srimgdetail.length - 1 ? (
															<a
																className='inline-flex text-green-500 mt-10 mr-6 cursor-pointer'
																onClick={() => {
																	arrayHelper.push({
																		id: "",
																		srId: dataSummary.id,
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
																className='inline-flex text-red-500  mt-10 cursor-pointer mt-1'
																onClick={() => {
																	let detailDelete: any = values.delete;
																	if (res.id !== "") {
																		detailDelete.push({
																			id: res.id,
																		});
																	}
																	setFieldValue("delete", detailDelete);
																	arrayHelper.remove(i);
																}}
															>
																<Trash2 size={18} className='mr-1 mt-1' />{" "}
																Remove Detail
															</a>
														) : null}
													</div>
												</Section>
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
									) : isLoadingUpload ? (
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
											Upload Image
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
