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
import { GetReceive, EditKontraBon } from "../../../services";
import { toast } from "react-toastify";
import moment from "moment";
import { formatRupiah } from "@/src/utils";

interface props {
	content: string;
	dataSelected: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	termId: string;
	poandsoId: string;
	id_kontrabon: string;
	account_name: string;
	tax_prepered: any;
	due_date: any;
	invoice: string;
	DO: string;
	purchaseID: string;
	grandtotal: number;
	tax_invoice: boolean;
	suplier: string;
	termOfPay: string;
	billpaid: number;
}

export const FormEditKontraBon = ({
	dataSelected,
	content,
	showModal,
}: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [dataPurchase, setDataPurchase] = useState<any>([]);
	const [dataAccBank, setDataAccBank] = useState<any>([]);
	const [bankSelected, setBankSelected] = useState<any>([]);
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
	const [cashAdv, setCashAdv] = useState<string>("");
	const [bankName, setBankName] = useState<string>("");
	const [accName, setAccName] = useState<string>("");
	const [accNo, setAccNo] = useState<string>("");
	const [totalAmount, setTotalAmount] = useState<number>(0);
	const [data, setData] = useState<data>({
		termId: "",
		poandsoId: "",
		id_kontrabon: "",
		account_name: "",
		purchaseID: "",
		tax_prepered: new Date(),
		due_date: new Date(),
		invoice: "",
		DO: "",
		grandtotal: 0,
		tax_invoice: true,
		suplier: "",
		termOfPay: "",
		billpaid: 0,
	});

	useEffect(() => {
		getPurchase();
		generateIdNum();
		settingData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		let disc: number = 0;
		let ppn: number = 0;
		let pph: number = 0;
		let bill: number = 0;
		let dataAcc: any = [];
		let datas: any = [];
		let hasTax: boolean = false;
		let typeTax: string = "";
		let typePurchase: string = "";

		if (dataSelected.term_of_pay_po_so) {
			datas = dataSelected.term_of_pay_po_so;
			typePurchase = "purchase"
			typeTax = dataSelected.term_of_pay_po_so.poandso.taxPsrDmr
			dataSelected.term_of_pay_po_so.poandso.detailMr.map((res: any) => {
				disc = disc + res.disc;
				bill = bill + res.total;
			});
			dataSelected.term_of_pay_po_so.poandso.SrDetail.map((res: any) => {
				disc = disc + res.disc;
				bill = bill + res.total;
			});
			// dataSelected.term_of_pay_po_so.poandso.supplier.SupplierBank.map(
			// 	(bank: any) => {
			// 		dataAcc.push({
			// 			label: `${bank.account_name} - ${bank.bank_name}`,
			// 			value: bank,
			// 		});
			// 	}
			// );
		} else {
			datas = dataSelected.purchase;
			typePurchase = "dirrect"
			typeTax = dataSelected.purchase.taxPsrDmr
			dataSelected.purchase.detailMr.map((res: any) => {
				disc = disc + res.disc;
				bill = bill + res.total;
			});
			dataSelected.purchase.SrDetail.map((res: any) => {
				disc = disc + res.disc;
				bill = bill + res.total;
			});
			// dataSelected.purchase.supplier.SupplierBank.map((bank: any) => {
			// 	dataAcc.push({
			// 		label: `${bank.account_name} - ${bank.bank_name}`,
			// 		value: bank,
			// 	});
			// });
		}

		if (typeTax === "ppn") {
			if (typePurchase === "purchase") {
				if (datas.tax_invoice) {
					ppn = (bill * datas.poandso.supplier.ppn) / 100;
					setTotalAmount(datas.price - disc + ppn);
				} else {
					setTotalAmount(datas.price - disc);
				}
			} else {
				ppn = (bill * datas.supplier.ppn) / 100;
				setTotalAmount(bill - disc + ppn);
			}
		} else if (typeTax === "pph") {
			if (typePurchase === "purchase") {
				if (datas.tax_invoice) {
					pph = (bill * datas.poandso.supplier.pph) / 100;
					setTotalAmount(datas.price - disc + pph);
				} else {
					setTotalAmount(datas.price - disc);
				}
			} else {
				pph = (bill * datas.supplier.pph) / 100;
				setTotalAmount(bill - disc + pph);
			}
		} else if (typeTax === "ppn_and_pph") {
			if (typePurchase === "purchase") {
				if (datas.tax_invoice) {
					ppn = (bill * datas.poandso.supplier.ppn) / 100;
					pph = (bill * datas.poandso.supplier.pph) / 100;
					setTotalAmount(datas.price - disc + ppn + pph);
				} else {
					setTotalAmount(datas.price - disc);
				}
			} else {
				ppn = (bill * datas.supplier.ppn) / 100;
				pph = (bill * datas.supplier.pph) / 100;
				setTotalAmount(bill - disc + ppn + pph);
			}
		}else {
			if(typePurchase === "purchase"){
				setTotalAmount(datas.price - disc);
			}else{
				setTotalAmount(bill - disc)
			}
		}
		// setBankSelected({
		// 	label: `${dataSelected.SupplierBank.account_name} - ${dataSelected.SupplierBank.bank_name}`,
		// 	value: dataSelected.SupplierBank,
		// });

		setPpn(ppn);
		setPph(pph);
		setPercent(datas.percent ? datas.percent : 100 );
		setBillAmount(bill);
		setDisc(disc);
		setDataAccBank(dataAcc);
		// setBankName(dataSelected.SupplierBank.bank_name);
		// setAccName(dataSelected.SupplierBank.account_name);
		// setAccNo(dataSelected.SupplierBank.rekening);
		setData({
			termId: dataSelected.termId,
			poandsoId: dataSelected.term_of_pay_po_so ? dataSelected.term_of_pay_po_so.poandso.id_so : null,
			purchaseID: dataSelected.term_of_pay_po_so ? null : dataSelected.purchase.idPurchase,
			suplier: dataSelected.term_of_pay_po_so ? dataSelected.term_of_pay_po_so.poandso.supplier.supplier_name : dataSelected.purchase.supplier.supplier_name,
			termOfPay: dataSelected.term_of_pay_po_so ? `${dataSelected.term_of_pay_po_so.limitpay} (${dataSelected.term_of_pay_po_so.percent}%)` : dataSelected.purchase.note,
			billpaid: dataSelected.term_of_pay_po_so ? dataSelected.term_of_pay_po_so.price : bill,
			id_kontrabon: dataSelected.id_kontrabon,
			account_name: dataSelected.account_name,
			tax_prepered: dataSelected.tax_prepered,
			due_date: dataSelected.due_date,
			invoice: dataSelected.invoice,
			DO: dataSelected.DO,
			grandtotal: dataSelected.grandtotal,
			tax_invoice: dataSelected.tax_invoice,
		});
	};

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
						label: res.id_so,
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

	const editKontraBon = async (payload: any) => {
		setIsLoading(true);
		const body = {
			account_name: payload.account_name,
			due_date: payload.due_date,
			invoice: payload.invoice,
			DO: payload.DO,
		};
		try {
			const response = await EditKontraBon(dataSelected.id, body);
			if (response) {
				toast.success("Edit Kontra Bon Success", {
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
			toast.error("Edit Kontra Bon Failed", {
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
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			<Formik
				initialValues={data}
				// validationSchema={kontraBonSchema}
				onSubmit={(values) => {
					editKontraBon(values);
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
									value={values.id_kontrabon}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='Id Purchase'
									name='Id Purchase'
									placeholder='Id Purchase'
									label='Id Purchase'
									type='text'
									required={true}
									disabled={true}
									withLabel={true}
									value={ values.poandsoId === null ? values.purchaseID : values.poandsoId}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							{/* <div className='w-full'>
								<InputSelectSearch
									datas={dataPurchase}
									id='job_no'
									name='job_no'
									placeholder='Job No'
									label='Job No'
									onChange={(e: any) => {
										console.log(e.value);
										selectPO(e.value);
										setFieldValue("id_kontrabon", idKontraBon);
										setFieldValue("poandsoId", e.value.id);
										setFieldValue("termId", e.value.term_of_pay_po_so[0].id);
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
							</div> */}
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
									value={values.suplier}
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
									value={values.termOfPay}
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
									value={formatRupiah(values.billpaid.toString())}
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
									value={formatRupiah(ppn.toString())}
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
						<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							{/* <div className='w-full'>
								<Input
									id='cash ADV'
									name='cash ADV'
									placeholder='Cash ADV'
									label='Cash ADV'
									type='text'
									required={true}
									disabled={true}
									withLabel={true}
									value={values.name}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div> */}
							{/* <div className='w-full'>
								<InputSelect
									id='tax'
									name='tax'
									placeholder='Pay Tax'
									label='Pay Tax'
									onChange={(e: any) => {
										if (e.target.value === "yes") {
											setFieldValue("tax_invoice", true);
											setPayTax(true);
											if (tax === "ppn") {
												setTotalAmount(billPaid + ppn);
												setFieldValue("grandtotal", billPaid + ppn);
											} else {
												setTotalAmount(billPaid);
												setFieldValue("grandtotal", billPaid);
											}
										} else {
											setPayTax(false);
											setTotalAmount(billPaid);
											setFieldValue("tax_invoice", false);
											setFieldValue("grandtotal", billPaid);
										}
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option value='yes' selected>
										Pay With Tax
									</option>
									<option value='no'>Pay No Tax</option>
								</InputSelect>
							</div> */}
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
										setBankSelected(e);
									}}
									value={bankSelected}
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
