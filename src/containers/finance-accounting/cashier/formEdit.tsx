import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelectSearch,
	InputArea,
	InputSelect,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { cashierSchema } from "../../../schema/finance-accounting/cashier/cashierSchema";
import { GetCashier, EditCashier, GetAllCoa } from "../../../services";
import { toast } from "react-toastify";
import moment from "moment";
import { formatRupiah } from "@/src/utils";
import { Plus, Trash2 } from "react-feather";

interface props {
	content: string;
	dataSelected: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	id_cashier: string;
	status_payment: string;
	kontrabonId: string;
	cdvId: string;
	reference: string;
	suplier: string;
	currency: string;
	disc: number;
	ppn: number;
	pph: number;
	totalPay: number;
	date_cashier: Date;
	note: string;
	total: number;
	bank_name: string;
	acc_name: string;
	acc_number: string;
	journal_cashier: any;
}

export const FormEditCashier = ({
	content,
	dataSelected,
	showModal,
}: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [dataPurchase, setDataPurchase] = useState<any>([]);
	const [dataCoa, setDataCoa] = useState<any>([]);
	const [idCashier, setIdCashier] = useState<string>("");
	const [tax, setTax] = useState<string>("");
	const [suplier, setSuplier] = useState<string>("");
	const [currency, setCurrency] = useState<string>("");
	const [total, setTotal] = useState<number>(0);
	const [ppn, setPpn] = useState<number>(0);
	const [pph, setPph] = useState<number>(0);
	const [disc, setDisc] = useState<number>(0);
	const [totalAmount, setTotalAmount] = useState<number>(0);
	const [bankName, setBankName] = useState<string>("");
	const [accNumber, setAccNumber] = useState<string>("");
	const [accName, setAccName] = useState<string>("");
	const [data, setData] = useState<data>({
		id_cashier: "",
		status_payment: "Transfer",
		kontrabonId: "",
		cdvId: "",
		reference: "",
		suplier: "",
		currency: "",
		disc: 0,
		ppn: 0,
		pph: 0,
		totalPay: 0,
		date_cashier: new Date(),
		note: "",
		total: 0,
		bank_name: "",
		acc_name: "",
		acc_number: "",
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
		settingData();
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

	const settingData = () => {
		let jurnal: any = [];
		if(dataSelected.kontrabonId === null){
			setTax('nonetax')
		}else if (dataSelected.kontrabon.term_of_pay_po_so === null) {
			setTax(dataSelected.kontrabon.purchase.taxPsrDmr);
		} else {
			setTax(dataSelected.kontrabon.term_of_pay_po_so.poandso.taxPsrDmr);
		}
		dataSelected.journal_cashier.map((res: any) => {
			jurnal.push({
				id: res.id,
				coa_id: res.coa_id,
				coa: {
					label: res.coa.coa_name,
					value: res,
				},
				coa_name: res.coa.coa_name,
				cashier_id: res.cashier_id,
				status_transaction: res.status_transaction,
				grandtotal: res.grandtotal,
			});
		});
		setData({
			id_cashier: dataSelected.id_cashier,
			status_payment: dataSelected.status_payment,
			cdvId: dataSelected.cdvId,
			kontrabonId: dataSelected.kontrabonId,
			date_cashier: dataSelected.date_cashier,
			reference: dataSelected.kontrabonId === null ? dataSelected.cash_advance.id_cash_advance : `${dataSelected.kontrabon.id_kontrabon} - ${
				dataSelected.kontrabon.term_of_pay_po_so === null
					? dataSelected.kontrabon.purchase.idPurchase
					: dataSelected.kontrabon.term_of_pay_po_so.poandso.id_so
			}`,
			suplier:
			dataSelected.kontrabonId === null ? dataSelected.cash_advance.employee.employee_name : dataSelected.kontrabon.term_of_pay_po_so === null
					? dataSelected.kontrabon.purchase.supplier.supplier_name
					: dataSelected.kontrabon.term_of_pay_po_so.poandso.supplier
							.supplier_name,
			currency:
			dataSelected.kontrabonId === null ? "IDR" : dataSelected.kontrabon.term_of_pay_po_so === null
					? dataSelected.kontrabon.purchase.currency
					: dataSelected.kontrabon.term_of_pay_po_so.poandso.currency,
			disc:
			dataSelected.kontrabonId === null ? 0 : dataSelected.kontrabon.term_of_pay_po_so === null
					? discAmount(dataSelected.kontrabon.purchase)
					: discAmount(dataSelected.kontrabon.term_of_pay_po_so.poandso),
			ppn: dataSelected.kontrabonId === null ? 0 : taxAmount(
				dataSelected.kontrabon.term_of_pay_po_so === null
					? totalPaid(dataSelected.kontrabon.purchase)
					: totalPaid(dataSelected.kontrabon.term_of_pay_po_so.poandso),
				dataSelected.kontrabon.term_of_pay_po_so === null
					? dataSelected.kontrabon.purchase.supplier.ppn
					: dataSelected.kontrabon.term_of_pay_po_so.poandso.supplier.ppn
			),
			pph: dataSelected.kontrabonId === null ? 0 : taxAmount(
				dataSelected.kontrabon.term_of_pay_po_so === null
					? totalPaid(dataSelected.kontrabon.purchase)
					: totalPaid(dataSelected.kontrabon.term_of_pay_po_so.poandso),
				dataSelected.kontrabon.term_of_pay_po_so === null
					? dataSelected.kontrabon.purchase.supplier.pph
					: dataSelected.kontrabon.term_of_pay_po_so.poandso.supplier.pph
			),
			totalPay:
			dataSelected.kontrabonId === null ? dataSelected.total : dataSelected.kontrabon.term_of_pay_po_so === null
					? totalPaid(dataSelected.kontrabon.purchase)
					: dataSelected.kontrabon.term_of_pay_po_so.price,
			note: dataSelected.note,
			total: dataSelected.total,
			bank_name: dataSelected.kontrabonId === null ? "" : dataSelected.kontrabon.SupplierBank.bank_name,
			acc_name: dataSelected.kontrabonId === null ? "" : dataSelected.kontrabon.SupplierBank.account_name,
			acc_number: dataSelected.kontrabonId === null ? "" : dataSelected.kontrabon.SupplierBank.rekening,
			journal_cashier: jurnal,
		});
	};

	const getCashier = async () => {
		setIsLoading(true);
		let data: any = [];
		try {
			const response = await GetCashier();
			if (response.data) {
				response.data.result.map((res: any) => {
					data.push({
						label: `${res.id_kontrabon} - ${
							res.term_of_pay_po_so
								? res.term_of_pay_po_so.poandso.id_so
								: res.purchase.idPurchase
						}`,
						value: res,
					});
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
						label: res.coa_name,
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
			totalPaidPurchase = totalPaidPurchase + res.total;
		});
		data.SrDetail.map((res: any) => {
			totalPaidPurchase = totalPaidPurchase + res.total;
		});
		return totalPaidPurchase;
	};

	const taxAmount = (data: number, taxPercent: number) => {
		let amount = (data * taxPercent) / 100;
		return amount;
	};

	const discAmount = (data: any) => {
		let discTotal: number = 0;
		data.detailMr.map((res: any) => {
			discTotal = discTotal + res.disc;
		});
		data.SrDetail.map((res: any) => {
			discTotal = discTotal + res.disc;
		});
		return discTotal;
	};

	const editCashier = async (payload: any) => {
		setIsLoading(true);
		let totalDebet: number = 0;
		let totalKredit: number = 0;
		let jurnal: any = [];
		payload.journal_cashier.map((res: any) => {
			jurnal.push({
				id: res.id,
				coa_id: res.coa_id,
				cashier_id: res.cashier_id,
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
			status_payment: payload.status_payment,
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
				const response = await EditCashier(dataSelected.id, data);
				if (response) {
					toast.success("Edit Cashier Success", {
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
				toast.error("Edit Cashier Failed", {
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

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<Formik
				initialValues={data}
				// validationSchema={kontraBonSchema}
				onSubmit={(values) => {
					editCashier(values);
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
									value={values.id_cashier}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='reference'
									name='refernce'
									placeholder='Reference'
									label='Reference'
									type='text'
									required={true}
									disabled={true}
									withLabel={true}
									value={values.reference}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{/* <InputSelectSearch
									datas={dataPurchase}
									id='reference'
									name='refernce'
									placeholder='Reference'
									label='Reference'
									onChange={(e: any) => {
										setSuplier(
											e.value.term_of_pay_po_so ? e.value.term_of_pay_po_so.poandso.supplier.supplier_name : e.value.purchase.supplier.supplier_name
										);
										setCurrency(e.value.term_of_pay_po_so ?e.value.term_of_pay_po_so.poandso.currency : e.value.purchase.currency);
										setTotal(e.value.term_of_pay_po_so ? e.value.term_of_pay_po_so.price : totalPaid(e.value.purchase) );
										discAmount(e.value.term_of_pay_po_so ? e.value.term_of_pay_po_so.poandso : e.value.purchase);
										setTotalAmount(e.value.grandtotal);
										setBankName(e.value.SupplierBank.bank_name);
										setAccName(e.value.SupplierBank.account_name);
										setAccNumber(e.value.SupplierBank.rekening);
										setFieldValue(
											"note",
											e.value.term_of_pay_po_so ? `${e.value.term_of_pay_po_so.limitpay}, ${e.value.term_of_pay_po_so.poandso.note}` : `${e.value.purchase.note}`
										);
										setFieldValue(
											"kontrabonId", e.value.id
										);
										setFieldValue(
											"total", e.value.grandtotal
										);
										if(e.value.term_of_pay_po_so){
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
												e.value.term_of_pay_po_so.poandso.taxPsrDmr === "ppn_and_pph"
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
										}else{
											if(e.value.purchase.taxPsrDmr === 'ppn'){
												taxAmount(
													totalPaid(e.value.purchase),
													e.value.purchase.supplier.ppn,
													"ppn"
												);
											}else if(e.value.purchase.taxPsrDmr === 'pph'){
												taxAmount(
													totalPaid(e.value.purchase),
													e.value.purchase.supplier.pph,
													"pph"
												);
											}else if(e.value.purchase.taxPsrDmr === 'ppn_and_pph'){
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
											}else{
												setPpn(0);
												setPph(0);
											}
										}
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/> */}
							</div>
							<div className='w-full'>
								<Input
									id='pay_to'
									name='pay_to'
									placeholder='Pay To'
									label='Pay To'
									type='text'
									required={true}
									disabled={true}
									withLabel={true}
									value={values.suplier}
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
									value={values.currency}
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
									disabled={true}
									withLabel={true}
									value={formatRupiah(values.totalPay.toString())}
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
									required={true}
									disabled={true}
									withLabel={true}
									value={
										tax === "ppn" || tax === "ppn_and_pph"
											? formatRupiah(values.ppn.toString())
											: 0
									}
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
									required={true}
									disabled={true}
									withLabel={true}
									value={
										tax === "pph" || tax === "ppn_and_pph"
											? formatRupiah(values.pph.toString())
											: 0
									}
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
									disabled={true}
									withLabel={true}
									value={formatRupiah(values.disc.toString())}
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
									value={formatRupiah(values.total.toString())}
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
						<Section className='grid md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2 pb-2 border-b border-b-gray-500 '>
							<div className='w-full'>
								<Input
									id='bank_name'
									name='bank_name'
									placeholder='Bank Name'
									label='Bank Name'
									type='text'
									required={true}
									disabled={true}
									withLabel={true}
									value={values.bank_name}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='acc_name'
									name='acc_name'
									placeholder='Account Name'
									label='Account Name'
									type='text'
									required={true}
									disabled={true}
									withLabel={true}
									value={values.acc_name}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='acc_no'
									name='acc_no'
									placeholder='Account Number'
									label='Account Number'
									type='text'
									required={true}
									disabled={true}
									withLabel={true}
									value={values.acc_number}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<FieldArray
							name='journal_cashier'
							render={(arrays) =>
								values.journal_cashier.map((result: any, i: number) => {
									return (
										<div key={i}>
											<Section className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2 pt-2'>
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
														type='number'
														onChange={handleChange}
														required={true}
														withLabel={false}
														value={result.grandtotal}
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
																	status_transaction: "",
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
