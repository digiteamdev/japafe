import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelectSearch,
	InputDate,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { GetSpjPurchase, AddSpjPurchase } from "../../../services";
import { toast } from "react-toastify";
import { getIdUser } from "../../../configs/session";
import moment from "moment";
import { formatRupiah } from "@/src/utils";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	id: string;
	date_spj_purchase: any;
	userId: string;
	detailMr: any;
}

export const FormCreateSPJPurchase = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listPurchase, setListPurchase] = useState<any>([]);
	const [idPR, setIdPR] = useState<string>("");
	const [data, setData] = useState<data>({
		id: "",
		date_spj_purchase: new Date(),
		userId: "",
		detailMr: [],
	});

	useEffect(() => {
		setIdPR(generateIdNum());
		getPurchase();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getPurchase = async () => {
		let dataList: any = [];
		try {
			const response = await GetSpjPurchase(undefined, undefined, "");
			if (response.data) {
				response.data.result.map((res: any) => {
					dataList.push({
						value: res,
						label: res.idPurchase,
					});
				});
				setListPurchase(dataList);
			}
		} catch (error) {
			setListPurchase(dataList);
		}
	};

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		var year = dateObj.getUTCFullYear();
		const id =
			"PRV" +
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 10000);
		return id;
	};

	const addSpjPurchase = async (payload: any) => {
		setIsLoading(true);
		let mr: any = [];
        let userId: any = getIdUser()
		payload.detailMr.map((res: any) => {
			mr.push({
				id: res.id,
				disc: parseFloat(res.disc),
				price: parseFloat(res.price),
				total: parseFloat(res.total),
				qty_actual: parseInt(res.qty_actual),
			});
		});
		const body: any = {
			date_spj_purchase: payload.date_spj_purchase,
			userId: userId,
            detailMr: mr
		};
		try {
			const response = await AddSpjPurchase(body);
			if (response.data) {
				toast.success("Spj Purchase Success", {
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
			toast.error("Spj Purchase Failed", {
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

	const grandTotal = (data: any) => {
		let total: any = 0;
		data.map((res: any) => {
			total += res.total;
		});
		return total;
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto  h-[calc(100vh-100px)]'>
			<Formik
				initialValues={{ ...data }}
				// validationSchema={departemenSchema}
				onSubmit={(values) => {
					addSpjPurchase(values);
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
					<Form>
						<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputDate
									id='date_spj_purchase'
									label='Date Of SPJ'
									value={moment(values.date_spj_purchase).format(
										"DD-MMMM-YYYY"
									)}
									onChange={(e: any) => {
										setFieldValue("date_spj_purchase", new Date(e));
									}}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								<InputSelectSearch
									datas={listPurchase}
									id='sa'
									name='as'
									placeholder='ID Purchase'
									label='ID Purchase'
									onChange={(e: any) => {
										setFieldValue("detailMr", e.value.detailMr);
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
							</div>
						</Section>
						<div className='w-full mt-4'>
							<h5 className='font-semibold text-lg'>Detail Purchase</h5>
							{values.detailMr.length > 0 ? (
								<FieldArray
									name='detailMr'
									render={(arrayMr) => {
										return (
											<div className='text-xs'>
												<table className='w-full'>
													<thead>
														<tr>
															<th className='border border-black p-1 text-center'>
																Job no
															</th>
															<th className='border border-black p-1 text-center'>
																No Mr
															</th>
															<th className='border border-black p-1 text-center'>
																Material
															</th>
															<th className='border border-black p-1 text-center'>
																Supplier
															</th>
															<th className='border border-black p-1 text-center'>
																Qty Purchase
															</th>
															<th className='border border-black p-1 text-center'>
																Qty Actual
															</th>
															<th className='border border-black p-1 text-center'>
																Price
															</th>
															<th className='border border-black p-1 text-center'>
																Disc
															</th>
															<th className='border border-black p-1 text-center'>
																Total Price
															</th>
														</tr>
													</thead>
													<tbody>
														{values.detailMr.map((res: any, i: number) => {
															console.log(res);
															return (
																<tr key={i}>
																	<td className='border border-black p-1 text-center'>
																		{res.mr?.job_no}
																	</td>
																	<td className='border border-black p-1 text-center'>
																		{res.mr?.no_mr}
																	</td>
																	<td className='border border-black p-1 text-center'>
																		{res.mr?.job_no}
																	</td>
																	<td className='border border-black p-1 text-center'>
																		{res.supplier?.supplier_name}
																	</td>
																	<td className='w-[5%] border border-black p-1 text-center'>
																		{res.qtyAppr}
																	</td>
																	<td className='w-[10%] border border-black p-1 text-center'>
																		<Input
																			id='date_spj'
																			name='date_spj'
																			placeholder='Qty actual'
																			label='Qty actual'
																			type='number'
																			value={res.qty_actual}
																			onChange={(e: any) => {
																				let qty: any =
																					e.target.value.replaceAll(".", "");
																				let total: any =
																					res.price * qty - res.disc;
																				setFieldValue(
																					`detailMr.${i}.qty_actual`,
																					qty
																				);
																				setFieldValue(
																					`detailMr.${i}.total`,
																					total
																				);
																			}}
																			required={true}
																			withLabel={false}
																			className='bg-white border border-primary-300 text-gray-900 text-xs rounded-lg block w-full p-1 outline-primary-600'
																		/>
																	</td>
																	<td className='border border-black p-1 text-center'>
																		<Input
																			id='date_spj'
																			name='date_spj'
																			placeholder='Qty actual'
																			label='Qty actual'
																			type='text'
																			value={formatRupiah(res.price.toString())}
																			onChange={(e: any) => {
																				let price: any =
																					e.target.value.replaceAll(".", "");
																				let total: any =
																					price * res.qty_actual - res.disc;
																				setFieldValue(
																					`detailMr.${i}.price`,
																					price
																				);
																				setFieldValue(
																					`detailMr.${i}.total`,
																					total
																				);
																			}}
																			required={true}
																			withLabel={false}
																			className='bg-white border border-primary-300 text-gray-900 text-xs rounded-lg block w-full p-1 outline-primary-600'
																		/>
																	</td>
																	<td className='border border-black p-1 text-center'>
																		<Input
																			id='date_spj'
																			name='date_spj'
																			placeholder='Qty actual'
																			label='Qty actual'
																			type='text'
																			value={formatRupiah(res.disc.toString())}
																			onChange={(e: any) => {
																				let disc: any =
																					e.target.value.replaceAll(".", "");
																				let total: any =
																					res.price * res.qty_actual - disc;
																				setFieldValue(
																					`detailMr.${i}.disc`,
																					disc
																				);
																				setFieldValue(
																					`detailMr.${i}.total`,
																					total
																				);
																			}}
																			required={true}
																			withLabel={false}
																			className='bg-white border border-primary-300 text-gray-900 text-xs rounded-lg block w-full p-1 outline-primary-600'
																		/>
																	</td>
																	<td className='border border-black p-1 text-center'>
																		{formatRupiah(res.total.toString())}
																	</td>
																</tr>
															);
														})}
														<tr>
															<td
																className='border border-black p-1 text-right'
																colSpan={8}
															>
																Grand total
															</td>
															<td className='border border-black p-1 text-center'>
																{formatRupiah(
																	grandTotal(values.detailMr).toString()
																)}
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										);
									}}
								/>
							) : null}
						</div>
						{values.detailMr.length === 0 ? null : (
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
