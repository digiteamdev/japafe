import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputSelectSearch,
	InputArea,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import {
	GetAllSupplier,
	GetAllPoMr,
	GetAllCoa,
	AddPoMr,
} from "../../../services";
import { toast } from "react-toastify";
import moment from "moment";
import { getIdUser } from "../../../configs/session";
import { ChevronDown, ChevronUp, Trash2, Plus } from "react-feather";
import { Disclosure } from "@headlessui/react";
import { formatRupiah } from "@/src/utils";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	dateOfPO: any;
	idPO: string;
	ref: string;
	note: string;
	supplierId: string;
	taxPsrDmr: string;
	currency: string;
	dp: any;
	termOfPayment: any;
	detailMr: any;
}

export const FormCreatePurchaseSr = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listSupplier, setListSupplier] = useState<any>([]);
	const [listDataSuplier, setListDataSupplier] = useState<any>([]);
	const [contact, setContact] = useState<string>("");
	const [phone, setPhone] = useState<string>("");
	const [address, setAddress] = useState<string>("");
	const [currency, setCurrency] = useState<string>("");
	const [listMr, setListMr] = useState<any>([]);
	const [userId, setUserId] = useState<string>("");
	const [suplierId, setSuplierId] = useState<string>("");
	const [idPR, setIdPR] = useState<string>("");
	const [total, setTotal] = useState<string>("");
	const [tax, setTax] = useState<string>("");
	const [typeTax, setTypeTax] = useState<string>("non_tax");
	const [ppn, setPpn] = useState<string>("0");
	const [pph, setPph] = useState<string>("0");
	const [ppnPercent, setPpnPercent] = useState<number>(0);
	const [pphPercent, setPphPercent] = useState<number>(0);
	const [countTax, setCountTax] = useState<string>("0");
	const [grandTotal, setGrandTotal] = useState<string>("");
	const [data, setData] = useState<data>({
		dateOfPO: new Date(),
		idPO: "",
		ref: "",
		supplierId: "",
		dp: 0,
		note: "",
		taxPsrDmr: "",
		currency: "IDR",
		termOfPayment: [],
		detailMr: [],
	});

	useEffect(() => {
		let idUser = getIdUser();
		setData({
			dateOfPO: new Date(),
			idPO: generateIdNum(),
			ref: "",
			supplierId: "",
			note: "",
			taxPsrDmr: "non_tax",
			currency: "IDR",
			dp: 0,
			termOfPayment: [],
			detailMr: [],
		});
		if (idUser !== undefined) {
			setUserId(idUser);
		}
		setIdPR(generateIdNum());
		getSrPo();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getSrPo = async () => {
		try {
			const response = await GetAllPoMr(1,1,"PSR");
			if (response) {
				let detail: any = [];
				let suplier: any = [];
				let dataSuplier: any = [];

				response.data.result.map((res: any) => {
					res.SrDetail.map((result: any) => {
						if (!suplier.includes(result.supplier.supplier_name)) {
							suplier.push({
								label: result.supplier.supplier_name,
								value: res,
							});
							dataSuplier.push(result.supplier);
						}
						detail.push({
							id: result.id,
							no_mr: result.sr.no_sr,
							user: result.sr.user.employee.employee_name,
							supId: result.supId,
							taxpr: res.taxPsrDmr,
							akunId: result.akunId,
							disc: result.disc,
							currency: res.currency,
							total: result.total,
							desc: result.desc,
							qty: result.qtyAppr,
							note: result.note,
							price: result.price,
							job_no: result.sr.job_no,
						});
					});
				});
				setListSupplier(suplier);
				setListDataSupplier(dataSuplier);
				setListMr(detail);
			}
		} catch (error) {
			setListMr([]);
		}
	};

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		var year = dateObj.getUTCFullYear();
		const id =
			"SO" +
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 10000);
		return id;
	};

	const AddPurchaseOrder = async (payload: data) => {
		setIsLoading(true);
		let detail: any = [];
		let termOfPay: any = [];
		let termOfPayPercent: number = 0;
		payload.detailMr.map((res: any) => {
			detail.push({
				id: res.id,
			});
		});
		payload.termOfPayment.map((res: any) => {
			let prices: any = res.price.toString().replace(/[$.]/g, "");
			termOfPayPercent = termOfPayPercent + parseInt(res.percent);
			termOfPay.push({
				limitpay: res.limitpay,
				percent: parseInt(res.percent),
				price: parseInt(prices),
				invoice: res.invoice,
			});
		});
		let data = {
			id_so: payload.idPO,
			date_prepared: payload.dateOfPO,
			your_reff: payload.ref,
			supplierId: suplierId,
			note: payload.note,
			currency: currency,
			taxPsrDmr: typeTax,
			DP: payload.dp,
			term_of_pay_po_so: termOfPay,
			detailMrID: null,
			detailSrID: detail,
		};
		if (termOfPayPercent === 100) {
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
		} else if (termOfPayPercent > 100) {
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
		} else if (termOfPayPercent < 100) {
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
		}
		setIsLoading(false);
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name === "suplier") {
			if (event.target.value !== "no data") {
				listDataSuplier.map((res: any) => {
					if (res.supplier_name === event.target.value) {
						let detail: any = [];
						let total: number = 0;
						let totalTax: number = 0;
						let tax: boolean = false;
						let taxSo: string = "";
						let termOfPayment: any = [
							{
								limitpay: "Normal",
								percent: 0,
								price: 0,
								invoice: "",
							},
						];
						listMr.map((mr: any) => {
							if (mr.supId === res.id) {
								detail.push(mr);
								setCurrency(mr.currency);
								setTypeTax(mr.taxpr);
								total = total + mr.total;
								if (
									mr.taxpr === "ppn" ||
									mr.taxpr === "pph" ||
									mr.taxpr === "ppn_and_pph"
								) {
									tax = true;
									taxSo = mr.taxpr;
								}
							}
						});
						let totalTaxPpn = (total * res.ppn) / 100;
						let totalTaxPph = (total * res.pph) / 100;
						setPpnPercent(res.ppn);
						setPphPercent(res.pph);
						setPpn(formatRupiah(totalTaxPpn.toString()));
						setPph(formatRupiah(totalTaxPph.toString()));
						if (tax && taxSo === "ppn") {
							let grandTotal: number = total + totalTaxPpn;
							setGrandTotal(formatRupiah(grandTotal.toString()));
						} else if (tax && taxSo === "pph") {
							let grandTotal: number = total - totalTaxPph;
							setGrandTotal(formatRupiah(grandTotal.toString()));
						} else if (tax && taxSo === "ppn_and_pph") {
							let grandTotal: number = total + totalTaxPpn - totalTaxPph;
							setGrandTotal(formatRupiah(grandTotal.toString()));
						} else {
							setGrandTotal(formatRupiah(total.toString()));
						}

						setTotal(formatRupiah(total.toString()));
						setContact(res.SupplierContact[0].contact_person);
						setPhone(`+62${res.SupplierContact[0].phone}`);
						setAddress(res.addresses_sup);
						setSuplierId(res.id);
						setData({
							dateOfPO: data.dateOfPO,
							idPO: data.idPO,
							ref: "",
							note: "",
							supplierId: "",
							taxPsrDmr: event.taxpr,
							currency: event.currency,
							dp: 0,
							termOfPayment: termOfPayment,
							detailMr: detail,
						});
					}
				});
			} else {
				setData({
					dateOfPO: data.dateOfPO,
					idPO: data.idPO,
					ref: "",
					note: "",
					supplierId: "",
					taxPsrDmr: "",
					currency: "",
					dp: 0,
					termOfPayment: [],
					detailMr: [],
				});
				setCurrency("");
				setContact("");
				setPhone("");
				setAddress("");
				setSuplierId("");
			}
		}
	};

	const totalTermOfPayment = (data: any) => {
		let total: number = 0;
		let grandTotals: any = grandTotal.replace(/[$.]/g, "");
		total = (parseInt(grandTotals) * data) / 100;
		total = Math.ceil(total);
		return formatRupiah(total.toString());
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
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
					<Form onChange={handleOnChanges}>
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
										let total: number = 0;
										let totalTax: number = 0;
										let tax: boolean = false;
										let taxSo: string = "";
										let termOfPayment: any = [
											{
												limitpay: "Normal",
												percent: 0,
												price: 0,
												invoice: "",
											},
										];
										e.value.SrDetail.map((res: any) => {
											detail.push(res);
											setCurrency(res.currency);
											setTypeTax(res.taxpr);
											total = total + res.total;
											if (
												res.taxpr === "ppn" ||
												res.taxpr === "pph" ||
												res.taxpr === "ppn_and_pph"
											) {
												tax = true;
												taxSo = res.taxpr;
											}
											let totalTaxPpn = (total * res.ppn) / 100;
											let totalTaxPph = (total * res.pph) / 100;
											setPpnPercent(res.ppn);
											setPphPercent(res.pph);
											setPpn(formatRupiah(totalTaxPpn.toString()));
											setPph(formatRupiah(totalTaxPph.toString()));
											if (tax && taxSo === "ppn") {
												let grandTotal: number = total + totalTaxPpn;
												setGrandTotal(formatRupiah(grandTotal.toString()));
											} else if (tax && taxSo === "pph") {
												let grandTotal: number = total + totalTaxPph;
												setGrandTotal(formatRupiah(grandTotal.toString()));
											} else if (tax && taxSo === "ppn_and_pph") {
												let grandTotal: number =
													total + totalTaxPpn + totalTaxPph;
												setGrandTotal(formatRupiah(grandTotal.toString()));
											} else {
												setGrandTotal(formatRupiah(total.toString()));
											}
											setContact(
												res.supplier.SupplierContact[0]?.contact_person
											);
											setPhone(res.supplier.SupplierContact[0]?.phone);
											setAddress(res.addresses_sup);
											setSuplierId(res.supplier.id);
											setCurrency(e.value.currency);
											setTotal(formatRupiah(total.toString()));
											setData({
												dateOfPO: data.dateOfPO,
												idPO: data.idPO,
												ref: "",
												note: "",
												supplierId: "",
												taxPsrDmr: res.taxpr,
												currency: res.currency,
												dp: 0,
												termOfPayment: termOfPayment,
												detailMr: detail,
											});
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
									value={phone ? `+62${phone}` : ""}
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
								<Input
									id='curr'
									name='curr'
									placeholder='Currency'
									label='Currency'
									type='text'
									value={currency}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
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
						<h5 className='mt-2'>Term Of Payment</h5>
						<FieldArray
							name='termOfPayment'
							render={(arrayPayment) => {
								return values.termOfPayment.map((res: any, i: number) => {
									return (
										<Section
											className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2'
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
															totalTermOfPayment(e.target.value)
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
														<Trash2 size={22} className='mr-1 mt-1' /> Remove
													</a>
												) : null}
											</div>
										</Section>
									);
								});
							}}
						/>
						{values.detailMr.map((result: any, i: number) => {
							return (
								<Section
									className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-4'
									key={i}
								>
									<div className='w-full'>
										<Input
											id='job_no'
											name='job_no'
											placeholder='Job No'
											label='Job No / No SR'
											type='text'
											value={`${result.sr.job_no} / ${result.sr.no_sr}`}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<InputArea
											id='desc'
											name='desc'
											placeholder='Description'
											label='Description'
											value={result.desc}
											required={true}
											disabled={true}
											row={2}
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
											value={result.qty}
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
											placeholder='Prince'
											label='Prince'
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
									<div className='w-full col-span-5'>
										<p className='text-xl mt-4 text-end'>Total ({currency})</p>
									</div>
									<div className='w-full'>
										<Input
											id='total'
											name='total'
											placeholder='Total'
											type='text'
											value={total}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
								</Section>
								{typeTax === "ppn" ? (
									<Section className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2'>
										<div className='w-full col-span-5'>
											<p className='text-xl mt-4 text-end'>
												PPN {ppnPercent}% {currency}
											</p>
										</div>
										<div className='w-full'>
											<Input
												id='total'
												name='total'
												placeholder='PPN'
												type='text'
												value={ppn}
												disabled={true}
												required={true}
												withLabel={true}
												className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
											/>
										</div>
									</Section>
								) : typeTax === "pph" ? (
									<Section className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2'>
										<div className='w-full col-span-5'>
											<p className='text-xl mt-4 text-end'>
												PPH {pphPercent}% {currency}
											</p>
										</div>
										<div className='w-full'>
											<Input
												id='total'
												name='total'
												placeholder='PPH'
												type='text'
												value={pph}
												disabled={true}
												required={true}
												withLabel={true}
												className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
											/>
										</div>
									</Section>
								) : typeTax === "ppn_and_pph" ? (
									<>
										<Section className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2'>
											<div className='w-full col-span-5'>
												<p className='text-xl mt-4 text-end'>
													PPN {ppnPercent}% {currency}
												</p>
											</div>
											<div className='w-full'>
												<Input
													id='total'
													name='total'
													placeholder='PPH'
													type='text'
													value={ppn}
													disabled={true}
													required={true}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												/>
											</div>
										</Section>
										<Section className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2'>
											<div className='w-full col-span-5'>
												<p className='text-xl mt-4 text-end'>
													PPH {pphPercent}% {currency}
												</p>
											</div>
											<div className='w-full'>
												<Input
													id='total'
													name='total'
													placeholder='PPH'
													type='text'
													value={pph}
													disabled={true}
													required={true}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												/>
											</div>
										</Section>
									</>
								) : null}
								<Section className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2'>
									<div className='w-full col-span-5'>
										<p className='text-xl mt-4 text-end'>
											Grand Total ({currency})
										</p>
									</div>
									<div className='w-full'>
										<Input
											id='total'
											name='total'
											placeholder='Grand Total'
											type='text'
											value={grandTotal}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
								</Section>
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
		</div>
	);
};
