import { useEffect, useState } from "react";
import moment from "moment";
import { ApprovalPoMr } from "../../../services";
import { Section } from "../../../components";
import { formatRupiah, pembilang } from "../../../utils";
import { getPosition } from "../../../configs/session";
import { Check, X, Printer } from "react-feather";
import { toast } from "react-toastify";
import { PdfPo } from "./pdfPo";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewPoMR = ({ dataSelected, content, showModal }: props) => {
	const [isModal, setIsModal] = useState<boolean>(false);
	const [position, setPosition] = useState<any>([]);

	useEffect(() => {
		let positionAkun = getPosition();
		if (positionAkun !== undefined) {
			setPosition(positionAkun);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const Total = () => {
		let jumlahTotal: any = 0;
		dataSelected.detailMr.map((res: any) => {
			jumlahTotal = jumlahTotal + res.total;
		});
		return jumlahTotal.toString();
	};

	const Ppn = () => {
		let totalBayar: any = Total();
		if (dataSelected.detailMr[0].taxpr === "ppn") {
			let totalPPN: any =
				(totalBayar * dataSelected.detailMr[0].supplier.ppn) / 100;
			return totalPPN.toString();
		} else {
			return "0";
		}
	};

	const grandTotal = () => {
		let totalBayar: any = Total();
		let totalPPN: any = Ppn();
		let total: any = parseInt(totalBayar) + parseInt(totalPPN);
		return total;
	};

	const approve = async () => {
		try {
			const response = await ApprovalPoMr(dataSelected.id);
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

	const showButtonValid = (data: any) => {
		if (position === "Manager") {
			if (data.status_manager) {
				return (
					<div>
						<button
							className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => showModalPdf(true)}
						>
							<div className='flex px-1 py-1'>
								<Printer size={16} className='mr-1' /> Print
							</div>
						</button>
						<button
							className={`justify-center rounded-full border border-transparent bg-gray-500 hover:bg-gray-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => approve()}
						>
							<div className='flex px-1 py-1'>
								<X size={16} className='mr-1' /> Unvalid Manager
							</div>
						</button>
					</div>
				);
			} else {
				return (
					<div>
						<button
							className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => showModalPdf(true)}
						>
							<div className='flex px-1 py-1'>
								<Printer size={16} className='mr-1' /> Print
							</div>
						</button>
						<button
							className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => approve()}
						>
							<div className='flex px-1 py-1'>
								<Check size={16} className='mr-1' /> Valid Manager
							</div>
						</button>
					</div>
				);
			}
		} else {
			return (
				<div>
					<button
						className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
						onClick={() => showModalPdf(true)}
					>
						<div className='flex px-1 py-1'>
							<Printer size={16} className='mr-1' /> Print
						</div>
					</button>
				</div>
			);
		}
	};

	const showModalPdf = (val: boolean) => {
		setIsModal(val);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<PdfPo
				isModal={isModal}
				data={dataSelected}
				showModalPdf={showModalPdf}
			/>
			{dataSelected ? (
				<>
					<div className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1'>
						<div className='text-right mr-6'>
							{showButtonValid(dataSelected)}
						</div>
					</div>
					<h1 className='font-bold text-xl'>Purchase Order Material Request</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										ID Purchase Order
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.id_so}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Date Purchase Order
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{moment(dataSelected.date_prepared).format("DD-MMMM-YYYY")}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Suplier
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{`${dataSelected.supplier.supplier_name} - ${dataSelected.supplier.addresses_sup}, ${dataSelected.supplier.districts}, ${dataSelected.supplier.cities}, ${dataSelected.supplier.provinces}`}
									</td>
								</tr>
                                <tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Suplier Contact
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
                                        { dataSelected.supplier.SupplierContact[0].contact_person } - +62{ dataSelected.supplier.SupplierContact[0].phone }
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Referensi
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.your_reff}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Valid Manager
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{ dataSelected.status_manager ? "Valid" : "Unvalid" }
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Valid director
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{ dataSelected.status_manager_director }
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<table>
							<thead>
								<tr>
									<th className='border border-black text-center'>
										Id Purchase MR
									</th>
									<th className='border border-black text-center'>
										Date Purchase MR
									</th>
									<th className='border border-black text-center'>Job no</th>
									<th className='border border-black text-center'>Material</th>
									<th className='border border-black text-center'>Qty</th>
									<th className='border border-black text-center'>Price</th>
									<th className='border border-black text-center'>Discount</th>
									<th className='border border-black text-center'>Total</th>
								</tr>
							</thead>
							<tbody>
								{dataSelected.detailMr.map((res: any, i: number) => {
									return (
										<tr key={i}>
											<td className='border border-black text-center'>
												{res.mr.no_mr}
											</td>
											<td className='border border-black text-center'>
												{moment(res.mr.date_mr).format("DD-MMMM-YYYY")}
											</td>
											<td className='border border-black text-center'>
												{res.mr.wor.job_operational
													? res.mr.wor.job_no_mr
													: res.mr.wor.job_no}
											</td>
											<td className='border border-black text-center'>
												{`${res.Material_Stock.Material_master.material_name} - ${res.Material_Stock.spesifikasi}`}
											</td>
											<td className='border border-black text-center'>
												{res.qtyAppr}
											</td>
											<td className='border border-black text-center'>
												{formatRupiah(res.price.toString())}
											</td>
											<td className='border border-black text-center'>
												{formatRupiah(res.disc.toString())}
											</td>
											<td className='border border-black text-center'>
												{formatRupiah(res.total.toString())}
											</td>
										</tr>
									);
								})}
								<tr>
									<td
										colSpan={7}
										className='border border-black text-right pr-4'
									>
										Total
									</td>
									<td className='border border-black text-center'>
										{formatRupiah(Total())}
									</td>
								</tr>
								<tr>
									<td
										colSpan={7}
										className='border border-black text-right pr-4'
									>
										{dataSelected.detailMr[0].taxpr === "ppn"
											? `PPN ${dataSelected.detailMr[0].supplier.ppn}%`
											: "PPN 0%"}
									</td>
									<td className='border border-black text-center'>
										{formatRupiah(Ppn())}
									</td>
								</tr>
								<tr>
									<td
										colSpan={7}
										className='border border-black text-right pr-4'
									>
										Grand Total
									</td>
									<td className='border border-black text-center'>
										{formatRupiah(grandTotal().toString())}
									</td>
								</tr>
							</tbody>
						</table>
					</Section>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2 mb-5'>
						<div className='w-full'>
							<p>
								Said :{" "}
								<span className='font-bold'>{pembilang(grandTotal())}</span>
							</p>
						</div>
						<div className='w-full'>
							<p>Term & Condition : { dataSelected.note }</p>
						</div>
						<div className='w-full'>
							{dataSelected.term_of_pay_po_so.map((res: any, i: number) => {
								return (
									<div className='flex w-full' key={i}>
										<p className="pr-4">{ res.limitpay }</p>
                                        <p className="pr-4">{ res.percent }%</p>
                                        <p className="pr-4">({ formatRupiah(res.price.toString()) })</p>
                                        <p className="pr-4">Invoice : {res.invoice}</p>
									</div>
								);
							})}
						</div>
					</Section>
				</>
			) : null}
		</div>
	);
};
