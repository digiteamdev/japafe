import { useState, useEffect } from "react";
import { Section } from "../../../components";
import { formatRupiah } from "../../../utils/index";
import moment from "moment";

interface props {
	dataSelected: any;
}

export const ViewPo = ({ dataSelected }: props) => {
	
	const ppn = () => {
		let ppn: number =
			(dataSelected.total * dataSelected.quotations.Customer.ppn) / 100;
		return Math.ceil(ppn);
	};

	const pph = () => {
		let pph: number =
			(dataSelected.total * dataSelected.quotations.Customer.pph) / 100;
		return Math.ceil(pph);
	};

	const grandTotal = (data: any) => {
		let total: number = 0
		data.map( (res: any) => {
			total = total + res.total_price
		})
		return total
	}
console.log(dataSelected)
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
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											PO/SO/SPK No
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.id_po}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											PO/SO/SPK Date
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{moment(dataSelected.date).format("DD-MMMM-YYYY")}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Quotation No
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.quotations.quo_num}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Customer
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.quotations.Customer.name}
										</td>
									</tr>
									{/* <tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Equipment
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.quotations.eqandpart[0].equipment.nama} /{" "}
											{dataSelected.quotations.eqandpart.length} Count Part
										</td>
									</tr> */}
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Subject
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.quotations.subject}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Tax
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.tax}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											PO/SO/SPK File
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
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
					{/* <h1 className='font-bold text-xl mt-2'>Description Detail</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead>
									<tr>
										<th className='w-[30%] pl-2 border border-black text-center font-semibold'>
											Description
										</th>
										<th className='w-[10%] pl-2 border border-black text-center font-semibold'>
											Quantity
										</th>
										<th className='w-[15%] pl-2 border border-black text-center font-semibold'>
											Unit
										</th>
										<th className='w-[15%] pl-2 border border-black text-center font-semibold'>
											Price
										</th>
										<th className='w-[15%] pl-2 border border-black text-center font-semibold'>
											Discount
										</th>
										<th className='w-[15%] pl-2 border border-black text-center font-semibold'>
											Total
										</th>
									</tr>
								</thead>
								<tbody>
									{dataSelected.Deskription_CusPo.length > 0 ? (
										dataSelected.Deskription_CusPo.map(
											(res: any, i: number) => (
												<tr key={i}>
													<td className='pl-2 border border-black'>
														{res.description}
													</td>
													<td className='pl-2 border border-black text-center'>
														{res.qty}
													</td>
													<td className='pl-2 border border-black text-center'>
														{res.unit}
													</td>
													<td className='pl-2 border border-black text-center'>
														{formatRupiah(res.price.toString())}
													</td>
													<td className='pl-2 border border-black text-center'>
														{formatRupiah(res.discount.toString())}
													</td>
													<td className='pl-2 border border-black text-center'>
														{formatRupiah(res.total.toString())}
													</td>
												</tr>
											)
										)
									) : (
										<tbody>
											<tr>
												<td className='w-full pl-2 border border-black'>
													-
												</td>
												<td className='w-full pl-2 border border-black'>
													-
												</td>
												<td className='w-full pl-2 border border-black'>
													-
												</td>
												<td className='w-full pl-2 border border-black'>
													-
												</td>
												<td className='w-full pl-2 border border-black'>
													-
												</td>
												<td className='w-full pl-2 border border-black'>
													-
												</td>
											</tr>
										</tbody>
									)}
									<tr>
										<td colSpan={5} className='pr-4 text-right border border-black'>Total</td>
										<td className='pl-2 border border-black text-center'>
											<p>{formatRupiah(total().toString())}</p>
										</td>
									</tr>
									{dataSelected.tax === "ppn" ? (
										<tr>
											<td
												className='border border-black text-right pr-4'
												colSpan={5}
											>
												PPN {dataSelected.quotations.Customer.ppn}%
											</td>
											<td className='pl-2 border border-black text-center'>
												<p>{formatRupiah(ppn().toString())}</p>
											</td>
										</tr>
									) : dataSelected.tax === "pph" ? (
										<tr>
											<td
												className='border border-black text-right pr-4'
												colSpan={5}
											>
												PPH {dataSelected.quotations.Customer.pph}%
											</td>
											<td className='pl-2 border border-black text-center'>
												<p>{formatRupiah(pph().toString())}</p>
											</td>
										</tr>
									) : dataSelected.tax === "ppn_and_pph" ? (
										<>
											<tr>
												<td
													className='border border-black text-right pr-4'
													colSpan={5}
												>
													PPN {dataSelected.quotations.Customer.ppn}%
												</td>
												<td className='pl-2 border border-black text-center'>
													<p>{formatRupiah(ppn().toString())}</p>
												</td>
											</tr>
											<tr>
												<td
													className='border border-black text-right pr-4'
													colSpan={5}
												>
													PPH {dataSelected.quotations.Customer.pph}%
												</td>
												<td className='pl-2 border border-black text-center'>
													<p>{formatRupiah(pph().toString())}</p>
												</td>
											</tr>
										</>
									) : null}
									<tr>
										<td colSpan={5} className='pr-4 text-right border border-black'>Grand Total</td>
										<td className='pl-2 border border-black text-center'>
											<p>{formatRupiah(grandTotal().toString())}</p>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Section> */}
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
											Discount
										</th>
										<th className='pl-2 w-[10%] border border-black text-center'>
											Total Price
										</th>
									</tr>
								</thead>
								<tbody>
									{dataSelected.price_po.map(
										(res: any, i: number) => (
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
													{res.discount}%
												</td>
												<td className='pl-2 w-[10%] border border-black text-center'>
													{formatRupiah(res.total_price.toString())}
												</td>
											</tr>
										)
									)}
									{dataSelected.tax === "ppn" ? (
										<tr>
											<td
												className='pr-2 border border-black text-right'
												colSpan={5}
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
												colSpan={5}
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
													colSpan={5}
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
													colSpan={5}
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
											colSpan={5}
										>
											Grand Total
										</td>
										<td className='pl-2 border border-black text-center'>
											{formatRupiah(dataSelected.grand_tot.toString())}
										</td>
									</tr>
								</tbody>
							</table>
							<table>
								<thead></thead>
								<tbody>
									
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
