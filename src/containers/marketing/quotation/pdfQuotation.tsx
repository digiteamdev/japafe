import { Dialog, Transition } from "@headlessui/react";
import { useEffect, useState, Fragment } from "react";
import { X, FileText } from "react-feather";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Printer } from "react-feather";
import Logo from "../../../assets/logo/logo-ISO-9001.png";
import Logo2 from "../../../assets/logo/Logo-ISO-14001.png";
import Logo3 from "../../../assets/logo/Logo-ISO-45001.png";
import Logo4 from "../../../assets/logo/dwitama.png";
import Image from "next/image";
import { formatRupiah } from "@/src/utils";
import { Input } from "@/src/components/input";

interface props {
	isModal?: boolean;
	data?: any;
	showModalPdf: (val: boolean) => void;
}

export const PdfQuotation = ({ isModal, data, showModalPdf }: props) => {
	const printDocument = () => {
		const doc: any = document.getElementById("divToPrint");
		html2canvas(doc).then((canvas) => {
			const imgData = canvas.toDataURL("image/png");
			const pdf: any = new jsPDF("p", "mm", "a4");
			const width = pdf.internal.pageSize.getWidth();
			const height = pdf.internal.pageSize.getHeight();
			pdf.addImage(imgData, "JPEG", 0, 0, width, 265);
			// window.open(pdf.output("bloburl"), "_blank");
			pdf.save(`quotation_${data.quo_auto}.pdf`);
		});
	};

	const listScopeWork = (data: string) => {
		const listScopeWork: any = data.split("\r\n");
		let list1: any = [];
		let list2: any = [];
		if (listScopeWork.length > 10) {
			let no: number = (listScopeWork.length - 1) / 2;
			listScopeWork.map((res: any, i: number) => {
				if (i < no) {
					list1.push(res);
				} else {
					list2.push(res);
				}
			});
			return (
				<div className='grid grid-cols-2 ml-2'>
					<div className='w-full'>
						{list1.map((res: any, i: number) => {
							return (
								<p className='whitespace-pre' key={i}>
									{res}
								</p>
							);
						})}
					</div>
					<div className='w-full'>
						{list2.map((res: any, i: number) => {
							return (
								<p className='whitespace-pre' key={i}>
									{res}
								</p>
							);
						})}
					</div>
				</div>
			);
		} else {
			return (
				<div className='grid grid-cols-1 ml-2'>
					<div className='w-full'>
						<p className='whitespace-pre'>{data}</p>
					</div>
				</div>
			);
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
												Download Quotation
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
										className='m-2 px-1 pb-4 pt-4 text-xs'
										id='divToPrint'
									>
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
										<div className='w-full grid grid-cols-7 grid-rows-2'>
											<div className=' w-full p-2 border border-black border-t-0 border-r-0 col-span-4 row-span-2 bg-purple-400'>
												<h2 className='text-lg font-bold text-center pt-4'>
													Quotation
												</h2>
											</div>
											<div className='w-full p-2 border border-black border-t-0 border-r-0 col-span-2'>
												<h2 className='text-center'>No. Dokumen / Revisi</h2>
											</div>
											<div className='w-full p-2 border border-black border-t-0'>
												<h2 className='text-center'>Level</h2>
											</div>
											<div className='w-full p-2 border border-black border-t-0 border-r-0 col-span-2'>
												<h2 className='text-center'>DMP/PCH/FRM-04 / 00</h2>
											</div>
											<div className='w-full p-2 border border-black border-t-0'>
												<h2 className='text-center'>3</h2>
											</div>
										</div>
										<div className='w-full mt-2'>
											<div className='grid grid-cols-5'>
												<div className='w-full'>Quotation No</div>
												<div className='w-full col-span-2'>
													: {data.quo_num}
												</div>
												<div className='w-full col-span-2 text-right'>
													Bandung, {moment(new Date()).format("DD MMMM YYYY")}
												</div>
											</div>
											<div className='grid grid-cols-5 mb-2'>
												<div className='w-full'>To</div>
												<div className='w-full col-span-4'>
													: {data.Customer.name}
													<p className='ml-2'>
														{data.Customer.address[0].address_workshop},{" "}
														{data.Customer.address[0].sub_districts}
													</p>
													<p className='ml-2'>
														{data.Customer.address[0].cities},{" "}
														{data.Customer.address[0].ec_postalcode}
													</p>
												</div>
											</div>
											<div className='grid grid-cols-5'>
												<div className='w-full'>Telp</div>
												<div className='w-full col-span-4'>
													: +62{data.Customer.phone}
												</div>
											</div>
											<div className='grid grid-cols-5'>
												<div className='w-full'>Fax</div>
												<div className='w-full col-span-4'>
													: {data.Customer.fax}
												</div>
											</div>
											<div className='grid grid-cols-5'>
												<div className='w-full'>Email</div>
												<div className='w-full col-span-4'>
													: {data.Customer.email}
												</div>
											</div>
											<div className='grid grid-cols-5 pb-2'>
												<div className='w-full'>Attention</div>
												<div className='w-full col-span-4'>
													: {data.attention}
												</div>
											</div>
											<div className='w-full divide-y p-[1.5px] bg-slate-400'></div>
											<div className='grid grid-cols-5 pb-2'>
												<div className='w-full'>Subject</div>
												<div className='w-full col-span-4'>
													: {data.subject}
												</div>
											</div>
											<div className='w-full divide-y p-[1.5px] bg-slate-400'></div>
											<div className='w-full'>
												We Would like to provide our qoutation as follow:
											</div>
											<div className='ml-2'>
												<div className='w-full mt-[2px]'>
													<p className='font-bold'>
														1.{" "}
														<span className='underline'>
															WORKSCOPE DESCRIPTION
														</span>
													</p>
												</div>
												{ listScopeWork(data.Quotations_Detail) }
												<div className='w-full mt-[2px] mb-[4px]'>
													<p className='font-bold'>
														2. <span className='underline'>DELIVERY TIME</span>
													</p>
												</div>
												<div className='w-full'>
													Delivery time is estimated at{" "}
													<span className='font-bold ml-3'>
														{data.estimated_delivery}
													</span>
												</div>
												<div className='w-full mt-[2px]'>
													<p className='font-bold'>
														3.{" "}
														<span className='underline mb-1'>
															PRICE AND TERM OF PAYMENT
														</span>
													</p>
													<table className='w-full mt-2'>
														<thead>
															<tr className='bg-purple-400'>
																<th className='text-center pb-2'>No</th>
																<th className='text-center pb-2'>
																	Description
																</th>
																<th className='text-center pb-2'>Qty</th>
																<th className='text-center pb-2'>Unit</th>
																<th className='text-center pb-2'>Unit Price</th>
																<th className='text-center pb-2'>
																	Total Price
																</th>
															</tr>
														</thead>
														<tbody>
															{data.price_quotation.map(
																(res: any, i: number) => {
																	return (
																		<tr key={i} className='bg-slate-200'>
																			<td className='text-center border border-b-black pb-2'>
																				{i + 1}
																			</td>
																			<td className='text-center border border-b-black pb-2'>
																				{res.description}
																			</td>
																			<td className='text-center border border-b-black pb-2'>
																				{res.qty}
																			</td>
																			<td className='text-center border border-b-black pb-2'>
																				{res.unit}
																			</td>
																			<td className='text-center border border-b-black pb-2'>
																				{formatRupiah(
																					res.unit_price.toString()
																				)}
																			</td>
																			<td className='text-center border border-b-black pb-2'>
																				{formatRupiah(
																					res.total_price.toString()
																				)}
																			</td>
																		</tr>
																	);
																}
															)}
														</tbody>
													</table>
													<div className='flex'>
														<div className='w-[25%]'>Note</div>
														<div className='w-[75%]'>: {data.note_payment}</div>
													</div>
													<div className='flex'>
														<div className='w-[25%]'>Term Of Payment</div>
														<div className='w-[75%]'>: {data.term_payment}</div>
													</div>
												</div>
												<div className='w-full mt-[2px]'>
													<p className='font-bold'>
														4. <span className='underline'>VALIDITY</span>
													</p>
												</div>
												<div className='w-full'>
													This proposal will remain valid for 21 (Twenty one)
													calender days from the date of bid opening and may be
													modified or withdrawn by seller prior to receipt of
													buyer`s acceptance.
												</div>
												{data.warranty === "" ? null : (
													<>
														<div className='w-full mt-[2px]'>
															<p className='font-bold'>
																5. <span className='underline'>WARRANTY</span>
															</p>
														</div>
														<div className='w-full'>
															<p>
																Warranty period is{" "}
																<span className='font-bold'>
																	{data.warranty}
																</span>
															</p>
															<p>
																This warranty is valid in accordance with the
																period and conditions set by PT. Dwitama Mulya
																Persada.
															</p>
															<p className='font-bold'>
																Warranty part as per approval drawing, not
																performance warranty
															</p>
														</div>
													</>
												)}
												<div className='w-full mt-[2px]'>
													<p className='font-bold'>
														{data.warranty === "" ? "5." : "6. "}{" "}
														<span className='underline'>PROPRIENTARY</span>
													</p>
												</div>
												<div className='w-full whitespace-normal'>
													<p>
														We herein submit this proposal in confidence for
														evaluation by the buyer. Its contents are
														proprietary to the seller. By taking receipt of this
														proposal, the buyer agrees not to reveal its content
														in whole or in part beyond those persons in its own
														organization necessary to properly evaluate this
														proposal or to perform any resulting contract. Buyer
														shall not reveal the contents of this proposal to a
														third party or make copies of this proposal without
														the prior written consent of the seller.
													</p>
												</div>
											</div>
											<div className='w-full mt-3'>
												We hope that our quotation well meet to your
												requirement, thank you for your attention and
												cooperation
											</div>
										</div>
										<div className='grid grid-cols-3 gap-2 mt-2 text-center'>
											<div className='w-full'>
												<p className='mb-16'>Yours Faithfully,</p>
												<Input
													placeholder='.....'
													type='text'
													required={true}
													withLabel={false}
													className='text-black text-lg rounded-lg text-center w-full outline-none'
												/>
												<Input
													placeholder='.....'
													type='text'
													required={true}
													withLabel={false}
													className='text-black text-lg rounded-lg text-center w-full outline-none'
												/>
											</div>
											<div className='w-full'>
												<p className='mb-20'></p>
												<Input
													placeholder='.....'
													type='text'
													required={true}
													withLabel={false}
													className='text-black text-lg rounded-lg text-center w-full outline-none'
												/>
												<Input
													placeholder='.....'
													type='text'
													required={true}
													withLabel={false}
													className='text-black text-lg rounded-lg text-center w-full outline-none'
												/>
											</div>
											<div className='w-full'>
												<p className='mb-16'>Consent By,</p>
												<Input
													placeholder='.....'
													type='text'
													required={true}
													withLabel={false}
													className='text-black text-lg rounded-lg text-center w-full outline-none'
												/>
												<Input
													placeholder='.....'
													type='text'
													required={true}
													withLabel={false}
													className='text-black text-lg rounded-lg text-center w-full outline-none'
												/>
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
