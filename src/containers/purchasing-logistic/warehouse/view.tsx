import { useEffect, useState } from "react";
import moment from "moment";
import {
	Input,
	InputArea,
	InputSelect,
	InputSelectSearch,
	Section,
} from "../../../components";
import { formatRupiah, rupiahFormat } from "../../../utils";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewWarehouse = ({ dataSelected, content, showModal }: props) => {

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Warehouse</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Material Name
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.name}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Satuan
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.satuan}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<table>
							<thead>
								<tr>
									<th className="border border-black text-center">Spesification</th>
									<th className="border border-black text-center">Stock</th>
									<th className="border border-black text-center">Price</th>
									<th className="border border-black text-center">Date in</th>
								</tr>
							</thead>
							<tbody>
								{dataSelected?.Material_Master?.map((res:any, i: number) => {
									return(
											<tr key={i}>
												<td className="border border-black text-center">{res?.name}</td>
												<td className="border border-black text-center">{res?.jumlah_Stock}</td>
												<td className="border border-black text-center">{rupiahFormat(res?.harga)}</td>
												<td className="border border-black text-center">{moment(res?.createdAt).format("DD-MMMM-YYYY")}</td>
											</tr>
									)
								})}
							</tbody>
						</table>
					</Section>
				</>
			) : null}
		</div>
	);
};
