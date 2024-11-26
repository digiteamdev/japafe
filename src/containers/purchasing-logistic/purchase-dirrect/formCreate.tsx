import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputSelectSearch,
	InputDate,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import {
	GetAllPoMr,
	AddPoMr,
	GetPurchaseDirrect,
	GetPurchaseSupplier,
	AddSupplierMr,
	AddPrMr,
} from "../../../services";
import { toast } from "react-toastify";
import moment from "moment";
import { getIdUser } from "../../../configs/session";
import { Trash2, Plus } from "react-feather";
import { formatRupiah } from "@/src/utils";

interface props {
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
	franco: string;
	payment_method: string;
	dp: any;
	termOfPayment: any;
	detailMr: any;
}

export const FormCreatePurchaseDirrect = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listSupplier, setListSupplier] = useState<any>([]);
	const [listDataSuplier, setListDataSupplier] = useState<any>([]);
	const [date, setDate] = useState<any>(new Date());
	const [contact, setContact] = useState<string>("");
	const [phone, setPhone] = useState<string>("");
	const [address, setAddress] = useState<string>("");
	const [currency, setCurrency] = useState<string>("");
	const [listMr, setListMr] = useState<any>([]);
	const [userId, setUserId] = useState<string>("");
	const [suplierId, setSuplierId] = useState<string>("");
	const [idPR, setIdPR] = useState<string>("");
	const [total, setTotal] = useState<string>("");
	const [tax, setTax] = useState<string>("");
	const [countTax, setCountTax] = useState<string>("0");
	const [amountPercent, setAmountPercent] = useState<number>(100);
	const [grandTotal, setGrandTotal] = useState<string>("");
	const [data, setData] = useState<data>({
		dateOfPO: new Date(),
		idPO: "",
		ref: "",
		supplierId: "",
		delivery_time: "",
		franco: "",
		payment_method: "",
		dp: 0,
		note: "",
		termOfPayment: [],
		detailMr: [],
	});

	useEffect(() => {
		let idUser = getIdUser();
		setData({
			dateOfPO: new Date(),
			idPO: generateIdNum(),
			ref: "",
			supplierId: "",
			note: "",
			delivery_time: "",
			franco: "",
			payment_method: "",
			dp: 0,
			termOfPayment: [],
			detailMr: [],
		});
		if (idUser !== undefined) {
			setUserId(idUser);
		}
		setIdPR(generateIdNum());
		// getMrPo();
		getPurchaseMR();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getPurchaseMR = async () => {
		setIsLoading(true);
		try {
			const response = await GetPurchaseDirrect(undefined, undefined, "DP");
			if (response.data) {
				let detail: any = [];
				let suplier: any = [];
				let dataListSupplier: any = [];
				let dataSuplier: any = [];

				response.data.result.map((res: any) => {
					if (!suplier.includes(res?.supplier.supplier_name)) {
						suplier.push(res?.supplier.supplier_name);
						dataListSupplier.push({
							label: res?.supplier.supplier_name,
							value: res?.supplier,
						});
						dataSuplier.push(res.supplier);
					}
					// detail.push({
					//     id: res.id,
					//     no_mr: res.mr.no_mr,
					//     user: res.mr.user.employee.employee_name,
					//     supId: res.supId,
					//     disc: res.disc,
					//     currency: res.currency,
					//     total: result.total,
					//     material: `${result.Material_Master.name} ${result.Material_Master.spesifikasi}`,
					//     qty: result.qtyAppr,
					//     note: result.note,
					//     price: result.price,
					//     job_no: result.mr.job_no,
					// });
				});

				setListSupplier(dataListSupplier);
				setListDataSupplier(dataSuplier);
				setListMr(detail);
			}
		} catch (error: any) {
			setListMr([]);
		}
		setIsLoading(false);
	};

	const getDetailPurchaseMR = async (id: string) => {
		setIsLoading(true);
		try {
			const response = await GetPurchaseSupplier(id, "DP");
			if (response.data) {
				let listPurchase: any = [];
				response.data.result.map((res: any) => {
					listPurchase.push(res);
				});
				setListMr(listPurchase);
			}
		} catch (error: any) {
			setListMr([]);
		}
		setIsLoading(false);
	};

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

	const AddPurchaseDirrect = async () => {
		setIsLoading(true);
		let listDetail: any = [];
		let isWarning: boolean = false;
		listMr.map((res: any) => {
			listDetail.push({
				id: res.id,
				name_material: res.name_material,
				name_spesifikasi: res.spesifikasi,
				supId: res.supId,
				taxpr: res.taxpr,
				currency: res.currency,
				qtyAppr: parseInt(res.qtyAppr),
				price: parseInt(res.price),
				disc: parseInt(res.disc),
				total: parseInt(res.total),
			});
		});
		let data = {
			dateOfPurchase: new Date(date),
			idPurchase: generateIdNum(),
			supId: suplierId,
			taxPsrDmr: "non_tax",
			currency: "IDR",
			detailMr: listDetail,
		};
		if (!isWarning) {
			try {
				const response = await AddPrMr(data);
				if (response.data) {
					toast.success("Purchase dirrect Material Request Success", {
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
				toast.error("Purchase dirrect Material Request Failed", {
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

	const handleOnChanges = (event: any) => {
		if (event.target.name === "suplier") {
			listDataSuplier.map((res: any) => {
				if (res.supplier_name === event.target.value) {
					let detail: any = [];
					let total: number = 0;
					let totalTax: number = 0;
					let tax: boolean = false;
					let termOfPayment: any = [
						{
							limitpay: "Normal",
							percent: 0,
							price: 0,
							invoice: "",
						},
					];
					listMr.map((mr: any) => {
						if (mr.supId === res.id) {
							detail.push(mr);
							setCurrency(mr.currency);
							total = total + mr.total;
							if (mr.taxpr === "ppn") {
								tax = true;
							}
						}
					});
					if (tax) {
						totalTax = (total * res.ppn) / 100;
						setCountTax(res.ppn);
						setTax(formatRupiah(totalTax.toString()));
					}
					let grandTotal: number = total + totalTax;
					setTotal(formatRupiah(total.toString()));
					setGrandTotal(formatRupiah(grandTotal.toString()));
					setContact(res.SupplierContact[0].contact_person);
					setPhone(`+62${res.SupplierContact[0].phone}`);
					setAddress(res.addresses_sup);
					setSuplierId(res.id);
					setData({
						dateOfPO: data.dateOfPO,
						idPO: data.idPO,
						ref: "",
						note: "",
						delivery_time: "",
						franco: "",
						payment_method: "",
						supplierId: "",
						dp: 0,
						termOfPayment: termOfPayment,
						detailMr: detail,
					});
				}
			});
		}
	};

	const removeDetail = (id: any) => {
		let list: any = listMr;
		let listDetail: any = [];
		list.map((res: any) => {
			if (res.id !== id) {
				listDetail.push(res);
			}
		});
		setListMr(listDetail);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			<Formik
				initialValues={{ ...data }}
				// validationSchema={departemenSchema}
				onSubmit={(values) => {
					AddPurchaseDirrect();
				}}
				enableReinitialize
			>
				{({
					handleChange,
					handleSubmit,
					setFieldValue,
					errors,
					touched,
					values,
				}) => (
					<Form onChange={handleOnChanges}>
						<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputDate
									id='datePR'
									label='Date Of Purchase'
									value={moment(date).format("DD-MMMM-YYYY")}
									onChange={(value: any) => setDate(new Date(value))}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								<InputSelectSearch
									datas={listSupplier}
									id='suplier'
									name='suplier'
									placeholder='Supplier'
									label='Supplier'
									onChange={(e: any) => {
										getDetailPurchaseMR(e.value.id);
										setSuplierId(e.value.id)
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
							</div>
						</Section>
						{listMr?.length === 0 ? null : (
							<>
								<h1 className='font-bold text-xl py-2'>Detail Purchase</h1>
								<table className='w-full text-xs'>
									<thead>
										<tr>
											<th className='text-center border border-black'>
												Job no
											</th>
											<th className='text-center border border-black'>No MR</th>
											<th className='text-center border border-black'>
												Material
											</th>
											<th className='text-center border border-black'>Qty</th>
											<th className='text-center border border-black'>
												Supplier
											</th>
											<th className='text-center border border-black'>Price</th>
											<th className='text-center border border-black'>Disc</th>
											<th className='text-center border border-black'>
												Total Price
											</th>
											<th className='text-center border border-black'></th>
										</tr>
									</thead>
									<tbody>
										{listMr?.map((res: any, i: number) => {
											return (
												<tr key={i}>
													<td className='pr-1 border border-black'>
														{res?.mr?.job_no}
													</td>
													<td className='pr-1 border border-black'>
														{res?.mr?.no_mr}
													</td>
													<td className='pr-1 border border-black'>
														{res?.name_material + " " + res?.spesifikasi}
													</td>
													<td className='pr-1 text-center border border-black'>
														{res?.qtyAppr}
													</td>
													<td className='pr-1 border border-black'>
														{res?.supplier?.supplier_name}
													</td>
													<td className='pr-1 text-center border border-black'>
														{formatRupiah(res?.price.toString())}
													</td>
													<td className='pr-1 text-center border border-black'>
														{formatRupiah(res?.disc.toString())}
													</td>
													<td className='pr-1 text-center border border-black'>
														{formatRupiah(res?.total.toString())}
													</td>
													<td className='pr-1 text-center border border-black'>
														{listMr.length === 1 ? null : (
															<button
																type='button'
																className='bg-red-500 hover:bg-red-300 text-white p-[3px] rounded-lg'
																onClick={() => {
																	removeDetail(res.id);
																}}
															>
																<Trash2 size={18} />
															</button>
														)}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</>
						)}
						{listMr?.length === 0 ? null : (
							<div className='mt-8 flex justify-end'>
								<div className='flex gap-2 items-center'>
									<button
										type='button'
										className='inline-flex justify-center rounded-full border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
										disabled={isLoading}
										onClick={() => {
											handleSubmit();
										}}
									>
										{isLoading ? (
											<>
												<svg
													role='status'
													className='inline mr-3 w-4 h-4 text-white animate-spin'
													viewBox='0 0 100 101'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'
												>
													<path
														d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
														fill='#E5E7EB'
													/>
													<path
														d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
														fill='currentColor'
													/>
												</svg>
												Loading
											</>
										) : (
											"Save"
										)}
									</button>
								</div>
							</div>
						)}
					</Form>
				)}
			</Formik>
		</div>
	);
};
