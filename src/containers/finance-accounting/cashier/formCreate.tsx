import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelectSearch,
	InputArea,
	InputSelect,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { GetCashier, AddCashier, GetAllCoa } from "../../../services";
import { toast } from "react-toastify";
import { rupiahFormat } from "@/src/utils";
import { Plus, Trash2 } from "react-feather";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	id_cashier: string;
	status_payment: string;
	id_cash_advance: string;
	kontrabonId: string;
	idPurchase: string;
	account_name: string;
	bank_name: string;
	rekening: string;
	date_cashier: Date;
	pay_to: string;
	note: string;
	total: number;
	journal_cashier: any;
}

export const FormCreateCashier = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDirrect, setIsDirrect] = useState<boolean>(true);
	const [dataPurchase, setDataPurchase] = useState<any>([]);
	const [dataCoa, setDataCoa] = useState<any>([]);
	const [detailCdv, setDetailCdv] = useState<any>([]);
	const [detailPurchase, setDetailPurchase] = useState<any>([]);
	const [jobno, setJobno] = useState<string>("");
	const [idCashier, setIdCashier] = useState<string>("");
	const [currency, setCurrency] = useState<string>("");
	const [total, setTotal] = useState<number>(0);
	const [ppn, setPpn] = useState<number>(0);
	const [pph, setPph] = useState<number>(0);
	const [disc, setDisc] = useState<number>(0);
	const [totalAmount, setTotalAmount] = useState<number>(0);
	const [data, setData] = useState<data>({
		id_cashier: "",
		status_payment: "Cash",
		kontrabonId: "",
		idPurchase: "",
		id_cash_advance: "",
		pay_to: "",
		account_name: "",
		bank_name: "",
		rekening: "",
		date_cashier: new Date(),
		note: "",
		total: 0,
		journal_cashier: [
			{
				coa_id: "",
				coa_name: "",
				status_transaction: "Debet",
				grandtotal: 0,
			},
		],
	});

	useEffect(() => {
		getCashier();
		getCoa();
		generateIdNum();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		var year = dateObj.getUTCFullYear();
		const id =
			"CS" +
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 10000);
		setIdCashier(id);
	};

	const getCashier = async () => {
		setIsLoading(true);
		let data: any = [];
		try {
			const response = await GetCashier();
			if (response.data) {
				data.push({
					label: "Direct",
					type: "Direct",
					value: [],
				});
				response.data.result.map((res: any) => {
					if (res.id_kontrabon) {
						data.push({
							label: `${res.id_kontrabon} - ${
								res.term_of_pay_po_so
									? res.term_of_pay_po_so.poandso.id_so
									: res.idPurchase
									? res.idPurchase
									: res.purchase.idPurchase
							}`,
							type: "kontrabon",
							value: res,
						});
					} else if (res.idPurchase) {
						data.push({
							label: res.idPurchase,
							type: "purchase",
							value: res,
						});
					} else {
						data.push({
							label: res.id_cash_advance,
							type: "ca",
							value: res,
						});
					}
				});
				setDataPurchase(data);
			}
		} catch (error: any) {
			setDataPurchase(data);
		}
		setIsLoading(false);
	};

	const getCoa = async () => {
		setIsLoading(true);
		let dataCoa: any = [];
		try {
			const response = await GetAllCoa();
			if (response.data) {
				response.data.result.map((res: any) => {
					dataCoa.push({
						label: `${res.coa_code} ${res.coa_name}`,
						value: res,
					});
				});
				setDataCoa(dataCoa);
			}
		} catch (error: any) {
			setDataCoa(dataCoa);
		}
		setIsLoading(false);
	};

	const totalPaid = (data: any) => {
		let totalPaidPurchase: number = 0;
		data.detailMr.map((res: any) => {
			totalPaidPurchase = totalPaidPurchase + res.total - res.disc;
		});
		data.SrDetail.map((res: any) => {
			totalPaidPurchase = totalPaidPurchase + res.total - res.disc;
		});
		return totalPaidPurchase;
	};

	const totalCa = (data: any) => {
		let totalPaidCa: number = 0;
		data.cdv_detail.map((res: any) => {
			totalPaidCa = totalPaidCa + res.total;
		});
		return totalPaidCa;
	};

	const grandTotalPaid = (data: any) => {
		let totalPaidPurchase: number = 0;
		data.detailMr.map((res: any) => {
			totalPaidPurchase = totalPaidPurchase + res.total;
		});
		data.SrDetail.map((res: any) => {
			totalPaidPurchase = totalPaidPurchase + res.total;
		});
		return totalPaidPurchase;
	};

	const taxAmount = (total: number, taxPercent: number, type: string) => {
		let amount = (total * taxPercent) / 100;
		if (type === "ppn") {
			setPpn(amount);
		} else {
			setPph(amount);
		}
	};

	const discAmount = (data: any) => {
		let discTotal: number = 0;
		data.detailMr.map((res: any) => {
			discTotal = discTotal + res.disc;
		});
		data.SrDetail.map((res: any) => {
			discTotal = discTotal + res.disc;
		});
		setDisc(discTotal);
	};

	const addCashier = async (payload: any) => {
		setIsLoading(true);
		let totalDebet: number = 0;
		let totalKredit: number = 0;
		let jurnal: any = [];
		payload.journal_cashier.map((res: any) => {
			jurnal.push({
				coa_id: res.coa_id,
				status_transaction: res.status_transaction,
				grandtotal: res.grandtotal,
			});
			if (res.status_transaction === "Debet") {
				totalDebet = totalDebet + res.grandtotal;
			} else {
				totalKredit = totalKredit + res.grandtotal;
			}
		});
		let data = {
			id_cashier: idCashier,
			status_payment: payload.status_payment,
			kontrabonId: payload.kontrabonId,
			cdvId: payload.id_cash_advance,
			idPurchase: payload.idPurchase === "" ? null : payload.idPurchase,
			date_cashier: payload.date_cashier,
			note: payload.note,
			total: payload.total,
			pay_to: payload.pay_to,
			account_name: payload.account_name,
			bank_name: payload.bank_name,
			rekening: payload.rekening,
			journal_cashier: jurnal,
		};
		if (totalDebet === 0 || totalKredit === 0) {
			toast.warning("Journal total has not been filled in", {
				position: "top-center",
				autoClose: 1000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		} else if (totalDebet !== totalKredit) {
			toast.warning("debits and credits are not balanced", {
				position: "top-center",
				autoClose: 1000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		} else if (totalDebet === totalKredit) {
			try {
				const response = await AddCashier(data);
				if (response) {
					toast.success("Add Cashier Success", {
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
				toast.error("Add Cashier Failed", {
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
		} else {
		}
		setIsLoading(false);
	};
	console.log(detailPurchase);
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<Formik
				initialValues={data}
				// validationSchema={kontraBonSchema}
				onSubmit={(values) => {
					addCashier(values);
				}}
				enableReinitialize
			>
				{({
					handleChange,
					setFieldValue,
					handleSubmit,
					errors,
					touched,
					values,
				}) => (
					<Form>
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='id'
									name='id'
									placeholder='Id Cashier'
									label='Id Cashier'
									type='text'
									required={true}
									disabled={true}
									withLabel={true}
									value={idCashier}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputSelectSearch
									datas={dataPurchase}
									id='reference'
									name='refernce'
									placeholder='Reference'
									label='Reference'
									onChange={(e: any) => {
										if (e.label === "Direct") {
											setCurrency("IDR");
											setTotal(0);
											setDetailCdv([]);
											setJobno("");
											setTotalAmount(0);
											setFieldValue("pay_to", "");
											setFieldValue("account_name", "");
											setFieldValue("bank_name", "");
											setFieldValue("rekening", "");
											setFieldValue("note", "");
											setFieldValue("kontrabonId", null);
											setFieldValue("id_cash_advance", null);
											setFieldValue("id_purchase", null);
											setFieldValue("total", 0);
											setFieldValue("status_payment", "Cash");
											setDisc(0);
											setPpn(0);
											setPph(0);
											setIsDirrect(false);
											setFieldValue("journal_cashier", [
												{
													coa_id: "",
													coa_name: "",
													status_transaction: "Debet",
													grandtotal: 0,
												},
											]);
										} else if (e.type === "kontrabon") {
											setIsDirrect(true);
											setDetailCdv([]);
											setDetailPurchase(
												e.value.detailMr ? e.value.detailMr : e.value.SrDetail
											);
											setJobno("");
											setFieldValue(
												"pay_to",
												e.value.id_kontrabon === undefined
													? e.value.employee.employee_name
													: e.value.term_of_pay_po_so
													? e.value.term_of_pay_po_so.poandso.supplier
															.supplier_name
													: e.value.purchase.supplier.supplier_name
											);
											setCurrency(
												e.value.id_kontrabon === undefined
													? "IDR"
													: e.value.term_of_pay_po_so
													? e.value.term_of_pay_po_so.poandso.currency
													: e.value.purchase.currency
											);
											setTotal(
												e.value.id_kontrabon === undefined
													? e.value.grand_tot
													: e.value.term_of_pay_po_so
													? totalPaid(e.value.term_of_pay_po_so?.poandso)
													: totalPaid(e.value.purchase)
											);
											setTotalAmount(
												e.value.id_kontrabon === undefined
													? e.value.grand_tot
													: e.value.grandtotal
											);
											setFieldValue(
												"account_name",
												e.value.id_kontrabon === undefined
													? ""
													: e.value.SupplierBank?.account_name
											);
											setFieldValue(
												"bank_name",
												e.value.id_kontrabon === undefined
													? ""
													: e.value.SupplierBank?.bank_name
											);
											setFieldValue(
												"rekening",
												e.value.id_kontrabon === undefined
													? ""
													: e.value.SupplierBank?.rekening
											);
											setFieldValue(
												"note",
												e.value.id_kontrabon === undefined
													? e.value.note
													: e.value.term_of_pay_po_so
													? `${e.value.term_of_pay_po_so.limitpay}, ${e.value.term_of_pay_po_so.poandso.note}`
													: `${e.value.purchase.note}`
											);
											setFieldValue(
												"kontrabonId",
												e.type === "kontrabon" ? e.value.id : null
											);
											setFieldValue(
												"id_cash_advance",
												e.type === "ca" ? e.value.id : null
											);
											setFieldValue(
												" idPurchase",
												e.type === "purchase" ? e.value.id : null
											);
											setFieldValue(
												"total",
												e.value.id_kontrabon === undefined
													? e.value.grand_tot
													: e.value.grandtotal
											);
											setFieldValue("status_payment", "Transfer");
											if (e.value.id_cash_advance) {
												setDisc(0);
												setPpn(0);
												setPph(0);
												setFieldValue("status_payment", "Cash");
											} else if (e.value.term_of_pay_po_so) {
												discAmount(e.value.term_of_pay_po_so.poandso);
												if (
													e.value.term_of_pay_po_so.tax_invoice &&
													e.value.term_of_pay_po_so.poandso.taxPsrDmr === "ppn"
												) {
													taxAmount(
														totalPaid(e.value.term_of_pay_po_so.poandso),
														e.value.term_of_pay_po_so.poandso.supplier.ppn,
														"ppn"
													);
												} else if (
													e.value.term_of_pay_po_so.tax_invoice &&
													e.value.term_of_pay_po_so.poandso.taxPsrDmr === "pph"
												) {
													taxAmount(
														totalPaid(e.value.term_of_pay_po_so.poandso),
														e.value.term_of_pay_po_so.poandso.supplier.pph,
														"pph"
													);
												} else if (
													e.value.term_of_pay_po_so.tax_invoice &&
													e.value.term_of_pay_po_so.poandso.taxPsrDmr ===
														"ppn_and_pph"
												) {
													taxAmount(
														totalPaid(e.value.term_of_pay_po_so.poandso),
														e.value.term_of_pay_po_so.poandso.supplier.ppn,
														"ppn"
													);
													taxAmount(
														totalPaid(e.value.term_of_pay_po_so.poandso),
														e.value.term_of_pay_po_so.poandso.supplier.pph,
														"pph"
													);
												} else {
													setPpn(0);
													setPph(0);
												}
											} else {
												discAmount(e.value.purchase);
												if (e.value.purchase.taxPsrDmr === "ppn") {
													taxAmount(
														totalPaid(e.value.purchase),
														e.value.purchase.supplier.ppn,
														"ppn"
													);
												} else if (e.value.purchase.taxPsrDmr === "pph") {
													taxAmount(
														totalPaid(e.value.purchase),
														e.value.purchase.supplier.pph,
														"pph"
													);
												} else if (
													e.value.purchase.taxPsrDmr === "ppn_and_pph"
												) {
													taxAmount(
														totalPaid(e.value.purchase),
														e.value.purchase.supplier.ppn,
														"ppn"
													);
													taxAmount(
														totalPaid(e.value.purchase),
														e.value.purchase.supplier.ppn,
														"pph"
													);
												} else {
													setPpn(0);
													setPph(0);
												}
											}
											setFieldValue("journal_cashier", [
												{
													coa_id: "",
													coa_name: "",
													status_transaction: "Debet",
													grandtotal: 0,
												},
											]);
										} else if (e.type === "purchase") {
											console.log(e);
											setIsDirrect(false);
											setDetailCdv([]);
											setDetailPurchase(
												e.value.detailMr ? e.value.detailMr : e.value.SrDetail
											);
											setJobno("");
											setCurrency(e.value.currency);
											setTotal(totalPaid(e.value));
											setTotalAmount(grandTotalPaid(e.value));
											setFieldValue("account_name", "");
											setFieldValue("bank_name", "");
											setFieldValue("rekening", "");
											setFieldValue("note", e.value.note);
											setFieldValue(
												"kontrabonId",
												e.type === "kontrabon" ? null : e.value.id
											);
											setFieldValue(
												"id_cash_advance",
												e.type === "ca" ? e.value.id : null
											);
											setFieldValue(
												"idPurchase",
												e.type === "purchase" ? e.value.id : null
											);
											setFieldValue("total", totalPaid(e.value));
											setFieldValue("status_payment", "Cash");
											if (e.value.type === "ca") {
												setDisc(0);
												setPpn(0);
												setPph(0);
												setFieldValue("status_payment", "Cash");
											} else if (e.type === "kontrabon") {
												discAmount(e.value.term_of_pay_po_so.poandso);
												if (
													e.value.term_of_pay_po_so.tax_invoice &&
													e.value.term_of_pay_po_so.poandso.taxPsrDmr === "ppn"
												) {
													taxAmount(
														totalPaid(e.value.term_of_pay_po_so.poandso),
														e.value.term_of_pay_po_so.poandso.supplier.ppn,
														"ppn"
													);
												} else if (
													e.value.term_of_pay_po_so.tax_invoice &&
													e.value.term_of_pay_po_so.poandso.taxPsrDmr === "pph"
												) {
													taxAmount(
														totalPaid(e.value.term_of_pay_po_so.poandso),
														e.value.term_of_pay_po_so.poandso.supplier.pph,
														"pph"
													);
												} else if (
													e.value.term_of_pay_po_so.tax_invoice &&
													e.value.term_of_pay_po_so.poandso.taxPsrDmr ===
														"ppn_and_pph"
												) {
													taxAmount(
														totalPaid(e.value.term_of_pay_po_so.poandso),
														e.value.term_of_pay_po_so.poandso.supplier.ppn,
														"ppn"
													);
													taxAmount(
														totalPaid(e.value.term_of_pay_po_so.poandso),
														e.value.term_of_pay_po_so.poandso.supplier.pph,
														"pph"
													);
												} else {
													setPpn(0);
													setPph(0);
												}
											} else if (e.type === "purchase") {
												discAmount(e.value);
												// setDisc(0);
												setPpn(0);
												setPph(0);
												setFieldValue("status_payment", "Cash");
											} else {
												discAmount(e.value.purchase);
												if (e.value.purchase.taxPsrDmr === "ppn") {
													taxAmount(
														totalPaid(e.value.purchase),
														e.value.purchase.supplier.ppn,
														"ppn"
													);
												} else if (e.value.purchase.taxPsrDmr === "pph") {
													taxAmount(
														totalPaid(e.value.purchase),
														e.value.purchase.supplier.pph,
														"pph"
													);
												} else if (
													e.value.purchase.taxPsrDmr === "ppn_and_pph"
												) {
													taxAmount(
														totalPaid(e.value.purchase),
														e.value.purchase.supplier.ppn,
														"ppn"
													);
													taxAmount(
														totalPaid(e.value.purchase),
														e.value.purchase.supplier.ppn,
														"pph"
													);
												} else {
													setPpn(0);
													setPph(0);
												}
											}
										} else {
											setIsDirrect(false);
											setDetailCdv(e.value.cdv_detail);
											setDetailPurchase([]);
											setJobno(e.value.job_no);
											setDisc(0);
											setPpn(0);
											setPph(0);
											setCurrency("IDR");
											setTotal(totalCa(e.value));
											setTotalAmount(totalCa(e.value));
											setFieldValue("account_name", "");
											setFieldValue(
												"pay_to",
												e.value.user.employee.employee_name
											);
											setFieldValue("bank_name", "");
											setFieldValue("rekening", "");
											setFieldValue("note", e.value.note);
											setFieldValue("kontrabonId", null);
											setFieldValue(
												"id_cash_advance",
												e.type === "ca" ? e.value.id : null
											);
											setFieldValue("idPurchase", null);
											setFieldValue("total", totalCa(e.value));
											setFieldValue("status_payment", e.value.status_payment);
											setFieldValue("journal_cashier", [
												{
													coa_id: "",
													coa_name: "",
													status_transaction: "Debet",
													grandtotal: 0,
												},
											]);
										}
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='pay_to'
									name='pay_to'
									placeholder='Pay To'
									label='Pay To'
									type='text'
									onChange={(e: any) => {
										setFieldValue("pay_to", e.target.value);
									}}
									required={true}
									disabled={isDirrect}
									withLabel={true}
									value={values.pay_to}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='currency'
									name='currency'
									placeholder='Currency'
									label='Currency'
									type='text'
									required={true}
									disabled={true}
									withLabel={true}
									value={currency}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='total'
									name='total'
									placeholder='Total Pay'
									label='Total Pay'
									type='text'
									required={true}
									pattern='\d*'
									onChange={(e: any) => {
										let totals: number = 0;
										if (e.target.value !== "") {
											totals = parseInt(e.target.value.replace(/\./g, ""));
											setTotal(totals);
											setTotalAmount(totals + ppn + pph - disc);
											setFieldValue("total", totals + ppn + pph - disc);
										} else {
											setTotal(0);
											setTotalAmount(0 + ppn + pph - disc);
											setFieldValue("total", 0 + ppn + pph - disc);
										}
									}}
									disabled={isDirrect}
									withLabel={true}
									value={rupiahFormat(total.toString())}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='ppn'
									name='ppn'
									placeholder='PPN'
									label='PPN'
									type='text'
									pattern='\d*'
									onChange={(e: any) => {
										let ppns: number = 0;
										if (e.target.value !== "") {
											ppns = parseInt(e.target.value.replace(/\./g, ""));
											setPpn(ppns);
											setTotalAmount(total + ppns + pph - disc);
											setFieldValue("total", total + ppns + pph - disc);
										} else {
											setPpn(0);
											setTotalAmount(total + 0 + pph - disc);
											setFieldValue("total", total + 0 + pph - disc);
										}
									}}
									required={true}
									disabled={isDirrect}
									withLabel={true}
									value={rupiahFormat(ppn.toString())}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='pph'
									name='pph'
									placeholder='PPH'
									label='PPH'
									type='text'
									pattern='\d*'
									onChange={(e: any) => {
										let pphs: number = 0;
										if (e.target.value !== "") {
											pphs = parseInt(e.target.value.replace(/\./g, ""));
											setPph(pphs);
											setTotalAmount(total + ppn + pphs - disc);
											setFieldValue("total", total + ppn + pphs - disc);
										} else {
											setPph(0);
											setTotalAmount(total + ppn + 0 - disc);
											setFieldValue("total", total + ppn + 0 - disc);
										}
									}}
									required={true}
									disabled={isDirrect}
									withLabel={true}
									value={rupiahFormat(pph.toString())}
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
									pattern='\d*'
									onChange={(e: any) => {
										let discs: number = 0;
										if (e.target.value !== "") {
											discs = parseInt(e.target.value.replace(/\./g, ""));
											setDisc(discs);
											setTotalAmount(total + ppn + pph - discs);
											setFieldValue("total", total + ppn + pph - discs);
										} else {
											setDisc(0);
											setTotalAmount(total + ppn + pph - 0);
											setFieldValue("total", total + ppn + pph - 0);
										}
									}}
									required={true}
									disabled={isDirrect}
									withLabel={true}
									value={rupiahFormat(disc.toString())}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='grandTotal'
									name='grandTotal'
									placeholder='Grand Total'
									label='Grand Total'
									type='text'
									required={true}
									disabled={true}
									withLabel={true}
									value={rupiahFormat(totalAmount.toString())}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputSelect
									id='pay_with'
									name='pay_with'
									placeholder='Pay With'
									label='Pay With'
									type='text'
									value={values.status_payment}
									onChange={(e: any) => {
										setFieldValue("status_payment", e.target.value);
										setFieldValue("account_name", "");
										setFieldValue("bank_name", "");
										setFieldValue("rekening", "");
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option value='Transfer'>Transfer</option>
									<option value='Cash'>Cash</option>
								</InputSelect>
							</div>
							<div className='w-full col-span-2'>
								<InputArea
									id='note'
									name='note'
									placeholder='Note'
									label='Note'
									type='text'
									onChange={handleChange}
									required={true}
									withLabel={true}
									value={values.note}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						{values.status_payment === "Transfer" ? (
							<Section className='grid md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2 pb-2 border-b border-b-gray-500 '>
								<div className='w-full'>
									<Input
										id='bank_name'
										name='bank_name'
										placeholder='Bank Name'
										label='Bank Name'
										type='text'
										required={true}
										onChange={handleChange}
										withLabel={true}
										value={values.bank_name}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
								<div className='w-full'>
									<Input
										id='account_name'
										name='account_name'
										placeholder='Account Name'
										label='Account Name'
										type='text'
										required={true}
										onChange={handleChange}
										withLabel={true}
										value={values.account_name}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
								<div className='w-full'>
									<Input
										id='rekening'
										name='rekening'
										placeholder='Account Number'
										label='Account Number'
										type='text'
										required={true}
										onChange={handleChange}
										withLabel={true}
										value={values.rekening}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
							</Section>
						) : null}
						<FieldArray
							name='journal_cashier'
							render={(arrays) =>
								values.journal_cashier.map((result: any, i: number) => {
									return (
										<div key={i}>
											<Section className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2 pt-2 border-b-2 border-blue-500 pb-2'>
												<div className='w-full'>
													<InputSelectSearch
														datas={dataCoa}
														menuPlacement='top'
														id={`journal_cashier.${i}.coa_id`}
														name={`journal_cashier.${i}.coa_id`}
														label='Coa'
														value={result.coa}
														onChange={(e: any) => {
															setFieldValue(
																`journal_cashier.${i}.coa_name`,
																e.value.coa_name
															);
															setFieldValue(
																`journal_cashier.${i}.coa_id`,
																e.value.id
															);
															setFieldValue(`journal_cashier.${i}.coa`, e);
														}}
														required={true}
														withLabel={false}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<Input
														id={`journal_cashier.${i}.coa_name`}
														name={`journal_cashier.${i}.coa_name`}
														placeholder='Coa'
														label='coa'
														type='text'
														required={true}
														disabled={true}
														withLabel={false}
														value={result.coa_name}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<InputSelect
														id={`journal_cashier.${i}.status_transaction`}
														name={`journal_cashier.${i}.status_transaction`}
														label='Status'
														type='text'
														onChange={handleChange}
														required={true}
														withLabel={false}
														value={result.status_transaction}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													>
														<option value='Debet'>Debet</option>
														<option value='Kredit'>Kredit</option>
													</InputSelect>
												</div>
												<div className='w-full'>
													<Input
														id={`journal_cashier.${i}.grandtotal`}
														name={`journal_cashier.${i}.grandtotal`}
														placeholder='total'
														label='total'
														type='text'
														pattern='\d*'
														onChange={(e: any) => {
															let totals: number = 0;
															if (e.target.value !== "") {
																totals = parseInt(
																	e.target.value.replace(/\./g, "")
																);
																setFieldValue(
																	`journal_cashier.${i}.grandtotal`,
																	totals
																);
															} else {
																setFieldValue(
																	`journal_cashier.${i}.grandtotal`,
																	totals
																);
															}
														}}
														required={true}
														withLabel={false}
														value={rupiahFormat(result.grandtotal.toString())}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													{i === values.journal_cashier.length - 1 ? (
														<a
															className='inline-flex text-green-500 mr-6 mt-1 cursor-pointer'
															onClick={() => {
																arrays.push({
																	coa_id: "",
																	coa_name: "",
																	status_transaction: "Debet",
																	grandtotal: 0,
																});
															}}
														>
															<Plus size={18} className='mr-1 mt-1' /> Add
														</a>
													) : null}
													{values.journal_cashier.length !== 1 ? (
														<a
															className='inline-flex text-red-500 cursor-pointer mt-1'
															onClick={() => {
																arrays.remove(i);
															}}
														>
															<Trash2 size={18} className='mr-1 mt-1' />
															Remove
														</a>
													) : null}
												</div>
											</Section>
										</div>
									);
								})
							}
						/>
						{detailCdv.length > 0 ? (
							<h1 className='font-semibold text-xl mt-2'>
								Cash Advance Detail
							</h1>
						) : null}
						{detailCdv.map((res: any, i: number) => {
							return (
								<Section
									className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'
									key={i}
								>
									<Input
										id='jobno'
										name='jobno'
										placeholder='Job No'
										label='Job No'
										type='text'
										value={jobno}
										required={true}
										disabled={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
									<Input
										id='total'
										name='total'
										placeholder='Total'
										label='Total'
										type='text'
										value={rupiahFormat(res.total)}
										required={true}
										disabled={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
									<InputArea
										id='description'
										name='description'
										placeholder='description'
										label='Description'
										type='text'
										required={true}
										disabled={true}
										withLabel={true}
										value={res.description}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</Section>
							);
						})}
						{detailPurchase.length > 0 ? (
							<h1 className='font-semibold text-xl mt-2'>Detail Purchase</h1>
						) : null}
						{detailPurchase.map((res: any, i: number) => {
							return (
								<Section
									className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2'
									key={i}
								>
									<InputArea
										id='jobno'
										name='jobno'
										placeholder='Material'
										label='Material'
										type='text'
										value={res?.Material_Master?.name}
										required={true}
										disabled={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
									<Input
										id='total'
										name='total'
										placeholder='Quantity'
										label='Quantity'
										type='text'
										value={rupiahFormat(res?.qtyAppr)}
										required={true}
										disabled={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
									<Input
										id='total'
										name='total'
										placeholder='Price'
										label='Price'
										type='text'
										value={rupiahFormat(res?.price)}
										required={true}
										disabled={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
									<Input
										id='total'
										name='total'
										placeholder='Discon'
										label='Discon'
										type='text'
										value={rupiahFormat(res?.disc)}
										required={true}
										disabled={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
									<Input
										id='total'
										name='total'
										placeholder='Total'
										label='Total'
										type='text'
										value={rupiahFormat(res?.total)}
										required={true}
										disabled={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</Section>
							);
						})}
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
