import { useEffect, useState } from "react";
import { Section } from "../../../components";
import moment from "moment";
import { ValidateWor } from "../../../services";
import { toast } from "react-toastify";
import { PdfWor } from "./pdfWor";
import { Printer } from "react-feather";
import { rupiahFormat } from "@/src/utils";

interface props {
	dataSelected: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewWorJobCost = ({ dataSelected, showModal }: props) => {
	const [purchase, setPurchase] = useState<any>([]);
	const [total, setTotal] = useState<number>(0);

	useEffect(() => {
		let listPurchase: any = [];
		let totalPurchase: number = 0;
		dataSelected?.Mr?.map((res: any) => {
			res?.detailMr?.map((mr: any) => {
				if (mr?.poandso) {
					listPurchase.push({
						no: res.no_mr,
						no_purchase: mr?.poandso?.id_so,
						material: mr.name_material,
						qty: mr.qtyAppr,
						price: mr.price,
						discount: mr.disc,
						total: mr.total,
					});
				}
			});
		});
		dataSelected?.Sr?.map((res: any) => {
			res?.SrDetail?.map((sr: any) => {
				if (sr?.poandso) {
					listPurchase.push({
						no: res.no_sr,
						no_purchase: sr?.poandso?.id_so,
						material: sr.desc,
						qty: sr.qtyAppr,
						price: sr.price,
						discount: sr.disc,
						total: sr.total,
					});
				}
			});
		});
		listPurchase?.map((res: any) => {
			totalPurchase = totalPurchase + res.total;
		});
		setTotal(totalPurchase);
		setPurchase(listPurchase);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			{dataSelected ? (
				<div>
					<div className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1'>
						<div>
							<h1 className='font-bold text-xl'>Work order release</h1>
						</div>
					</div>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								<tbody>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Job No
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.job_no}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Quotation
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.customerPo.quotations.quo_num}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											No PO
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.customerPo.id_po}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Customer
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.customerPo.quotations.Customer.name}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Customer Address
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{
												dataSelected.customerPo.quotations.Customer.address[0]
													.address_workshop
											}
											,{" "}
											{
												dataSelected.customerPo.quotations.Customer.address[0]
													.districts
											}
											,{" "}
											{
												dataSelected.customerPo.quotations.Customer.address[0]
													.cities
											}
											,{" "}
											{
												dataSelected.customerPo.quotations.Customer.address[0]
													.provinces
											}{" "}
											{
												dataSelected.customerPo.quotations.Customer.address[0]
													.ec_postalcode
											}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Subject
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.customerPo.quotations.subject}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Job Description
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.job_description}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className='w-full'>
							<h1 className='font-bold text-xl mt-2'>Job cost</h1>
							<table className='w-full'>
								<thead>
									<tr>
										<th className='border border-black text-center'>No mr</th>
										<th className='border border-black text-center'>
											No purchase
										</th>
										<th className='border border-black text-center'>
											Material
										</th>
										<th className='border border-black text-center'>Qty</th>
										<th className='border border-black text-center'>Price</th>
										<th className='border border-black text-center'>
											Discount
										</th>
										<th className='border border-black text-center'>Total</th>
									</tr>
								</thead>
								<tbody>
									{purchase.map((res: any, i: number) => {
										return (
											<tr key={i}>
												<td className='border border-black pl-2'>{res.no}</td>
												<td className='border border-black pl-2'>
													{res.no_purchase}
												</td>
												<td className='border border-black pl-2'>
													{res.material}
												</td>
												<td className='border border-black pl-2'>{res.qty}</td>
												<td className='border border-black pl-2'>
													{rupiahFormat(res.price)}
												</td>
												<td className='border border-black pl-2'>
													{rupiahFormat(res.discount)}
												</td>
												<td className='border border-black pl-2'>
													{rupiahFormat(res.total)}
												</td>
											</tr>
										);
									})}
									<tr>
										<td className='border border-black pl-2 text-right pr-4' colSpan={6}>
											Grand total
										</td>
										<td className='border border-black pl-2'>
											{rupiahFormat(total)}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Section>
				</div>
			) : null}
		</div>
	);
};
