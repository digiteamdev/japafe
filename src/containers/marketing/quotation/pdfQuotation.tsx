import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, FileText } from "react-feather";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Printer } from "react-feather";

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
			// const width = pdf.internal.pageSize.getWidth();
			// const height = pdf.internal.pageSize.getHeight();
			pdf.addImage(imgData, "JPEG", 0, 0, 0, 0);
			window.open(pdf.output("bloburl"), "_blank");
			// pdf.save(`Work_Order_Release_${data.job_no}.pdf`);
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
										className='my-4 mx-40 px-20 pb-4 pt-4'
										id='divToPrint'
									>
                                        <div className="border border-black">
                                            <div className="w-full p-2">
                                                <h4 className="text-sm font-semibold">PT DWITAMA MULYA PERSADA</h4>
                                                <p className="text-xs">Kawasan Industri De Prima Terra</p>
                                                <p className="text-xs">Jl. Raya Sapan - Gede Bage Block D1 07 Tegalluar Bandung 40287</p>
                                                <p className="text-xs">Phone : +62 22 88881810, +62 22 87528469-60</p>
                                                <p className="text-xs">Email : sales@dwitama.co.id - www.dwitama.co.id</p>
                                            </div>
                                        </div>
                                        <div className="w-full grid grid-cols-6 grid-rows-2">
                                            <div className=" w-full p-2 border border-black border-t-0 border-r-0 col-span-3 row-span-2">
                                                <h2 className="text-lg font-bold text-center pt-4">Quotation</h2>
                                            </div>
                                            <div className="w-full p-2 border border-black border-t-0 border-r-0 col-span-2">
                                                <h2 className="text-base text-center">No. Dokumen / Revisi</h2>
                                            </div>
                                            <div className="w-full p-2 border border-black border-t-0">
                                                <h2 className="text-base text-center">Level</h2>
                                            </div>
                                            <div className="w-full p-2 border border-black border-t-0 border-r-0 col-span-2">
                                                <h2 className="text-base text-center">No. Dokumen / Revisi</h2>
                                            </div>
                                            <div className="w-full p-2 border border-black border-t-0">
                                                <h2 className="text-base text-center">3</h2>
                                            </div>
                                        </div>
                                        <div className="w-full mt-4">
                                            <div className="grid grid-cols-5">
                                                <div className="w-full">Date</div>
                                                <div className="w-full col-span-4">: </div>
                                            </div>
                                            <div className="grid grid-cols-5">
                                                <div className="w-full">Quotation Ref</div>
                                                <div className="w-full col-span-4">: </div>
                                            </div>
                                            <div className="grid grid-cols-5 mb-2">
                                                <div className="w-full">To</div>
                                                <div className="w-full col-span-4">: </div>
                                            </div>
                                            <div className="w-full divide-y p-1 bg-slate-400"></div>
                                            <div className="w-full grid grid-cols-5">
                                                <div className="w-full">Attention</div>
                                                <div className="w-full col-span-4">: </div>
                                            </div>
                                            <div className="grid grid-cols-5">
                                                <div className="w-full">Subject</div>
                                                <div className="w-full col-span-4">: </div>
                                            </div>
                                            <div className="grid grid-cols-5">
                                                <div className="w-full">End User's</div>
                                                <div className="w-full col-span-4">: </div>
                                            </div>
                                            <div className="grid grid-cols-5">
                                                <div className="w-full">Maker's</div>
                                                <div className="w-full col-span-4">: </div>
                                            </div>
                                            <div className="grid grid-cols-5 mb-2">
                                                <div className="w-full">Site Location</div>
                                                <div className="w-full col-span-4">: </div>
                                            </div>
                                            <div className="w-full divide-y p-1 bg-slate-400"></div>
                                        </div>
                                        <div className="w-full mt-2">
                                            <p className="text-center font-semibold">Description</p>
                                        </div>
                                        <div className="w-full mt-2">
                                            <p className="text-sm">We hope that our proposal well meet to your requirement, thank you for kind attention and corporation.</p>
                                        </div>
                                        <div className="w-full mt-2">
                                            <p className="text-base text-center mt-2">Your Faithfully,</p>
                                            <div className="grid grid-cols-2 mt-2">
                                                <div className="w-full text-center">
                                                    <p className="mb-[65px]">Bandung, {moment(new Date()).format('DD-MMMM-YYYY')}</p>
                                                    <p>Manager Marketing</p>
                                                </div>
                                                <div className="w-full text-center">
                                                    <p className="mb-[65px]">Bandung, {moment(new Date()).format('DD-MMMM-YYYY')}</p>
                                                    <p>Sales & Marketing Dept</p>
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
