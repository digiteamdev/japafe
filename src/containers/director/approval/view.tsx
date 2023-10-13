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

export const ViewApprovalDirector = ({
	dataSelected,
	content,
	showModal,
}: props) => {
	const [dataSuplier, setDataSuplier] = useState<any>([]);
	const [dataPPN, setDataPPN] = useState<any>([]);
	const [position, setPosition] = useState<any>([]);
	const [request, setRequest] = useState<string>("");

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
			dataSelected.SrDetail.map((res: any) => {
				if (!dataSuplier.includes(res.supplier.supplier_name)) {
					dataSuplier.push(res.supplier.supplier_name);
					dataPPN.push({
						supplier: res.supplier.supplier_name,
						ppn: res.supplier.ppn,
						pph: res.supplier.pph,
						tax: res.taxPsrDmr,
					});
				}
			});
		}
		setDataPPN(dataPPN);
		setDataSuplier(dataSuplier);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
console.log(dataSelected)
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

    const price = (total: number, disc: number) => {
		let priceSr: number = total + disc;
		return priceSr.toString();
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

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>
						{dataSelected.idPurchase.startsWith("PSR")
							? "Purchase Service Request"
							: dataSelected.idPurchase.startsWith("DSR")
							? "Direct Service Purchase"
							: dataSelected.idPurchase.startsWith("PR")
							? "Purchase Material Request"
							: "Direct Material Request"}
					</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										{dataSelected.idPurchase.startsWith("PSR")
											? "Id Purchase Service Request"
											: dataSelected.idPurchase.startsWith("DSR")
											? "Id Direct Service Purchase"
											: dataSelected.idPurchase.startsWith("PR")
											? "Id Purchase Material Request"
											: "Id Direct Material Request"}
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.idPurchase}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										{dataSelected.idPurchase.startsWith("PSR")
											? "Date Purchase Service Request"
											: dataSelected.idPurchase.startsWith("DSR")
											? "Date Direct Service Purchase"
											: dataSelected.idPurchase.startsWith("PR")
											? "Date Purchase Material Request"
											: "Date Direct Material Request"}
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{moment(dataSelected.dateOfPurchase).format("DD-MMMM-YYYY")}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					{ dataSelected.detailMr.length > 0 ? (
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
					) : null }
					{ dataSelected.SrDetail.length > 0 ? (
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
																Part / Item
															</th>
															<th className='border border-black text-center'>
																Service Description
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
														{dataSelected.SrDetail.filter((fil: any) => {
															return fil.supplier.supplier_name === res;
														}).map((result: any, idx: number) => {
															return (
																<tr key={idx}>
																	<td className='border border-black text-center'>
																		{result.sr.wor.job_operational
																			? result.sr.wor.job_no_mr
																			: result.sr.wor.job_no}
																	</td>
																	<td className='border border-black text-center'>
																		{result.part}
																	</td>
																	<td className='border border-black text-center'>
																		{result.workCenter.name}
																	</td>
																	<td className='border border-black text-center'>
																		{result.qty}
																	</td>
																	<td className='border border-black text-center'>
																		{result.note}
																	</td>
																	<td className='border border-black text-center'>
																		{formatRupiah(
																			price(result.total, result.disc)
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
																colSpan={7}
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
																colSpan={7}
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
																colSpan={7}
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
					) : null }
				</>
			) : null}
		</div>
	);
};
