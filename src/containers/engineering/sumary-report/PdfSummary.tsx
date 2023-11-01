import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, FileText } from "react-feather";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Printer } from "react-feather";
import { Section } from "../../../components";
import Image from "next/image";

interface props {
	isModal?: boolean;
	data?: any;
	showModalPdf: (val: boolean) => void;
}

export const PdfSummary = ({ isModal, data, showModalPdf }: props) => {
	const printDocument = () => {
		const doc: any = document.getElementById("divToPrint");
		html2canvas(doc).then((canvas) => {
			const imgData = canvas.toDataURL("image/png");
			const pdf: any = new jsPDF("p", "mm", "a4");
			const width = pdf.internal.pageSize.getWidth();
			const height = pdf.internal.pageSize.getHeight();
			pdf.addImage(imgData, "JPEG", 0, 0, width, height);
			// window.open(pdf.output("bloburl"), "_blank");
			pdf.save(`Summary_report_${data.timeschedule.wor.job_no}.pdf`);
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
												Download Summary Report
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
										className='my-4 mx-48 px-32 border border-black'
										id='divToPrint'
									>
										{data ? (
											<>
												<h1 className='font-bold text-xl'>Summary Report</h1>
												<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
													<div className='w-full'>
														<table className='w-full'>
															<thead></thead>
															<tbody>
																<tr>
																	<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
																		No Job
																	</td>
																	<td className='w-[50%] pl-2 border border-gray-200'>
																		{data.timeschedule.wor.job_no} (
																		{
																			data.timeschedule.wor.customerPo.quotations.Customer
																				.name
																		}
																		)
																	</td>
																</tr>
																<tr>
																	<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
																		Description
																	</td>
																	<td className='w-[50%] pl-2 border border-gray-200'>
																		{data.timeschedule.wor.subject}
																	</td>
																</tr>
																<tr>
																	<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
																		Introduction
																	</td>
																	<td className='w-[50%] pl-2 border border-gray-200'>
																		{data.introduction}
																	</td>
																</tr>
																<tr>
																	<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
																		Introduction Image
																	</td>
																	<td className='w-[50%] pl-2 border border-gray-200'>
																		{ data.inimg === null ? null : (
																			<Image
																				src={data.inimg}
																				width={70}
																				height={70}
																				alt='Picture part'
																				className='mr-2'
																			/>
																		) }
																	</td>
																</tr>
															</tbody>
														</table>
													</div>
												</Section>
												<h1 className='font-bold text-xl mt-2'>Static Part</h1>
												<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2 mb-4'>
													<div className='w-full'>
														{data.srimgdetail.length > 0
															? data.srimgdetail.map((res: any, i: number) => {
																	return (
																		<div key={i}>
																			<h1 className='font-bold text-lg'>
																				{i + 1}. {res.name_part}
																			</h1>
																			<div className='ml-5'>
																				<div className='flex w-full mt-2'>
																					{res.imgSummary.length > 0
																						? res.imgSummary.map(
																								(resImg: any) => {
																									return (
																										<Image
																											key={i}
																											src={resImg.img}
																											width={70}
																											height={70}
																											alt='Picture part'
																											className='mr-2'
																										/>
																									);
																								}
																						  )
																						: null}
																				</div>
																				<div className='w-full mt-2'>
																					<table>
																						<thead></thead>
																						<tbody>
																							<tr>
																								<td className='w-[10%]'>
																									Finding
																								</td>
																								<td className='w-[1%] text-center'>
																									:
																								</td>
																								<td className='w-[89%]'>
																									{res.input_finding}
																								</td>
																							</tr>
																							<tr>
																								<td className='w-[10%]'>
																									Recom
																								</td>
																								<td className='w-[1%] text-center'>
																									:
																								</td>
																								<td className='w-[89%]'>
																									{res.choice.replace(
																										/_|-|\./g,
																										" "
																									)}
																								</td>
																							</tr>
																							<tr>
																								<td className='w-[10%]'>
																									Note
																								</td>
																								<td className='w-[1%] text-center'>
																									:
																								</td>
																								<td className='w-[89%]'>
																									{res.noted}
																								</td>
																							</tr>
																						</tbody>
																					</table>
																				</div>
																			</div>
																		</div>
																	);
															  })
															: null}
													</div>
												</Section>
											</>
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
