import { useEffect, useState } from "react";
import moment from "moment";
import { FieldArray, Form, Formik } from "formik";
import { AddPoMr, ApprovalPoMr } from "../../../services";
import {
	Input,
	InputSelect,
	InputSelectSearch,
	Section,
} from "../../../components";
import { formatRupiah, pembilang } from "../../../utils";
import { getPosition } from "../../../configs/session";
import { Check, X, Printer, Plus, Trash2 } from "react-feather";
import { toast } from "react-toastify";
import { PdfPo } from "./pdfPo";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	dateOfPO: any;
	idPO: string;
	ref: string;
	note: string;
	supplierId: string;
	delivery_time: string;
	tax: boolean;
	franco: string;
	payment_method: string;
	dp: any;
	termOfPayment: any;
	detailMr: any;
}

export const ViewPoMR = ({ dataSelected, content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isModal, setIsModal] = useState<boolean>(false);
	const [isTax, setIsTax] = useState<number>(0);
	const [contact, setContact] = useState<string>("");
	const [phone, setPhone] = useState<string>("");
	const [address, setAddress] = useState<string>("");
	const [position, setPosition] = useState<any>([]);
	const [listSupplier, setListSupplier] = useState<any>([]);
	const [data, setData] = useState<data>({
		dateOfPO: new Date(),
		idPO: "",
		ref: "",
		supplierId: "",
		delivery_time: "",
		tax: true,
		franco: "",
		payment_method: "",
		dp: 0,
		note: "",
		termOfPayment: [],
		detailMr: [],
	});

	useEffect(() => {
		let supplier: any = [];
		let detailSupplier: any = [];
		dataSelected.detailMr.map((res: any) => {
			if (!supplier.includes(res.supplier.supplier_name)) {
				detailSupplier.push({
					label: res.supplier.supplier_name,
					value: res,
				});
				supplier.push(res.supplier.supplier_name);
			}
		});
		setListSupplier(detailSupplier);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		var year = dateObj.getUTCFullYear();
		const id =
			"PO" +
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 10000);
		return id;
	};

	const Total = (detail: any) => {
		let jumlahTotal: any = 0;
		detail.map((res: any) => {
			jumlahTotal = jumlahTotal + res.price * res.qtyAppr - res.disc;
		});
		return jumlahTotal.toString();
	};

	const Ppn = (detail: any, tax: boolean) => {
		let totalBayar: any = Total(detail);
		let totalPPN: any = (totalBayar * isTax) / 100;
		return tax ? totalPPN.toString() : "0";
	};

	const GrandTotal = (detail: any, tax: boolean) => {
		let totalBayar: any = Total(detail);
		if (tax) {
			let totalPPN: any = Ppn(detail, tax);
			let total: any = parseInt(totalBayar) + parseInt(totalPPN);
			return total;
		} else {
			let total: any = parseInt(totalBayar);
			return total;
		}
	};

	const totalTermOfPayment = (data: any, detail: any, tax: boolean) => {
		let total: number = 0;
		let grandTotals: any = GrandTotal(detail, tax);
		total = (parseInt(grandTotals) * data) / 100;
		total = Math.ceil(total);
		return formatRupiah(total.toString());
	};

	const AddPurchaseOrder = async (payload: data) => {
		setIsLoading(true);
		let detail: any = [];
		let currency: string = "";
		let tax: string = "non_tax";
		let termOfPay: any = [];
		let totalPercent: number = 0;
		payload.detailMr.map((res: any) => {
			detail.push({
				id: res.id,
			});
		});
		payload.termOfPayment.map((res: any) => {
			let prices: any = res.price.replace(/[$.]/g, "");
			totalPercent = totalPercent + parseInt(res.percent);
			termOfPay.push({
				limitpay: res.limitpay,
				percent: parseInt(res.percent),
				price: parseInt(prices),
				invoice: res.invoice,
			});
		});
		let data = {
			id_so: generateIdNum(),
			date_prepared: payload.dateOfPO,
			your_reff: payload.ref,
			supplierId: payload.supplierId,
			note: payload.note,
			DP: payload.dp,
			term_of_pay_po_so: termOfPay,
			taxPsrDmr: payload.tax ? "ppn" : "non_tax",
			currency: "IDR",
			delivery_time: payload.delivery_time,
			franco: payload.franco,
			payment_method: payload.payment_method,
			detailMrID: detail,
			detailSrID: null,
		};
		if (totalPercent === 100) {
			try {
				const response = await AddPoMr(data);
				if (response.data) {
					toast.success("Purchase Order Material Request Success", {
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
				}
			} catch (error) {
				toast.error("Purchase Order Material Request Failed", {
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
		} else if (totalPercent < 100) {
			toast.warning("Term Of Pay not yet 100%", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		} else {
			toast.warning("Term Of Pay exceed 100%", {
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
		setIsLoading(false);
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
						{/* <button
							className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => showModalPdf(true)}
						>
							<div className='flex px-1 py-1'>
								<Printer size={16} className='mr-1' /> Print
							</div>
						</button> */}
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
					{/* <button
						className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
						onClick={() => showModalPdf(true)}
					>
						<div className='flex px-1 py-1'>
							<Printer size={16} className='mr-1' /> Print
						</div>
					</button> */}
				</div>
			);
		}
	};

	const showModalPdf = (val: boolean) => {
		setIsModal(val);
	};
	console.log(dataSelected);
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Purchase Order</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Job no
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.job_no}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										No MR
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.no_mr}
										{/* {moment(dataSelected.date_prepared).format("DD-MMMM-YYYY")} */}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-lg mt-2'>Detail Purchase</h1>
					<Section className='w-full mt-2'>
						<table className='w-full'>
							<thead>
								<tr>
									<th className='text-center border border-black'>Material</th>
									<th className='text-center border border-black'>Spesification</th>
									<th className='text-center border border-black'>Qty</th>
									<th className='text-center border border-black'>Unit</th>
									<th className='text-center border border-black'>Supplier</th>
									<th className='text-center border border-black'>Price</th>
									<th className='text-center border border-black'>Discount</th>
									<th className='text-center border border-black'>Total</th>
								</tr>
							</thead>
							<tbody>
								{dataSelected.detailMr.map((res: any, i: number) => {
									return (
										<tr key={i}>
											<td className='text-center border border-black'>
												{res.name_material}
											</td>
											<td className='text-center border border-black'>
												{res.spesifikasi}
											</td>
											<td className='text-center border border-black'>
												{res.qtyAppr}
											</td>
											<td className='text-center border border-black'>
												{res.Material_Master?.satuan}
											</td>
											<td className='text-center border border-black'>
												{res.supplier?.supplier_name}
											</td>
											<td className='text-center border border-black'>
												{formatRupiah(res.price.toString())}
											</td>
											<td className='text-center border border-black'>
												{formatRupiah(res.disc.toString())}
											</td>
											<td className='text-center border border-black'>
												{formatRupiah(res.total.toString())}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</Section>
				</>
			) : null}
		</div>
	);
};
