import { Input, InputSelect, Section } from "@/src/components";
import { formatRupiah } from "@/src/utils";
import { FieldArray, Form, Formik } from "formik";
import moment from "moment";
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "react-feather";
import { EditPoMr } from "@/src/services";
import { toast } from "react-toastify";

interface props {
	content: string;
	dataSelected: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	id: string;
	your_reff: string;
	note: string;
	DP: number;
	tax: number;
	delivery_time: string;
	payment_method: string;
	franco: string;
	taxPsrDmr: string;
	term_of_pay_po_so: any;
	detailMr: any;
}

export const FormEditPo = ({ content, dataSelected, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [remove, setIsRemove] = useState<any>([]);
	const [data, setData] = useState<data>({
		id: "",
		your_reff: "",
		note: "",
		DP: 0,
		tax: 0,
		delivery_time: "",
		payment_method: "",
		franco: "",
		taxPsrDmr: "",
		term_of_pay_po_so: [],
		detailMr: [],
	});

	useEffect(() => {
		settingData();
	}, []);

	const settingData = () => {
		let termpay: any = [];
		let mr: any = [];
		dataSelected.term_of_pay_po_so?.map((res: any) => {
			termpay.push({
				id: res.id,
				poandsoId: res.poandsoId,
				limitpay: res.limitpay,
				price: res.price,
				percent: res.percent,
				invoice: res.invoice,
			});
		});
		dataSelected.detailMr?.map((res: any) => {
			mr.push(res);
		});
		setData({
			id: dataSelected.id,
			your_reff: dataSelected.your_reff,
			note: dataSelected.note,
			DP: dataSelected.DP,
			tax: dataSelected.supplier?.ppn,
			delivery_time: dataSelected.delivery_time,
			payment_method: dataSelected.payment_method,
			franco: dataSelected.franco,
			taxPsrDmr: dataSelected.taxPsrDmr,
			term_of_pay_po_so: termpay,
			detailMr: mr,
		});
	};

	const Total = (detail: any) => {
		let jumlahTotal: any = 0;
		detail.map((res: any) => {
			jumlahTotal = jumlahTotal + res.price * res.qtyAppr - res.disc;
		});
		return jumlahTotal.toString();
	};

	const Ppn = (detail: any) => {
		let totalBayar: any = Total(detail);
		let totalPPN: any = (totalBayar * dataSelected.supplier?.ppn) / 100;
		return totalPPN.toString();
	};

	const GrandTotal = (detail: any, taxPsrDmr: string) => {
		let totalBayar: any = Total(detail);
		if (taxPsrDmr === "ppn") {
			let totalPPN: any = Ppn(detail);
			let total: any = parseInt(totalBayar) + parseInt(totalPPN);
			return total;
		} else {
			let total: any = parseInt(totalBayar);
			return total;
		}
	};

	const totalTermOfPayment = (data: any, GrandTotal: number) => {
		let total: number = 0;
		let grandTotals: any = GrandTotal;
		total = (parseInt(grandTotals) * data) / 100;
		total = Math.ceil(total);
		return formatRupiah(total.toString());
	};

	const editPo = async (payload: any) => {
		setIsLoading(true)
		let term: any = [];
		let totalPercent: number = 0
		payload.term_of_pay_po_so.map((res: any) => {
			term.push({
				id: res.id,
				poandsoId: res.poandsoId,
				limitpay: res.limitpay,
				price: parseFloat(res.price.toString().replaceAll('.', '')),
				percent: parseFloat(res.percent),
				invoice: res.invoice,
			});
			totalPercent += parseFloat(res.percent)
		});
		let data = {
			id: payload.id,
			your_reff: payload.your_reff,
			note: payload.note,
			DP: parseFloat(payload.DP),
			delivery_time: payload.deliveru_time,
			payment_method: payload.payment_method,
			franco: payload.franco,
			taxPsrDmr: payload.taxPsrDmr,
			term_of_pay_po_so: term,
			delete: remove
		};
		if(totalPercent === 100){
			try {
				const response = await EditPoMr(data)
				if(response.data){
					toast.success("Edit Purchase Order Success", {
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
				toast.error("Edit Purchase Order Failed", {
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
		setIsLoading(false)
	};

	const removeTerm = (id: string) => {
		let listRemove: any = remove
		listRemove.push({
			id: id
		})
	}

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			<Formik
				initialValues={{ ...data }}
				onSubmit={(values) => {
					editPo(values);
				}}
				enableReinitialize
			>
				{({ handleSubmit, setFieldValue, handleChange, values }) => (
					<Form>
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='date'
									name='date'
									placeholder='date'
									label='Date Purchase'
									type='text'
									value={moment(dataSelected.date_prepared).format("LL")}
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
									placeholder='suplier'
									label='Suplier'
									type='text'
									value={dataSelected.supplier?.supplier_name}
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
									placeholder='contact'
									label='Contact'
									type='text'
									value={
										dataSelected.supplier?.SupplierContact[0]?.contact_person
									}
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
									placeholder='phone'
									label='Phone'
									type='text'
									value={`${
										dataSelected.supplier?.SupplierContact[0] ? "" : ""
									}`}
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
									placeholder='address'
									label='Address'
									type='text'
									value={dataSelected.supplier?.addresses_sup}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='your_reff'
									name='your_reff'
									placeholder='reff'
									label='Your Reff'
									type='text'
									value={values.your_reff}
									onChange={handleChange}
									disabled={false}
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
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option
										value='ppn'
										selected={values.taxPsrDmr === "ppn" ? true : false}
									>
										PPN
									</option>
									<option
										value='non_tax'
										selected={values.taxPsrDmr === "non_tax" ? true : false}
									>
										Non Tax
									</option>
								</InputSelect>
							</div>
							<div className='w-full'>
								<Input
									id='note'
									name='note'
									placeholder='note'
									label='Note'
									type='text'
									value={values.note}
									onChange={handleChange}
									disabled={false}
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
						{values.term_of_pay_po_so.length > 0 ? (
							<h5 className='font-bold text-lg mt-2'>Term Of Payment</h5>
						) : null}
						<FieldArray
							name='term_of_pay_po_so'
							render={(arrayTerm) =>
								values.term_of_pay_po_so.map((res: any, i: number) => {
									return (
										<Section
											className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2 border-b-[3px] border-b-green-500 pb-2'
											key={i}
										>
											<div className='w-full'>
												<InputSelect
													id={`term_of_pay_po_so.${i}.limitpay`}
													name={`term_of_pay_po_so.${i}.limitpay`}
													placeholder='Limit Payment'
													onChange={(e: any) => {
														setFieldValue(
															`term_of_pay_po_so.${i}.limitpay`,
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
													id={`term_of_pay_po_so.${i}.percent`}
													name={`term_of_pay_po_so.${i}.percent`}
													placeholder='%'
													type='number'
													value={res.percent}
													onChange={(e: any) => {
														if (e.target.value < 0 || e.target.value > 100) {
															setFieldValue(
																`term_of_pay_po_so.${i}.percent`,
																res.percent
															);
														} else {
															setFieldValue(
																`term_of_pay_po_so.${i}.percent`,
																e.target.value
															);
															setFieldValue(
																`term_of_pay_po_so.${i}.price`,
																totalTermOfPayment(e.target.value, GrandTotal(values.detailMr, values.taxPsrDmr))
															);
														}
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
													value={formatRupiah(res.price.toString())}
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
												{i === values.term_of_pay_po_so.length - 1 ? (
													<a
														className='inline-flex text-green-500 mr-6 mt-5 text-xl cursor-pointer'
														onClick={() => {
															arrayTerm.push({
																id: "",
																poandsoId: dataSelected.id,
																limitpay: "Normal",
																price: 0,
																percent: 0,
																invoice: "",
															});
														}}
													>
														<Plus size={22} className='mr-1 mt-1' /> Add
													</a>
												) : null}
												{values.term_of_pay_po_so.length !== 1 ? (
													<a
														className='inline-flex text-red-500 cursor-pointer text-xl mt-5'
														onClick={() => {
															if(res.id !== ""){
																removeTerm(res.id)
															}
															arrayTerm.remove(i);
														}}
													>
														<Trash2 size={22} className='mr-1 mt-1' /> Remove
													</a>
												) : null}
											</div>
										</Section>
									);
								})
							}
						/>
						{values.detailMr.length > 0 ? (
							<h5 className='font-bold text-lg mt-2'>Detail Purchase</h5>
						) : null}
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
											value={`${result.mr.job_no} / ${result.mr.no_mr}`}
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
									<div className='w-full col-span-5'>
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
								{values.taxPsrDmr === "ppn" ? (
									<Section className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2'>
										<div className='w-full col-span-5'>
											<p className='text-xl mt-4 text-end'>PPN</p>
										</div>
										<div className='w-full'>
											<Input
												id='total'
												name='total'
												placeholder='PPN'
												type='text'
												value={formatRupiah(Ppn(values.detailMr))}
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
										<p className='text-xl mt-4 text-end'>Grand Total</p>
									</div>
									<div className='w-full'>
										<Input
											id='total'
											name='total'
											placeholder='Grand Total'
											type='text'
											value={formatRupiah(
												GrandTotal(values.detailMr, values.taxPsrDmr).toString()
											)}
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
											"Edit"
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
