import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, FileText } from "react-feather";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Printer } from "react-feather";
import { formatRupiah } from "../../../utils";
import { Section } from "@/src/components";

interface props {
	isModal?: boolean;
	dataSelected?: any;
	total?: string;
	showModalPdf: (val: boolean) => void;
}

export const PdfCashAdvance = ({
	isModal,
	dataSelected,
	total,
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
			pdf.save(`Work_Order_Release_${dataSelected.id_cash_advance}.pdf`);
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
												Download Cash Advance
											</Dialog.Title>
										</div>

										<button
											onClick={() => showModalPdf(false)}
											className='text-white text-sm font-semibold'
										>
											<X />
										</button>
									</div>
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
									<div
										className='my-4 mx-40 px-20 border border-black'
										id='divToPrint'
									>
										<h1 className='font-bold text-center text-xl my-4'>
											Cash Advance
										</h1>
										<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
											<div className='flex flex-row w-full'>
												<div className='w-1/4'>Id</div>
												<div className='w-full'>
													: {dataSelected.id_cash_advance}
												</div>
											</div>
											<div className='flex flex-row w-full'>
												<div className='w-1/4'>Date</div>
												<div className='w-full'>
													:{" "}
													{moment(dataSelected.date_cash_advance).format(
														"DD-MMMM-YYYY"
													)}
												</div>
											</div>
											<div className='flex flex-row w-full'>
												<div className='w-1/4'>Request By</div>
												<div className='w-full'>
													: {dataSelected.employee.employee_name}
												</div>
											</div>
											<div className='flex flex-row w-full'>
												<div className='w-1/4'>Job No</div>
												<div className='w-full'>
													:{" "}
													{dataSelected.wor.job_no}
												</div>
											</div>
											<div className='flex flex-row w-full'>
												<div className='w-1/4'>Customer</div>
												<div className='w-full'>
													:{" "}
													{dataSelected.wor.customerPo.quotations.Customer.name}
												</div>
											</div>
											<div className='flex flex-row w-full'>
												<div className='w-1/4'>Subject</div>
												<div className='w-full'>
													: {dataSelected.wor.subject}
												</div>
											</div>
											<div className='flex flex-row w-full'>
												<div className='w-1/4'>Payment Type</div>
												<div className='w-full'>
													: {dataSelected.status_payment}
												</div>
											</div>
											<div className='flex flex-row w-full'>
												<div className='w-1/4'>Note</div>
												<div className='w-full'>: {dataSelected.note}</div>
											</div>
										</Section>
										<Section className='grid grid-cols-1 gap-2 mt-2'>
											<table className='w-full'>
												<thead>
													<th className='border border-black text-center'>
														Type
													</th>
													<th className='border border-black text-center'>
														Description
													</th>
													<th className='border border-black text-center'>
														Value
													</th>
												</thead>
												<tbody>
													{dataSelected.cdv_detail.map(
														(res: any, i: number) => {
															return (
																<tr key={i}>
																	<td className='border border-black text-center'>
																		{res.type_cdv}
																	</td>
																	<td className='border border-black text-center'>
																		{res.description}
																	</td>
																	<td className='border border-black text-center'>
																		{formatRupiah(res.total.toString())}
																	</td>
																</tr>
															);
														}
													)}
													<tr>
														<td
															className='border border-black text-right pr-5'
															colSpan={2}
														>
															Total
														</td>
														<td className='border border-black text-center'>
															{total}
														</td>
													</tr>
												</tbody>
											</table>
										</Section>
										<table className='mb-4 mx-auto mt-4'>
											<tr>
												<td className='border-black border-t border-l'>
													<p className='px-6 py-2 mb-1'>Prepared By</p>
												</td>
												<td className='border-black border-t border-l'>
													<p className='px-6 py-2 mb-1'>Checked By</p>
												</td>
												<td className='border-black border-t border-l border-r'>
													<p className='px-6 py-2 mb-1'>Approved By</p>
												</td>
											</tr>
											<tr>
												<td className='border-black border-t border-l py-12'></td>
												<td className='border-black border-t border-l py-12'></td>
												<td className='border-black border-t border-l border-r py-12'></td>
											</tr>
											<tr>
												<td className='border-black border-t border-l border-b'>
													<p className='px-6 py-3'></p>
												</td>
												<td className='border-black border-t border-l border-b'>
													<p className='px-6 py-3'></p>
												</td>
												<td className='border-black border-t border-l border-b border-r'>
													<p className='px-6 py-3'></p>
												</td>
											</tr>
										</table>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
};
