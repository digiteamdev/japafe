import { useState, useEffect } from "react";
import { ApprovalKontraBon } from "../../../services";
import { Section } from "../../../components";
import { formatRupiah } from "../../../utils/index";
import { getPosition } from "../../../configs/session";
import { Check, X, Printer } from "react-feather";
import moment from "moment";
import { toast } from "react-toastify";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewDuePayment = ({ dataSelected, content, showModal }: props) => {
	const [isModal, setIsModal] = useState<boolean>(false);
	const [position, setPosition] = useState<any>([]);

	useEffect(() => {
		let positionAkun = getPosition();
		if (positionAkun !== undefined) {
			setPosition(positionAkun);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const discount = () => {
		let discount: number = 0;
		if (dataSelected.purchase) {
			dataSelected.purchase.detailMr.map((res: any) => {
				discount = discount + res.disc;
			});
			dataSelected.purchase.SrDetail.map((res: any) => {
				discount = discount + res.disc;
			});
		} else {
			dataSelected.term_of_pay_po_so.poandso.detailMr.map((res: any) => {
				discount = discount + res.disc;
			});
			dataSelected.term_of_pay_po_so.poandso.SrDetail.map((res: any) => {
				discount = discount + res.disc;
			});
		}
		return discount;
	};

	const total = () => {
		let total: number = 0;
		if (dataSelected.purchase) {
			dataSelected.purchase.detailMr.map((res: any) => {
				total = total + res.total;
			});
			dataSelected.purchase.SrDetail.map((res: any) => {
				total = total + res.total;
			});
		} else {
			dataSelected.term_of_pay_po_so.poandso.detailMr.map((res: any) => {
				total = total + res.total;
			});
			dataSelected.term_of_pay_po_so.poandso.SrDetail.map((res: any) => {
				total = total + res.total;
			});
		}
		return total;
	};

	const ppn = () => {
		let percentPpn = dataSelected.term_of_pay_po_so
			? dataSelected.term_of_pay_po_so.poandso.supplier.ppn
			: dataSelected.purchase.supplier.ppn;
		let ppn = (total() * percentPpn) / 100;
		return Math.ceil(ppn);
	};

	const pph = () => {
		let percentPph = dataSelected.term_of_pay_po_so
			? dataSelected.term_of_pay_po_so.poandso.supplier.pph
			: dataSelected.purchase.supplier.pph;
		let pph = (total() * percentPph) / 100;
		return Math.ceil(pph);
	};

	const approve = async () => {
		try {
			const response = await ApprovalKontraBon(dataSelected.id);
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

	const typePurchase = (data: string) => {
		if (data.startsWith("PO")) {
			return "Purchase Order";
		} else if (data.startsWith("SO")) {
			return "Servise Order";
		} else if (data.startsWith("DMR")) {
			return "Dirrect Purchase Order";
		} else if (data.startsWith("DSR")) {
			return "Dirrect Service Order";
		} else {
			return "Spj Cash Advance"
		}
	};

	const showModalPdf = (val: boolean) => {
		setIsModal(val);
	};

	const showTax = () => {
		if (dataSelected.purchase) {
			if (dataSelected.purchase.taxPsrDmr === "ppn") {
				return (
					<tr>
						<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
							PPN {dataSelected.purchase.supplier.ppn}% (
							{dataSelected.purchase.currency})
						</td>
						<td className='w-[50%] pl-2 border border-gray-200'>
							{formatRupiah(ppn().toString())}
						</td>
					</tr>
				);
			} else if (dataSelected.purchase.taxPsrDmr === "pph") {
				return (
					<tr>
						<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
							PPH {dataSelected.purchase.supplier.pph}% (
							{dataSelected.purchase.currency})
						</td>
						<td className='w-[50%] pl-2 border border-gray-200'>
							{formatRupiah(pph().toString())}
						</td>
					</tr>
				);
			} else if (dataSelected.purchase.taxPsrDmr === "ppn_and_pph") {
				return (
					<>
						<tr>
							<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
								PPN {dataSelected.purchase.supplier.ppn}% (
								{dataSelected.purchase.currency})
							</td>
							<td className='w-[50%] pl-2 border border-gray-200'>
								{formatRupiah(ppn().toString())}
							</td>
						</tr>
						<tr>
							<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
								PPH {dataSelected.purchase.supplier.pph}% (
								{dataSelected.purchase.currency})
							</td>
							<td className='w-[50%] pl-2 border border-gray-200'>
								{formatRupiah(pph().toString())}
							</td>
						</tr>
					</>
				);
			} else {
				return false;
			}
		} else {
			if ( dataSelected.term_of_pay_po_so.tax_invoice && dataSelected.term_of_pay_po_so.poandso.taxPsrDmr === "ppn") {
				return (
					<tr>
						<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
							PPN {dataSelected.term_of_pay_po_so.poandso.supplier.ppn}% (
							{dataSelected.term_of_pay_po_so.poandso.currency})
						</td>
						<td className='w-[50%] pl-2 border border-gray-200'>
							{formatRupiah(ppn().toString())}
						</td>
					</tr>
				);
			} else if ( dataSelected.term_of_pay_po_so.tax_invoice && dataSelected.term_of_pay_po_so.poandso.taxPsrDmr === "pph") {
				return (
					<tr>
						<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
							PPH {dataSelected.term_of_pay_po_so.poandso.supplier.pph}% (
							{dataSelected.term_of_pay_po_so.poandso.currency})
						</td>
						<td className='w-[50%] pl-2 border border-gray-200'>
							{formatRupiah(pph().toString())}
						</td>
					</tr>
				);
			} else if (
				dataSelected.term_of_pay_po_so.tax_invoice && dataSelected.term_of_pay_po_so.poandso.taxPsrDmr === "ppn_and_pph"
			) {
				return (
					<>
						<tr>
							<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
								PPN {dataSelected.term_of_pay_po_so.poandso.supplier.ppn}% (
								{dataSelected.term_of_pay_po_so.poandso.currency})
							</td>
							<td className='w-[50%] pl-2 border border-gray-200'>
								{formatRupiah(ppn().toString())}
							</td>
						</tr>
						<tr>
							<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
								PPH {dataSelected.term_of_pay_po_so.poandso.supplier.pph}% (
								{dataSelected.term_of_pay_po_so.poandso.currency})
							</td>
							<td className='w-[50%] pl-2 border border-gray-200'>
								{formatRupiah(pph().toString())}
							</td>
						</tr>
					</>
				);
			}
		}
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Kontra Bon</h1>
					<Section className='grid grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								<tbody>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Id Kontra Bon
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.id_kontrabon}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Date Prepered
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{moment(dataSelected.date_prepered).format(
												"DD-MMMM-YYYY"
											)}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Purchase Type / Id Purchase
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{`${typePurchase(
												dataSelected.term_of_pay_po_so
													? dataSelected.term_of_pay_po_so.poandso.id_so
													: dataSelected.purchase ? dataSelected.purchase.idPurchase : dataSelected.cash_advance.id_spj
											)} / ${
												dataSelected.term_of_pay_po_so
													? dataSelected.term_of_pay_po_so.poandso.id_so
													: dataSelected.purchase ? dataSelected.purchase.idPurchase : dataSelected.cash_advance.id_spj
											}`}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Suplier/Vendor
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.term_of_pay_po_so
												? dataSelected.term_of_pay_po_so.poandso.supplier
														.supplier_name
												: dataSelected.purchase ? dataSelected.purchase.supplier.supplier_name : "-"}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Invoice Number
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.invoice}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Delivery Number
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.DO}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Due Date
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{moment(dataSelected.due_date).format("DD-MMMM-YYYY")}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Bill Amount (
											{dataSelected.term_of_pay_po_so
												? dataSelected.term_of_pay_po_so.poandso.currency
												: dataSelected.purchase ? dataSelected.purchase.currency : "IDR"}
											)
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{formatRupiah(
												dataSelected.term_of_pay_po_so
													? dataSelected.term_of_pay_po_so.price.toString()
													: dataSelected.purchase ? total().toString() : formatRupiah(dataSelected.grandtotal.toString())
											)}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Discount (
											{dataSelected.term_of_pay_po_so
												? dataSelected.term_of_pay_po_so.poandso.currency
												: dataSelected.purchase ? dataSelected.purchase.currency : "IDR"}
											)
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{ dataSelected.cash_advance ? 0 : formatRupiah(discount().toString())}
										</td>
									</tr>
									{ dataSelected.cash_advance ? null : showTax()}
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Cash Advant (
											{dataSelected.term_of_pay_po_so
												? dataSelected.term_of_pay_po_so.poandso.currency
												: dataSelected.purchase ? dataSelected.purchase.currency : "IDR"}
											)
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>{0}</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Total Amount (
											{dataSelected.term_of_pay_po_so
												? dataSelected.term_of_pay_po_so.poandso.currency
												: dataSelected.purchase ? dataSelected.purchase.currency : "IDR"}
											)
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{formatRupiah(dataSelected.grandtotal.toString())}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Term & Conditions
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.term_of_pay_po_so
												? dataSelected.term_of_pay_po_so.limitpay
												: dataSelected.purchase ? dataSelected.purchase.note : "IDR"}{" "}
											(
											{dataSelected.term_of_pay_po_so
												? dataSelected.term_of_pay_po_so.percent
												: 100}
											%)
										</td>
									</tr>
									{/* <tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Paid To
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.SupplierBank.bank_name},{" "}
											{dataSelected.SupplierBank.rekening} (
											{dataSelected.SupplierBank.account_name})
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Status
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.status_valid ? "Valid" : "Unvalid"}
										</td>
									</tr> */}
								</tbody>
							</table>
						</div>
					</Section>
				</>
			) : null}
		</div>
	);
};
