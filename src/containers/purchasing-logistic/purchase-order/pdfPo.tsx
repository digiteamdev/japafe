import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, FileText } from "react-feather";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Printer } from "react-feather";
import { formatRupiah, pembilang } from "../../../utils";
import { Section } from "@/src/components";
import Logo from "../../../assets/logo/logo-ISO-9001.png";
import Logo2 from "../../../assets/logo/Logo-ISO-14001.png";
import Logo3 from "../../../assets/logo/Logo-ISO-45001.png";
import Logo4 from "../../../assets/logo/dwitama.png";
import Image from "next/image";

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
			window.open(pdf.output("bloburl"), "_blank");
			// pdf.save(`Purchase_Order_${data.id_so}.pdf`);
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
		let totalPPN: any = (totalBayar * data.detailMr[0].supplier.ppn) / 100;
		return totalPPN.toString();
	};

	const grandTotal = () => {
		let totalBayar: any = Total();
		if (data.taxPsrDmr === "ppn") {
			let totalPPN: any = Ppn();
			let total: any = parseInt(totalBayar) + parseInt(totalPPN);
			return total;
		} else {
			let total: any = parseInt(totalBayar);
			return total;
		}
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
									<div className='my-4 mx-40 px-20' id='divToPrint'>
										<div className="pt-4">
											<div className='flex border border-black'>
												<div className='w-[45%] p-2'>
													<h4 className='text-xs font-semibold'>
														PT DWITAMA MULYA PERSADA
													</h4>
													<p className='text-[9px]'>
														Kawasan Industri De Prima Terra
													</p>
													<p className='text-[9px]'>
														Jl. Raya Sapan - Gede Bage Block D1 07 Tegalluar
														Bandung 40287
													</p>
													<p className='text-[9px]'>
														Phone : +62 22 88881810, +62 22 87528469-60
													</p>
													<p className='text-[9px]'>
														Email : sales@dwitama.co.id - www.dwitama.co.id
													</p>
												</div>
												<div className='w-[55%]'>
													<div className='flex ml-8 p-3'>
														<Image
															className='w-[35%] mx-1'
															src={Logo4}
															alt='logo'
														/>
														<Image
															className='w-[15%] mx-1'
															src={Logo}
															alt='logo'
														/>
														<Image
															className='w-[15%] mx-1'
															src={Logo2}
															alt='logo'
														/>
														<Image
															className='w-[15%] mx-1'
															src={Logo3}
															alt='logo'
														/>
													</div>
												</div>
											</div>
											<div className='w-full grid grid-cols-6 grid-rows-2'>
												<div className=' w-full p-2 border border-black border-t-0 border-r-0 col-span-3 row-span-2'>
													<h2 className='text-lg font-bold text-center pt-4'>
														Purchase Material (PO)
													</h2>
												</div>
												<div className='w-full p-2 border border-black border-t-0 border-r-0 col-span-2'>
													<h2 className='text-base text-center'>
														No. Dokumen / Revisi
													</h2>
												</div>
												<div className='w-full p-2 border border-black border-t-0'>
													<h2 className='text-base text-center'>Level</h2>
												</div>
												<div className='w-full p-2 border border-black border-t-0 border-r-0 col-span-2'>
													<h2 className='text-base text-center'>
														DMP/PCH/FRM-03 / 00
													</h2>
												</div>
												<div className='w-full p-2 border border-black border-t-0'>
													<h2 className='text-base text-center'>3</h2>
												</div>
											</div>
											<Section className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-4'>
												<div className='flex w-full'>
													<div className='w-[30%]'>Number</div>
													<div className='w-[70%]'>: {data.id_so}</div>
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
													<div className='w-[30%]'>Date</div>
													<div className='w-[70%]'>
														: {moment(data.date_prepared).format("DD MMMM YYYY")}
													</div>
												</div>
												<div className='flex w-full'>
													<div className='w-[30%]'>Address</div>
													<div className='w-[70%]'>
														: {data.supplier.addresses_sup} -{" "}
														{data.supplier.cities} - {data.supplier.provinces}
													</div>
												</div>
											</Section>
											<Section className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2'>
												<div className='flex w-full'>
													<div className='w-[30%]'>Vendor</div>
													<div className='w-[70%]'>
														: {data.supplier.supplier_name}
													</div>
												</div>
												<div className='flex w-full'>
													<div className='w-[30%]'>Phone</div>
													<div className='w-[70%]'>: 022-8888810</div>
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
													<div className='w-[30%]'>Fax</div>
													<div className='w-[70%]'>: 022-8888810</div>
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
													<div className='w-[30%]'>Requestor</div>
													<div className='w-[70%]'>
														: {data.detailMr[0].mr.user.employee.employee_name}
													</div>
												</div>
											</Section>
											<Section className='grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2'>
												<div className='flex w-full'>
													<div className='w-[30%]'>Fax</div>
													<div className='w-[70%]'>: -</div>
												</div>
												<div className='flex w-full'>
													<div className='w-[30%]'>Job</div>
													<div className='w-[70%]'>
														:{" "}
														{data.detailMr[0].mr.job_no}
													</div>
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
													<div className='w-[30%]'>Your Reff</div>
													<div className='w-[70%]'>
														: {data.your_reff}
													</div>
												</div>
											</Section>
											<Section className='grid grid-cols-1 gap-2 mt-2 mb-2'>
												<table className='w-full'>
													<thead>
														<tr>
															<th className='border border-t-black border-l-black border-r-0 border-b-0 text-center p-2'>
																No
															</th>
															<th className='border border-t-black border-l-black border-r-0 border-b-0 text-center p-2'>
																Description
															</th>
															<th className='border border-t-black border-l-black border-r-0 border-b-0 text-center p-2'>
																Qty
															</th>
															<th className='border border-t-black border-l-black border-r-0 border-b-0 text-center p-2'>
																Unit
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
																		{i + 1}
																	</td>
																	<td
																		className={`border border-t-black border-l-black border-r-0 ${
																			i === data.detailMr.length - 1
																				? "border-b-black"
																				: "border-b-0"
																		} text-center p-2`}
																	>
																		{
																			res.Material_Stock.Material_master
																				.material_name
																		}{" "}
																		- {res.Material_Stock.spesifikasi}
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
																		{res.Material_Stock.Material_master.satuan}
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
																colSpan={6}
																className='border border-l-black border-r-0 border-t-0 border-b-0 text-center p-2'
															>
																Total ({data.currency})
															</td>
															<td className='border border-t-0 border-b-0 border-l-black border-r-black text-center p-2'>
																{formatRupiah(Total())}
															</td>
														</tr>
														{data.taxPsrDmr === "ppn" ? (
															<tr>
																<td
																	colSpan={6}
																	className='border border-l-black border-r-0 border-t-black border-b-black text-center p-2'
																>
																	{`PPN ${data.supplier.ppn}% (${data.currency})`}
																</td>
																<td className='border border-black text-center'>
																	{formatRupiah(Ppn())}
																</td>
															</tr>
														) : null}
														<tr>
															<td
																colSpan={6}
																className='border border-l-black border-r-0 border-t-black border-b-black text-center p-2'
															>
																Grand Total ({data.currency})
															</td>
															<td className='border border-t-black border-b-black border-l-black border-r-black text-center p-2'>
																{formatRupiah(grandTotal().toString())}
															</td>
														</tr>
													</tbody>
												</table>
											</Section>
											<Section className='grid grid-cols-1 gap-2 mt-2 mb-2'>
												<div className='flex w-full'>
													<div className='w-[30%]'>Note</div>
													<div className='w-[70%]'>: {data.note}</div>
												</div>
											</Section>
											<div className='w-full text-center mt-8'>
												Bandung, {moment(new Date()).format("DD/MMMM/YYYY")}
											</div>
											<Section className="grid grid-cols-3 gap-1 mt-24 text-center">
												<div className="mb-2">President Director</div>
												<div className="mb-2">Procurement Manager</div>
												<div className="mb-2">Purchasing Staff</div>
											</Section>
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
