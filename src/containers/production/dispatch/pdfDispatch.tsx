import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, FileText } from "react-feather";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Printer } from "react-feather";
import moment from "moment";

interface props {
	isModal?: boolean;
	dataDispatch?: any;
	dataDetail?: any;
	showModalPdf: (res: any, val: boolean) => void;
}

export const PdfDispatch = ({
	isModal,
	dataDispatch,
	dataDetail,
	showModalPdf,
}: props) => {

	const printDocument = () => {
		const doc: any = document.getElementById("divToPrint");
		html2canvas(doc).then((canvas) => {
			const imgData = canvas.toDataURL("image/png");
			const pdf: any = new jsPDF("p", "mm", [145, 250]);
			// const width = pdf.internal.pageSize.getWidth();
			// const height = pdf.internal.pageSize.getHeight();
			pdf.addImage(imgData, "JPEG", 0, 0);
			// window.open(pdf.output("bloburl"), "_blank");
			pdf.save(`Dispatch_${dataDispatch.id_dispatch}.pdf`);
		});
	};

	const status = (choice: string) => {
		let dataPart = dataDispatch.srimg.srimgdetail.filter( (namePart: any) => { return namePart.name_part === dataDetail })
		if(dataPart[0].choice === choice){
			return true
		}else{
			return false
		}
	}

	return (
		<div className='z-80'>
			<Transition appear show={isModal} as={Fragment}>
				<Dialog
					as='div'
					className='relative w-full'
					onClose={() => showModalPdf(null, false)}
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
												Download Detail Dispatch
											</Dialog.Title>
										</div>

										<button
											onClick={() => showModalPdf(null, false)}
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
										className='my-4 mx-[270px] px-4 py-4 border border-black'
										id='divToPrint'
									>
										{dataDetail ? (
											<div>
												<div className='border border-collapse border-black py-2'>
													<p className='text-black text-center text-2xl font-semibold m-0'>
														JAPA
													</p>
												</div>
												<p className='text-black text-center text-lg font-semibold py-2'>
													DISPATCH RECORD
												</p>
												<div>
													<div className='flex justify-center'>
														<div className='mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]'>
															<input
																className='relative float-left -ml-[1.5rem] mr-1 mt-[6px] h-5 w-5 rounded-full border-2 border-solid border-neutral-300'
																type='radio'
																onChange={ (e) => e }
																checked={ status('Repair')}
																disabled={ !status('Repair')}
															/>
															<label className='inline-block pl-[0.15rem] hover:cursor-pointer pr-4'>
																Repair
															</label>
														</div>
														<div className='mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]'>
															<input
																className='relative float-left -ml-[1.5rem] mr-1 mt-[6px] h-5 w-5 rounded-full border-2 border-solid border-neutral-300'
																type='radio'
																onChange={ (e) => e }
																checked={ status('Manufacture_New') }
																disabled={ !status('Manufacture_New') }
															/>
															<label className='mt-px inline-block pl-[0.15rem] hover:cursor-pointer pr-4'>
																Manufacture New
															</label>
														</div>
														<div className='mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]'>
															<input
																className='relative float-left -ml-[1.5rem] mr-1 mt-[6px] h-5 w-5 rounded-full border-2 border-solid border-neutral-300'
																type='radio'
																onChange={ (e) => e }
																checked={ status('Supply_New')}
																disabled={ !status('Supply_New')}
															/>
															<label className='mt-px inline-block pl-[0.15rem] hover:cursor-pointer pr-4'>
																Supply New
															</label>
														</div>
													</div>
												</div>
												<table>
													<thead></thead>
													<tbody>
														<tr>
															<td>Job No</td>
															<td className='px-2'>:</td>
															<td>{dataDispatch.srimg.timeschedule.wor.job_no}</td>
														</tr>
														<tr>
															<td>Customer</td>
															<td className='px-2'>:</td>
															<td>
																{
																	dataDispatch.srimg.timeschedule.wor.customerPo.quotations
																		.Customer.name
																}
															</td>
														</tr>
														<tr>
															<td>Part Name</td>
															<td className='px-2'>:</td>
															<td>{dataDetail}</td>
														</tr>
														<tr>
															<td>Total Qty</td>
															<td className='px-2'>:</td>
															<td>{dataDispatch.srimg.timeschedule.wor.qty}</td>
														</tr>
														<tr>
															<td>Remark</td>
															<td className='px-2'>:</td>
															<td>{dataDispatch.remark}</td>
														</tr>
													</tbody>
												</table>
												<table className='w-full mt-4'>
													<thead>
														<tr>
															<th className='border border-collapse border-black w-[20%] text-center text-sm pb-2'>
																Worker Center
															</th>
															<th className='border border-collapse border-black w-[20%] text-center text-sm pb-2'>
																Start
															</th>
															<th className='border border-collapse border-black w-[20%] text-center text-sm pb-2'>
																Operator
															</th>
															<th className='border border-collapse border-black w-[20%] text-center text-sm pb-2'>
																Approval
															</th>
															<th className='border border-collapse border-black w-[20%] text-center text-sm pb-2'>
																Finish
															</th>
														</tr>
													</thead>
													<tbody>
														{dataDispatch.dispatchDetail
															.filter((part: any) => {
																return part.part === dataDetail;
															})
															.map((res: any, i: number) => {
																return (
																	<tr key={i}>
																		<td className='border border-collapse border-black w-[20%] text-justify text-sm pb-2'>
																			{res.workCenter.name}
																		</td>
																		<td className='border border-collapse border-black w-[20%] text-justify text-sm pb-2'>
																			{moment(res.start).format("DD-MM-YYYY")}
																		</td>
																		<td className='border border-collapse border-black w-[20%] text-justify text-sm pb-2'>
																			{ res.Employee !== null ? res.Employee.employee_name : ''}
																		</td>
																		<td className='border border-collapse border-black w-[20%] text-justify text-sm pb-2'>
																			{res.approvebyID === null ? "" : "Admin"}
																		</td>
																		<td className='border border-collapse border-black w-[20%] text-justify text-sm pb-2'>
																			{res.finish === null
																				? ""
																				: moment(res.finish).format(
																						"DD-MM-YYYY"
																				)}
																		</td>
																	</tr>
																);
															})}
													</tbody>
												</table>
											</div>
										) : null}
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
