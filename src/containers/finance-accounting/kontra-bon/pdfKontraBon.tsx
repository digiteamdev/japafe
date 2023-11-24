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
	discount: () => any;
	ppn: () => any;
	showModalPdf: (val: boolean) => void;
}

export const PdfKontraBon = ({
	isModal,
	data,
	discount,
	ppn,
	showModalPdf,
}: props) => {
	const printDocument = () => {
		const doc: any = document.getElementById("divToPrint");
		html2canvas(doc).then((canvas) => {
			const imgData = canvas.toDataURL("image/png");
			const pdf: any = new jsPDF("p", "mm", "a4");
			const width = pdf.internal.pageSize.getWidth();
			pdf.addImage(imgData, "JPEG", 0, 0, width, 0);
			// window.open(pdf.output("bloburl"), "_blank");
			pdf.save(`Kontra_Bon_${data.id_kontrabon}.pdf`);
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
													KONTRA BON
												</h1>
												<Section className='grid grid-cols-1 gap-2'>
													<div className='grid grid-cols-2 w-full'>
														<div className='w-full'>
															Receipt Of Billing Number
														</div>
														<div className='w-full'>
															: {data.id_kontrabon},{" "}
															{moment(data.date_prepared).format("DD-MMM-YYYY")}
														</div>
													</div>
													<div className='grid grid-cols-2 w-full'>
														<div className='w-full'>Refrence Number</div>
														<div className='w-full'>
															: {data.term_of_pay_po_so.poandso.id_so},{" "}
															{moment(
																data.term_of_pay_po_so.poandso.date_prepared
															).format("DD-MMM-YYYY")}
														</div>
													</div>
													<div className='grid grid-cols-2 w-full'>
														<div className='w-full'>Invoice Number</div>
														<div className='w-full'>: {data.invoice}</div>
													</div>
													<div className='grid grid-cols-2 w-full'>
														<div className='w-full'>DO Number</div>
														<div className='w-full'>: {data.DO}</div>
													</div>
													<div className='grid grid-cols-2 w-full'>
														<div className='w-full'>Suplier / Vendor</div>
														<div className='w-full'>
															:{" "}
															{
																data.term_of_pay_po_so.poandso.supplier
																	.supplier_name
															}
														</div>
													</div>
													<div className='grid grid-cols-2 w-full'>
														<div className='w-full'>Amount Of The Bill ({data.term_of_pay_po_so.poandso.currency})</div>
														<div className='w-full'>
															:{" "}
															{formatRupiah(
																data.term_of_pay_po_so.price.toString()
															)}
														</div>
													</div>
													<div className='grid grid-cols-2 w-full'>
														<div className='w-full'>Discount ({data.term_of_pay_po_so.poandso.currency})</div>
														<div className='w-full'>
															: {formatRupiah(discount().toString())}
														</div>
													</div>
													<div className='grid grid-cols-2 w-full'>
														<div className='w-full'>PPN {data.term_of_pay_po_so.poandso.supplier.ppn}% ({data.term_of_pay_po_so.poandso.currency})</div>
														<div className='w-full'>
															: {formatRupiah(ppn().toString())}
														</div>
													</div>
													<div className='grid grid-cols-2 w-full'>
														<div className='w-full'>Total ({data.term_of_pay_po_so.poandso.currency})</div>
														<div className='w-full'>
															: {formatRupiah(data.grandtotal.toString())}
														</div>
													</div>
													<div className='grid grid-cols-2 w-full'>
														<div className='w-full'>Cash Advant ({data.term_of_pay_po_so.poandso.currency})</div>
														<div className='w-full'>: </div>
													</div>
													<div className='grid grid-cols-2 w-full'>
														<div className='w-full'>Paid To</div>
														<div className='w-full'>
															: {data.SupplierBank.bank_name},{" "}
															{data.SupplierBank.rekening} (
															{data.SupplierBank.account_name})
														</div>
													</div>
													<div className='grid grid-cols-2 w-full'>
														<div className='w-full'>Due Date</div>
														<div className='w-full'>
															: {moment(data.due_date).format("DD-MMM-YYYY")}
														</div>
													</div>
												</Section>
												<Section className='grid grid-cols-2 gap-2 mt-10'>
													<div className='w-full flex flex-col'>
														<p className='mx-auto pb-20'>Submit By</p>
														<p className='mx-auto'>Note: </p>
													</div>
													<div className='w-full flex flex-col'>
														<p className='mx-auto'>
															Bandung,{" "}
															{moment(new Date()).format("DD-MMM-YYYY")}
														</p>
														<p className='mx-auto pb-16'>Received By</p>
														<p className='mx-auto'>Manager</p>
													</div>
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
