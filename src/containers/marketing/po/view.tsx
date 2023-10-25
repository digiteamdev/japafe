import { useState, useEffect } from "react";
import { Section } from "../../../components";
import { formatRupiah } from "../../../utils/index";
import moment from "moment";

interface props {
	dataSelected: any;
}

export const ViewPo = ({ dataSelected }: props) => {

	const total = () => {
		let total: number = 0
		dataSelected.Deskription_CusPo.map( (res: any) => {
			total = total + parseInt(res.total)
		})
		return total
	}

	const ppn = () => {
		let ppn =
			(parseInt(dataSelected.total) * dataSelected.quotations.Customer.ppn) /
			100;
		return Math.ceil(ppn);
	};

	const pph = () => {
		let pph =
			(parseInt(dataSelected.total) * dataSelected.quotations.Customer.pph) /
			100;
		return Math.ceil(pph);
	};

	const grandTotal = () => {
		if(dataSelected.tax === 'ppn'){
			const Total: any = parseInt(dataSelected.total) + ppn();
			return Total
		}else if(dataSelected.tax === 'pph'){
			const Total: any = parseInt(dataSelected.total) + pph();
			return Total
		}else if(dataSelected.tax === 'ppn_and_pph'){
			const Total: any = parseInt(dataSelected.total) + ppn() + pph();
			return Total
		}else{
			const Total: any = parseInt(dataSelected.total);
			return Total
		}
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
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
											Customer PO ID
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.po_num_auto}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Customer PO Number
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.id_po}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Customer PO Date
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{moment(dataSelected.date).format("DD-MMMM-YYYY")}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Quotation Id / Quotation Number
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.quotations.quo_auto} /{" "}
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
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Equipment
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.quotations.eqandpart[0].equipment.nama} /{" "}
											{dataSelected.quotations.eqandpart.length} Count Part
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Subject
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.quotations.deskription}
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
											Noted
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.noted}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl mt-2'>Description Detail</h1>
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
														{formatRupiah(res.price)}
													</td>
													<td className='pl-2 border border-black text-center'>
														{formatRupiah(res.discount)}
													</td>
													<td className='pl-2 border border-black text-center'>
														{formatRupiah(res.total)}
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
					</Section>
					<h1 className='font-bold text-xl mt-2'>Term Of Payment</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								{dataSelected.term_of_pay.length > 0 ? (
									dataSelected.term_of_pay.map((res: any, i: number) => (
										<tbody key={i}>
											<tr>
												<td className='pl-2 w-[50%] border border-black'>
													{res.limitpay}
												</td>
												<td className='pl-2 w-[10%] border border-black text-center'>
													{res.percent}%
												</td>
												<td className='pl-2 w-[10%] border border-black text-center'>
													({formatRupiah(res.price.toString())})
												</td>
												<td className='pl-2 w-[30%] border border-black'>
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
