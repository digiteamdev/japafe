import moment from "moment";
import { Section } from "../../../components";
import { formatRupiah } from "@/src/utils";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewDirrectPurchase = ({ dataSelected, content, showModal }: props) => {

	const Total = (detail: any) => {
		let jumlahTotal: any = 0;
		detail.map((res: any) => {
			jumlahTotal = (jumlahTotal + res.price * res.qty) - res.disc;
		});
		return jumlahTotal.toString();
	};

	const Ppn = (detail: any) => {
		let totalBayar: any = Total(detail);
		let totalPPN: any = (totalBayar * dataSelected.supplier.ppn) / 100;
		return totalPPN.toString();
	};

	const GrandTotal = (detail: any) => {
		let totalBayar: any = Total(detail);
		if (dataSelected.taxPsrDmr === 'ppn') {
			let totalPPN: any = Ppn(detail);
			let total: any = parseInt(totalBayar) + parseInt(totalPPN);
			return total;
		} else {
			let total: any = parseInt(totalBayar);
			return total;
		}
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Dirrect Purchase</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										ID Dirrect Purchase
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.idPurchase}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Date Dirrect Purchase
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{moment(dataSelected.date_prepared).format("DD-MMMM-YYYY")}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-lg mt-2'>Detail Purchase</h1>
					<Section className='w-full mt-2'>
						<table className='w-full'>
							<thead>
								<tr>
									<th className='text-center border border-black'>Material</th>
									<th className='text-center border border-black'>Qty</th>
									<th className='text-center border border-black'>Unit</th>
                                    <th className='text-center border border-black'>Supplier</th>
									<th className='text-center border border-black'>Price</th>
									<th className='text-center border border-black'>Discount</th>
									<th className='text-center border border-black'>Total</th>
								</tr>
							</thead>
							<tbody>
								{dataSelected.detailMr.map((res: any, i: number) => {
									return (
										<tr key={i}>
											<td className='text-center border border-black'>
												{res.Material_Master.name}
											</td>
											<td className='text-center border border-black'>
												{res.qty}
											</td>
											<td className='text-center border border-black'>
												{res.Material_Master.satuan}
											</td>
                                            <td className='text-center border border-black'>
												{res.supplier.supplier_name}
											</td>
											<td className='text-center border border-black'>
												{formatRupiah(res.price.toString())}
											</td>
											<td className='text-center border border-black'>
												{formatRupiah(res.disc.toString())}
											</td>
											<td className='text-center border border-black'>
												{formatRupiah(res.total.toString())}
											</td>
										</tr>
									);
								})}
								<tr>
									<td
										className='border border-black text-right pr-2 text-lg font-semibold'
										colSpan={5}
									>
										Total
									</td>
									<td className='text-center border border-black' colSpan={5}>
										{formatRupiah(Total(dataSelected.detailMr))}
									</td>
								</tr>
								{dataSelected.taxPsrDmr === "ppn" ? (
									<tr>
										<td
											className='border border-black text-right pr-2 text-lg font-semibold'
											colSpan={5}
										>
											PPN
										</td>
										<td className='text-center border border-black' colSpan={5}>
											{formatRupiah(Ppn(dataSelected.detailMr))}
										</td>
									</tr>
								) : null}
                                <tr>
									<td
										className='border border-black text-right pr-2 text-lg font-semibold'
										colSpan={5}
									>
										Grand Total
									</td>
									<td className='text-center border border-black' colSpan={5}>
										{formatRupiah(GrandTotal(dataSelected.detailMr).toString())}
									</td>
								</tr>
							</tbody>
						</table>
					</Section>
				</>
			) : null}
		</div>
	);
};
