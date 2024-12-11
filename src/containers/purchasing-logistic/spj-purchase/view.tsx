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
import { getPosition } from "@/src/configs/session";
import { Check } from "react-feather";
import { toast } from "react-toastify";
import { ApprovalSpj } from "@/src/services";

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
	const [position, setPosition] = useState<any>([]);

	useEffect(() => {
		let positionAkun = getPosition();
		if (positionAkun !== undefined) {
			setPosition(positionAkun);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const grandTotal = (data: any) => {
		let total: any = 0;
		data.map((res: any) => {
			total += res.total;
		});
		return total;
	};

	const approve = async () => {
		try {
			const response = await ApprovalSpj(dataSelected.id);
			if (response.status === 201) {
				toast.success("Approve Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				showModal(false, content, true);
			} else {
				toast.error("Approve Failed", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
			}
		} catch (error) {
			toast.error("Approve Failed", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		}
	};
	console.log(dataSelected)
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<div className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1'>
						<div className="w-full">
							<h1 className='font-bold text-xl'>Spj Purchase</h1>
						</div>
						<div className='text-right mr-6'>
							{ position === "Manager" && !dataSelected?.status ? (
								<button
									className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
									onClick={() => approve()}
								>
									<div className='flex px-1 py-1'>
										<Check size={16} className='mr-1' /> Approve
									</div>
								</button>
							) : null }
						</div>
					</div>
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
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Approved
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.status ? "Approved" : "Not approved"}
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
								return (
									<tr key={i}>
										<td className='border border-black p-1 text-center'>
											{res.mr?.job_no}
										</td>
										<td className='border border-black p-1 text-center'>
											{res.mr?.no_mr}
										</td>
										<td className='border border-black p-1 text-center'>
											{res.name_material + " " + res.spesifikasi}
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
