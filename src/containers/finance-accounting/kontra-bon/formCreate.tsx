import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelectSearch,
	InputDate,
	InputSelect,
} from "../../../components";
import { Formik, Form } from "formik";
import { kontraBonSchema } from "../../../schema/finance-accounting/kontra-bon/kontrabonSchema";
import { GetReceive, AddKontraBon } from "../../../services";
import { toast } from "react-toastify";
import moment from "moment";
import { formatRupiah } from "@/src/utils";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	termId: string | null;
	poandsoId: string | null;
	id_kontrabon: string;
	account_name: string;
	tax_prepered: any;
	due_date: any;
	invoice: string;
	purchaseID: string | null;
	cdvId: string | null;
	DO: string;
	grandtotal: number;
	tax_invoice: boolean;
}

export const FormCreateKontraBon = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [dataPurchase, setDataPurchase] = useState<any>([]);
	const [dataAccBank, setDataAccBank] = useState<any>([]);
	const [idKontraBon, setIdKontraBon] = useState<string>("");
	const [suplier, setSuplier] = useState<string>("");
	const [termOfPayment, setTermOfPayment] = useState<string>("");
	const [billAmount, setBillAmount] = useState<number>(0);
	const [billPaid, setBillPaid] = useState<number>(0);
	const [percent, setPercent] = useState<number>(0);
	const [tax, setTax] = useState<string>("");
	const [ppn, setPpn] = useState<number>(0);
	const [pph, setPph] = useState<number>(0);
	const [disc, setDisc] = useState<number>(0);
	const [payTax, setPayTax] = useState<boolean>(true);
	const [Account, setAccount] = useState<boolean>(false);
	const [bankName, setBankName] = useState<string>("");
	const [accName, setAccName] = useState<string>("");
	const [accNo, setAccNo] = useState<string>("");
	const [totalAmount, setTotalAmount] = useState<number>(0);
	const [data, setData] = useState<data>({
		termId: null,
		poandsoId: null,
		id_kontrabon: "",
		account_name: "",
		purchaseID: null,
		cdvId: null,
		tax_prepered: new Date(),
		due_date: new Date(),
		invoice: "",
		DO: "",
		grandtotal: 0,
		tax_invoice: true,
	});

	useEffect(() => {
		getPurchase();
		generateIdNum();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		var year = dateObj.getUTCFullYear();
		const id =
			"KB" +
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 10000);
		setIdKontraBon(id);
	};

	const getPurchase = async () => { 
		setIsLoading(true);
		let data: any = [];
		try {
			const response = await GetReceive();
			if (response.data) {
				response.data.result.map((res: any) => {
					data.push({
						label: res.id_spj ? res.id_spj : res.id_so ? res.id_so : res.idPurchase,
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

	const taxAmount = (total: number, percent: number) => {
		let ppn = (total * percent) / 100;
		return ppn;
	};

	const selectPO = (data: any) => {
		let disc: number = 0;
		let ppn: number = 0;
		let pph: number = 0;
		let bill: number = 0;
		let billPaid: number = 0;
		let dataAcc: any = [];
		let hasTax: boolean = false;
		let taxType: string = "";
		if(data.detailMr === undefined){
			data.cdv_detail.map((res: any) => {
				bill = bill + res.actual
			})
			setTotalAmount(bill)
			setBillAmount(bill);
			setBillPaid(bill);
			setPercent(100)
			setTax("");
			setDataAccBank([]);
			setDisc(disc);
			setSuplier("-");
			setTermOfPayment("-");
			setAccount(false)
		}else{
			data.detailMr.map((res: any) => {
				disc = disc + res.disc;
				bill = bill + res.total;
			});
			data.SrDetail.map((res: any) => {
				disc = disc + res.disc;
				bill = bill + res.total;
			});
			data.supplier?.SupplierBank.map((bank: any) => {
				dataAcc.push({
					label: `${bank.account_name} - ${bank.bank_name}`,
					value: bank,
				});
			});
			if (data.taxPsrDmr === "ppn") {
				ppn = taxAmount(bill, data.supplier ? data.supplier.ppn : data.detailMr[0].supplier.ppn);
				billPaid = taxAmount(
					bill,
					data.term_of_pay_po_so ? data.term_of_pay_po_so[0].percent : 100
				);
				if (data.term_of_pay_po_so && data.term_of_pay_po_so[0].tax_invoice) {
					setTotalAmount(billPaid - disc);
				} else {
					setTotalAmount(billPaid - disc + ppn);
				}
			} else if (data.taxPsrDmr === "pph") {
				billPaid = taxAmount(
					bill,
					data.term_of_pay_po_so ? data.term_of_pay_po_so[0].percent : 100
				);
				pph = taxAmount(bill, data.supplier ? data.supplier.pph : data.detailMr[0].supplier.pph);
				if (data.term_of_pay_po_so && data.term_of_pay_po_so[0].tax_invoice) {
					setTotalAmount(billPaid - disc);
				} else {
					setTotalAmount(billPaid - disc + pph);
				}
			} else if (data.taxPsrDmr === "ppn_and_pph") {
				ppn = taxAmount(bill, data.supplier ? data.supplier.ppn : data.detailMr[0].supplier.ppn);
				pph = taxAmount(bill, data.supplier ? data.supplier.pph : data.detailMr[0].supplier.pph);
				billPaid = taxAmount(
					bill,
					data.term_of_pay_po_so ? data.term_of_pay_po_so[0].percent : 100
				);
				if (data.term_of_pay_po_so && data.term_of_pay_po_so[0].tax_invoice) {
					setTotalAmount(billPaid - disc);
				} else {
					setTotalAmount(billPaid - disc + ppn + pph);
				}
			} else {
				billPaid = taxAmount(
					bill,
					data.term_of_pay_po_so ? data.term_of_pay_po_so[0].percent : 100
				);
				setTotalAmount(billPaid - disc);
			}
			if (
				(data.term_of_pay_po_so &&
					!data.term_of_pay_po_so[0].tax_invoice &&
					data.taxPsrDmr === "ppn") ||
				(!data.term_of_pay_po_so && data.taxPsrDmr === "ppn")
			) {
				setPpn(ppn);
				setPph(0);
			} else if (
				(data.term_of_pay_po_so &&
					!data.term_of_pay_po_so[0].tax_invoice &&
					data.taxPsrDmr === "pph") ||
				(!data.term_of_pay_po_so && data.taxPsrDmr === "pph")
			) {
				setPph(pph);
				setPpn(0);
			} else if (
				(data.term_of_pay_po_so &&
					!data.term_of_pay_po_so[0].tax_invoice &&
					data.taxPsrDmr === "ppn_and_pph") ||
				(!data.term_of_pay_po_so && data.taxPsrDmr === "ppn_and_pph")
			) {
				setPph(pph);
				setPpn(ppn);
			} else {
				setPph(0);
				setPpn(0);
			}
			setTax(taxType);
			setDataAccBank(dataAcc);
			setBillAmount(bill);
			setBillPaid(billPaid);
			setDisc(disc);
			setSuplier(data.supplier ? data.supplier.supplier_name : data.detailMr[0].supplier.supplier_name);
			setPercent(
				data.term_of_pay_po_so ? data.term_of_pay_po_so[0].percent : 100
			);
			setTermOfPayment(
				data.term_of_pay_po_so
					? `${data.term_of_pay_po_so[0].limitpay} (${data.term_of_pay_po_so[0].percent}%)`
					: `${data.note}`
			);
			setAccount(true)
		}
	};

	const addKontraBon = async (payload: any) => {
		setIsLoading(true);
		try {
			const response = await AddKontraBon(payload);
			if (response) {
				toast.success("Add Kontra Bon Success", {
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
			toast.error("Add Kontra Bon Failed", {
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

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<Formik
				initialValues={data}
				// validationSchema={kontraBonSchema}
				onSubmit={(values) => {
					addKontraBon(values);
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
						<Section className='grid md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='id'
									name='id'
									placeholder='Id Kontra Bon'
									label='Id Kontra Bon'
									type='text'
									required={true}
									disabled={true}
									withLabel={true}
									value={idKontraBon}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputSelectSearch
									datas={dataPurchase}
									id='job_no'
									name='job_no'
									placeholder='ID Purchase'
									label='ID Purchase'
									onChange={(e: any) => {
										selectPO(e.value);
										if(e.value.cdv_detail !== undefined){
											let totalAmount = 0;
											e.value.cdv_detail.map( (res: any) => {
												totalAmount = totalAmount + res.actual
											})
											setFieldValue("purchaseID", null);
											setFieldValue("cdvId", e.value.id);
											setFieldValue("poandsoId", null);
											setFieldValue("termId", null);
											setFieldValue("tax_invoice", false);
											setFieldValue("grandtotal", totalAmount);
											setFieldValue("account_name", null);
											setPayTax(true);
										}else if (
											e.value.term_of_pay_po_so &&
											e.value.term_of_pay_po_so[0].tax_invoice
										) {
											setFieldValue("purchaseID", null);
											setFieldValue("cdvId", null);
											setFieldValue("poandsoId", e.value.id);
											setFieldValue("termId", e.value.term_of_pay_po_so[0].id);
											setFieldValue("tax_invoice", false);
											setPayTax(true);
										} else if (
											e.value.term_of_pay_po_so &&
											e.value.term_of_pay_po_so[0].status
										) {
											setFieldValue("purchaseID", null);
											setFieldValue("cdvId", null);
											setFieldValue("poandsoId", e.value.id);
											setFieldValue("termId", e.value.term_of_pay_po_so[0].id);
											setFieldValue("tax_invoice", true);
											setPayTax(true);
										} else if (!e.value.term_of_pay_po_so) {
											setFieldValue("poandsoId", null);
											setFieldValue("termId", null);
											setFieldValue("cdvId", null);
											setFieldValue("purchaseID", e.value.id);
											setFieldValue("tax_invoice", true);
											setPayTax(true);
											if(e.value.taxPsrDmr === 'nontax'){
												setFieldValue("tax_invoice",false);
											}else{
												setFieldValue("tax_invoice",true);
											}
										} else {
											setFieldValue("purchaseID", null);
											setFieldValue("cdvId", null);
											setFieldValue("poandsoId", e.value.id);
											setFieldValue("termId", e.value.term_of_pay_po_so[0].id);
											setFieldValue("tax_invoice", true);
											setPayTax(false);
										}
										setFieldValue("id_kontrabon", idKontraBon);
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='suplier'
									name='suplier'
									placeholder='Suplier/Vendor'
									label='Suplier/Vendor'
									type='text'
									required={true}
									disabled={true}
									withLabel={true}
									value={suplier}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='invoice'
									name='invoice'
									placeholder='Invoice Number'
									label='Invoice Number'
									type='text'
									required={true}
									disabled={isLoading}
									withLabel={true}
									value={values.invoice}
									onChange={handleChange}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='DO'
									name='DO'
									placeholder='DO'
									label='DO'
									type='text'
									required={true}
									disabled={isLoading}
									withLabel={true}
									value={values.DO}
									onChange={handleChange}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='term'
									name='term'
									placeholder='Term Of Condition'
									label='Term Of Condition'
									type='text'
									required={true}
									disabled={true}
									withLabel={true}
									value={termOfPayment}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='billPaid'
									name='billPaid'
									placeholder='Bill Paid'
									label={`Bill Paid ${percent}%`}
									type='text'
									required={true}
									disabled={true}
									withLabel={true}
									value={formatRupiah(billPaid.toString())}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='bill'
									name='bill'
									placeholder='Total Bill Amount'
									label='Total Bill Amount'
									type='text'
									required={true}
									disabled={true}
									withLabel={true}
									value={formatRupiah(billAmount.toString())}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='PPN'
									name='PPN'
									placeholder='PPN'
									label='PPN'
									type='text'
									required={true}
									disabled={true}
									withLabel={true}
									value={
										values.tax_invoice ? formatRupiah(ppn.toString()) : "0"
									}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='PPH'
									name='PPH'
									placeholder='PPH'
									label='PPH'
									type='text'
									required={true}
									disabled={true}
									withLabel={true}
									value={formatRupiah(pph.toString())}
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
									value={formatRupiah(disc.toString())}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputDate
									id='dueDate'
									label='Pay Date'
									value={values.due_date}
									minDate={new Date()}
									onChange={(value: any) => setFieldValue("due_date", value)}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
						</Section>
						{ Account ? (
							<>
								<Section className='grid md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<InputSelect
											id='tax'
											name='tax'
											placeholder='Pay Tax'
											label='Pay Tax'
											onChange={(e: any) => {
												if (e.target.value === "yes") {
													setFieldValue("tax_invoice", true);
													if (tax === "ppn") {
														setTotalAmount(billPaid + ppn);
														setFieldValue("grandtotal", billPaid + ppn);
													} else {
														setTotalAmount(billPaid);
														setFieldValue("grandtotal", billPaid);
													}
												} else {
													setTotalAmount(billPaid);
													setFieldValue("tax_invoice", false);
													setFieldValue("grandtotal", billPaid);
												}
											}}
											disabled={payTax}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										>
											<option value='yes' selected={values.tax_invoice}>
												Pay With Tax
											</option>
											<option value='no' selected={!values.tax_invoice}>
												Pay No Tax
											</option>
										</InputSelect>
									</div>
									<div className='w-full'>
										<Input
											id='totalAmount'
											name='totalAmount'
											placeholder='Total Amount'
											label='Total Amount'
											type='text'
											required={true}
											disabled={true}
											withLabel={true}
											value={formatRupiah(totalAmount.toString())}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<InputSelectSearch
											datas={dataAccBank}
											id='account_namec'
											name='account_name'
											placeholder='Acc Name'
											label='Acc Name'
											onChange={(e: any) => {
												setFieldValue("account_name", e.value.id);
												setFieldValue("grandtotal", totalAmount);
												setBankName(e.value.bank_name);
												setAccName(e.value.account_name);
												setAccNo(e.value.rekening);
											}}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
										/>
									</div>
								</Section>
								<Section className='grid md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<Input
											id='bankName'
											name='bankName'
											placeholder='Bank Name'
											label='Bank Name'
											type='text'
											required={true}
											disabled={true}
											withLabel={true}
											value={bankName}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<Input
											id='accName'
											name='accName'
											placeholder='Account Name'
											label='Account Name'
											type='text'
											required={true}
											disabled={true}
											withLabel={true}
											value={accName}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<Input
											id='accNumber'
											name='accNumber'
											placeholder='Account Number'
											label='Account Number'
											type='text'
											required={true}
											disabled={true}
											withLabel={true}
											value={accNo}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
								</Section>
							</>
						) : null }
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
