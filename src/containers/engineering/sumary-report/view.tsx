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
console.log(dataSelected)
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{/* <PdfSummary
				isModal={isModal}
				data={dataSelected}
				showModalPdf={showModalPdf}
			/> */}
			{dataSelected ? (
				<>
					{/* <div className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1'>
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
					</div> */}
					<h1 className='font-bold text-xl'>Summary Report</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								<tbody>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											No Job
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.wor.job_no}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Customer
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{
												dataSelected.wor.customerPo.quotations
													.Customer.name
											}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Type Summary
										</td>
										<td className='sm:w-[50%] md: w-[75%] pl-2 border border-gray-200'>
											{dataSelected.type_srimg}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Equipment
										</td>
										<td className='sm:w-[50%] md: w-[75%] pl-2 border border-gray-200'>
											{dataSelected.equipment}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Model
										</td>
										<td className='sm:w-[50%] md: w-[75%] pl-2 border border-gray-200'>
											{dataSelected.model}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Quantity
										</td>
										<td className='sm:w-[50%] md: w-[75%] pl-2 border border-gray-200'>
											{dataSelected.qty}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											O E M
										</td>
										<td className='sm:w-[50%] md: w-[75%] pl-2 border border-gray-200'>
											{dataSelected.ioem}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Certificate Number
										</td>
										<td className='sm:w-[50%] md: w-[75%] pl-2 border border-gray-200'>
											{dataSelected.ca_number}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Serial Number
										</td>
										<td className='sm:w-[50%] md: w-[75%] pl-2 border border-gray-200'>
											{dataSelected.isr}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Tag Number
										</td>
										<td className='sm:w-[50%] md: w-[75%] pl-2 border border-gray-200'>
											{dataSelected.itn}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Introduction
										</td>
										<td className='sm:w-[50%] md: w-[75%] pl-2 border border-gray-200'>
											{dataSelected.introduction}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											File
										</td>
										<td className='sm:w-[50%] md: w-[75%] pl-2 border border-gray-200'>
											{dataSelected.inimg !== null ? (
												<a
													href={dataSelected.inimg}
													target='_blank'
													className='justify-center rounded-full border border-transparent bg-green-500 px-2 py-1 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer'
												>
													Show File
												</a>
											) : (
												"-"
											)}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl mt-2'>Static Part</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead>
									<tr>
										<th className='border border-black text-center'>Image</th>
										<th className='border border-black text-center'>Part</th>
										<th className='border border-black text-center'>Finding</th>
										<th className='border border-black text-center'>
											Quantity
										</th>
										<th className='border border-black text-center'>Type</th>
										<th className='border border-black text-center'>note</th>
									</tr>
								</thead>
								<tbody>
									{dataSelected.srimgdetail.map((res: any, i: number) => {
										return (
											<tr key={i}>
												<td className='border border-black text-center'>
													{res.imgSummary.length > 0
														? res.imgSummary.map((resImg: any) => {
																return (
																	<Image
																		key={i}
																		src={resImg.img}
																		width={70}
																		height={70}
																		alt='Picture part'
																		className='mx-auto'
																	/>
																);
														  })
														: null}
												</td>
												<td className='border border-black text-center'>
													{res.name_part}
												</td>
												<td className='border border-black text-center'>
													{res.input_finding}
												</td>
												<td className='border border-black text-center'>
													{res.qty}
												</td>
												<td className='border border-black text-center'>
													{res.choice.replace(/_|-|\./g, " ")}
												</td>
												<td className='border border-black text-center'>
													{res.note}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</Section>
				</>
			) : null}
		</div>
	);
};
