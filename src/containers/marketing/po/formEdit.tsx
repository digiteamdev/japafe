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
import { poSchema } from "../../../schema/marketing/po/PoSchema";
import {
	GetAllQuotationEdit,
	EditPo,
	EditPoDetail,
	DeletePoDetail,
	EditPoPayment,
} from "../../../services";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "react-feather";
import { formatRupiah } from "@/src/utils";

interface props {
	content: string;
	dataPo: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface dataPo {
	id: string;
	id_po: string;
	po_num_auto: string;
	job_no: string;
	quo_id: string;
	customer: string;
	tax: string;
	noted: string;
	subject: string;
	date_of_po: any;
	date_delivery: any;
	file: any;
	term_of_pay: any;
	price_po: any;
	discount: number;
	delete: any;
	upload_doc: any;
	Deskription_CusPo: string;
}

export const FormEditPo = ({ content, dataPo, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listQuotation, setListQuotation] = useState<any>([]);
	const [listPriceQuotation, setListPriceQuotation] = useState<any>([]);
	const [tax, setTax] = useState<number>(0);
	const [taxPPN, setTaxPPN] = useState<number>(0);
	const [taxPPH, setTaxPPH] = useState<number>(0);
	const [totalPPN, setTotalPPN] = useState<number>(0);
	const [totalPPH, setTotalPPH] = useState<number>(0);
	const [total, setTotal] = useState<number>(0);
	const [vat, setVat] = useState<number>(0);
	const [grandTotal, setGrandTotal] = useState<number>(0);
	const [jumlahDisc, setJumlahDisc] = useState<number>(0);
	const [totalTerm, setTotalTerm] = useState<number>(0);
	const [customer, setCustomer] = useState<string>("");
	const [subject, setSubject] = useState<string>("");
	const [equipment, setEquipment] = useState<string>("");
	const [countPart, setCountPart] = useState<string>("");
	const [quoId, setQuoId] = useState<string>("");
	const [imgQuotation, setImgQuotation] = useState<any>(null);
	const [data, setData] = useState<dataPo>({
		id: "",
		id_po: "",
		po_num_auto: "",
		quo_id: "",
		job_no: "",
		customer: "",
		file: null,
		tax: "",
		subject: "",
		noted: "",
		discount: 0,
		Deskription_CusPo: "",
		upload_doc: null,
		term_of_pay: [],
		price_po: [],
		delete: [],
		date_of_po: new Date(),
		date_delivery: new Date(),
	});

	useEffect(() => {
		settingData();
		getQuatation();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		let dataTerm: any = [];

		if (dataPo.term_of_pay.length > 0) {
			dataPo.term_of_pay.map((res: any) => {
				dataTerm.push({
					id: res.id,
					cuspoId: res.cuspoId,
					limitpay: res.limitpay,
					percent: res.percent,
					price: res.price,
					date_limit: new Date(res.date_limit),
				});
			});
		} else {
			dataTerm.push({
				id: "",
				cuspoId: dataPo.id,
				limitpay: "",
				percent: "",
				price: "",
				date_limit: new Date(),
			});
		}
		let disc = (dataPo.total * parseFloat(dataPo.discount)) / 100;
		setData({
			id: dataPo.id,
			id_po: dataPo.id_po,
			po_num_auto: dataPo.po_num_auto,
			quo_id: dataPo.quo_id,
			job_no: dataPo.job_no,
			tax: dataPo.tax,
			discount: dataPo.discount,
			noted: dataPo.noted,
			subject: dataPo.quotations.subject,
			customer: dataPo.quotations.Customer.name,
			file: dataPo.upload_doc,
			Deskription_CusPo: dataPo.quotations.Quotations_Detail,
			date_of_po: new Date(dataPo.date_of_po),
			date_delivery: new Date(dataPo.date_delivery),
			term_of_pay: dataTerm,
			delete: [],
			upload_doc: dataPo.upload_doc,
			price_po: dataPo.price_po,
		});
		// setEquipment(dataPo.quotations.eqandpart[0].equipment.nama);
		// setSubject(dataPo.quotations.deskription);
		// setCustomer(dataPo.quotations.Customer.name);
		// setCountPart(dataPo.quotations.eqandpart.length);
		// setQuoId(dataPo.quotations.id);
		setTaxPPH(dataPo.quotations.Customer.pph);
		setTaxPPN(dataPo.quotations.Customer.ppn);
		setTotal(dataPo.total);
		setGrandTotal(dataPo.grand_tot);
		setJumlahDisc(disc);
		// setVat(dataPo.vat);
	};

	const vatPrice = (taxType: string, discount: number) => {
		let disc = (total * discount) / 100;
		if (taxType === "ppn") {
			const jumlahTax = ((total - Math.ceil(disc)) * taxPPN) / 100;
			setTotalPPN(Math.ceil(jumlahTax));
			return Math.ceil(jumlahTax).toString();
		} else if (taxType === "pph") {
			const jumlahTax = ((total - Math.ceil(disc)) * taxPPH) / 100;
			setTotalPPH(Math.ceil(jumlahTax));
			return jumlahTax.toString();
		} else {
			setTotalPPN(0);
			setTotalPPH(0);
			return "0";
		}
	};

	const getQuatation = async () => {
		// let listQuo: any = [];
		try {
			const response = await GetAllQuotationEdit(dataPo.quo_id);
			if (response.data) {
				// response.data.result.map((res: any) => {
				// 	console.log(res);
				// 	listQuo.push({
				// 		label: res.quo_num + "-" + res.Customer.name,
				// 		value: res,
				// 	});
				// });
				setListQuotation(response.data.result);
			}
		} catch (error) {
			setListQuotation([]);
		}
	};

	const showUpload = (id: any) => {
		const inputan = document.getElementById(id);
		inputan?.click();
	};

	const grandTotalChange = (
		data: any,
		totalPrice: number,
		i: number,
		tax: string,
		discount: number
	) => {
		let totalHarga = 0;
		data.map((res: any, idx: number) => {
			if (i === idx) {
				totalHarga += totalPrice;
			} else {
				totalHarga += res.total_price;
			}
		});
		let disc = (total * discount) / 100;
		setTotal(totalHarga);
		if (tax === "ppn") {
			const jumlahTax = ((totalHarga - Math.ceil(disc)) * taxPPN) / 100;
			const grandtotal: number = totalHarga + Math.ceil(jumlahTax);
			setGrandTotal(grandtotal);
		} else if (tax === "pph") {
			const jumlahTax = (totalHarga - Math.ceil(disc) - taxPPH) / 100;
			const grandtotal: number = totalHarga + Math.ceil(jumlahTax);
			setGrandTotal(grandtotal);
		} else if (tax === "ppn_and_pph") {
			const jumlahTaxPPH = ((totalHarga - Math.ceil(disc)) * taxPPH) / 100;
			const jumlahTaxPPN = ((totalHarga - Math.ceil(disc)) * taxPPN) / 100;
			const grandtotal: number =
				totalHarga + Math.ceil(jumlahTaxPPN) - Math.ceil(jumlahTaxPPH);
			setGrandTotal(grandtotal);
		} else {
			setGrandTotal(totalHarga - Math.ceil(disc));
		}
	};

	const grandTotals = (tax: string, discount: number) => {
		let disc = (total * discount) / 100;
		if (tax === "ppn") {
			const grandtotal: number = total - Math.ceil(disc) + totalPPN;
			return grandtotal.toString();
		} else if (tax === "pph") {
			const grandtotal: number = total - Math.ceil(disc) - totalPPH;
			return grandtotal.toString();
		} else if (tax === "ppn_and_pph") {
			const grandtotal: number = total - Math.ceil(disc) + totalPPN - totalPPH;
			return grandtotal.toString();
		} else {
			return (total - Math.ceil(disc)).toString();
		}
	};

	const grandTotalTerm = (percent: string, tax: string, discount: number) => {
		let disc = (total * discount) / 100;
		if (percent) {
			if (tax === "ppn") {
				const grandtotal: number = total - Math.ceil(disc) + totalPPN;
				let totalTerm = (grandtotal * parseInt(percent)) / 100;
				return Math.ceil(totalTerm).toString();
			} else if (tax === "pph") {
				const grandtotal: number = total - Math.ceil(disc) - totalPPH;
				let totalTerm = (grandtotal * parseInt(percent)) / 100;
				return Math.ceil(totalTerm).toString();
			} else if (tax === "ppn_and_pph") {
				const grandtotal: number =
					total - Math.ceil(disc) + totalPPN - totalPPH;
				let totalTerm = (grandtotal * parseInt(percent)) / 100;
				return Math.ceil(totalTerm).toString();
			} else {
				let totalTerm = ((total - Math.ceil(disc)) * parseInt(percent)) / 100;
				return totalTerm.toString();
			}
		} else {
			return "0";
		}
	};

	const editPo = async (payload: any) => {
		setIsLoading(true);
		const form = new FormData();
		let term_pay: any = [];
		let price: any = [];
		payload.term_of_pay.map((res: any) => {
			term_pay.push({
				id: res.id,
				cuspoId: dataPo.id,
				limitpay: res.limitpay,
				percent: res.percent,
				price: res.price,
				date_limit: res.date_limit,
				note: res.note,
			});
		});

		payload.price_po.map((res: any) => {
			price.push({
				id: res.id,
				cuspoId: res.cuspoId,
				description: res.description,
				qty: res.qty,
				unit: res.unit,
				unit_price: res.unit_price,
				discount: res.discount,
				total_price: res.total_price,
			});
		});

		if (imgQuotation === null) {
			form.append("upload_doc", payload.upload_doc);
		} else {
			form.append("upload_doc", imgQuotation);
		}
		form.append("id_po", payload.id_po);
		form.append("po_num_auto", payload.po_num_auto);
		form.append("job_no", payload.job_no);
		form.append("quo_id", payload.quo_id);
		form.append("tax", payload.tax);
		form.append("noted", payload.noted);
		form.append("date_of_po", payload.date_of_po);
		form.append("discount", payload.discount);
		form.append("date_delivery", payload.date_delivery);
		form.append("grand_tot", grandTotals(payload.tax, payload.discount));
		if (payload.tax === "ppn") {
			form.append("vat", vatPrice("ppn", payload.discount));
		} else if (payload.tax === "pph") {
			form.append("vat", vatPrice("pph", payload.discount));
		} else if (payload.tax === "ppn_and_pph") {
			let totalVat =
				vatPrice("ppn", payload.discount) + vatPrice("pph", payload.discount);
			form.append("vat", totalVat);
		} else {
			form.append("vat", "0");
		}
		form.append("total", total.toString());
		form.append("price_po", JSON.stringify(price));
		form.append("term_of_pay", JSON.stringify(term_pay));
		form.append("delete", JSON.stringify(payload.delete));

		try {
			const response = await EditPo(form, dataPo.id);
			if (response.data) {
				toast.success("Edit Customer PO Success", {
					position: "top-center",
					autoClose: 1000,
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
			toast.error("Edit Customer PO Failed", {
				position: "top-center",
				autoClose: 1000,
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

	const handleOnChanges = (event: any) => {
		if (event.target.name === "upload_doc") {
			setImgQuotation(event.target.files[0]);
		}
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			<Formik
				initialValues={data}
				validationSchema={poSchema}
				onSubmit={(values) => {
					editPo(values);
				}}
				enableReinitialize
				key={0}
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
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='id_po'
									name='id_po'
									placeholder='Po Number'
									label='PO Number'
									type='text'
									value={values.id_po}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='job_no'
									name='job_no'
									placeholder='Job No'
									label='Job No'
									type='text'
									onChange={handleChange}
									value={values.job_no}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								{/* <InputSelectSearch
									datas={listQuotation}
									id='quotation'
									name='quotation'
									placeholder='Quotation'
									label='Quotation'
									onChange={(e: any) => {
										let total: number = 0;
										setCustomerName(e.value.Customer.name);
										setDeskription(e.value.subject);
										setEquipment(e.value.eqandpart[0].equipment.nama);
										setListPriceQuotation(e.value.price_quotation);
										setQuoId(e.value.id);
										setTaxPPH(e.value.Customer.pph);
										setTaxPPN(e.value.Customer.ppn);
										setFieldValue("price_po", e.value.price_quotation);
										setFieldValue(
											"Deskription_CusPo",
											e.value.Quotations_Detail
										);
										e.value.price_quotation.map((res: any) => {
											total = total + res.total_price;
										});
										setTotal(total);
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/> */}
								<InputSelect
									id='quotation'
									name='quotation'
									placeholder='Quotation'
									label='Quotation'
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option defaultValue='' selected>
										Choose Quotation
									</option>
									{listQuotation.length === 0 ? (
										<option value=''>No Data Quotation</option>
									) : (
										listQuotation.map((res: any, i: number) => {
											return (
												<option
													value={JSON.stringify(res)}
													key={i}
													selected={res.id === values.quo_id ? true : false}
												>
													{res.quo_num} - {res.Customer.name}
												</option>
											);
										})
									)}
								</InputSelect>
								{errors.quo_id && touched.quo_id ? (
									<span className='text-red-500 text-xs'>{errors.quo_id}</span>
								) : null}
							</div>
							<div className='w-full'>
								<Input
									id='customer'
									name='customer'
									placeholder='Customer'
									label='Customer Name'
									type='text'
									value={values.customer}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputSelect
									id='tax'
									name='tax'
									placeholder='tax'
									label='Tax'
									onChange={handleChange}
									value={values.tax}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option defaultValue='' selected>
										Choose tax
									</option>
									<option value='nontax'>None</option>
									<option value='ppn'>PPN</option>
									<option value='pph'>PPH</option>
									<option value='ppn_and_pph'>PPN And PPH</option>
								</InputSelect>
								{errors.tax && touched.tax ? (
									<span className='text-red-500 text-xs'>{errors.tax}</span>
								) : null}
							</div>
							<div className='w-full'>
								<InputDate
									id='date'
									label='Date'
									value={
										values.date_of_po === null ? new Date() : values.date_of_po
									}
									onChange={(value: any) => setFieldValue("date_of_po", value)}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								<InputDate
									id='date_delivery'
									label='Date delivery'
									minDate={
										values.date_of_po === null ? new Date() : values.date_of_po
									}
									value={
										values.date_delivery === null
											? new Date()
											: values.date_delivery
									}
									onChange={(value: any) =>
										setFieldValue("date_delivery", value)
									}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								{values.upload_doc !== null &&
								values.upload_doc.includes("https://res.cloudinary.com/") ? (
									<div>
										<label className='block mb-2 text-sm font-medium text-gray-900'>
											Quotation File
										</label>
										<div className='flex'>
											<a
												href={values.upload_doc}
												target='_blank'
												className='justify-center rounded-full border border-transparent bg-green-500 px-4 py-1 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mt-2 mr-2'
											>
												Show File
											</a>
											<p
												className='justify-center rounded-full border border-transparent bg-orange-500 px-4 py-1 text-sm font-medium text-white hover:bg-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mt-2 cursor-pointer'
												onClick={() => showUpload("quo_img")}
											>
												Change File
											</p>
											<Input
												id='quo_img'
												name='upload_doc'
												placeholder='File'
												type='file'
												accept='image/*, .pdf'
												className='hidden'
											/>
										</div>
									</div>
								) : (
									<Input
										id='upload_doc'
										name='upload_doc'
										placeholder='PO File'
										label='PO File'
										type='file'
										accept='image/*, .pdf'
										required={false}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								)}
							</div>
						</Section>
						<Section className='grid grid-cols-1 gap-2'>
							<div className='w-full'>
								<Input
									id='subject'
									name='subject'
									placeholder='Subject'
									label='Subject'
									type='text'
									value={values.subject}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						{values.Deskription_CusPo === "" ? null : (
							<>
								<h1 className='text-xl font-bold mt-2'>Scope Of Work</h1>
								<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2'>
									<p className='whitespace-pre-line'>
										{values.Deskription_CusPo}
									</p>
								</Section>
							</>
						)}
						<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-[-10px]'>
							<h1 className='text-xl font-bold mt-3'>Term Of Payment</h1>
							<FieldArray
								name='price_po'
								render={(arrayPrice) => (
									<>
										{values.price_po.map((res: any, i: number) => (
											<div key={i}>
												<Section className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2'>
													<div className='w-full'>
														<InputArea
															id={`price_po.${i}.description`}
															name={`price_po.${i}.description`}
															placeholder='Description'
															label='Description'
															required={true}
															value={res.description}
															onChange={(e: any) => {
																setFieldValue(
																	`price_po.${i}.description`,
																	e.target.value
																);
															}}
															row={2}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`price_po.${i}.qty`}
															name={`price_po.${i}.qty`}
															placeholder='Quantity'
															label='Quantity'
															type='text'
															pattern='\d*'
															value={formatRupiah(res.qty.toString())}
															onChange={(e: any) => {
																let qty = e.target.value
																	.toString()
																	.replaceAll(".", "");
																let unitPrice = res.unit_price
																	.toString()
																	.replaceAll(".", "");
																let discount = res.discount
																	.toString()
																	.replaceAll(".", "");
																let totalPrice = qty * unitPrice;
																let totalDisc = (totalPrice * discount) / 100;
																setFieldValue(`price_po.${i}.qty`, qty);
																setFieldValue(
																	`price_po.${i}.total_price`,
																	totalPrice - Math.ceil(totalDisc)
																);
																grandTotalChange(
																	values.price_po,
																	totalPrice - Math.ceil(totalDisc),
																	i,
																	values.tax,
																	values.discount
																);
															}}
															disabled={false}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`price_po.${i}.unit`}
															name={`price_po.${i}.unit`}
															placeholder='Unit'
															label='Unit'
															type='text'
															value={res.unit}
															onChange={(e: any) => {
																setFieldValue(
																	`price_po.${i}.unit`,
																	e.target.value
																);
															}}
															disabled={false}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`price_po.${i}.unit_price`}
															name={`price_po.${i}.unit_price`}
															placeholder='Unit Price'
															label='Unit Price'
															type='text'
															pattern='\d*'
															value={formatRupiah(res.unit_price.toString())}
															onChange={(e: any) => {
																let qty = res.qty
																	.toString()
																	.replaceAll(".", "");
																let unitPrice = e.target.value
																	.toString()
																	.replaceAll(".", "");
																let discount = res.discount
																	.toString()
																	.replaceAll(".", "");
																let totalPrice = qty * unitPrice;
																let totalDisc = (totalPrice * discount) / 100;
																setFieldValue(
																	`price_po.${i}.unit_price`,
																	unitPrice
																);
																setFieldValue(
																	`price_po.${i}.total_price`,
																	totalPrice - Math.ceil(totalDisc)
																);
																grandTotalChange(
																	values.price_po,
																	totalPrice - Math.ceil(totalDisc),
																	i,
																	values.tax,
																	values.discount
																);
															}}
															disabled={false}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													{/* <div className='w-full'>
														<Input
															id={`price_po.${i}.discount`}
															name={`price_po.${i}.discount`}
															placeholder='Discount'
															label='Discount (%)'
															type='text'
															pattern='\d*'
															value={formatRupiah(res.discount.toString())}
															onChange={(e: any) => {
																let qty = res.qty
																	.toString()
																	.replaceAll(".", "");
																let unitPrice = res.unit_price
																	.toString()
																	.replaceAll(".", "");
																let discount = e.target.value
																	.toString()
																	.replaceAll(".", "");
																let totalPrice = qty * unitPrice;
																let totalDisc = (totalPrice * discount) / 100;
																setFieldValue(
																	`price_po.${i}.discount`,
																	discount
																);
																setFieldValue(
																	`price_po.${i}.total_price`,
																	totalPrice - Math.ceil(totalDisc)
																);
																grandTotalChange(
																	values.price_po,
																	totalPrice - Math.ceil(totalDisc),
																	i,
																	values.tax,
																	values.discount
																);
															}}
															disabled={false}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div> */}
													<div className='w-full'>
														<Input
															id={`price_po.${i}.total_price`}
															name={`price_po.${i}.total_price`}
															placeholder='Total Price'
															label='Total Price'
															type='text'
															value={formatRupiah(res.total_price.toString())}
															disabled={true}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
												</Section>
												<Section className='flex'>
													{i === values.price_po.length - 1 ? (
														<a
															className='flex mt-1 text-[20px] text-blue-600 cursor-pointer hover:text-blue-400'
															onClick={() =>
																arrayPrice.push({
																	id: "",
																	cuspoId: "",
																	description: "",
																	qty: 0,
																	discount: 0,
																	unit: "",
																	unit_price: 0,
																	total_price: 0,
																})
															}
														>
															<Plus size={23} className='mt-1' />
															Add
														</a>
													) : null}
													{values.price_po.length !== 1 ? (
														<a
															className='flex ml-4 mt-1 text-[20px] text-red-600 w-full hover:text-red-400 cursor-pointer'
															onClick={() => {
																let priceDelete: any = values.delete;
																if (res.id !== "") {
																	priceDelete.push({
																		id: res.id,
																	});
																}
																setFieldValue("delete", priceDelete);
																arrayPrice.remove(i);
															}}
														>
															<Trash2 size={22} className='mt-1 mr-1' />
															Remove
														</a>
													) : null}
												</Section>
											</div>
										))}
									</>
								)}
							/>
							<Section className='grid md:grid-cols-5 sm:grid-cols-4 xs:grid-cols-1 gap-2 mt-2'>
								<div className='col-span-4 text-right'>
									<p className='mt-4'>Sub Total</p>
								</div>
								<div className='w-full'>
									<Input
										id='discount'
										name='discount'
										placeholder='Discount'
										type='text'
										pattern='\d*'
										value={formatRupiah(total.toString())}
										disabled={true}
										required={true}
										withLabel={false}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
							</Section>
							<Section className='grid md:grid-cols-5 sm:grid-cols-4 xs:grid-cols-1 gap-2 mt-2'>
								<div className='col-span-4 text-right'>
									<p className='mt-4'>Discount (%)</p>
								</div>
								<div className='w-full'>
									<Input
										id='discount'
										name='discount'
										placeholder='Discount'
										type='text'
										pattern='\d*'
										onChange={(e: any) => {
											let disc = (total * parseFloat(e.target.value)) / 100;
											setFieldValue("discount", e.target.value);
											setJumlahDisc(disc);
										}}
										value={values.discount.toString()}
										disabled={false}
										required={true}
										withLabel={false}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
							</Section>
							<Section className='grid md:grid-cols-5 sm:grid-cols-4 xs:grid-cols-1 gap-2 mt-2'>
								<div className='col-span-4 text-right'>
									<p className='mt-4'>Jumlah Disc</p>
								</div>
								<div className='w-full'>
									<Input
										id='discount'
										name='discount'
										placeholder='Discount'
										type='text'
										pattern='\d*'
										value={formatRupiah(jumlahDisc.toString())}
										disabled={false}
										required={true}
										withLabel={false}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
							</Section>
							<Section className='grid md:grid-cols-5 sm:grid-cols-4 xs:grid-cols-1 gap-2 mt-2'>
								<div className='col-span-4 text-right'>
									<p className='mt-4'>Total</p>
								</div>
								<div className='w-full'>
									<Input
										id='discount'
										name='discount'
										placeholder='Discount'
										type='text'
										pattern='\d*'
										value={formatRupiah((total - jumlahDisc).toString())}
										disabled={true}
										required={true}
										withLabel={false}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
							</Section>
							{values.tax === "ppn" ? (
								<Section className='grid md:grid-cols-5 sm:grid-cols-4 xs:grid-cols-1 gap-2 mt-2'>
									<div className='col-span-4 text-right'>
										<p className='mt-4'>PPN</p>
									</div>
									<div className='w-full'>
										<Input
											id='ppn'
											name='ppn'
											placeholder='PPN'
											type='text'
											value={formatRupiah(vatPrice("ppn", values.discount))}
											disabled={true}
											required={true}
											withLabel={false}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
								</Section>
							) : values.tax === "pph" ? (
								<Section className='grid md:grid-cols-5 sm:grid-cols-4 xs:grid-cols-1 gap-2 mt-2'>
									<div className='col-span-4 text-right'>
										<p className='mt-4'>PPH</p>
									</div>
									<div className='w-full'>
										<Input
											id='pph'
											name='pph'
											placeholder='PPH'
											type='text'
											value={formatRupiah(vatPrice("pph", values.discount))}
											disabled={true}
											required={true}
											withLabel={false}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
								</Section>
							) : values.tax === "ppn_and_pph" ? (
								<>
									<Section className='grid md:grid-cols-5 sm:grid-cols-4 xs:grid-cols-1 gap-2 mt-2'>
										<div className='col-span-4 text-right'>
											<p className='mt-4'>PPN</p>
										</div>
										<div className='w-full'>
											<Input
												id='ppn'
												name='ppn'
												placeholder='PPN'
												type='text'
												value={formatRupiah(vatPrice("ppn", values.discount))}
												disabled={true}
												required={true}
												withLabel={false}
												className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
											/>
										</div>
									</Section>
									<Section className='grid md:grid-cols-5 sm:grid-cols-4 xs:grid-cols-1 gap-2 mt-2'>
										<div className='col-span-4 text-right'>
											<p className='mt-4'>PPH</p>
										</div>
										<div className='w-full'>
											<Input
												id='pph'
												name='pph'
												placeholder='PPH'
												type='text'
												value={formatRupiah(vatPrice("pph", values.discount))}
												disabled={true}
												required={true}
												withLabel={false}
												className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
											/>
										</div>
									</Section>
								</>
							) : null}
							<Section className='grid md:grid-cols-5 sm:grid-cols-4 xs:grid-cols-1 gap-2 mt-2'>
								<div className='col-span-4 text-right'>
									<p className='mt-4'>Grand Total</p>
								</div>
								<div className='w-full'>
									<Input
										id='qty'
										name='qty'
										placeholder='Grand Total'
										type='text'
										value={formatRupiah(
											grandTotals(values.tax, values.discount)
										)}
										disabled={true}
										required={true}
										withLabel={false}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
							</Section>
							<FieldArray
								name='term_of_pay'
								render={(arrayTerm) => (
									<>
										{values.term_of_pay.map((res: any, i: number) => (
											<Section
												className={`grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 ${
													i === 0 ? "mt-[-10px]" : "mt-[-40px]"
												}`}
												key={i}
											>
												<div className='w-full'>
													<table className='w-full'>
														<tr>
															<td className='w-[20%]'>
																<InputSelect
																	id={`term_of_pay.${i}.limitpay`}
																	name={`term_of_pay.${i}.limitpay`}
																	placeholder='Limit Pay'
																	label='Limit Pay'
																	onChange={handleChange}
																	value={res.limitpay}
																	required={true}
																	withLabel={false}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																>
																	<option defaultValue='' selected>
																		Choose Limit Pay
																	</option>
																	<option value='Normal'>Normal</option>
																	<option value='Down_Payment'>
																		Down Payment
																	</option>
																	<option value='Termin_I'>Termin I</option>
																	<option value='Termin_II'>Termin II</option>
																	<option value='Termin_III'>Termin III</option>
																	<option value='Termin_IV'>Termin IV</option>
																	<option value='Termin_V'>Termin V</option>
																	<option value='Repayment'>Repayment</option>
																</InputSelect>
															</td>
															<td className='w-[10%]'>
																<Input
																	id={`term_of_pay.${i}.percent`}
																	name={`term_of_pay.${i}.percent`}
																	placeholder='%'
																	type='number'
																	value={res.percent}
																	onChange={(e: any) => {
																		const nameSplit = e.target.name.split("."),
																			index = nameSplit[1],
																			percent = e.target.value,
																			totalTerm: any =
																				(parseInt(
																					grandTotals(
																						values.tax,
																						values.discount
																					)
																				) *
																					percent) /
																				100;
																		setFieldValue(
																			`term_of_pay.${i}.percent`,
																			e.target.value
																		);
																		setFieldValue(
																			`term_of_pay.${i}.price`,
																			Math.ceil(totalTerm)
																		);
																	}}
																	required={true}
																	withLabel={false}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</td>
															<td className='w-[30%]'>
																<Input
																	id={`term_of_pay.${i}.price`}
																	name={`term_of_pay.${i}.price`}
																	placeholder='10000'
																	label='Noted'
																	type='text'
																	value={formatRupiah(
																		grandTotalTerm(
																			res.percent,
																			values.tax,
																			values.discount
																		)
																	)}
																	disabled={true}
																	required={true}
																	withLabel={false}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</td>
															<td className='w-[20%]'>
																<InputDate
																	id={`term_of_pay.${i}.date_limit`}
																	label='date_limit'
																	value={res.date_limit}
																	onChange={(value: any) =>
																		setFieldValue(
																			`term_of_pay.${i}.date_limit`,
																			value
																		)
																	}
																	withLabel={false}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600 mt-6'
																	classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 mt-6 z-20'
																/>
															</td>
															<td className='w-[20%]'>
																<div className='flex w-full'>
																	{i === values.term_of_pay.length - 1 ? (
																		<a
																			className='flex mt-2 text-[20px] text-blue-600 cursor-pointer hover:text-blue-400'
																			onClick={() => {
																				arrayTerm.push({
																					id: "",
																					cuspoId: dataPo.id,
																					limitpay: "",
																					percent: 0,
																					price: 0,
																					date_limit: new Date(),
																					note: "",
																				});
																			}}
																		>
																			<Plus size={23} className='mt-1' />
																			Add
																		</a>
																	) : null}
																	{values.term_of_pay.length !== 1 ? (
																		<a
																			className='flex ml-4 mt-2 text-[20px] text-red-600 w-full hover:text-red-400 cursor-pointer'
																			onClick={() => {
																				let priceDelete: any = values.delete;
																				if (res.id !== "") {
																					priceDelete.push({
																						id: res.id,
																					});
																				}
																				setFieldValue("delete", priceDelete);
																				arrayTerm.remove(i);
																			}}
																		>
																			<Trash2 size={22} className='mt-1 mr-1' />
																			Remove
																		</a>
																	) : null}
																</div>
															</td>
														</tr>
													</table>
												</div>
											</Section>
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
										"Edit Customer Po"
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
