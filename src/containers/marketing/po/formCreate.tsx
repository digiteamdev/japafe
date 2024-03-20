import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputDate,
	InputSelectSearch,
	InputArea,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { poSchema } from "../../../schema/marketing/po/PoSchema";
import { AddPo, GetAllQuotation } from "../../../services";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "react-feather";
import { formatRupiah } from "@/src/utils";
import { cekDivisiMarketing } from "../../../utils"

interface props {
	content: string;
	dataCustomer: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	id_po: string;
	po_num_auto: string;
	quo_id: string;
	tax: string;
	upload_doc: any;
	noted: string;
	date_of_po: Date | null;
	date_delivery: Date | null;
	vat: string;
	grand_tot: string;
	total: string;
	Deskription_CusPo: string;
	price_po: any;
	term_of_pay: [
		{
			limitpay: string;
			percent: string;
			price: string;
			date_limit: Date | null;
		}
	];
}

export const FormCreatePo = ({ content, dataCustomer, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [typeTax, setTypeTax] = useState<string>("");
	const [tax, setTax] = useState<number>(0);
	const [taxPPN, setTaxPPN] = useState<number>(0);
	const [taxPPH, setTaxPPH] = useState<number>(0);
	const [total, setTotal] = useState<number>(0);
	const [totalPPN, setTotalPPN] = useState<number>(0);
	const [totalPPH, setTotalPPH] = useState<number>(0);
	const [listQuotation, setListQuotation] = useState<any>([]);
	const [listPriceQuotation, setListPriceQuotation] = useState<any>([]);
	const [customerName, setCustomerName] = useState<string>("");
	const [deskription, setDeskription] = useState<string>("");
	const [equipment, setEquipment] = useState<string>("");
	const [quoId, setQuoId] = useState<string>("");
	const [countPart, setCountPart] = useState<string>("");
	const [poFile, setPoFile] = useState<any>(null);
	const [idAutoNum, setIdAutoNum] = useState<string>("");
	const [data, setData] = useState<data>({
		id_po: "",
		po_num_auto: "",
		quo_id: "",
		tax: "",
		upload_doc: "",
		noted: "",
		vat: "",
		grand_tot: "",
		total: "",
		date_of_po: new Date(),
		date_delivery: new Date(),
		Deskription_CusPo: "",
		price_po: [
			{
				description: "",
				qty: 0,
				unit: "",
				unit_price: 0,
				discount: 0,
				total_price: 0,
			},
		],
		term_of_pay: [
			{
				limitpay: "",
				percent: "",
				price: "",
				date_limit: new Date(),
			},
		],
	});

	useEffect(() => {
		getQuatation();
		generateIdNum();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		var year = dateObj.getUTCFullYear();
		const id =
			year.toString() +
			"/" +
			month.toString() +
			"/" +
			"TS-DW/" +
			Math.floor(Math.random() * 10000) +
			1;
		setIdAutoNum(id);
	};

	const totalPrice = (data: any) => {
		let total: number = 0;
		data.map((res: any, i: number) => {
			const htmlTotal = document.getElementById(
				`Deskription_CusPo.${i}.total`
			) as HTMLInputElement;
			if (htmlTotal !== null) {
				const totalPrice: any = htmlTotal.value === "" ? 0 : htmlTotal.value;
				total = total + parseInt(totalPrice);
			}
		});
		return total.toString();
		// return formatRupiah(total.toString())
	};

	const vat = (taxType: string) => {
		// const htmlTotal = document.getElementById("total") as HTMLInputElement;
		if (taxType === "ppn") {
			const jumlahTax = (total * taxPPN) / 100;
			setTotalPPN(jumlahTax);
			return jumlahTax.toString();
		} else if (taxType === "pph") {
			const jumlahTax = (total * taxPPH) / 100;
			setTotalPPH(jumlahTax);
			return jumlahTax.toString();
		} else {
			setTotalPPN(0);
			setTotalPPH(0);
			return "0";
		}
	};

	const grandTotal = () => {
		if (typeTax === "ppn") {
			const grandtotal: number = total + totalPPN;
			return grandtotal.toString();
		} else if (typeTax === "pph") {
			const grandtotal: number = total + totalPPH;
			return grandtotal.toString();
		} else if (typeTax === "ppn_and_pph") {
			const grandtotal: number = total + totalPPN + totalPPH;
			return grandtotal.toString();
		} else {
			return total.toString();
		}
	};

	const grandTotalChange = (data: any, totalPrice: number, i: number) => {
		let totalHarga = 0
		data.map( (res: any, idx: number) => {
			if( i === idx){
				totalHarga += totalPrice
			}else{
				totalHarga += res.total_price
			}
		})
		if (typeTax === "ppn") {
			const grandtotal: number = totalHarga + totalPPN;
			setTotal(grandtotal);
		} else if (typeTax === "pph") {
			const grandtotal: number = totalHarga + totalPPH;
			setTotal(grandtotal);
		} else if (typeTax === "ppn_and_pph") {
			const grandtotal: number = totalHarga + totalPPN + totalPPH;
			setTotal(grandtotal);
		} else {
			setTotal(totalHarga);
		}
	};

	const addPo = async (payload: any) => {
		setIsLoading(true);
		const price: any = [];
		const term: any = [];
		let vattotal: string = "0";
		let termOFPaymentEmpty: boolean = false;
		payload.term_of_pay.map((res: any, i: number) => {
			if (res.limitpay === "") {
				toast.warning("Term Of Payment not empty", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				termOFPaymentEmpty = true;
			} else {
				const htmlTotal = document.getElementById(
					`term_of_pay.${i}.price`
				) as HTMLInputElement;
				term.push({
					limitpay: res.limitpay,
					percent: parseInt(res.percent),
					price: res.price,
					date_limit: res.date_limit,
				});
			}
		});
		if (payload.tax === "ppn") {
			vattotal = vat("ppn");
		} else if (payload.tax === "pph") {
			vattotal = vat("pph");
		} else if (payload.tax === "ppn_and_pph") {
			vattotal = (parseInt(vat("ppn")) + parseInt(vat("pph"))).toString();
		}

		payload.price_po.map((res: any) => {
			price.push({
				description: res.description,
				qty: parseInt(res.qty),
				unit: res.unit,
				unit_price: parseInt(res.unit_price),
				discount: parseInt(res.discount),
				total_price: parseInt(res.total_price),
			});
		});
		// const dataBody = {
		// 	id_po: payload.id_po,
		// 	po_num_auto: idAutoNum,
		// 	quo_id: quoId,
		// 	tax: payload.tax,
		// 	noted: payload.noted,
		// 	date_of_po: payload.date_of_po,
		// 	date_delivery: payload.date_delivery,
		// 	Deskription_CusPo: desc,
		// 	term_of_pay: term,
		// 	vat: parseInt(vattotal),
		// 	grand_tot: parseInt(htmlGrandTotal.value),
		// 	total: parseInt(htmlTotals.value),
		// };
		const form = new FormData();

		form.append("id_po", payload.id_po);
		form.append("po_num_auto", idAutoNum);
		form.append("quo_id", quoId);
		form.append("tax", payload.tax);
		form.append("noted", payload.noted);
		form.append("date_of_po", payload.date_of_po);
		form.append("upload_doc", poFile);
		form.append("date_delivery", payload.date_delivery);
		form.append("job_operational", cekDivisiMarketing());
		form.append("term_of_pay", JSON.stringify(term));
		form.append("price_po", JSON.stringify(price));
		form.append("vat", vattotal);
		form.append("grand_tot", grandTotal());
		form.append("total", total.toString());
		try {
			if (!termOFPaymentEmpty) {
				const response = await AddPo(form);
				if (response) {
					toast.success("Add Customer PO Success", {
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
			}
		} catch (error) {
			toast.error("Add Customer PO Failed", {
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

	const getQuatation = async () => {
		let dataQuotation: any = [];
		try {
			const response = await GetAllQuotation(cekDivisiMarketing());
			if (response.data) {
				response.data.result.map((res: any) => {
					dataQuotation.push({
						value: res,
						label: `${res.quo_num} - ${res.Customer.name}`,
					});
				});
				setListQuotation(dataQuotation);
			}
		} catch (error) {
			setListQuotation(dataQuotation);
		}
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			<Formik
				initialValues={{ ...data }}
				validationSchema={poSchema}
				onSubmit={(values) => {
					addPo(values);
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
						<h1 className='text-xl font-bold mt-3'>Customer PO</h1>
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='id_po'
									name='id_po'
									placeholder='PO/SO/SPK No'
									label='PO/SO/SPK No'
									type='text'
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='quo_auto'
									name='quo_auto'
									placeholder='Po Id'
									label='PO Id'
									type='text'
									value={idAutoNum}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputSelectSearch
									datas={listQuotation}
									id='quotation'
									name='quotation'
									placeholder='Quotation'
									label='Quotation'
									onChange={(e: any) => {
										let total: number = 0;
										setCustomerName(e.value.Customer.name);
										setDeskription(e.value.subject);
										// setEquipment(e.value.eqandpart[0].equipment.nama);
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
								/>
							</div>
							<div className='w-full'>
								<Input
									id='customer'
									name='customer'
									placeholder='Customer'
									label='Customer Name'
									type='text'
									value={customerName}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
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
								<InputSelect
									id='tax'
									name='tax'
									placeholder='tax'
									label='Tax'
									onChange={handleChange}
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
								<Input
									id='upload_doc'
									name='upload_doc'
									placeholder='PO File'
									label='PO File'
									type='file'
									accept='image/*, .pdf'
									onChange={handleChange}
									required={false}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
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
									value={deskription}
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
												<Section className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2'>
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
																let qty = e.target.value.toString().replaceAll(".", "");
																let unitPrice = res.unit_price.toString().replaceAll(".", "");
																let discount = res.discount.toString().replaceAll(".", "");
																let totalPrice = qty * unitPrice;
																let totalDisc = totalPrice * discount / 100
																setFieldValue(
																	`price_po.${i}.qty`,
																	qty
																);
																setFieldValue(
																	`price_po.${i}.total_price`,
																	totalPrice - totalDisc
																);
																grandTotalChange(values.price_po, (totalPrice - totalDisc), i)
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
																let qty = res.qty.toString().replaceAll(".", "");
																let unitPrice = e.target.value.toString().replaceAll(".", "");
																let discount = res.discount.toString().replaceAll(".", "");
																let totalPrice = qty * unitPrice;
																let totalDisc = totalPrice * discount / 100
																setFieldValue(
																	`price_po.${i}.unit_price`,
																	unitPrice
																);
																setFieldValue(
																	`price_po.${i}.total_price`,
																	totalPrice - totalDisc
																);
																grandTotalChange(values.price_po, (totalPrice - totalDisc), i)
															}}
															disabled={false}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`price_po.${i}.discount`}
															name={`price_po.${i}.discount`}
															placeholder='Discount'
															label='Discount (%)'
															type='text'
															pattern='\d*'
															value={formatRupiah(res.discount.toString())}
															onChange={(e: any) => {
																let qty = res.qty.toString().replaceAll(".", "");
																let unitPrice = res.unit_price.toString().replaceAll(".", "");
																let discount = e.target.value.toString().replaceAll(".", "");
																let totalPrice = qty * unitPrice;
																let totalDisc = totalPrice * discount / 100 
																setFieldValue(
																	`price_po.${i}.discount`,
																	discount
																);
																setFieldValue(
																	`price_po.${i}.total_price`,
																	totalPrice - totalDisc
																);
																grandTotalChange(values.price_po, (totalPrice - totalDisc), i)
															}}
															disabled={false}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
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
																	description: "",
																	qty: 0,
																	unit: "",
																	unit_price: 0,
																	discount: 0,
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
											value={vat("ppn")}
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
											value={vat("pph")}
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
												value={vat("ppn")}
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
												value={vat("pph")}
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
										value={formatRupiah(grandTotal())}
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
										{values.term_of_pay.map((res, i) => (
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
																	onChange={(e: any) => {
																		const nameSplit = e.target.name.split("."),
																			index = nameSplit[1],
																			percent = e.target.value,
																			htmlTotalTerm = document.getElementById(
																				`term_of_pay.${index}.price`
																			) as HTMLInputElement,
																			totalTerm: any =
																				(parseInt(grandTotal()) * percent) /
																				100;
																		htmlTotalTerm.value = formatRupiah(
																			totalTerm.toString()
																		);
																		setFieldValue(
																			`term_of_pay.${i}.percent`,
																			e.target.value
																		);
																		setFieldValue(
																			`term_of_pay.${i}.price`,
																			totalTerm
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
																					limitpay: "",
																					percent: "",
																					price: "",
																					date_limit: new Date(),
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
