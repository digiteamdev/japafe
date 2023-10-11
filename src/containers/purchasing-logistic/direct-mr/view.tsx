import { useEffect, useState } from "react";
import moment from "moment";
import { ApprovalPrMr } from "../../../services";
import { Section } from "../../../components";
import { formatRupiah } from "../../../utils";
import { getPosition } from "../../../configs/session";
import { Check, X } from "react-feather";
import { toast } from "react-toastify";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewDirectMR = ({ dataSelected, content, showModal }: props) => {
	const [dataSuplier, setDataSuplier] = useState<any>([]);
	const [dataPPN, setDataPPN] = useState<any>([]);
	const [position, setPosition] = useState<any>([]);

	useEffect(() => {
		let dataSuplier: any = [];
		let dataPPN: any = [];
		let positionAkun = getPosition();
		if (positionAkun !== undefined) {
			setPosition(positionAkun);
		}
		if (dataSelected) {
			dataSelected.detailMr.map((res: any) => {
				if (!dataSuplier.includes(res.supplier.supplier_name)) {
					dataSuplier.push(res.supplier.supplier_name);
					dataPPN.push({
						supplier: res.supplier.supplier_name,
						ppn: res.supplier.ppn,
					});
				}
			});
		}
		setDataPPN(dataPPN);
		setDataSuplier(dataSuplier);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const Total = (suplier: string) => {
		let jumlahTotal: any = 0;
		dataSelected.detailMr
			.filter((fil: any) => {
				return fil.supplier.supplier_name === suplier;
			})
			.map((res: any) => {
				jumlahTotal = jumlahTotal + res.total;
			});
		return jumlahTotal.toString();
	};

	const Ppn = (suplier: string, type: string) => {
		let supplierPPN: number = 0;
		let totalBayar: any = Total(suplier);
		if (type === "ppn") {
			dataPPN.filter((fil: any) => {
				if (fil.supplier === suplier) {
					supplierPPN = fil.ppn;
				}
			});
			return `PPN ${supplierPPN} %`;
		} else {
			dataPPN.filter((fil: any) => {
				if (fil.supplier === suplier) {
					supplierPPN = fil.ppn;
				}
			});
			let totalPPN: any = (totalBayar * supplierPPN) / 100;
			return totalPPN.toString();
		}
	};

	const grandTotal = (suplier: string) => {
		let totalBayar: any = Total(suplier);
		let totalPPN: any = Ppn(suplier, "total");
		let total: any = parseInt(totalBayar) + parseInt(totalPPN);
		return formatRupiah(total.toString());
	};

	const approve = async (status: boolean) => {
		let data = {
			statusApprove: {
				status_manager_pr: status,
			},
		};
		try {
			const response = await ApprovalPrMr(dataSelected.id, data);
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
			if (data.status_manager_pr) {
				return (
					<button
						className={`justify-center rounded-full border border-transparent bg-gray-500 hover:bg-gray-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
						onClick={() => approve(false)}
					>
						<div className='flex px-1 py-1'>
							<X size={16} className='mr-1' /> Unvalid Manager
						</div>
					</button>
				);
			} else {
				return (
					<button
						className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
						onClick={() => approve(true)}
					>
						<div className='flex px-1 py-1'>
							<Check size={16} className='mr-1' /> Valid Manager
						</div>
					</button>
				);
			}
		} else {
			return null;
		}
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<div className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1'>
						<div className='text-right mr-6'>
							{showButtonValid(dataSelected)}
						</div>
					</div>
					<h1 className='font-bold text-xl'>Direct Material Request</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										ID Direct MR
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.idPurchase}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Date Direct MR
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{moment(dataSelected.dateOfPurchase).format("DD-MMMM-YYYY")}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Valid Manager
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.status_manager_pr ? "Valid" : "Unvalid"}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						{dataSuplier.length > 0
							? dataSuplier.map((res: any, i: number) => {
									return (
										<div key={i}>
											<h5>Suplier : {res}</h5>
											<table className='w-full mt-2'>
												<thead>
													<tr>
														<th className='border border-black text-center'>
															Akun / Job no
														</th>
														<th className='border border-black text-center'>
															Material / Material Spesifikasi
														</th>
														<th className='border border-black text-center'>
															Qty
														</th>
														<th className='border border-black text-center'>
															Note
														</th>
														<th className='border border-black text-center'>
															Price
														</th>
														<th className='border border-black text-center'>
															Discount
														</th>
														<th className='border border-black text-center'>
															Total
														</th>
													</tr>
												</thead>
												<tbody>
													{dataSelected.detailMr
														.filter((fil: any) => {
															return fil.supplier.supplier_name === res;
														})
														.map((result: any, idx: number) => {
															return (
																<tr key={idx}>
																	<td className='border border-black text-center'>
																		{result.mr.wor.job_operational
																			? result.mr.wor.job_no_mr
																			: result.mr.wor.job_no}
																	</td>
																	<td className='border border-black text-center'>
																		{
																			result.Material_Stock.Material_master
																				.material_name
																		}{" "}
																		/ {result.Material_Stock.spesifikasi}
																	</td>
																	<td className='border border-black text-center'>
																		{result.qtyAppr}
																	</td>
																	<td className='border border-black text-center'>
																		{result.note}
																	</td>
																	<td className='border border-black text-center'>
																		{formatRupiah(
																			result.Material_Stock.harga.toString()
																		)}
																	</td>
																	<td className='border border-black text-center'>
																		{formatRupiah(result.disc.toString())}
																	</td>
																	<td className='border border-black text-center'>
																		{formatRupiah(result.total.toString())}
																	</td>
																</tr>
															);
														})}
													<tr>
														<td
															className='border border-black text-right pr-4'
															colSpan={6}
														>
															Total
														</td>
														<td className='border border-black text-center'>
															{formatRupiah(Total(res))}
														</td>
													</tr>
													<tr>
														<td
															className='border border-black text-right pr-4'
															colSpan={6}
														>
															{Ppn(res, "ppn")}
														</td>
														<td className='border border-black text-center'>
															{formatRupiah(Ppn(res, "total"))}
														</td>
													</tr>
													<tr>
														<td
															className='border border-black text-right pr-4'
															colSpan={6}
														>
															Grand Total
														</td>
														<td className='border border-black text-center'>
															{grandTotal(res)}
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									);
							  })
							: null}
					</Section>
				</>
			) : null}
		</div>
	);
};
