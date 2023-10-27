import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, FileText } from "react-feather";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Printer } from "react-feather";
import { formatRupiah } from "../../../utils";

interface props {
	isModal?: boolean;
	data?: any;
	dataSuplier?: any;
	dataPPN?: any;
	showModalPdf: (val: boolean) => void;
}

export const PdfDpr = ({
	isModal,
	data,
	dataSuplier,
	dataPPN,
	showModalPdf,
}: props) => {
	const printDocument = () => {
		const doc: any = document.getElementById("divToPrint");
		html2canvas(doc).then((canvas) => {
			const imgData = canvas.toDataURL("image/png");
			const pdf: any = new jsPDF("p", "mm", "a4");
			pdf.addImage(imgData, "JPEG", 0, 0);
			// window.open(pdf.output("bloburl"), "_blank");
			pdf.save(`Work_Order_Release_${data.idPurchase}.pdf`);
		});
	};

	const Total = (suplier: string) => {
		let jumlahTotal: any = 0;
		data.detailMr
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

	return (
		<div className='z-80'>
			<Transition appear show={isModal} as={Fragment}>
				<Dialog
					as='div'
					className='relative w-full'
					onClose={() => showModalPdf(false)}
				>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-black z-20 bg-opacity-25 w-full h-screen' />
					</Transition.Child>

					<div className='fixed inset-0 z-40 overflow-y-auto w-full'>
						<div className='flex min-h-full items-center justify-center p-4 text-center'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<Dialog.Panel className='w-full max-w-6xl transform overflow-x-auto rounded-lg bg-white text-left align-middle shadow-xl transition-all'>
									<div
										className={`flex items-center justify-between px-5 py-[10px] bg-primary-400`}
									>
										<div className='flex items-center gap-2'>
											<div className='w-10 h-10 rounded-full bg-white flex justify-center items-center'>
												<FileText />
											</div>
											<Dialog.Title
												as='h4'
												className='text-base font-bold leading-6 text-white'
											>
												Download Direct Purchase Material Request
											</Dialog.Title>
										</div>

										<button
											onClick={() => showModalPdf(false)}
											className='text-white text-sm font-semibold'
										>
											<X />
										</button>
									</div>
									<div className='text-center mt-3'>
										<button
											className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
											onClick={() => printDocument()}
										>
											<div className='flex px-1 py-1'>
												<Printer size={16} className='mr-1' /> Download PDF
											</div>
										</button>
									</div>
									<div
										className='my-4 mx-40 px-20 border border-black'
										id='divToPrint'
									>
										<h1 className='font-bold text-center text-xl my-4'>
											DIRECT PURCHASE MATERIAL REQUEST
										</h1>
										<div className='grid grid-cols-2 gap-2'>
											<div className='w-full'>
												<p>Number : {data.idPurchase}</p>
											</div>
											<div className='w-full'>
												<p>
													Date Prepare :{" "}
													{moment(data.dateOfPurchase).format("DD-MMMM-YYYY")}
												</p>
											</div>
										</div>
										<div className='grid grid-cols-2 gap-2'>
											<div className='w-full'>
												<p>Cash Advance ID :</p>
											</div>
											<div className='w-full'>
												<p>
													Total Cash Adv :
												</p>
											</div>
										</div>
										<div className='grid grid-cols-2 gap-2'>
											<div className='w-full'>
												<p>Note : {data.note}</p>
											</div>
										</div>
										<div className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
											{dataSuplier.length > 0
												? dataSuplier.map((res: any, i: number) => {
														return (
															<div key={i}>
																<h5 className='font-semibold'>{res}</h5>
																<table className='w-full mt-2'>
																	<thead>
																		<tr>
																			<th className='border-black border-t border-l text-center mb-1'>
																				<p className='mb-1'>No MR</p>
																			</th>
																			<th className='border-black border-t border-l text-center mb-1'>
																				<p className='mb-1'>Job no</p>
																			</th>
																			<th className='border-black border-t  border-l text-center mb-1'>
																				<p className='mb-1'>Akun</p>
																			</th>
																			<th className='border-black border-t  border-l text-center mb-1'>
																				<p className='mb-1'>
																					Material / Material Spesifikasi
																				</p>
																			</th>
																			<th className='border-black border-t  border-l text-center mb-1'>
																				<p className='mb-1'>Qty</p>
																			</th>
																			<th className='border-black border-t  border-l text-center mb-1'>
																				<p className='mb-1'>Price</p>
																			</th>
																			<th className='border-black border-t  border-l text-center mb-1'>
																				<p className='mb-1'>Discount</p>
																			</th>
																			<th className='border-black border-t  border-l border-r text-center mb-1'>
																				<p className='mb-1'>Total</p>
																			</th>
																		</tr>
																	</thead>
																	<tbody>
																		{data.detailMr
																			.filter((fil: any) => {
																				return (
																					fil.supplier.supplier_name === res
																				);
																			})
																			.map((result: any, idx: number) => {
																				return (
																					<tr key={idx}>
																						<td className='border-black border-t border-l text-center mb-1'>
																							<p className='mb-1'>
																								{result.mr.no_mr}
																							</p>
																						</td>
																						<td className='border-black border-t border-l  text-center mb-1'>
																							<p className='mb-1'>
																								{result.mr.wor.job_operational
																									? result.mr.wor.job_no_mr
																									: result.mr.wor.job_no}
																							</p>
																						</td>
																						<td className='border-black border-t border-l text-center mb-1'>
																							<p className='mb-1'>
																								{result.coa.coa_code}
																							</p>
																						</td>
																						<td className='border-black border-t border-l text-center mb-1'>
																							<p className='mb-1'>
																								{
																									result.Material_Stock
																										.Material_master
																										.material_name
																								}{" "}
																								/{" "}
																								{
																									result.Material_Stock
																										.spesifikasi
																								}
																							</p>
																						</td>
																						<td className='border-black border-t border-l text-center mb-1'>
																							<p className='mb-1'>
																								{result.qtyAppr}
																							</p>
																						</td>
																						<td className='border-black border-t border-l text-center mb-1'>
																							<p className='mb-1'>
																								{formatRupiah(
																									result.price.toString()
																								)}
																							</p>
																						</td>
																						<td className='border-black border-t border-l text-center mb-1'>
																							<p className='mb-1'>
																								{formatRupiah(
																									result.disc.toString()
																								)}
																							</p>
																						</td>
																						<td className='border-black border-t border-l border-r text-center mb-1'>
																							<p className='mb-1'>
																								{formatRupiah(
																									result.total.toString()
																								)}
																							</p>
																						</td>
																					</tr>
																				);
																			})}
																		<tr>
																			<td
																				className='border-black border-t border-l  text-right pr-4 mb-1'
																				colSpan={7}
																			>
																				<p className='mb-1'>Total</p>
																			</td>
																			<td className='border-black border-t border-l border-r text-center mb-1'>
																				<p className='mb-1'>
																					{formatRupiah(Total(res))}
																				</p>
																			</td>
																		</tr>
																		<tr>
																			<td
																				className='border-black border-t border-l  text-right pr-4 mb-1'
																				colSpan={7}
																			>
																				<p className='mb-1'>
																					{Ppn(res, "ppn")}
																				</p>
																			</td>
																			<td className='border-black border-t border-l border-r text-center mb-1'>
																				<p className='mb-1'>
																					{formatRupiah(Ppn(res, "total"))}
																				</p>
																			</td>
																		</tr>
																		<tr>
																			<td
																				className='border-black border-t border-l border-b text-right pr-4 mb-1'
																				colSpan={7}
																			>
																				<p className='mb-1'>Grand Total</p>
																			</td>
																			<td className='border-black border-t border-l border-r border-b text-center'>
																				<p className='mb-1'>
																					{grandTotal(res)}
																				</p>
																			</td>
																		</tr>
																	</tbody>
																</table>
															</div>
														);
												  })
												: null}
										</div>
										<div className='mt-3'>
											<h5 className='font-semibold mb-1'>
												Bandung, {moment(new Date()).format("DD-MMMM-YYYY")}
											</h5>
										</div>
										<table className='mb-4'>
											<tr>
												<td className='border-black border-t border-l'>
													<p className='px-6 py-2 mb-1'>Prepared By</p>
												</td>
												<td className='border-black border-t border-l'>
													<p className='px-6 py-2 mb-1'>Checked By</p>
												</td>
												<td className='border-black border-t border-l border-r'>
													<p className='px-6 py-2 mb-1'>Approved By</p>
												</td>
											</tr>
											<tr>
												<td className='border-black border-t border-l py-12'></td>
												<td className='border-black border-t border-l py-12'></td>
												<td className='border-black border-t border-l border-r py-12'></td>
											</tr>
											<tr>
												<td className='border-black border-t border-l border-b'>
													<p className='px-6 py-3'></p>
												</td>
												<td className='border-black border-t border-l border-b'>
													<p className='px-6 py-3'></p>
												</td>
												<td className='border-black border-t border-l border-b border-r'>
													<p className='px-6 py-3'></p>
												</td>
											</tr>
										</table>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
};
