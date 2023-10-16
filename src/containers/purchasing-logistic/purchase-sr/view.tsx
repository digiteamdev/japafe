import { useEffect, useState } from "react";
import moment from "moment";
import { ApprovalPrMr } from "../../../services";
import { Section } from "../../../components";
import { formatRupiah } from "../../../utils";
import { getPosition } from "../../../configs/session";
import { Check, X, Printer } from "react-feather";
import { toast } from "react-toastify";
import { PdfPsr } from "./pdfPsr";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewPurchaseSR = ({ dataSelected, content, showModal }: props) => {
	const [dataSuplier, setDataSuplier] = useState<any>([]);
	const [isModal, setIsModal] = useState<boolean>(false);
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
		let supplierTaxPercen: number = 0;
		let supplierTax: string = "";
		let totalBayar: any = Total(suplier);
		if (type !== "total") {
			dataPPN.filter((fil: any) => {
				if (fil.supplier === suplier) {
					if (fil.tax === "ppn") {
						supplierTaxPercen = fil.ppn;
					} else if (fil.tax === "pph") {
						supplierTaxPercen = fil.pph;
					} else {
						supplierTaxPercen = fil.ppn + fil.pph;
					}
					supplierTax = fil.tax;
				}
			});
			if (supplierTax === "nontax") {
				return "Non Tax";
			} else {
				return `${supplierTax} ${supplierTaxPercen} %`;
			}
		} else {
			dataPPN.filter((fil: any) => {
				if (fil.supplier === suplier) {
					if (fil.tax === "ppn") {
						supplierTaxPercen = fil.ppn;
					} else if (fil.tax === "pph") {
						supplierTaxPercen = fil.pph;
					} else {
						supplierTaxPercen = fil.ppn + fil.pph;
					}
					supplierTax = fil.tax;
				}
			});
			if (supplierTax === "nontax") {
				return "0";
			} else {
				let totalPPN: any = (totalBayar * supplierTaxPercen) / 100;
				return Math.ceil(totalPPN).toString();
			}
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
							onClick={() => approve(false)}
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
							onClick={() => approve(true)}
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
				<button
					className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
					onClick={() => showModalPdf(true)}
				>
					<div className='flex px-1 py-1'>
						<Printer size={16} className='mr-1' /> Print
					</div>
				</button>
			);
		}
	};

	const showModalPdf = (val: boolean) => {
		setIsModal(val);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<PdfPsr
				isModal={isModal}
				data={dataSelected}
				dataPPN={dataPPN}
				dataSuplier={dataSuplier}
				showModalPdf={showModalPdf}
			/>
			{dataSelected ? (
				<>
					<div className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1'>
						<div className='text-right mr-6'>
							{showButtonValid(dataSelected)}
						</div>
					</div>
					<h1 className='font-bold text-xl'>Purchase Service Request</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										ID Purchase SR
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.idPurchase}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Date Purchase SR
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
																	{result.qtyAppr}
																</td>
																<td className='border border-black text-center'>
																	{result.note}
																</td>
																<td className='border border-black text-center'>
																	{formatRupiah(result.price.toString())}
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
				</>
			) : null}
		</div>
	);
};
