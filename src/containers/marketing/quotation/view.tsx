import { useState } from "react";
import { Section } from "../../../components";
import moment from "moment";
import { PdfQuotation } from "./pdfQuotation";
import { Printer } from "react-feather";

interface props {
	dataSelected: any;
}

export const ViewQuotation = ({ dataSelected }: props) => {
	const [isModal, setIsModal] = useState<boolean>(false);

	const showModalPdf = (val: boolean) => {
		setIsModal(val);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<PdfQuotation
				isModal={isModal}
				data={dataSelected}
				showModalPdf={showModalPdf}
			/>
			{dataSelected ? (
				<>
					<div className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1'>
						<div>
							<h1 className='font-bold text-xl'>Work Order Release</h1>
						</div>
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
					<h1 className='font-bold text-xl'>Quotation</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								<tbody>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Quotation ID
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.quo_auto}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Quotation Number
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.quo_num}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Quotation Date
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{moment(dataSelected.date).format("DD-MMMM-YYYY")}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Quotation Description
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.deskription}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Customer Name
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.Customer.name}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Customer Phone
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											+62{dataSelected.CustomerContact.phone}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Customer Email
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.CustomerContact.email_person}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Quotation File
										</td>
										<td className='w-[50%] px-2 py-2 border border-gray-200'>
											{dataSelected.quo_img === null ? (
												"Tidak Ada File"
											) : (
												<a
													href={dataSelected.quo_img}
													target='_blank'
													className='justify-center rounded-full border border-transparent bg-green-500 px-4 py-1 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer'
												>
													show file
												</a>
											)}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl mt-2'>Scope Of work</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead>
									<tr>
										<th className='w-[50%] pl-2 border border-black text-center font-semibold'>
											Item of work
										</th>
										<th className='w-[25%] pl-2 border border-black text-center font-semibold'>
											Volume
										</th>
										<th className='w-[25%] pl-2 border border-black text-center font-semibold'>
											Unit
										</th>
									</tr>
								</thead>
								{dataSelected.Quotations_Detail.length > 0 ? (
									dataSelected.Quotations_Detail.map((res: any, i: number) => (
										<tbody key={i}>
											<tr>
												<td className='pl-2 border border-black'>
													{res.item_of_work}
												</td>
												<td className='pl-2 border border-black text-center'>
													{res.volume}
												</td>
												<td className='pl-2 border border-black text-center'>
													{res.unit}
												</td>
											</tr>
										</tbody>
									))
								) : (
									<tbody>
										<tr>
											<td className='w-full pl-2 border border-black'>-</td>
											<td className='w-full pl-2 border border-black'>-</td>
											<td className='w-full pl-2 border border-black'>-</td>
										</tr>
									</tbody>
								)}
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl mt-2'>Equipment</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead>
									<tr>
										<th className='w-[30%] pl-2 border border-black text-center font-semibold'>
											Equipment
										</th>
										<th className='w-[30%] pl-2 border border-black text-center font-semibold'>
											Part
										</th>
										<th className='w-[10%] pl-2 border border-black text-center font-semibold'>
											Quantity
										</th>
										<th className='w-[30%] pl-2 border border-black text-center font-semibold'>
											Description
										</th>
									</tr>
								</thead>
								{dataSelected.eqandpart.length > 0 ? (
									dataSelected.eqandpart.map((res: any, i: number) => (
										<tbody key={i}>
											<tr>
												<td className='pl-2 border border-black'>
													{res.equipment.nama}
												</td>
												<td className='pl-2 border border-black'>
													{res.eq_part.nama_part}
												</td>
												<td className='pl-2 border border-black text-center'>
													{res.qty}
												</td>
												<td className='pl-2 border border-black'>
													{res.keterangan}
												</td>
											</tr>
										</tbody>
									))
								) : (
									<tbody>
										<tr>
											<td className='w-full pl-2 border border-black'>-</td>
											<td className='w-full pl-2 border border-black'>-</td>
											<td className='w-full pl-2 border border-black'>-</td>
											<td className='w-full pl-2 border border-black'>-</td>
										</tr>
									</tbody>
								)}
							</table>
						</div>
					</Section>
				</>
			) : null}
		</div>
	);
};
