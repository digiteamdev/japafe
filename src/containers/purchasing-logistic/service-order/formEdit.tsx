import { useState, useEffect } from "react";
import { Section, Input, InputSelect, InputArea } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { GetAllPoMr, EditPoMr, DeletePoMr } from "../../../services";
import { toast } from "react-toastify";
import moment from "moment";
import { getIdUser } from "../../../configs/session";
import { Trash2, Plus } from "react-feather";
import { formatRupiah } from "@/src/utils";

interface props {
	content: string;
	dataSelected: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	dateOfPO: any;
	idPO: string;
	ref: string;
	note: string;
	supplierId: string;
	supplier: string;
	dp: any;
	termOfPayment: any;
	detailMr: any;
}

export const FormEditPurchaseSr = ({
	content,
	showModal,
	dataSelected,
}: props) => {
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
	const [taxPpn, setTaxPpn] = useState<string>("");
	const [taxPph, setTaxPph] = useState<string>("");
	const [countTaxPpn, setCountTaxPpn] = useState<string>("");
	const [countTaxPph, setCountTaxPph] = useState<string>("");
	const [grandTotal, setGrandTotal] = useState<string>("");
	const [listRemoveTerm, setListRemoveTerm] = useState<any>([]);
	const [data, setData] = useState<data>({
		dateOfPO: new Date(),
		idPO: "",
		ref: "",
		supplierId: "",
		supplier: "",
		dp: 0,
		note: "",
		termOfPayment: [],
		detailMr: [],
	});

	useEffect(() => {
		let idUser = getIdUser();
		settingData();
		if (idUser !== undefined) {
			setUserId(idUser);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		let detail: any = [];
		let termOfPayment: any = [];
		let total: number = 0;
		let totalTaxPpn: number = 0;
		let totalTaxPph: number = 0;
		let tax: boolean = false;
		let taxSo: string = "";

		dataSelected.term_of_pay_po_so.map((res: any, i: number) => {
			termOfPayment.push({
				id: res.id ? res.id : "",
				poandsoId: dataSelected.id,
				limitpay: res.limitpay,
				price: formatRupiah(res.price.toString()),
				percent: res.percent,
				invoice: res.invoice,
			});
		});
		dataSelected.SrDetail.map((result: any) => {
			detail.push({
				id: result.id,
				no_mr: result.sr.no_sr,
				user: result.sr.user.employee.employee_name,
				supId: result.supId,
				taxpr: result.taxPsrDmr,
				akunId: result.akunId,
				disc: result.disc,
				currency: result.currency,
				total: result.total,
				desc: result.desc,
				qty: result.qtyAppr,
				note: result.note,
				price: result.price,
				job_no: result.sr.job_no,
			});
			setCurrency(dataSelected.currency);
			total = total + result.total;
			if (
				result.taxPsrDmr === "ppn" ||
				result.taxPsrDmr === "pph" ||
				result.taxPsrDmr === "ppn_and_pph"
			) {
				tax = true;
				taxSo = result.taxPsrDmr;
			}
		});
		if (tax && taxSo === "ppn") {
			totalTaxPpn = (total * dataSelected.supplier.ppn) / 100;
			setCountTaxPpn(`PPN ${dataSelected.supplier.ppn}`);
			setTaxPpn(formatRupiah(totalTaxPpn.toString()));
		} else if (tax && taxSo === "pph") {
			totalTaxPph = (total * dataSelected.supplier.pph) / 100;
			setCountTaxPph(`PPH ${dataSelected.supplier.pph}`);
			setTaxPph(formatRupiah(totalTaxPph.toString()));
		} else if (tax && taxSo === "ppn_and_pph") {
			totalTaxPpn = (total * dataSelected.supplier.ppn) / 100;
			setCountTaxPpn(`PPN ${dataSelected.supplier.ppn}`);
			setTaxPpn(formatRupiah(totalTaxPpn.toString()));

			totalTaxPph = (total * dataSelected.supplier.pph) / 100;
			setCountTaxPph(`PPH ${dataSelected.supplier.pph}`);
			setTaxPph(formatRupiah(totalTaxPph.toString()));
		}
		let grandTotal: number = total + totalTaxPpn - totalTaxPph;
		setTotal(formatRupiah(total.toString()));
		setGrandTotal(formatRupiah(grandTotal.toString()));
		setContact(dataSelected.supplier.SupplierContact[0]?.contact_person);
		setPhone(
			dataSelected.supplier.SupplierContact.length > 0
				? `+62${dataSelected.supplier.SupplierContact[0]?.phone}`
				: ""
		);
		setAddress(dataSelected.supplier.addresses_sup);
		setData({
			dateOfPO: dataSelected.date_prepared,
			idPO: dataSelected.id_so,
			ref: dataSelected.your_reff,
			supplierId: dataSelected.supplier.id,
			supplier: dataSelected.supplier.supplier_name,
			note: dataSelected.note,
			dp: dataSelected.DP,
			termOfPayment: termOfPayment,
			detailMr: detail,
		});
	};

	const editPurchaseOrder = async (payload: data) => {
		setIsLoading(true);
		let termOfPay: any = [];
		payload.termOfPayment.map((res: any) => {
			let prices: any = res.price.replace(/[$.]/g, "");
			termOfPay.push({
				id: res.id ? res.id : "",
				poandsoId: dataSelected.id,
				limitpay: res.limitpay,
				price: parseInt(prices),
				percent: res.percent,
				invoice: res.invoice,
			});
		});
		let data = {
			id: dataSelected.id,
			your_reff: payload.ref,
			note: payload.note,
			DP: payload.dp,
			term_of_pay_po_so: termOfPay,
		};

		try {
			const response = await EditPoMr(data);
			if (response.data) {
				if (listRemoveTerm.length > 0) {
					let termOfPayRemove: any = {
						termOfPayRemove: listRemoveTerm,
					};
					await DeletePoMr(termOfPayRemove);
				}
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
		setIsLoading(false);
	};

	const totalTermOfPayment = (data: any) => {
		let total: number = 0;
		let grandTotals: any = grandTotal.replace(/[$.]/g, "");
		total = (parseInt(grandTotals) * data) / 100;
		total = Math.ceil(total);
		return formatRupiah(total.toString());
	};

	const removeTerm = (id: string) => {
		let dataRemove: any = listRemoveTerm;
		dataRemove.push({ id: id });
		setListRemoveTerm(dataRemove);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			<Formik
				initialValues={{ ...data }}
				// validationSchema={departemenSchema}
				onSubmit={(values) => {
					editPurchaseOrder(values);
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
									value={moment(values.dateOfPO).format("DD-MMMM-YYYY")}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='suplier'
									name='suplier'
									placeholder='Suplier'
									label='Suplier'
									type='text'
									value={values.supplier}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
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
													<option
														value='Normal'
														selected={res.limitpay === "Normal"}
													>
														Normal
													</option>
													<option
														value='Down_Payment'
														selected={res.limitpay === "Down_Payment"}
													>
														Down Payment
													</option>
													<option
														value='Termin_I'
														selected={res.limitpay === "Termin_I"}
													>
														Termin I
													</option>
													<option
														value='Termin_II'
														selected={res.limitpay === "Termin_II"}
													>
														Termin II
													</option>
													<option
														value='Termin_III'
														selected={res.limitpay === "TErmin_III"}
													>
														Termin III
													</option>
													<option
														value='Termin_IV'
														selected={res.limitpay === "Termin_IV"}
													>
														Termin IV
													</option>
													<option
														value='Termin_V'
														selected={res.limitpay === "Termin_V"}
													>
														Termin V
													</option>
													<option
														value='Repayment'
														selected={res.limitpay === "Repayment"}
													>
														Repayment
													</option>
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
															parseInt(e.target.value)
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
													type='number'
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
													value={res.invoice}
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
																limitPay: "normal",
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
															if (res.id !== "") {
																removeTerm(res.id);
															}
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
											value={`${result.job_no} / ${result.no_mr}`}
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
								{countTaxPpn !== "" ? (
									<Section className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2'>
										<div className='w-full col-span-5'>
											<p className='text-xl mt-4 text-end'>{countTaxPpn}%  ({currency})</p>
										</div>
										<div className='w-full'>
											<Input
												id='total'
												name='total'
												placeholder='PPN'
												type='text'
												value={taxPpn}
												disabled={true}
												required={true}
												withLabel={true}
												className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
											/>
										</div>
									</Section>
								) : null}
								{countTaxPph !== "" ? (
									<Section className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2'>
										<div className='w-full col-span-5'>
											<p className='text-xl mt-4 text-end'>{countTaxPph}%  ({currency})</p>
										</div>
										<div className='w-full'>
											<Input
												id='total'
												name='total'
												placeholder='PPN'
												type='text'
												value={taxPph}
												disabled={true}
												required={true}
												withLabel={true}
												className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
											/>
										</div>
									</Section>
								) : null}
								<Section className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2'>
									<div className='w-full col-span-5'>
										<p className='text-xl mt-4 text-end'>Grand Total  ({currency})</p>
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
