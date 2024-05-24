import { useEffect, useState } from "react";
import moment from "moment";
import { FieldArray, Form, Formik } from "formik";
import { AddPoMr, ApprovalPoMr } from "../../../services";
import {
	Input,
	InputSelect,
	InputSelectSearch,
	Section,
} from "../../../components";
import { formatRupiah, pembilang } from "../../../utils";
import { getPosition } from "../../../configs/session";
import { Check, X, Printer, Plus, Trash2 } from "react-feather";
import { toast } from "react-toastify";
import { PdfPo } from "./pdfPo";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	dateOfPO: any;
	idPO: string;
	ref: string;
	note: string;
	supplierId: string;
	delivery_time: string;
	tax: boolean,
	franco: string;
	payment_method: string;
	dp: any;
	termOfPayment: any;
	detailMr: any;
}

export const ViewPoMR = ({ dataSelected, content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isModal, setIsModal] = useState<boolean>(false);
	const [isTax, setIsTax] = useState<number>(0);
	const [contact, setContact] = useState<string>("");
	const [phone, setPhone] = useState<string>("");
	const [address, setAddress] = useState<string>("");
	const [position, setPosition] = useState<any>([]);
	const [listSupplier, setListSupplier] = useState<any>([]);
	const [data, setData] = useState<data>({
		dateOfPO: new Date(),
		idPO: "",
		ref: "",
		supplierId: "",
		delivery_time: "",
		tax: true,
		franco: "",
		payment_method: "",
		dp: 0,
		note: "",
		termOfPayment: [],
		detailMr: [],
	});

	useEffect(() => {
		let supplier: any = [];
		let detailSupplier: any = [];
		dataSelected.detailMr.map((res: any) => {
			if (!supplier.includes(res.supplier.supplier_name)) {
				detailSupplier.push({
					label: res.supplier.supplier_name,
					value: res,
				});
				supplier.push(res.supplier.supplier_name);
			}
		});
		setListSupplier(detailSupplier);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		var year = dateObj.getUTCFullYear();
		const id =
			"PO" +
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 10000);
		return id;
	};

	const Total = (detail:any) => {
		let jumlahTotal: any = 0;
		detail.map((res: any) => {
			jumlahTotal = jumlahTotal + res.price * res.qty;
		});
		return jumlahTotal.toString();
	};

	const Ppn = (detail:any, tax: boolean) => {
		let totalBayar: any = Total(detail);
		let totalPPN: any = (totalBayar * isTax) / 100;
		return tax ? totalPPN.toString() : '0';
	};

	const GrandTotal = (detail:any, tax: boolean) => {
		let totalBayar: any = Total(detail);
		if (tax) {
			let totalPPN: any = Ppn(detail, tax);
			let total: any = parseInt(totalBayar) + parseInt(totalPPN);
			return total;
		} else {
			let total: any = parseInt(totalBayar);
			return total;
		}
	};

	const totalTermOfPayment = (data: any, detail:any, tax:boolean) => {
		let total: number = 0;
		let grandTotals: any = GrandTotal(detail,tax);
		total = (parseInt(grandTotals) * data) / 100;
		total = Math.ceil(total);
		return formatRupiah(total.toString());
	};

	const AddPurchaseOrder = async (payload: data) => {
		setIsLoading(true);
		let detail: any = [];
		let currency: string = "";
		let tax: string = "non_tax";
		let termOfPay: any = [];
		let totalPercent: number = 0;
		payload.detailMr.map((res: any) => {
			detail.push({
				id: res.id,
			});
		});
		payload.termOfPayment.map((res: any) => {
			let prices: any = res.price.replace(/[$.]/g, "");
			totalPercent = totalPercent + parseInt(res.percent);
			termOfPay.push({
				limitpay: res.limitpay,
				percent: parseInt(res.percent),
				price: parseInt(prices),
				invoice: res.invoice,
			});
		});
		let data = {
			id_so: generateIdNum(),
			date_prepared: payload.dateOfPO,
			your_reff: payload.ref,
			supplierId: payload.supplierId,
			note: payload.note,
			DP: payload.dp,
			term_of_pay_po_so: termOfPay,
			taxPsrDmr: payload.tax ? 'ppn' : 'non_tax',
			currency: 'IDR',
			delivery_time: payload.delivery_time,
			franco: payload.franco,
			payment_method: payload.payment_method,
			detailMrID: detail,
			detailSrID: null,
		};
		if (totalPercent === 100) {
			try {
				const response = await AddPoMr(data);
				if (response.data) {
					toast.success("Purchase Order Material Request Success", {
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
				toast.error("Purchase Order Material Request Failed", {
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
		} else if (totalPercent < 100) {
			toast.warning("Term Of Pay not yet 100%", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		} else {
			toast.warning("Term Of Pay exceed 100%", {
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

	const approve = async () => {
		try {
			const response = await ApprovalPoMr(dataSelected.id);
			if (response.status === 201) {
				toast.success("Approve Success", {
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
			} else {
				toast.error("Approve Failed", {
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
		} catch (error) {
			toast.error("Approve Failed", {
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
	};

	const showButtonValid = (data: any) => {
		if (position === "Manager") {
			if (data.status_manager) {
				return (
					<div>
						<button
							className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => showModalPdf(true)}
						>
							<div className='flex px-1 py-1'>
								<Printer size={16} className='mr-1' /> Print
							</div>
						</button>
						<button
							className={`justify-center rounded-full border border-transparent bg-gray-500 hover:bg-gray-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => approve()}
						>
							<div className='flex px-1 py-1'>
								<X size={16} className='mr-1' /> Unvalid Manager
							</div>
						</button>
					</div>
				);
			} else {
				return (
					<div>
						{/* <button
							className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => showModalPdf(true)}
						>
							<div className='flex px-1 py-1'>
								<Printer size={16} className='mr-1' /> Print
							</div>
						</button> */}
						<button
							className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => approve()}
						>
							<div className='flex px-1 py-1'>
								<Check size={16} className='mr-1' /> Valid Manager
							</div>
						</button>
					</div>
				);
			}
		} else {
			return (
				<div>
					{/* <button
						className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
						onClick={() => showModalPdf(true)}
					>
						<div className='flex px-1 py-1'>
							<Printer size={16} className='mr-1' /> Print
						</div>
					</button> */}
				</div>
			);
		}
	};

	const showModalPdf = (val: boolean) => {
		setIsModal(val);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Purchase Order</h1>
					<Formik
						initialValues={{ ...data }}
						// validationSchema={departemenSchema}
						onSubmit={(values) => {
							AddPurchaseOrder(values);
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
								<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<Input
											id='datePR'
											name='datePR'
											placeholder='Date Of Purchase'
											label='Date Of Purchase'
											type='text'
											value={moment(new Date()).format("DD-MMMM-YYYY")}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<InputSelectSearch
											datas={listSupplier}
											id='suplier'
											name='suplier'
											placeholder='Supplier'
											label='Supplier'
											onChange={(e: any) => {
												let detail: any = [];
												let termOfPayment: any = [
													{
														limitpay: "Normal",
														percent: 0,
														price: 0,
														invoice: "",
													},
												];
												dataSelected.detailMr.map((res: any) => {
													if (res.supplier.supplier_name === e.label) {
														detail.push({
															job_no: dataSelected.job_no,
															no_mr: dataSelected.no_mr,
															...res,
														});
													}
												});
												setContact(
													e.value.supplier.SupplierContact.length === 0
														? ""
														: e.value.supplier.SupplierContact[0].contact_person
												);
												setPhone(
													`+62${
														e.value.supplier.SupplierContact.length === 0
															? ""
															: e.value.supplier.SupplierContact[0].phone
													}`
												);
												setAddress(e.value.supplier.addresses_sup);
												setIsTax(e.value.supplier.ppn)
												setData({
													dateOfPO: new Date(),
													idPO: values.idPO,
													ref: values.ref,
													supplierId: e.value.supplier.id,
													delivery_time: values.delivery_time,
													franco: values.franco,
													tax: values.tax,
													payment_method: values.payment_method,
													dp: values.dp,
													note: values.note,
													termOfPayment: termOfPayment,
													detailMr: detail,
												});
											}}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<Input
											id='contact'
											name='contact'
											placeholder='Contact'
											label='Contact'
											type='text'
											value={contact}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<Input
											id='phone'
											name='phone'
											placeholder='Phone'
											label='Phone'
											type='text'
											value={phone}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
								</Section>
								<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<Input
											id='address'
											name='address'
											placeholder='Address'
											label='Address'
											type='text'
											value={address}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<Input
											id='ref'
											name='ref'
											placeholder='Your Ref'
											label='Your Ref'
											type='text'
											value={values.ref}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<InputSelect
											id='taxPsrDmr'
											name='taxPsrDmr'
											placeholder='Tax'
											label='Tax'
											onChange={(e:any) => {
												if(e.target.value === 'ppn'){
													setFieldValue('tax', true)
												}else{
													setFieldValue('tax', false)
												}
											}}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										>
											<option value='ppn'>PPN</option>
											<option value='non_tax'>Non Tax</option>
										</InputSelect>
									</div>
									<div className='w-full'>
										<Input
											id='note'
											name='note'
											placeholder='Note'
											label='Note'
											type='text'
											value={values.note}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
								</Section>
								<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<Input
											id='delivery_time'
											name='delivery_time'
											placeholder='Delivery time'
											label='Delivery time'
											type='text'
											value={values.delivery_time}
											onChange={handleChange}
											disabled={false}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<Input
											id='payment_method'
											name='payment_method'
											placeholder='Payment Method'
											label='Payment Method'
											type='text'
											value={values.payment_method}
											onChange={handleChange}
											disabled={false}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<Input
											id='franco'
											name='franco'
											placeholder='Franco'
											label='Franco'
											type='text'
											value={values.franco}
											onChange={handleChange}
											disabled={false}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
								</Section>
								{ values.termOfPayment.length > 0 ? (
									<h5 className='font-bold text-lg mt-2'>Term Of Payment</h5>
								) : null }
								<FieldArray
									name='termOfPayment'
									render={(arrayPayment) => {
										return values.termOfPayment.map((res: any, i: number) => {
											return (
												<Section
													className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2 border-b-[3px] border-b-green-500 pb-2'
													key={i}
												>
													<div className='w-full'>
														<InputSelect
															id={`termOfPayment.${i}.limitpay`}
															name={`termOfPayment.${i}.limitpay`}
															placeholder='Limit Payment'
															onChange={(e: any) => {
																setFieldValue(
																	`termOfPayment.${i}.limitpay`,
																	e.target.value
																);
															}}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														>
															<option value='Normal' selected>
																Normal
															</option>
															<option value='Down_Payment'>Down Payment</option>
															<option value='Termin_I'>Termin I</option>
															<option value='Termin_II'>Termin II</option>
															<option value='Termin_III'>Termin III</option>
															<option value='Termin_IV'>Termin IV</option>
															<option value='Termin_V'>Termin V</option>
															<option value='Repayment'>Repayment</option>
														</InputSelect>
													</div>
													<div className='w-full'>
														<Input
															id={`termOfPayment.${i}.percent`}
															name={`termOfPayment.${i}.percent`}
															placeholder='%'
															type='number'
															value={res.percent}
															onChange={(e: any) => {
																setFieldValue(
																	`termOfPayment.${i}.percent`,
																	e.target.value
																);
																setFieldValue(
																`termOfPayment.${i}.price`,
																totalTermOfPayment(e.target.value, values.detailMr, values.tax)
																);
															}}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`termOfPayment.${i}.price`}
															name={`termOfPayment.${i}.price`}
															placeholder='total'
															type='text'
															value={res.price}
															disabled={true}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`termOfPayment.${i}.invoice`}
															name={`termOfPayment.${i}.invoice`}
															placeholder='Refrence'
															type='text'
															value={res.ref}
															onChange={(e: any) => {
																setFieldValue(
																	`termOfPayment.${i}.invoice`,
																	e.target.value
																);
															}}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														{i === values.termOfPayment.length - 1 ? (
															<a
																className='inline-flex text-green-500 mr-6 mt-5 text-xl cursor-pointer'
																onClick={() => {
																	arrayPayment.push({
																		limitpay: "Normal",
																		percent: 0,
																		total: 0,
																		invoice: "",
																	});
																}}
															>
																<Plus size={22} className='mr-1 mt-1' /> Add
															</a>
														) : null}
														{values.termOfPayment.length !== 1 ? (
															<a
																className='inline-flex text-red-500 cursor-pointer text-xl mt-5'
																onClick={() => {
																	arrayPayment.remove(i);
																}}
															>
																<Trash2 size={22} className='mr-1 mt-1' />{" "}
																Remove
															</a>
														) : null}
													</div>
												</Section>
											);
										});
									}}
								/>
								{ values.detailMr.length > 0 ? (
									<h5 className='font-bold text-lg mt-2'>Detail Purchase</h5>
								) : null }
								{values.detailMr.map((result: any, i: number) => {
									return (
										<Section
											className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-4 border-b-[3px] border-b-red-500 pb-2'
											key={i}
										>
											<div className='w-full'>
												<Input
													id='job_no'
													name='job_no'
													placeholder='Job No'
													label='Job No / No MR'
													type='text'
													value={`${result.job_no} / ${result.no_mr}`}
													disabled={true}
													required={true}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												/>
											</div>
											<div className='w-full'>
												<Input
													id='material'
													name='material'
													placeholder='Material'
													label='Material'
													type='text'
													value={result.Material_Master.name}
													disabled={true}
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
													type='text'
													value={result.qtyAppr}
													disabled={true}
													required={true}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												/>
											</div>
											<div className='w-full'>
												<Input
													id='price'
													name='price'
													placeholder='Price'
													label='Price'
													type='text'
													value={formatRupiah(result.price.toString())}
													disabled={true}
													required={true}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												/>
											</div>
											<div className='w-full'>
												<Input
													id='disc'
													name='disc'
													placeholder='Disc'
													label='Disc'
													type='text'
													value={formatRupiah(result.disc.toString())}
													disabled={true}
													required={true}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												/>
											</div>
											<div className='w-full'>
												<Input
													id='total'
													name='total'
													placeholder='Total'
													label='Total'
													type='text'
													value={formatRupiah(result.total.toString())}
													disabled={true}
													required={true}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												/>
											</div>
										</Section>
									);
								})}
								{values.detailMr.length > 0 ? (
									<div className='w-full'>
										<Section className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2'>
											<div className='w-full'></div>
											<div className='w-full'></div>
											<div className='w-full'></div>
											<div className='w-full'></div>
											<div className='w-full'>
												<p className='text-xl mt-4 text-end'>Total</p>
											</div>
											<div className='w-full'>
												<Input
													id='total'
													name='total'
													placeholder='Total'
													type='text'
													value={formatRupiah(Total(values.detailMr))}
													disabled={true}
													required={true}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												/>
											</div>
										</Section>
										<Section className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2'>
											<div className='w-full'></div>
											<div className='w-full'></div>
											<div className='w-full'></div>
											<div className='w-full'></div>
											<div className='w-full'>
												<p className='text-xl mt-4 text-end'>PPN</p>
											</div>
											<div className='w-full'>
												<Input
													id='total'
													name='total'
													placeholder='PPN'
													type='text'
													value={formatRupiah(Ppn(values.detailMr, values.tax))}
													disabled={true}
													required={true}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												/>
											</div>
										</Section>
										<Section className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2'>
											<div className='w-full'></div>
											<div className='w-full'></div>
											<div className='w-full'></div>
											<div className='w-full'></div>
											<div className='w-full'>
												<p className='text-xl mt-4 text-end'>Grand Total</p>
											</div>
											<div className='w-full'>
												<Input
													id='total'
													name='total'
													placeholder='Grand Total'
													type='text'
													value={formatRupiah(GrandTotal(values.detailMr, values.tax).toString())}
													disabled={true}
													required={true}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												/>
											</div>
										</Section>
										{/* <Section className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2'>
									<div className='w-full'></div>
									<div className='w-full'></div>
									<div className='w-full'></div>
									<div className='w-full'></div>
									<div className='w-full'>
										<p className='text-xl mt-4 text-end'>DP</p>
									</div>
									<div className='w-full'>
										<Input
											id='dp'
											name='dp'
											placeholder='DP'
											type='number'
											value={values.dp}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
								</Section> */}
									</div>
								) : null}
								{values.detailMr.length === 0 ? null : (
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
								)}
							</Form>
						)}
					</Formik>
				</>
			) : null}
		</div>
	);
};
