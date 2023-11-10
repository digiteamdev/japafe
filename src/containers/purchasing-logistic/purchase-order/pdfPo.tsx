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

export const PdfPo = ({ isModal, data, showModalPdf }: props) => {
	const printDocument = () => {
		const doc: any = document.getElementById("divToPrint");
		html2canvas(doc).then((canvas) => {
			const imgData = canvas.toDataURL("image/png");
			const pdf: any = new jsPDF("p", "mm", "a4");
			const width = pdf.internal.pageSize.getWidth();
			pdf.addImage(imgData, "JPEG", 0, 0, width, 0);
			// window.open(pdf.output("bloburl"), "_blank");
			pdf.save(`Purchase_Order_${data.id_so}.pdf`);
		});
	};

	const Total = () => {
		let jumlahTotal: any = 0;
		data.detailMr.map((res: any) => {
			jumlahTotal = jumlahTotal + res.total;
		});
		return jumlahTotal.toString();
	};

	const Ppn = () => {
		let totalBayar: any = Total();
		if (data.detailMr[0].taxpr === "ppn") {
			let totalPPN: any = (totalBayar * data.detailMr[0].supplier.ppn) / 100;
			return totalPPN.toString();
		} else {
			return "0";
		}
	};

	const grandTotal = () => {
		let totalBayar: any = Total();
		let totalPPN: any = Ppn();
		let total: any = parseInt(totalBayar) + parseInt(totalPPN);
		return total;
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
												Download Purchase Order Material Request
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
										className='my-4 mx-40 px-20'
										id='divToPrint'
									>
										<h1 className='font-bold text-center text-xl my-4'>
											PURCHASE ORDER
										</h1>
										<Section className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2'>
											<div className='flex w-full'>
												<div className='w-[30%]'>No</div>
												<div className='w-[70%]'>: {data.id_so}</div>
											</div>
											<div className='flex w-full'>
												<div className='w-[35%]'>Date Prepare</div>
												<div className='w-[65%]'>
													: {moment(data.date_prepared).format("DD-MMMM-YYYY")}
												</div>
											</div>
										</Section>
										<Section className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2'>
											<div className='flex w-full'>
												<div className='w-[30%]'>To</div>
												<div className='w-[70%]'>
													: {data.supplier.supplier_name}
												</div>
											</div>
											<div className='flex w-full'>
												<div className='w-[35%]'>Ship To</div>
												<div className='w-[65%]'>
													: PT. Dwitama Mulya Persada
												</div>
											</div>
										</Section>
										<Section className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2'>
											<div className='flex w-full'>
												<div className='w-[30%]'>Address</div>
												<div className='w-[70%]'>
													: {data.supplier.addresses_sup} -{" "}
													{data.supplier.cities} - {data.supplier.provinces}
												</div>
											</div>
											<div className='flex w-full'>
												<div className='w-[35%]'>Address</div>
												<div className='w-[65%]'>
													: Kawasan Industri De Prima Terra, Tegalluar,
													Kab.Bandung
												</div>
											</div>
										</Section>
										<Section className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2'>
											<div className='flex w-full'>
												<div className='w-[30%]'>Phone</div>
												<div className='w-[70%]'>
													: +62{data.supplier.SupplierContact[0].phone}
												</div>
											</div>
											<div className='flex w-full'>
												<div className='w-[35%]'>Phone</div>
												<div className='w-[65%]'>: -</div>
											</div>
										</Section>
										<Section className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2'>
											<div className='flex w-full'>
												<div className='w-[30%]'>Fax</div>
												<div className='w-[70%]'>: </div>
											</div>
											<div className='flex w-full'>
												<div className='w-[35%]'>Fax</div>
												<div className='w-[65%]'>: -</div>
											</div>
										</Section>
										<Section className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2'>
											<div className='flex w-full'>
												<div className='w-[30%]'>Contact</div>
												<div className='w-[70%]'>
													: {data.supplier.SupplierContact[0].contact_person}
												</div>
											</div>
											<div className='flex w-full'>
												<div className='w-[35%]'>Contact</div>
												<div className='w-[65%]'>: -</div>
											</div>
										</Section>
										<Section className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2'>
											<div className='flex w-full'>
												<div className='w-[30%]'>Refrensi</div>
												<div className='w-[70%]'>: {data.your_reff}</div>
											</div>
											<div className='flex w-full'>
												<div className='w-[35%]'>Currency</div>
												<div className='w-[65%]'>
													: {data.detailMr[0].currency}
												</div>
											</div>
										</Section>
										<Section className='grid grid-cols-1 gap-2 mt-2 mb-2'>
											<table className='w-full'>
												<thead>
													<tr>
														<th className='border border-t-black border-l-black border-r-0 border-b-0 text-center p-2'>
															Job No
														</th>
														<th className='border border-t-black border-l-black border-r-0 border-b-0 text-center p-2'>
															Material
														</th>
														<th className='border border-t-black border-l-black border-r-0 border-b-0 text-center p-2'>
															Qty
														</th>
														<th className='border border-t-black border-l-black border-r-0 border-b-0 text-center p-2'>
															Price
														</th>
														<th className='border border-t-black border-l-black border-r-0 border-b-0 text-center p-2'>
															Disc
														</th>
														<th className='border border-t-black border-l-black border-r-black border-b-0 text-center p-2'>
															Total
														</th>
													</tr>
												</thead>
												<tbody>
													{data.detailMr.map((res: any, i: number) => {
														return (
															<tr key={i}>
																<td
																	className={`border border-t-black border-l-black border-r-0 ${
																		i === data.detailMr.length - 1
																			? "border-b-black"
																			: "border-b-0"
																	} text-center p-2`}
																>
																	{res.mr.wor.job_operational
																		? res.mr.wor.job_no_mr
																		: res.mr.wor.job_no}
																</td>
																<td
																	className={`border border-t-black border-l-black border-r-0 ${
																		i === data.detailMr.length - 1
																			? "border-b-black"
																			: "border-b-0"
																	} text-center p-2`}
																>
																	{res.Material_Stock.spesifikasi}
																</td>
																<td
																	className={`border border-t-black border-l-black border-r-0 ${
																		i === data.detailMr.length - 1
																			? "border-b-black"
																			: "border-b-0"
																	} text-center p-2`}
																>
																	{res.qtyAppr}
																</td>
																<td
																	className={`border border-t-black border-l-black border-r-0 ${
																		i === data.detailMr.length - 1
																			? "border-b-black"
																			: "border-b-0"
																	} text-center p-2`}
																>
																	{formatRupiah(res.price.toString())}
																</td>
																<td
																	className={`border border-t-black border-l-black border-r-0 ${
																		i === data.detailMr.length - 1
																			? "border-b-black"
																			: "border-b-0"
																	} text-center p-2`}
																>
																	{formatRupiah(res.disc.toString())}
																</td>
																<td
																	className={`border border-t-black border-l-black border-r-black ${
																		i === data.detailMr.length - 1
																			? "border-b-black"
																			: "border-b-0"
																	} text-center p-2`}
																>
																	{formatRupiah(res.total.toString())}
																</td>
															</tr>
														);
													})}
													<tr>
														<td
															colSpan={5}
															className='border border-l-black border-r-0 border-t-0 border-b-0 text-center p-2'
														>
															Total
														</td>
														<td className='border border-t-0 border-b-0 border-l-black border-r-black text-center p-2'>
															{formatRupiah(Total())}
														</td>
													</tr>
													<tr>
														<td
															colSpan={5}
															className='border border-l-black border-r-0 border-t-black border-b-0 text-center p-2'
														>
															{data.detailMr[0].taxpr === "ppn"
																? `PPN ${data.detailMr[0].supplier.ppn}%`
																: "PPN 0%"}
														</td>
														<td className='border border-t-black border-b-0 border-l-black border-r-black text-center p-2'>
															{formatRupiah(Ppn())}
														</td>
													</tr>
													<tr>
														<td
															colSpan={5}
															className='border border-l-black border-r-0 border-t-black border-b-black text-center p-2'
														>
															Grand Total
														</td>
														<td className='border border-t-black border-b-black border-l-black border-r-black text-center p-2'>
															{formatRupiah(grandTotal().toString())}
														</td>
													</tr>
												</tbody>
											</table>
										</Section>
										<Section className='grid grid-cols-1 gap-2 mt-2 mb-2'>
											<div className='w-full'>
												<p>
													Said :{" "}
													<span className='font-bold'>
														{pembilang(grandTotal())}
													</span>
												</p>
											</div>
											<div className='w-full'>
												<p>
													Down Payment :{" "}
													<span>
														{ formatRupiah(data.DP.toString()) }
													</span>
												</p>
											</div>
											<div className='w-full'>
												<p>
													Payment Schedule :{" "}
													<span className='font-bold'>
													</span>
												</p>
											</div>
											<div className='w-full'>
												<p>
													Term And Condition :{" "}
													<span>
														{ data.note }
													</span>
												</p>
											</div>
										</Section>
										<div className='flex w-full'>
											<div className="w-[20%]">

											</div>
											<div className="w-[80%]">
												<Section className="grid grid-cols-2">
													<div className="w-full">
														<p className="pb-28">Approved By</p>
													</div>
													<div className="w-full">
														<p className="m-0">Bandung, { moment(new Date()).format('DD-MMM-YYYY') }</p>
														<p className="m-0 pb-28">PT. Dwitama Mulya Persada</p>
													</div>
												</Section>
											</div>
										</div>
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
