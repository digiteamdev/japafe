import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, FileText } from "react-feather";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Logo from "../../../assets/logo/logo-ISO-9001.png";
import Logo2 from "../../../assets/logo/Logo-ISO-14001.png";
import Logo3 from "../../../assets/logo/Logo-ISO-45001.png";
import Logo4 from "../../../assets/logo/dwitama.png";
import Image from "next/image";
import { Printer, Square, CheckSquare } from "react-feather";
import { formatRupiah } from "@/src/utils";

interface props {
	isModal?: boolean;
	data?: any;
	showModalPdf: (val: boolean) => void;
}

export const PdfSr = ({ isModal, data, showModalPdf }: props) => {
	const printDocument = () => {
		const doc: any = document.getElementById("divToPrint");
		html2canvas(doc).then((canvas) => {
			const imgData = canvas.toDataURL("image/png");
			const pdf: any = new jsPDF("p", "mm", "a4");
			const width = pdf.internal.pageSize.getWidth();
			// const height = pdf.internal.pageSize.getHeight();
			pdf.addImage(imgData, "JPEG", 0, 0, 0, 0);
			// window.open(pdf.output("bloburl"), "_blank");
			pdf.save(`Material_request_${data.no_sr}.pdf`);
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
												Download Service Request
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
									<div className='my-4 mx-40 px-20 pb-4' id='divToPrint'>
										<div className='pt-4'>
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
														Service Request (SR)
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
														DMP/PCH/FRM-06 / 00
													</h2>
												</div>
												<div className='w-full p-2 border border-black border-t-0'>
													<h2 className='text-base text-center'>3</h2>
												</div>
											</div>
											<div className='grid grid-cols-2 text-sm'>
												<div className='border border-t-0 border-r-0 border-black grid grid-cols-3 p-1'>
													<p>Number</p>
													<p className='col-span-2'>: {data.no_sr}</p>
												</div>
												<div className='border border-t-0 border-black grid grid-cols-3 p-1'>
													<p>Date Request</p>
													<p className='col-span-2'>
														: {moment(data.date_mr).format("DD MMMM YYYY")}
													</p>
												</div>
												<div className='border border-t-0 border-r-0 border-black grid grid-cols-3 p-1'>
													<p>Departement</p>
													<p className='col-span-2'>
														: {data.user.employee.sub_depart.departement.name} (
														{data.user.employee.sub_depart.name})
													</p>
												</div>
												<div className='border border-t-0 border-black grid grid-cols-3 p-1'>
													<p>Date Ready</p>
													<p className='col-span-2'>: </p>
												</div>
												<div className='border border-t-0 border-r-0 border-black grid grid-cols-3 p-1'>
													<p>Job No</p>
													<p className='col-span-2'>
														:{" "}
														{data.job_no}
													</p>
												</div>
												<div className='border border-t-0 border-black grid grid-cols-3 p-1'></div>
											</div>
											<div className='flex w-full bg-green-300'>
												<div className='text-center font-semibold w-[10%] border border-t-0 border-r-0 border-black p-1'>
													No
												</div>
												<div className='text-center font-semibold w-[40%] border border-t-0 border-r-0 border-black p-1'>
													Description
												</div>
												<div className='text-center font-semibold w-[10%] border border-t-0 border-r-0 border-black p-1'>
													Qty
												</div>
												<div className='text-center font-semibold w-[40%] border border-t-0 border-black p-1'>
													Unit Price
												</div>
											</div>
											{data.SrDetail.map((res: any, i: number) => {
												return (
													<div className='flex w-full' key={i}>
														<div className='text-center w-[10%] border border-t-0 border-r-0 border-black p-1'>
															{i + 1}
														</div>
														<div className='text-center w-[40%] border border-t-0 border-r-0 border-black p-1'>
															{res.workCenter.name}{" "}
															({res.part})
														</div>
														<div className='text-center w-[10%] border border-t-0 border-r-0 border-black p-1'>
															{res.qtyAppr}
														</div>
														<div className='text-center w-[40%] border border-t-0 border-black p-1'>
															{formatRupiah(res.price.toString())}
														</div>
													</div>
												);
											})}
											<div className='grid grid-cols-3 w-full bg-green-300'>
												<div className='text-center font-semibold border border-t-0 border-r-0 border-black p-1'>
													Prepared by
												</div>
												<div className='text-center font-semibold border border-t-0 border-r-0 border-black p-1'>
													Position
												</div>
												<div className='text-center font-semibold border border-t-0 border-black p-1'>
													Date & Signature
												</div>
											</div>
                                            <div className='grid grid-cols-3 w-full'>
												<div className='text-center border border-t-0 border-r-0 border-black p-1 h-20'>
													
												</div>
												<div className='text-center border border-t-0 border-r-0 border-black p-6'>
													Requestor
												</div>
												<div className='text-center border border-t-0 border-black p-1 h-20'>
													
												</div>
											</div>
                                            <div className='grid grid-cols-3 w-full bg-green-300'>
												<div className='text-center font-semibold border border-t-0 border-r-0 border-black p-1'>
													Checked by
												</div>
												<div className='text-center font-semibold border border-t-0 border-r-0 border-black p-1'>
													Position
												</div>
												<div className='text-center font-semibold border border-t-0 border-black p-1'>
													Date & Signature
												</div>
											</div>
                                            <div className='grid grid-cols-3 w-full'>
												<div className='text-center border border-t-0 border-r-0 border-black p-1 h-20'>
													
												</div>
												<div className='text-center border border-t-0 border-r-0 border-black p-6'>
													Related Manager
												</div>
												<div className='text-center border border-t-0 border-black p-1 h-20'>
													
												</div>
											</div>
                                            <div className='grid grid-cols-3 w-full bg-green-300'>
												<div className='text-center font-semibold border border-t-0 border-r-0 border-black p-1'>
													Approved by
												</div>
												<div className='text-center font-semibold border border-t-0 border-r-0 border-black p-1'>
													Position
												</div>
												<div className='text-center font-semibold border border-t-0 border-black p-1'>
													Date & Signature
												</div>
											</div>
                                            <div className='grid grid-cols-3 w-full'>
												<div className='text-center border border-t-0 border-r-0 border-black p-1 h-20'>
													
												</div>
												<div className='text-center border border-t-0 border-r-0 border-black p-6'>
													Director
												</div>
												<div className='text-center border border-t-0 border-black p-1 h-20'>
													
												</div>
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
