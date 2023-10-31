import { useState } from "react";
import { Section } from "../../../components";
import Image from "next/image";
import { PdfSummary } from "./PdfSummary";
import { Printer } from "react-feather";

interface props {
	dataSelected: any;
}

export const ViewSummaryReport = ({ dataSelected }: props) => {
	const [isModal, setIsModal] = useState<boolean>(false);

	const showModalPdf = (val: boolean) => {
		setIsModal(val);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<PdfSummary
				isModal={isModal}
				data={dataSelected}
				showModalPdf={showModalPdf}
			/>
			{dataSelected ? (
				<>
					<div className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1'>
						<div className='text-right mr-6'>
							<button
								className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
								onClick={() => showModalPdf(true)}
							>
								<div className='flex px-1 py-1'>
									<Printer size={16} className='mr-1' /> Print
								</div>
							</button>
						</div>
					</div>
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
											{dataSelected.timeschedule.wor.job_no} (
											{dataSelected.timeschedule.wor.customerPo.quotations.Customer.name})
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Description
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.timeschedule.wor.subject}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Introduction
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.introduction}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Introduction Image
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{
												dataSelected.inimg ? (
													<Image
														src={dataSelected.inimg}
														width={70}
														height={70}
														alt='Picture part'
														className='mr-2'
													/>
												) : "-"
											}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl mt-2'>Static Part</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							{dataSelected.srimgdetail.length > 0
								? dataSelected.srimgdetail.map((res: any, i: number) => {
										return (
											<div key={i}>
												<h1 className='font-bold text-lg'>
													{i + 1}. {res.name_part}
												</h1>
												<div className='ml-5'>
													<div className='flex w-full mt-2'>
														{res.imgSummary.length > 0
															? res.imgSummary.map((resImg: any) => {
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
															  })
															: null}
													</div>
													<div className='w-full mt-2'>
														<table>
															<thead></thead>
															<tbody>
																<tr>
																	<td className='w-[10%]'>Finding</td>
																	<td className='w-[1%] text-center'>:</td>
																	<td className='w-[89%]'>
																		{res.input_finding}
																	</td>
																</tr>
																<tr>
																	<td className='w-[10%]'>Recom</td>
																	<td className='w-[1%] text-center'>:</td>
																	<td className='w-[89%]'>
																		{res.choice.replace(/_|-|\./g, " ")}
																	</td>
																</tr>
																<tr>
																	<td className='w-[10%]'>Note</td>
																	<td className='w-[1%] text-center'>:</td>
																	<td className='w-[89%]'>{res.noted}</td>
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
	);
};
