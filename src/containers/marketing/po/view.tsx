import { useState, useEffect } from "react";
import { Section } from "../../../components";
import { formatRupiah } from "../../../utils/index";
import moment from "moment";

interface props {
	dataSelected: any;
}

export const ViewPo = ({ dataSelected }: props) => {
    
    const [total, setTotal] = useState<any>("0")
    const [vatTotal, setVatTotal] = useState<any>("0")
    const [granTotal, setGrandTotal] = useState<any>("0")

    useEffect( () => {
        totalPrice(dataSelected.Deskription_CusPo)
        vat(dataSelected.Deskription_CusPo, dataSelected.tax)
        grandTotal()
		// eslint-disable-next-line react-hooks/exhaustive-deps
    },[total, vatTotal])

    const totalPrice = (data: any) => {
		let total: number = 0
        data.map( (res: any) => {
            total += parseInt(res.total) + total
        })
        setTotal(total.toString())
	};

	const vat = (data: any, tax: any) => {
        let total: number = 0
        let persenTax: number = 0
        if (tax === "ppn") {
            persenTax = 11
        } else if (tax === "pph") {
            persenTax = 2
        } else if (tax === "ppn_and_pph") {
            persenTax = 13
        } else {
            persenTax = 0
        }
        data.map( (res: any) => {
            total += parseInt(res.total) + total
        })
        const jumlahTax = ((total) * persenTax) / 100
        setVatTotal(jumlahTax.toString())
	};

	const grandTotal = () => {
        const Total: any = parseInt(total) + parseInt(vatTotal);
        setGrandTotal(Total.toString())
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
											{dataSelected.quotations.quo_auto} / {dataSelected.quotations.quo_num}
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
											{dataSelected.quotations.eqandpart[0].equipment.nama} / {dataSelected.quotations.eqandpart.length} Count Part
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
										<th className='w-[30%] pl-2 border border-gray-200 text-center font-semibold'>
											Description
										</th>
										<th className='w-[10%] pl-2 border border-gray-200 text-center font-semibold'>
											Quantity
										</th>
										<th className='w-[15%] pl-2 border border-gray-200 text-center font-semibold'>
											Unit
										</th>
                                        <th className='w-[15%] pl-2 border border-gray-200 text-center font-semibold'>
											Price
										</th>
                                        <th className='w-[15%] pl-2 border border-gray-200 text-center font-semibold'>
											Discount
										</th>
                                        <th className='w-[15%] pl-2 border border-gray-200 text-center font-semibold'>
											Total
										</th>
									</tr>
								</thead>
								{dataSelected.Deskription_CusPo.length > 0 ? (
									dataSelected.Deskription_CusPo.map((res: any, i: number) => (
										<tbody key={i}>
											<tr>
												<td className='pl-2 border border-gray-200'>
													{res.description}
												</td>
												<td className='pl-2 border border-gray-200 text-center'>
													{res.qty}
												</td>
												<td className='pl-2 border border-gray-200 text-center'>
													{res.unit}
												</td>
                                                <td className='pl-2 border border-gray-200 text-center'>
													{formatRupiah(res.price)}
												</td>
                                                <td className='pl-2 border border-gray-200 text-center'>
													{formatRupiah(res.discount)}
												</td>
                                                <td className='pl-2 border border-gray-200 text-center'>
													{formatRupiah(res.total)}
												</td>
											</tr>
                                            <tr>
                                                <td className="pl-2 border-l border-b border-gray-200" colSpan={4}></td>
                                                <td className="pl-2 border-b">Total</td>
                                                <td className="pl-2 border border-gray-200 text-center">
                                                    <p>{ formatRupiah(total) }</p>
                                                </td>
                                            </tr>
                                            <tr>
                                            <td className="pl-2 border-l  border-b border-gray-200" colSpan={4}></td>
                                                <td className="pl-2 border-b">Vat</td>
                                                <td className="pl-2 border border-gray-200 text-center">
                                                    <p>{ formatRupiah(vatTotal) }</p>
                                                </td>
                                            </tr>
                                            <tr>
                                            <td className="pl-2 border-l border-b border-gray-200" colSpan={4}></td>
                                                <td className="pl-2 border-b">Grand Total</td>
                                                <td className="pl-2 border border-gray-200 text-center">
                                                    <p>{ formatRupiah(granTotal) }</p>
                                                </td>
                                            </tr>
										</tbody>
									))
								) : (
									<tbody>
										<tr>
											<td className='w-full pl-2 border border-gray-200'>-</td>
											<td className='w-full pl-2 border border-gray-200'>-</td>
											<td className='w-full pl-2 border border-gray-200'>-</td>
                                            <td className='w-full pl-2 border border-gray-200'>-</td>
											<td className='w-full pl-2 border border-gray-200'>-</td>
											<td className='w-full pl-2 border border-gray-200'>-</td>
										</tr>
									</tbody>
								)}
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
												<td className='pl-2 w-[50%] border border-gray-200'>
													{res.limitpay}
												</td>
												<td className='pl-2 w-[10%] border border-gray-200 text-center'>
													{res.percent}%
												</td>
												<td className='pl-2 w-[10%] border border-gray-200 text-center'>
													({formatRupiah(res.price.toString())})
												</td>
												<td className='pl-2 w-[30%] border border-gray-200'>
													{moment(res.date_limit).format('DD-MMMM-YYYY')}
												</td>
											</tr>
										</tbody>
									))
								) : (
									<tbody>
										<tr>
											<td className='w-full pl-2 border border-gray-200'>-</td>
											<td className='w-full pl-2 border border-gray-200'>-</td>
											<td className='w-full pl-2 border border-gray-200'>-</td>
											<td className='w-full pl-2 border border-gray-200'>-</td>
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
