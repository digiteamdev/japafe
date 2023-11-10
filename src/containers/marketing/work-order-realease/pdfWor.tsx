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

export const PdfWor = ({ isModal, data, showModalPdf }: props) => {
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
									<div
										className='my-4 mx-40 px-20 pb-4'
										id='divToPrint'
									>
										<h1 className='font-bold text-center text-xl my-4'>
											WORK ORDER RELEASE
										</h1>
										<table className='w-full mb-2'>
											<thead></thead>
											<tbody>
												<tr>
													<td className='w-[35%]'>Job No</td>
													<td className='w-[65%]'>: {data.job_no}</td>
												</tr>
												<tr>
													<td className='w-[35%]'>Customer</td>
													<td className='w-[65%]'>
														: {data.customerPo.quotations.Customer.name}
													</td>
												</tr>
												<tr>
													<td className='w-[35%]'>Subject</td>
													<td className='w-[65%]'>: {data.subject}</td>
												</tr>
												<tr>
													<td className='w-[35%]'>Job Description</td>
													<td className='w-[65%]'>: {data.job_desk}</td>
												</tr>
												<tr>
													<td className='w-[35%]'>SPK No.</td>
													<td className='w-[65%]'>: {data.contract_no_spk}</td>
												</tr>
												<tr>
													<td className='w-[35%]'>Sales Representative</td>
													<td className='w-[65%]'>
														: {data.employee.employee_name}
													</td>
												</tr>
												<tr>
													<td className='w-[35%]'>Contact Person</td>
													<td className='w-[65%]'>
														:{" "}
														{
															data.customerPo.quotations.CustomerContact
																.contact_person
														}
													</td>
												</tr>
												<tr>
													<td className='w-[35%]'>Email Address (Office)</td>
													<td className='w-[65%]'>
														: {data.customerPo.quotations.Customer.email}
													</td>
												</tr>
												<tr>
													<td className='w-[35%]'>Priority Status</td>
													<td className='w-[65%]'>: {data.priority_status}</td>
												</tr>
												<tr>
													<td className='w-[35%]'>Quantity</td>
													<td className='w-[65%]'>: {data.qty}</td>
												</tr>
												<tr>
													<td className='w-[35%]'>Date Of Order</td>
													<td className='w-[65%]'>
														:{" "}
														{moment(data.date_of_order).format("DD-MMMM-YYYY")}
													</td>
												</tr>
												<tr>
													<td className='w-[35%]'>Delivery Schedule</td>
													<td className='w-[65%]'>
														:{" "}
														{moment(data.delivery_date).format("DD-MMMM-YYYY")}
													</td>
												</tr>
												<tr>
													<td className='w-[35%]'>Shipping Address</td>
													<td className='w-[65%]'>: {data.shipping_address}</td>
												</tr>
												<tr>
													<td className='w-[35%]'>Equipment Name</td>
													<td className='w-[65%]'>
														:{" "}
														{
															data.customerPo.quotations.eqandpart[0].equipment
																.nama
														}
													</td>
												</tr>
												<tr>
													<td className='w-[35%]'>Estimate Man Hour</td>
													<td className='w-[65%]'>
														: {data.estimated_man_our}
													</td>
												</tr>
												<tr>
													<td className='w-[35%]'>Equipment Detail</td>
													<td className='w-[65%]'>
														: Mfg : {data.eq_mfg}{" "}
														&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Rotation :{" "}
														{data.eq_rotation}
													</td>
												</tr>
												<tr>
													<td className='w-[35%]'></td>
													<td className='w-[65%]'>
														: Model : {data.eq_model}{" "}
														&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Power :{" "}
														{data.eq_power}
													</td>
												</tr>
												<tr>
													<td className='w-[35%]'>Scope Of Work</td>
													<td className='w-[65%]'>: {data.scope_of_work}</td>
												</tr>
											</tbody>
										</table>
										<table className='w-full mb-2'>
											<thead>
												<tr>
													<th className='border border-black border-collapse text-center w-[5%] p-2'>
														No
													</th>
													<th className='border border-black text-center w-[55%] p-2'>
														Description
													</th>
													<th className='border border-black text-center w-[20%] p-2'>
														Qty
													</th>
													<th className='border border-black text-center w-[20%] p-2'>
														Unit
													</th>
												</tr>
											</thead>
											<tbody>
												{data.customerPo.quotations.Quotations_Detail.map(
													(res: any, i: number) => (
														<tr key={i}>
															<td className='border border-black text-center p-2'>
																{i + 1}
															</td>
															<td className='border border-black p-2'>
																{res.item_of_work}
															</td>
															<td className='border border-black text-center p-2'>
																{res.volume}
															</td>
															<td className='border border-black text-center p-2'>
																{res.unit}
															</td>
														</tr>
													)
												)}
											</tbody>
										</table>
										<table className='w-full mb-2'>
											<thead></thead>
											<tbody>
												<tr>
													<td className='w-[35%]'>Note</td>
													<td className='w-[65%]'>: {data.noted}</td>
												</tr>
											</tbody>
										</table>
										<table className='w-full mb-2'>
											<thead>
												<tr>
													<th className='border border-black text-center p-2'>
														Prepared By
													</th>
													<th className='border border-black text-center p-2'>
														Check By
													</th>
													<th className='border border-black text-center p-2'>
														Approved By
													</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td className='border border-black py-8'></td>
													<td className='border border-black py-8'></td>
													<td className='border border-black py-8'></td>
												</tr>
											</tbody>
										</table>
										<p>Distributed To :</p>
										<div className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-1'>
											<div>
												<p>O. Dirut</p>
											</div>
											<div>
												<p>O. Dir MKT</p>
											</div>
											<div>
												<p>O. Mgr Eng</p>
											</div>
											<div>
												<p>O. Accounting</p>
											</div>
										</div>
										<div className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-1'>
											<div>
												<p>O. Mgr Prod</p>
											</div>
											<div>
												<p>O. Mgr PPIC</p>
											</div>
											<div>
												<p>O. Mgr Purch</p>
											</div>
											<div>
												<p>O. SPV Mechanic</p>
											</div>
										</div>
										<div className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-1'>
											<div>
												<p>O. SPV QC</p>
											</div>
											<div>
												<p>O. Drafter</p>
											</div>
											<div>
												<p>O. SPV Fs</p>
											</div>
											<div>
												<p>O. SPV Machining</p>
											</div>
										</div>
										<div className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-1 mb-4'>
											<div>
												<p>O. Mgr Field Svc</p>
											</div>
											<div>
												<p>O. Mgr HSE</p>
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
