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
import { Input } from "@/src/components/input";

interface props {
	isModal?: boolean;
	data?: any;
	showModalPdf: (val: boolean) => void;
}

export const PdfWor = ({ isModal, data, showModalPdf }: props) => {
	const printDocument = () => {
		const doc: any = document.getElementById("divToPrint");
		html2canvas(doc).then((canvas) => {
			const imgData = canvas.toDataURL("image/png");
			const pdf: any = new jsPDF("p", "mm", "a4");
			const width = pdf.internal.pageSize.getWidth();
			const height = pdf.internal.pageSize.getHeight();
			pdf.addImage(imgData, "JPEG", 0, 0, width, 280);
			// window.open(pdf.output("bloburl"), "_blank");
			pdf.save(`Work_Order_Release_${data.job_no}.pdf`);
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
												Download Work Order Release
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
									<div className='m-2 p-1' id='divToPrint'>
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
												<div className=' w-full p-2 border border-black border-t-0 border-r-0 col-span-3 row-span-2 bg-purple-400'>
													<h2 className='text-lg font-bold text-center pt-4'>
														Work Order Release
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
														DMP/MKT/FRM-07 / 00
													</h2>
												</div>
												<div className='w-full p-2 border border-black border-t-0'>
													<h2 className='text-base text-center'>3</h2>
												</div>
											</div>
											<div className='w-full mt-4 text-sm'>
												<div className='grid grid-cols-5'>
													<div className='w-full font-semibold'>Job No</div>
													<div className='w-full font-semibold col-span-4 flex'>
														:{" "}
														{data.job_no.split("").map((res: any, i: number) => {
															return (
																<p className='mx-[2px] px-2 border border-black text-lg' key={i}>
																	{res}
																</p>
															);
														})}
													</div>
												</div>
												<div className='grid grid-cols-5'>
													<div className='w-full'>Customer</div>
													<div className='w-full col-span-4 border border-l-0 border-t-0 border-r-0 border-b-slate-400'>
														: {data.customerPo.quotations.Customer.name}
													</div>
												</div>
												<div className='grid grid-cols-5'>
													<div className='w-full'>Job Description</div>
													<div className='w-full col-span-4 border border-l-0 border-t-0 border-r-0 border-b-slate-400'>
														: {data.job_description}
													</div>
												</div>
											</div>
											<div className='w-full grid grid-cols-2 gap-1 text-sm mt-2'>
												<div className='grid grid-cols-7'>
													<div className='w-full col-span-3'>Quantity</div>
													<div className='w-full col-span-4 border border-l-0 border-t-0 border-r-0 border-b-slate-400'>: {data.qty}</div>
												</div>
												<div className='grid grid-cols-6'>
													<div className='w-full col-span-2'>PO No</div>
													<div className='w-full col-span-4 border border-l-0 border-t-0 border-r-0 border-b-slate-400'>
														: {data.customerPo.id_po}
													</div>
												</div>
												<div className='grid grid-cols-7'>
													<div className='w-full col-span-3'>Date Of Order</div>
													<div className='w-full col-span-4 border border-l-0 border-t-0 border-r-0 border-b-slate-400'>
														:{" "}
														{moment(data.date_of_order).format("DD MMMM YYYY")}
													</div>
												</div>
												<div className='grid grid-cols-6'>
													<div className='w-full col-span-2'>
														Contact Person
													</div>
													<div className='w-full col-span-4 border border-l-0 border-t-0 border-r-0 border-b-slate-400'>
														:{" "}
														{
															data.customerPo.quotations.CustomerContact
																.contact_person
														}{" "}
														(+62
														{data.customerPo.quotations.CustomerContact.phone})
													</div>
												</div>
												<div className='grid grid-cols-7'>
													<div className='w-full col-span-3'>
														Delivery Schedule
													</div>
													<div className='w-full col-span-4'>
														:{" "}
														{moment(data.delivery_date).format("DD MMMM YYYY")}
													</div>
												</div>
												<div className='grid grid-cols-6'>
													<div className='w-full col-span-2'>Sales</div>
													<div className='w-full col-span-4'>
														: {data.employee.employee_name}
													</div>
												</div>
												<div className='grid grid-cols-7'>
													<div className='w-full col-span-3'>
													</div>
													<div className='w-full col-span-4 border border-l-0 border-t-0 border-r-0 border-b-slate-400'>
													</div>
												</div>
												<div className='grid grid-cols-6'>
													<div className='w-full col-span-2'>Estimator</div>
													<div className='w-full col-span-4 border border-l-0 border-t-0 border-r-0 border-b-slate-400'>
														: {data.estimator.employee_name}
													</div>
												</div>
												<div className='grid grid-cols-7'>
													<div className='w-full col-span-3'>
														Shipping Address
													</div>
													<div className='w-full col-span-4 border border-l-0 border-t-0 border-r-0 border-b-slate-400'>
														: {data.shipping_address}
													</div>
												</div>
												<div className='grid grid-cols-6'>
													<div className='w-full col-span-2'>Email Address</div>
													<div className='w-full col-span-4 border border-l-0 border-t-0 border-r-0 border-b-slate-400'>
														: {data.customerPo.quotations.Customer.email}
													</div>
												</div>
											</div>
											<div className='w-full grid grid-cols-5 gap-1 text-sm mt-2'>
												<div className='w-full'>Equipment Detail</div>
												<div className='grid grid-cols-2 col-span-4 gap-1'>
													<div className='grid grid-cols-3'>
														<div>: Mfg</div>
														<div className='col-span-2 border border-l-0 border-t-0 border-r-0 border-b-slate-400'>: {data.eq_mfg}</div>
													</div>
													<div className='grid grid-cols-3'>
														<div>Rotation</div>
														<div className='col-span-2 border border-l-0 border-t-0 border-r-0 border-b-slate-400'>
															: {data.eq_rotation}
														</div>
													</div>
													<div className='grid grid-cols-3'>
														<div className="pl-1.5">Model</div>
														<div className='col-span-2 border border-l-0 border-t-0 border-r-0 border-b-slate-400'>: {data.eq_model}</div>
													</div>
													<div className='grid grid-cols-3'>
														<div>Power</div>
														<div className='col-span-2 border border-l-0 border-t-0 border-r-0 border-b-slate-400'>: {data.eq_power}</div>
													</div>
													<div className='grid grid-cols-3'>
														<div className="pl-1.5">Warranty</div>
														<div className='col-span-2 border border-l-0 border-t-0 border-r-0 border-b-slate-400'>: {data.customerPo.quotations.warranty}</div>
													</div>
													<div className='grid grid-cols-3'>
														<div></div>
														<div className='col-span-2 border border-l-0 border-t-0 border-r-0 border-b-slate-400'>	</div>
													</div>
												</div>
											</div>
											<div className='grid grid-cols-5 mb-2 mt-1 text-sm'>
													<div className='w-full'>Priority Status</div>
													<div className='w-full col-span-4 flex'>
														: 
														<div className={`mx-1 ${data.priority_status === 'ST' ? "px-1" : "px-2"} border border-black`}>{ data.priority_status === 'ST' ? "X" : "" }</div>
														<div className="mr-4">ST</div>
														<div className={`mx-1 ${data.priority_status === 'OT' ? "px-1" : "px-2"} border border-black`}>{ data.priority_status === 'OT' ? "X" : "" }</div>
														<div className="mr-4">OT</div>
														<div className={`mx-1 ${data.priority_status === 'XXT' ? "px-1" : "px-2"} border border-black`}>{ data.priority_status === 'XXT' ? "X" : "" }</div>
														<div className="mr-4">XXT</div>
														<div className={`mx-1 ${data.priority_status === 'T&M' ? "px-1" : "px-2"} border border-black`}>{ data.priority_status === 'T&M' ? "X" : "" }</div>
														<div className="mr-4">T & M</div>
														<div className={`mx-1 ${data.priority_status === 'Q' ? "px-1" : "px-2"} border border-black`}>{ data.priority_status === 'Q' ? "X" : "" }</div>
														<div className="mr-4">Q</div>
													</div>
												</div>
												<div className='grid grid-cols-5 my-1.5 text-sm'>
													<div className='w-full'>Quotation No</div>
													<div className='w-full col-span-4'>
														: {data.customerPo.quotations.quo_num}
													</div>
												</div>
											<div className='flex border border-black bg-purple-400 text-sm'>
												<div className='p-2 text-center w-[10%] font-semibold'>
													No
												</div>
												<div className='p-2 text-center w-[20%] font-semibold'>
													Qty Item
												</div>
												<div className='p-2 text-center w-[50%] font-semibold'>
													Standar work scope item
												</div>
												<div className='p-2 text-center w-[20%] font-semibold'>
													Unit
												</div>
											</div>
											{data.work_scope_item.map((res: any, i: number) => {
												return (
													<div
														className='flex border-b border-b-slate-400 text-sm'
														key={i}
													>
														<div className='p-1 text-center w-[10%]'>
															{i + 1}
														</div>
														<div className='p-1 text-center w-[20%]'>
															{res.qty}
														</div>
														<div className='p-1 w-[50%]'>
															{res.item}
														</div>
														<div className='p-1 text-center w-[20%]'>
															{res.unit}
														</div>
													</div>
												);
											})}
											<div className='flex w-full mt-2 bg-purple-400'>
												<div className='w-full border border-black border-r-0 pb-1 px-1 text-center font-semibold'>
													Prepared by
												</div>
												<div className='w-full border border-black border-r-0 pb-1 px-1 text-center font-semibold'>
													Position
												</div>
												<div className='w-full border border-black pb-1 px-1 text-center font-semibold'>
													Date & Signature
												</div>
											</div>
											<div className='flex w-full'>
												<div className='w-full border border-black border-r-0 border-t-0'>
													<Input
														placeholder='..........'
														type='text'
														required={true}
														withLabel={false}
														className='text-black text-lg rounded-lg text-center w-full outline-none p-2'
													/>
												</div>
												<div className='w-full border border-black border-r-0 border-t-0'>
													<Input
														placeholder='..........'
														type='text'
														required={true}
														withLabel={false}
														className='text-black text-lg rounded-lg text-center w-full outline-none p-2'
													/>
												</div>
												<div className='w-full border border-black border-t-0'>
													<Input
														placeholder='..........'
														type='text'
														required={true}
														withLabel={false}
														className='text-black text-lg rounded-lg text-center w-full outline-none p-2'
													/>
												</div>
											</div>
											<div className='flex w-full bg-purple-400'>
												<div className='w-full border border-black border-r-0 pb-1 px-1 text-center font-semibold'>
													Checked by
												</div>
												<div className='w-full border border-black border-r-0 pb-1 px-1 text-center font-semibold'>
													Position
												</div>
												<div className='w-full border border-black pb-1 px-1 text-center font-semibold'>
													Date & Signature
												</div>
											</div>
											<div className='flex w-full'>
												<div className='w-full border border-black border-r-0 border-t-0'>
													<Input
														placeholder='..........'
														type='text'
														required={true}
														withLabel={false}
														className='text-black text-lg rounded-lg text-center w-full outline-none p-2'
													/>
												</div>
												<div className='w-full border border-black border-r-0 border-t-0'>
													<Input
														placeholder='..........'
														type='text'
														required={true}
														withLabel={false}
														className='text-black text-lg rounded-lg text-center w-full outline-none p-2'
													/>
												</div>
												<div className='w-full border border-black border-t-0'>
													<Input
														placeholder='..........'
														type='text'
														required={true}
														withLabel={false}
														className='text-black text-lg rounded-lg text-center w-full outline-none p-2'
													/>
												</div>
											</div>
											<div className='flex w-full bg-purple-400'>
												<div className='w-full border border-black border-r-0 pb-1 px-1 text-center font-semibold'>
													Approved by
												</div>
												<div className='w-full border border-black border-r-0 pb-1 px-1 text-center font-semibold'>
													Position
												</div>
												<div className='w-full border border-black pb-1 px-1 text-center font-semibold'>
													Date & Signature
												</div>
											</div>
											<div className='flex w-full'>
												<div className='w-full border border-black border-r-0 border-t-0'>
													<Input
														placeholder='..........'
														type='text'
														required={true}
														withLabel={false}
														className='text-black text-lg rounded-lg text-center w-full outline-none p-2'
													/>
												</div>
												<div className='w-full border border-black border-r-0 border-t-0'>
													<Input
														placeholder='..........'
														type='text'
														required={true}
														withLabel={false}
														className='text-black text-lg rounded-lg text-center w-full outline-none p-2'
													/>
												</div>
												<div className='w-full border border-black border-t-0'>
													<Input
														placeholder='..........'
														type='text'
														required={true}
														withLabel={false}
														className='text-black text-lg rounded-lg text-center w-full outline-none p-2'
													/>
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
