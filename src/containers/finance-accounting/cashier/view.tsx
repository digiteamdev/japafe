import { useState, useEffect } from "react";
import { ApprovalCashier } from "../../../services";
import { Section } from "../../../components";
import { formatRupiah } from "../../../utils/index";
import { getPosition } from "../../../configs/session";
import { Check, X, Printer } from "react-feather";
import { PdfCashier } from "./pdfCashier";
import moment from "moment";
import { toast } from "react-toastify";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewCashier = ({ dataSelected, content, showModal }: props) => {
	const [isModal, setIsModal] = useState<boolean>(false);
	const [position, setPosition] = useState<any>([]);

	useEffect(() => {
		let positionAkun = getPosition();
		if (positionAkun !== undefined) {
			setPosition(positionAkun);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const discount = (data: any) => {
		let discount: number = 0;
		data.detailMr.map((res: any) => {
			discount = discount + res.disc;
		});
		data.SrDetail.map((res: any) => {
			discount = discount + res.disc;
		});
		return discount;
	};

	const total = (data: any) => {
		let total: number = 0;
		data.detailMr.map((res: any) => {
			total = total + res.total;
		});
		data.SrDetail.map((res: any) => {
			total = total + res.total;
		});
		return total;
	};

	const ppn = () => {
		let percentPpn = dataSelected.kontrabon.term_of_pay_po_so
			? dataSelected.kontrabon.term_of_pay_po_so.poandso.supplier.ppn
			: dataSelected.kontrabon.purchase.supplier.ppn;
		let ppn =
			(total(
				dataSelected.kontrabon.term_of_pay_po_so
					? dataSelected.kontrabon.term_of_pay_po_so.poandso
					: dataSelected.kontrabon.purchase
			) *
				percentPpn) /
			100;
		return Math.ceil(ppn);
	};

	const pph = () => {
		let percentPph = dataSelected.kontrabon.term_of_pay_po_so
			? dataSelected.kontrabon.term_of_pay_po_so.poandso.supplier.pph
			: dataSelected.kontrabon.purchase.supplier.pph;
		let pph =
			(total(
				dataSelected.kontrabon.term_of_pay_po_so
					? dataSelected.kontrabon.term_of_pay_po_so.poandso
					: dataSelected.kontrabon.purchase
			) *
				percentPph) /
			100;
		return Math.ceil(pph);
	};

	const approve = async () => {
		try {
			const response = await ApprovalCashier(dataSelected.id);
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
			if (data.status_valid) {
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
						<button
							className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => showModalPdf(true)}
						>
							<div className='flex px-1 py-1'>
								<Printer size={16} className='mr-1' /> Print
							</div>
						</button>
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
					<button
						className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
						onClick={() => showModalPdf(true)}
					>
						<div className='flex px-1 py-1'>
							<Printer size={16} className='mr-1' /> Print
						</div>
					</button>
				</div>
			);
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
			return "Cash Advance";
		}
	};

	const showModalPdf = (val: boolean) => {
		setIsModal(val);
	};

	const showTax = () => {
		if(dataSelected.kontrabonId === null){
			return false
		}else if (dataSelected.kontrabon.purchase) {
			if (dataSelected.kontrabon.purchase.taxPsrDmr === "ppn") {
				return (
					<tr>
						<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
							PPN {dataSelected.kontrabon.purchase.supplier.ppn}%
						</td>
						<td className='w-[50%] pl-2 border border-gray-200'>
							{formatRupiah(ppn().toString())}
						</td>
					</tr>
				);
			} else if (dataSelected.kontrabon.purchase.taxPsrDmr === "pph") {
				return (
					<tr>
						<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
							PPH {dataSelected.kontrabon.purchase.supplier.pph}%
						</td>
						<td className='w-[50%] pl-2 border border-gray-200'>
							{formatRupiah(pph().toString())}
						</td>
					</tr>
				);
			} else if (dataSelected.kontrabon.purchase.taxPsrDmr === "ppn_and_pph") {
				return (
					<>
						<tr>
							<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
								PPN {dataSelected.kontrabon.purchase.supplier.ppn}%
							</td>
							<td className='w-[50%] pl-2 border border-gray-200'>
								{formatRupiah(ppn().toString())}
							</td>
						</tr>
						<tr>
							<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
								PPH {dataSelected.kontrabon.purchase.supplier.pph}%
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
			if (
				dataSelected.kontrabon.term_of_pay_po_so.tax_invoice &&
				dataSelected.kontrabon.term_of_pay_po_so.poandso.taxPsrDmr === "ppn"
			) {
				return (
					<tr>
						<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
							PPN{" "}
							{dataSelected.kontrabon.term_of_pay_po_so.poandso.supplier.ppn}%
						</td>
						<td className='w-[50%] pl-2 border border-gray-200'>
							{formatRupiah(ppn().toString())}
						</td>
					</tr>
				);
			} else if (
				dataSelected.kontrabon.term_of_pay_po_so.tax_invoice &&
				dataSelected.kontrabon.term_of_pay_po_so.poandso.taxPsrDmr === "pph"
			) {
				return (
					<tr>
						<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
							PPH{" "}
							{dataSelected.kontrabon.term_of_pay_po_so.poandso.supplier.pph}%
						</td>
						<td className='w-[50%] pl-2 border border-gray-200'>
							{formatRupiah(pph().toString())}
						</td>
					</tr>
				);
			} else if (
				dataSelected.kontrabon.term_of_pay_po_so.tax_invoice &&
				dataSelected.kontrabon.term_of_pay_po_so.poandso.taxPsrDmr ===
					"ppn_and_pph"
			) {
				return (
					<>
						<tr>
							<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
								PPN{" "}
								{dataSelected.kontrabon.term_of_pay_po_so.poandso.supplier.ppn}%
							</td>
							<td className='w-[50%] pl-2 border border-gray-200'>
								{formatRupiah(ppn().toString())}
							</td>
						</tr>
						<tr>
							<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
								PPH{" "}
								{dataSelected.kontrabon.term_of_pay_po_so.poandso.supplier.pph}%
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
			<PdfCashier
				isModal={isModal}
				data={dataSelected}
				showModalPdf={showModalPdf}
			/>
			{dataSelected ? (
				<>
					<div className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1'>
						<div className='text-right mr-6'>
							{showButtonValid(dataSelected)}
						</div>
					</div>
					<h1 className='font-bold text-xl'>Cashier</h1>
					<Section className='grid grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								<tbody>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Id Cashier
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.id_cashier}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Date Prepered
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{moment(dataSelected.date_cashier).format("DD-MMMM-YYYY")}
										</td>
									</tr>
									{/* <tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Purchase Type / Id Purchase
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{`${typePurchase(
												dataSelected.kontrabonId === null
													? dataSelected.cash_advance.id_cash_advance
													: dataSelected.kontrabon.term_of_pay_po_so
													? dataSelected.kontrabon.term_of_pay_po_so.poandso
															.id_so
													: dataSelected.kontrabon.purchase.idPurchase
											)} / ${
												dataSelected.kontrabonId === null
													? dataSelected.cash_advance.id_cash_advance
													: dataSelected.kontrabon.term_of_pay_po_so
													? dataSelected.kontrabon.term_of_pay_po_so.poandso
															.id_so
													: dataSelected.kontrabon.purchase.idPurchase
											}`}
										</td>
									</tr> */}
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Pay To
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.pay_to}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Pay For
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.kontrabonId === null
												? dataSelected.note
												: dataSelected.kontrabon.purchase === null
												? `${dataSelected.kontrabon.term_of_pay_po_so.limitpay}, ${dataSelected.kontrabon.term_of_pay_po_so.poandso.note}`
												: dataSelected.kontrabon.purchase.note}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Total Pay
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.kontrabonId === null ? formatRupiah(dataSelected.total.toString()) : dataSelected.kontrabon.purchase === null
												? formatRupiah(
														dataSelected.kontrabon.term_of_pay_po_so.price.toString()
												  )
												: formatRupiah(
														total(dataSelected.kontrabon.purchase).toString()
												  )}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Discount
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.kontrabonId === null ? 0 : dataSelected.kontrabon.purchase === null
												? formatRupiah(
														discount(
															dataSelected.kontrabon.term_of_pay_po_so.poandso
														).toString()
												  )
												: formatRupiah(
														discount(dataSelected.kontrabon.purchase).toString()
												  )}
										</td>
									</tr>
									{showTax()}
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Grand Total
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{formatRupiah(dataSelected.total.toString())}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Pay With
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.status_payment}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Transfer Info
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{`Cash To ${dataSelected.pay_to}`}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Status
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.status_valid ? "Valid" : "Unvalid"}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Section>
					<Section className='grid grid-cols-1 gap-2 mt-2'>
						<table>
							<thead>
								<tr>
									<th className='text-center border border-black'>
										Account No
									</th>
									<th className='text-center border border-black'>Descripsi</th>
									<th className='text-center border border-black'>
										Debet/kredit
									</th>
									<th className='text-center border border-black'>Total</th>
								</tr>
							</thead>
							<tbody>
								{dataSelected.journal_cashier.map((res: any, i: number) => {
									return (
										<tr key={i}>
											<td className='text-center border border-black'>
												{res.coa.coa_code}
											</td>
											<td className='text-center border border-black'>
												{res.coa.coa_name}
											</td>
											<td className='text-center border border-black'>
												{res.status_transaction}
											</td>
											<td className='text-center border border-black'>
												{formatRupiah(res.grandtotal.toString())}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</Section>
				</>
			) : null}
		</div>
	);
};
