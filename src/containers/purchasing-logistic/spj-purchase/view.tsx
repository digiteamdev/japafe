import { useEffect, useState } from "react";
import moment from "moment";
import {
	Input,
	InputArea,
	InputSelect,
	InputSelectSearch,
	Section,
} from "../../../components";
import { formatRupiah } from "../../../utils";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewSpjPurchase = ({
	dataSelected,
	content,
	showModal,
}: props) => {
	console.log(dataSelected);

	const grandTotal = (data: any) => {
		let total: any = 0;
		data.map((res: any) => {
			total += res.total;
		});
		return total;
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Spj Purchase</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Id Spj Purchase
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.id_spj_purchase}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Id Dirrect Purchase
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.detailMr[0]?.purchase?.idPurchase}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Date SPJ Purchase
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{moment(dataSelected.date_spj_purchase).format(
											"DD-MMMM-YYYY"
										)}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl'>Detail Purchase</h1>
					<table className='w-full'>
						<thead>
							<tr>
								<th className='border border-black p-1 text-center'>Job no</th>
								<th className='border border-black p-1 text-center'>No Mr</th>
								<th className='border border-black p-1 text-center'>
									Material
								</th>
								<th className='border border-black p-1 text-center'>
									Supplier
								</th>
								<th className='border border-black p-1 text-center'>
									Qty Purchase
								</th>
								<th className='border border-black p-1 text-center'>
									Qty Actual
								</th>
								<th className='border border-black p-1 text-center'>Price</th>
								<th className='border border-black p-1 text-center'>Disc</th>
								<th className='border border-black p-1 text-center'>
									Total Price
								</th>
							</tr>
						</thead>
						<tbody>
							{dataSelected.detailMr.map((res: any, i: number) => {
								console.log(res);
								return (
									<tr key={i}>
										<td className='border border-black p-1 text-center'>
											{res.mr?.job_no}
										</td>
										<td className='border border-black p-1 text-center'>
											{res.mr?.no_mr}
										</td>
										<td className='border border-black p-1 text-center'>
											{res.mr?.job_no}
										</td>
										<td className='border border-black p-1 text-center'>
											{res.supplier?.supplier_name}
										</td>
										<td className='w-[5%] border border-black p-1 text-center'>
											{res.qtyAppr}
										</td>
										<td className='w-[10%] border border-black p-1 text-center'>
											{res.qty_actual}
										</td>
										<td className='border border-black p-1 text-center'>
											{formatRupiah(res.price.toString())}
										</td>
										<td className='border border-black p-1 text-center'>
											{formatRupiah(res.disc.toString())}
										</td>
										<td className='border border-black p-1 text-center'>
											{formatRupiah(res.total.toString())}
										</td>
									</tr>
								);
							})}
							<tr>
								<td className='border border-black p-1 text-right' colSpan={8}>
									Grand total
								</td>
								<td className='border border-black p-1 text-center'>
									{formatRupiah(grandTotal(dataSelected.detailMr).toString())}
								</td>
							</tr>
						</tbody>
					</table>
				</>
			) : null}
		</div>
	);
};
