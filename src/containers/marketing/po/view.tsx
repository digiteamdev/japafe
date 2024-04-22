import { useState, useEffect } from "react";
import { Section } from "../../../components";
import { formatRupiah } from "../../../utils/index";
import moment from "moment";

interface props {
	dataSelected: any;
}

export const ViewPo = ({ dataSelected }: props) => {
	const ppn = () => {
		let disc = (dataSelected.total * dataSelected.discount) / 100;
		let ppn: number =
			((dataSelected.total - Math.ceil(disc)) *
				dataSelected.quotations.Customer.ppn) /
			100;
		return Math.ceil(ppn);
	};

	const pph = () => {
		let disc = (dataSelected.total * dataSelected.discount) / 100;
		let pph: number =
			((dataSelected.total - Math.ceil(disc)) *
				dataSelected.quotations.Customer.pph) /
			100;
		return Math.ceil(pph);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Customer PO</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								<tbody>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											PO/SO/SPK No
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.id_po}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											PO/SO/SPK Date
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{moment(dataSelected.date).format("DD-MMMM-YYYY")}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Quotation No
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.quotations.quo_num}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Job No
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.job_no}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Customer
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.quotations.Customer.name}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Subject
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.quotations.subject}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Tax
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.tax.toUpperCase()}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											PO/SO/SPK File
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.upload_doc === null ? (
												"Tidak Ada File"
											) : (
												<a
													href={dataSelected.upload_doc}
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
					<h1 className='font-bold text-xl mt-2'>Scope Of Work</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<p className='whitespace-pre-line'>
								{dataSelected.quotations.Quotations_Detail}
							</p>
						</div>
					</Section>
					<h1 className='font-bold text-xl mt-2'>Term Of Payment</h1>
					<Section className='grid grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead>
									<tr>
										<th className='pl-2 w-[40%] border border-black text-center'>
											Description
										</th>
										<th className='pl-2 w-[10%] border border-black text-center'>
											Qty
										</th>
										<th className='pl-2 w-[10%] border border-black text-center'>
											Unit
										</th>
										<th className='pl-2 w-[10%] border border-black text-center'>
											Unit Price
										</th>
										<th className='pl-2 w-[10%] border border-black text-center'>
											Total Price
										</th>
									</tr>
								</thead>
								<tbody>
									{dataSelected.price_po.map((res: any, i: number) => (
										<tr key={i}>
											<td className='pl-2 w-[40%] border border-black text-center'>
												{res.description}
											</td>
											<td className='pl-2 w-[10%] border border-black text-center'>
												{res.qty}
											</td>
											<td className='pl-2 w-[10%] border border-black text-center'>
												{res.unit}
											</td>
											<td className='pl-2 w-[10%] border border-black text-center'>
												{formatRupiah(res.unit_price.toString())}
											</td>
											<td className='pl-2 w-[10%] border border-black text-center'>
												{formatRupiah(res.total_price.toString())}
											</td>
										</tr>
									))}
									<tr>
										<td
											className='pr-2 border border-black text-right'
											colSpan={4}
										>
											Sub Total
										</td>
										<td className='pl-2 border border-black text-center'>
											{formatRupiah(dataSelected.total.toString())}
										</td>
									</tr>
									<tr>
										<td
											className='pr-2 border border-black text-right'
											colSpan={4}
										>
											Discount
										</td>
										<td className='pl-2 border border-black text-center'>
											{dataSelected.discount}%
										</td>
									</tr>
									<tr>
										<td
											className='pr-2 border border-black text-right'
											colSpan={4}
										>
											Jumlah Discount
										</td>
										<td className='pl-2 border border-black text-center'>
											{formatRupiah(((dataSelected.total * dataSelected.discount) / 100).toString())}
										</td>
									</tr>
									<tr>
										<td
											className='pr-2 border border-black text-right'
											colSpan={4}
										>
											Total
										</td>
										<td className='pl-2 border border-black text-center'>
											{formatRupiah((dataSelected.total - ((dataSelected.total * dataSelected.discount) / 100)).toString())}
										</td>
									</tr>
									{dataSelected.tax === "ppn" ? (
										<tr>
											<td
												className='pr-2 border border-black text-right'
												colSpan={4}
											>
												PPN {dataSelected.quotations.Customer.ppn}%
											</td>
											<td className='pl-2 border border-black text-center'>
												{formatRupiah(ppn().toString())}
											</td>
										</tr>
									) : dataSelected.tax === "pph" ? (
										<tr>
											<td
												className='pr-2 border border-black text-right'
												colSpan={4}
											>
												PPH {dataSelected.quotations.Customer.pph}%
											</td>
											<td className='pl-2 border border-black text-center'>
												{formatRupiah(pph().toString())}
											</td>
										</tr>
									) : dataSelected.tax === "ppn_and_pph" ? (
										<>
											<tr>
												<td
													className='pr-2 border border-black text-right'
													colSpan={4}
												>
													PPN {dataSelected.quotations.Customer.ppn}%
												</td>
												<td className='pl-2 border border-black text-center'>
													{formatRupiah(ppn().toString())}
												</td>
											</tr>
											<tr>
												<td
													className='pr-2 border border-black text-right'
													colSpan={4}
												>
													PPH {dataSelected.quotations.Customer.pph}%
												</td>
												<td className='pl-2 border border-black text-center'>
													{formatRupiah(pph().toString())}
												</td>
											</tr>
										</>
									) : null}
									<tr>
										<td
											className='pr-2 border border-black text-right'
											colSpan={4}
										>
											Grand Total
										</td>
										<td className='pl-2 border border-black text-center'>
											{formatRupiah(dataSelected.grand_tot.toString())}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Section>
					<h5 className='mt-2'>Payment Method</h5>
					<Section className='grid grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead>
									<tr>
										<th className='pl-2 border border-black text-center'>
											Payment
										</th>
										<th className='pl-2 border border-black text-center'>
											Percent
										</th>
										<th className='pl-2 border border-black text-center'>
											Total Pay
										</th>
										<th className='pl-2 border border-black text-center'>
											Date Payment
										</th>
									</tr>
								</thead>
								{dataSelected.term_of_pay.length > 0 ? (
									dataSelected.term_of_pay.map((res: any, i: number) => (
										<tbody key={i}>
											<tr>
												<td className='pl-2 w-[50%] border border-black text-center'>
													{res.limitpay}
												</td>
												<td className='pl-2 w-[10%] border border-black text-center'>
													{res.percent}%
												</td>
												<td className='pl-2 w-[10%] border border-black text-center'>
													{formatRupiah(res.price.toString())}
												</td>
												<td className='pl-2 w-[30%] border border-black text-center'>
													{moment(res.date_limit).format("DD-MMMM-YYYY")}
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
