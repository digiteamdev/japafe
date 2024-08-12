import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, FileText } from "react-feather";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Printer } from "react-feather";
import { formatRupiah, pembilang } from "../../../utils";
import { Section } from "@/src/components";

interface props {
	isModal?: boolean;
	data?: any;
	showModalPdf: (val: boolean) => void;
}

export const PdfCashier = ({ isModal, data, showModalPdf }: props) => {
	const printDocument = () => {
		const doc: any = document.getElementById("divToPrint");
		html2canvas(doc).then((canvas) => {
			const imgData = canvas.toDataURL("image/png");
			const pdf: any = new jsPDF("p", "mm", "a4");
			const width = pdf.internal.pageSize.getWidth();
			pdf.addImage(imgData, "JPEG", 0, 0, width, 0);
			// window.open(pdf.output("bloburl"), "_blank");
			pdf.save(`Cashier_${data.id_cashier}.pdf`);
		});
	};

	return (
		<div className='z-80'>
			<Transition appear show={isModal} as={Fragment}>
				<Dialog
					as='div'
					className='relative w-full'
					onClose={() => showModalPdf(false)}
				>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-black z-20 bg-opacity-25 w-full h-screen' />
					</Transition.Child>

					<div className='fixed inset-0 z-40 overflow-y-auto w-full'>
						<div className='flex min-h-full items-center justify-center p-4 text-center'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<Dialog.Panel className='w-full max-w-6xl transform overflow-x-auto rounded-lg bg-white text-left align-middle shadow-xl transition-all'>
									<div
										className={`flex items-center justify-between px-5 py-[10px] bg-primary-400`}
									>
										<div className='flex items-center gap-2'>
											<div className='w-10 h-10 rounded-full bg-white flex justify-center items-center'>
												<FileText />
											</div>
											<Dialog.Title
												as='h4'
												className='text-base font-bold leading-6 text-white'
											>
												Download Kontra Bon
											</Dialog.Title>
										</div>

										<button
											onClick={() => showModalPdf(false)}
											className='text-white text-sm font-semibold'
										>
											<X />
										</button>
									</div>
									{data ? (
										<>
											<div className='text-center mt-3'>
												<button
													className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
													onClick={() => printDocument()}
												>
													<div className='flex px-1 py-1'>
														<Printer size={16} className='mr-1' /> Download PDF
													</div>
												</button>
											</div>
											<div className='my-4 mx-40 px-20 py-4' id='divToPrint'>
												<h1 className='font-bold text-center text-xl my-4'>
													Cash & Bank Payment
												</h1>
												<Section className='grid grid-cols-1 gap-2'>
													<div className='flex flex-row w-full'>
														<div className='w-1/4'>Number</div>
														<div className='w-full'>
															: {data.id_cashier},{" "}
															{moment(data.date_cashier).format("DD-MMMM-YYYY")}
														</div>
													</div>
													{/* <div className='flex flex-row w-full'>
														<div className='w-1/4'>Refrence</div>
														<div className='w-full'>
															:{" "}
															{data.kontrabonId === null
																? data.cash_advance.id_cash_advance
																: data.kontrabon.id_kontrabon}
														</div>
													</div> */}
													<div className='flex flex-row w-full'>
														<div className='w-1/4'>Pay To</div>
														<div className='w-full'>
															:{" "}
															{data.pay_to}
														</div>
													</div>
													<div className='flex flex-row w-full'>
														<div className='w-1/4'>Pay For</div>
														<div className='w-full'>
															:{" "}
															{data.kontrabonId === null
																? data.note
																: data.kontrabon.purchaseID === null
																? `${data.kontrabon.term_of_pay_po_so.limitpay}, ${data.kontrabon.term_of_pay_po_so.poandso.note}`
																: data.kontrabon.purchase.note}
														</div>
													</div>
													<div className='flex flex-row w-full'>
														<div className='w-1/4'>Amount</div>
														<div className='w-full'>
															:{" "}
															{data.kontrabonId === null ? 'IDR' : data.kontrabon.term_of_pay_po_so === null
																? data.kontrabon.purchase.currency
																: data.kontrabon.term_of_pay_po_so.poandso
																		.currency}{" "}
															{formatRupiah(data.total.toString())} (
															{pembilang(data.total)})
														</div>
													</div>
													<div className='flex flex-row w-full'>
														<div className='w-1/4'>Payment Info</div>
														<div className='w-full'>
															:{" "}
															{`Cash To ${data.pay_to}`}
														</div>
													</div>
												</Section>
												<Section className='grid grid-cols-1 gap-2 mt-4'>
													<table>
														<thead>
															<tr>
																<th className='border border-black border-r-0 border-b-0 text-center text-sm pb-1'>
																	Account No
																</th>
																<th className='border border-black border-r-0 border-b-0 text-center text-sm pb-1'>
																	Description
																</th>
																<th className='border border-black border-r-0 border-b-0 text-center text-sm pb-1'>
																	D/K
																</th>
																<th className='border border-black border-b-0 text-center text-sm pb-1'>
																	Amount
																</th>
															</tr>
														</thead>
														<tbody>
															{data.journal_cashier.map(
																(res: any, i: number, datas: any) => {
																	return (
																		<tr key={i}>
																			<td
																				className={`border border-black border-r-0 ${
																					i + 1 === datas.length
																						? ""
																						: "border-b-0"
																				} text-center text-sm pb-1`}
																			>
																				{res.coa.coa_code}
																			</td>
																			<td
																				className={`border border-black border-r-0 ${
																					i + 1 === datas.length
																						? ""
																						: "border-b-0"
																				} text-center text-sm pb-1`}
																			>
																				{res.coa.coa_name}
																			</td>
																			<td
																				className={`border border-black border-r-0 ${
																					i + 1 === datas.length
																						? ""
																						: "border-b-0"
																				} text-center text-sm pb-1`}
																			>
																				{res.status_transaction === "Debet"
																					? "D"
																					: "K"}
																			</td>
																			<td
																				className={`border border-black ${
																					i + 1 === datas.length
																						? ""
																						: "border-b-0"
																				} text-center text-sm pb-1`}
																			>
																				{formatRupiah(
																					res.grandtotal.toString()
																				)}
																			</td>
																		</tr>
																	);
																}
															)}
														</tbody>
													</table>
												</Section>
												<Section className='grid grid-cols-1 gap-2 mt-4'>
													<table>
														<thead></thead>
														<tbody>
															<tr>
																<td className='border border-black border-r-0 border-b-0 text-center text-sm pb-1'>
																	Receiver
																</td>
																<td className='border border-black border-r-0 border-b-0 text-center text-sm pb-1'>
																	Cashier
																</td>
																<td className='border border-black border-b-0 text-center text-sm pb-1'>
																	Validation
																</td>
															</tr>
															<tr>
																<td className='border border-black border-r-0 border-b-0 text-center text-sm py-10'></td>
																<td className='border border-black border-r-0 border-b-0 text-center text-sm py-10'></td>
																<td className='border border-black border-b-0 text-center text-sm py-10'></td>
															</tr>
															<tr>
																<td className='border border-black border-r-0 text-center text-sm py-3'>{ data.pay_to }</td>
																<td className='border border-black border-r-0 text-center text-sm py-3'></td>
																<td className='border border-black text-center text-sm py-3'></td>
															</tr>
														</tbody>
													</table>
												</Section>
											</div>
										</>
									) : null}
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
};
