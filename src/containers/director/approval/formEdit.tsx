import { useEffect, useState } from "react";
import moment from "moment";
import { ApprovalPrMr } from "../../../services";
import { Section } from "../../../components";
import { formatRupiah } from "../../../utils";
import { getPosition } from "../../../configs/session";
import { Check, X } from "react-feather";
import { Disclosure } from "@headlessui/react";
import { toast } from "react-toastify";
import { Formik, Form, FieldArray } from "formik";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const FormEditApproval = ({
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
				</>
			) : null}
		</div>
	);
};
