import { useEffect, useState } from "react";
import {
	Input,
	InputSelect,
	InputSelectSearch,
	Section,
} from "../../../components";
import moment from "moment";
import { FieldArray, Form, Formik } from "formik";
import {
	AddSupplierMr,
	BackToApprovalMr,
	GetAllSupplier,
} from "../../../services";
import { formatRupiah } from "../../../utils";
import { toast } from "react-toastify";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	dateOfPurchase: any;
	idPurchase: string;
	taxPsrDmr: string;
	currency: string;
	detailMr: any;
}

export const ViewPurchaseDirectService = ({
	dataSelected,
	content,
	showModal,
}: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isModal, setIsModal] = useState<boolean>(false);
	const [listSupplier, setListSupplier] = useState<any>([]);
	const [data, setData] = useState<data>({
		dateOfPurchase: new Date(),
		idPurchase: "",
		taxPsrDmr: "ppn",
		currency: "IDR",
		detailMr: [],
	});

	useEffect(() => {
		let detail: any = [];
		// dataSelected.detailMr.map((res: any) => {
		// 	detail.push(res);
		// });
		setData({
			dateOfPurchase: new Date(),
			idPurchase: generateIdNum(),
			taxPsrDmr: "non_tax",
			currency: "IDR",
			detailMr: detail,
		});
		getSupplier();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getSupplier = async () => {
		let listSup: any = [];
		try {
			const response = await GetAllSupplier();
			if (response) {
				response.data.result.map((res: any) => {
					listSup.push({
						label: res.supplier_name,
						value: res,
					});
				});
			}
		} catch (error) {}
		setListSupplier(listSup);
	};

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		var year = dateObj.getUTCFullYear();
		const id =
			"DMR" +
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 10000);
		return id;
	};

	const purchaseMr = async (payload: data) => {
		setIsLoading(true);
		let listDetail: any = [];
		let isWarning: boolean = false;
		payload.detailMr.map((res: any) => {
			if (res.supId !== null) {
				listDetail.push({
					id: res.id,
					name_material: res.name_material,
					supId: res.supId,
					taxpr: res.taxpr,
					currency: res.currency,
					qtyAppr: parseInt(res.qtyAppr),
					price: parseInt(res.price),
					disc: parseInt(res.disc),
					total: parseInt(res.total),
				});
				isWarning = false;
			}
		});
		let data = {
			// dateOfPurchase: payload.dateOfPurchase,
			// idPurchase: payload.idPurchase,
			// taxPsrDmr: payload.taxPsrDmr,
			// currency: payload.currency,
			detailMr: listDetail,
		};
		if (!isWarning) {
			try {
				const response = await AddSupplierMr(data);
				if (response.data) {
					toast.success("Purchase Material Request Success", {
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
				toast.error("Purchase Material Request Failed", {
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
		}
		setIsLoading(false);
	};

	const backToApproval = async (data: any) => {
		try {
			let listData: any = [];
			data.detailMr.map((res: any) => {
				listData.push({
					id: res.id,
					approvedRequestId: res.approvedRequestId,
				});
			});
			const response = await BackToApprovalMr(listData);
			if (response.data) {
				toast.success("Back to approval mr Success", {
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
			toast.error("Back to approval mr Failed", {
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

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Purchase dirrect service</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Job No
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected?.sr?.job_no}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										No SR
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.sr?.no_sr}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Request By
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.sr?.user.employee.employee_name}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Departement
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.sr?.user.employee.sub_depart.name}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl py-2'>Detail Service</h1>
					<table className='w-full text-xs'>
						<thead>
							<tr>
								<th className='text-center border border-black'>Description</th>
								<th className='text-center border border-black'>Qty</th>
								<th className='text-center border border-black'>Supplier</th>
								<th className='text-center border border-black'>Price</th>
								<th className='text-center border border-black'>Disc</th>
								<th className='text-center border border-black'>Total Price</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className='pr-1 w-[30%] border border-black'>
                                    {dataSelected?.desc}
                                </td>
								<td className='pr-1 w-[5%] text-center border border-black'>
                                    {dataSelected?.qtyAppr}
                                </td>
								<td className='pr-1 w-[25%] border border-black'>
                                    {dataSelected?.supplier?.supplier_name}
                                </td>
								<td className='pr-1 w-[15%] text-center border border-black'>
                                    {formatRupiah(dataSelected?.price.toString())}
                                </td>
								<td className='pr-1 w-[15%] text-center border border-black'>
                                    {formatRupiah(dataSelected?.disc.toString())}
                                </td>
								<td className='w-[15%] text-center border border-black'>
                                    {formatRupiah(dataSelected?.total.toString())}
                                </td>
							</tr>
						</tbody>
					</table>
				</>
			) : null}
		</div>
	);
};
