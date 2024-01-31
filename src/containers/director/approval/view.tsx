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

	useEffect(() => {
		let dataSuplier: any = [];
		let dataPPN: any = [];
		let positionAkun = getPosition();
		if (positionAkun !== undefined) {
			setPosition(positionAkun);
		}
		if (dataSelected.id_cash_advance === undefined) {
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

	const Total = (suplier: string) => {
		let jumlahTotal: any = 0;
		dataSelected.detailMr
			.filter((fil: any) => {
				return fil.supplier.supplier_name === suplier;
			})
			.map((res: any) => {
				jumlahTotal = jumlahTotal + res.total;
			});
		dataSelected.SrDetail.filter((fil: any) => {
			return fil.supplier.supplier_name === suplier;
		}).map((res: any) => {
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

	const title = () => {
		if (dataSelected.id_cash_advance) {
			return "Cash Advance";
		} else if (dataSelected.idPurchase) {
			if (dataSelected.idPurchase.startsWith("PSR")) {
				return "Purchase Service Request";
			} else if (dataSelected.idPurchase.startsWith("DSR")) {
				return "Direct Service Purchase";
			} else if (dataSelected.idPurchase.startsWith("PR")) {
				return "Purchase Material Request";
			} else {
				return "Direct Material Request";
			}
		} else {
			if (dataSelected.id_so.startsWith("PO")) {
				return "Purchase Order Material";
			} else {
				return "Purchase Order Service";
			}
		}
	};

	const titleID = () => {
		if (dataSelected.id_cash_advance) {
			return "ID Cash Advance";
		} else if (dataSelected.idPurchase) {
			if (dataSelected.idPurchase.startsWith("PSR")) {
				return "ID Purchase Service Request";
			} else if (dataSelected.idPurchase.startsWith("DSR")) {
				return "ID Direct Service Purchase";
			} else if (dataSelected.idPurchase.startsWith("PR")) {
				return "ID Purchase Material Request";
			} else {
				return "ID Direct Material Request";
			}
		} else {
			if (dataSelected.id_so.startsWith("PO")) {
				return "ID Purchase Order Material";
			} else {
				return "ID Purchase Order Service";
			}
		}
	};

	const titleDate = () => {
		if (dataSelected.id_cash_advance) {
			return "Date Cash Advance";
		} else if (dataSelected.idPurchase) {
			if (dataSelected.idPurchase.startsWith("PSR")) {
				return "Date Purchase Service Request";
			} else if (dataSelected.idPurchase.startsWith("DSR")) {
				return "Date Direct Service Purchase";
			} else if (dataSelected.idPurchase.startsWith("PR")) {
				return "Date Purchase Material Request";
			} else {
				return "Date Direct Material Request";
			}
		} else {
			if (dataSelected.id_so.startsWith("PO")) {
				return "Date Purchase Order Material";
			} else {
				return "Date Purchase Order Service";
			}
		}
	};

	const total = (datas: any) => {
		let totalHarga: number = 0;
		datas.map((res: any) => {
			totalHarga = totalHarga + res.total;
		});
		return formatRupiah(totalHarga.toString());
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>{title()}</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										{titleID()}
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.id_cash_advance
											? dataSelected.id_cash_advance
											: dataSelected.idPurchase
											? dataSelected.idPurchase
											: dataSelected.id_so}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										{titleDate()}
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.id_cash_advance
											? moment(dataSelected.date_cash_advance).format(
													"DD-MMMM-YYYY"
											  )
											: dataSelected.dateOfPurchase
											? moment(dataSelected.dateOfPurchase).format(
													"DD-MMMM-YYYY"
											  )
											: moment(dataSelected.date_prepared).format(
													"DD-MMMM-YYYY"
											  )}
									</td>
								</tr>
								{dataSelected.id_cash_advance ? (
									<>
										<tr>
											<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
												Request By
											</td>
											<td className='w-[50%] pl-2 border border-gray-200'>
												{dataSelected.employee.employee_name}
											</td>
										</tr>
										<tr>
											<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
												Job No
											</td>
											<td className='w-[50%] pl-2 border border-gray-200'>
												{dataSelected.wor.job_no}
											</td>
										</tr>
										<tr>
											<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
												Description
											</td>
											<td className='w-[50%] pl-2 border border-gray-200'>
												{dataSelected.description}
											</td>
										</tr>
										<tr>
											<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
												Value
											</td>
											<td className='w-[50%] pl-2 border border-gray-200'>
												{total(dataSelected.cdv_detail)}
											</td>
										</tr>
										<tr>
											<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
												Payment Type
											</td>
											<td className='w-[50%] pl-2 border border-gray-200'>
												{dataSelected.status_payment}
											</td>
										</tr>
										<tr>
											<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
												Note
											</td>
											<td className='w-[50%] pl-2 border border-gray-200'>
												{dataSelected.note}
											</td>
										</tr>
									</>
								) : null}
							</table>
						</div>
					</Section>
					{dataSelected.id_cash_advance === undefined ? (
						<>
							{dataSelected.detailMr.length > 0 ? (
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
																					{result.mr.job_no}
																				</td>
																				<td className='border border-black text-center'>
																					{
																						result.Material_Stock
																							.Material_master.material_name
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
																					{formatRupiah(
																						result.total.toString()
																					)}
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
							) : null}
							{dataSelected.SrDetail.length > 0 ? (
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
																				{result.sr.wor.job_no}
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
							) : null}
						</>
					) : null}
				</>
			) : null}
		</div>
	);
};
