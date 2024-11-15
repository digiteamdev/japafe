import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputSelectSearch,
	InputArea,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { departemenSchema } from "../../../schema/master-data/departement/departementSchema";
import { AddSpjCashAdvance, GetCashAdvances } from "../../../services";
import { Plus, Trash2 } from "react-feather";
import { toast } from "react-toastify";
import moment from "moment";
import { getIdUser } from "../../../configs/session";
import { formatRupiah, rupiahFormat } from "@/src/utils";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	id_cash_advance: string;
	id: string;
	job_no: string;
	pic: string;
	status_payment: string;
	grand_tot: any;
	date_cash_advance: Date | null;
	cdv_detail: any;
}

export const FormCreateSPJCashAdvance = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [caID, setCaID] = useState<string>("");
	const [balance, setBalance] = useState<any>(0);
	const [listCashAdvance, setListCashAdvance] = useState<any>([]);
	const [data, setData] = useState<data>({
		id_cash_advance: "",
		id: "",
		job_no: "",
		pic: "",
		grand_tot: 0,
		status_payment: "",
		date_cash_advance: null,
		cdv_detail: [],
	});

	useEffect(() => {
		getCashAdvance();
		generateIdNum();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		var year = dateObj.getUTCFullYear();
		const id =
			"SPJ" +
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 10000);
		setCaID(id);
	};

	const getCashAdvance = async () => {
		let listCashAdvance: any = [];
		try {
			const response = await GetCashAdvances();
			if (response) {
				response.data.result.map((res: any) => {
					listCashAdvance.push({
						label: res.id_cash_advance,
						value: res,
					});
				});
			}
		} catch (error) {
			listCashAdvance = [];
		}
		setListCashAdvance(listCashAdvance);
	};

	const totalBalances = (data: any) => {
		let total: any = 0;
		data.map((res: any) => {
			total = total + parseFloat(res.actual);
		});
		return balance - total;
	};

	const addSpjCashAdvance = async (payload: data) => {
		setIsLoading(true);
		var listDetail: any = [];
		payload.cdv_detail.map((res: any) => {
			listDetail.push({
				id: res.id,
				type_cdv: res.type_cdv,
				actual: parseInt(res.actual),
				description: res.description,
				balance: parseInt(res.balance),
				cdvId: res.cdvId,
			});
		});
		let data = {
			id_spj: caID,
			grand_tot: payload?.grand_tot,
			balance: totalBalances(payload.cdv_detail),
			cdv_detail: listDetail,
		};
		try {
			const response = await AddSpjCashAdvance(payload.id, data);
			if (response.data) {
				toast.success("Add SPJ Cash Advance Success", {
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
			toast.error("Add SPJ Cash Advances Failed", {
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

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<Formik
				initialValues={{ ...data }}
				// validationSchema={departemenSchema}
				onSubmit={(values) => {
					addSpjCashAdvance(values);
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
						<h1 className='text-xl font-bold mt-3'>Cash Advance</h1>
						<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							{/* <div className='w-full'>
								<Input
									id='id_cash_advance'
									name='id_cash_advance'
									placeholder='id SPJ Cash Advance'
									label='id SPJ Cash Advance'
									type='text'
									value={caID}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div> */}
							<div className='w-full'>
								<InputSelectSearch
									datas={listCashAdvance}
									id='id_spj'
									name='id_spj'
									placeholder='Reference'
									label='Reference'
									onChange={(e: any) => {
										setFieldValue("id", e.value.id);
										setFieldValue("job_no", e.value.wor ? e.value.wor?.job_no : e.value.job_no);
										setFieldValue("pic", e.value.user.employee.employee_name);
										setFieldValue("status_payment", e.value.status_payment);
										setFieldValue("grand_tot", e.value.grand_tot);
										setFieldValue(
											"date_cash_advance",
											e.value.date_cash_advance
										);
										setFieldValue("cdv_detail", e.value.cdv_detail);
										setBalance(e.value.grand_tot);
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='customer'
									name='customer'
									placeholder='Reference Date'
									label='Reference Date'
									type='text'
									value={
										values.date_cash_advance === null
											? ""
											: moment(values.date_cash_advance).format("DD-MMMM-YYYY")
									}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='id_cash_advance'
									name='id_cash_advance'
									placeholder='Total amount'
									label='Total amount'
									type='text'
									value={formatRupiah(values.grand_tot.toString())}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='job_no'
									name='job_no'
									placeholder='Job No'
									label='Job No'
									type='text'
									value={values.job_no}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='subject'
									name='subject'
									placeholder='PIC'
									label='PIC'
									type='text'
									value={values.pic}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='subject'
									name='subject'
									placeholder='Status Payment'
									label='Status Payment'
									type='text'
									value={values.status_payment}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<FieldArray
							name='cdv_detail'
							render={(arrayDetail) => (
								<div className='mt-4'>
									<table className='w-full'>
										<thead>
											<tr>
												<th className='border border-black text-center'>
													Type
												</th>
												<th className='border border-black text-center'>
													Description
												</th>
												<th className='border border-black text-center'>
													Value
												</th>
												<th className='border border-black text-center'></th>
											</tr>
										</thead>
										<tbody>
											{values.cdv_detail.map((res: any, i: number) => (
												<tr key={i}>
													<td className='border border-black'>
														<InputSelect
															id={`cdv_detail.${i}.type_cdv`}
															name={`cdv_detail.${i}.type_cdv`}
															placeholder='Type'
															label='Type'
															onChange={(e: any) => {
																setFieldValue(
																	`cdv_detail.${i}.type_cdv`,
																	e.target.value
																);
															}}
															required={true}
															withLabel={false}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														>
															<option
																value='Consumable'
																selected={
																	res.type_cdv === "Consumable" ? true : false
																}
															>
																Consumable
															</option>
															<option
																value='Investasi'
																selected={
																	res.type_cdv === "Investasi" ? true : false
																}
															>
																Investasi
															</option>
															<option
																value='Service'
																selected={
																	res.type_cdv === "Service" ? true : false
																}
															>
																Service
															</option>
															<option
																value='Operasional'
																selected={
																	res.type_cdv === "Operasional" ? true : false
																}
															>
																Operasional
															</option>
															<option
																value='SDM'
																selected={res.type_cdv === "SDM" ? true : false}
															>
																SDM
															</option>
														</InputSelect>
													</td>
													<td className='border border-black'>
														<InputArea
															id={`cdv_detail.${i}.description`}
															name={`cdv_detail.${i}.description`}
															placeholder='Decription'
															label='Decription'
															type='text'
															value={res.description}
															onChange={(e: any) => {
																setFieldValue(
																	`cdv_detail.${i}.description`,
																	e.target.value
																);
															}}
															disabled={false}
															required={true}
															row={1}
															withLabel={false}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</td>
													<td className='border border-black'>
														<Input
															id={`cdv_detail.${i}.actual`}
															name={`cdv_detail.${i}.actual`}
															placeholder='Actual'
															label='Actual'
															type='number'
															value={res.actual}
															onChange={(e: any) => {
																let balanced: any =
																	values.grand_tot - e.target.value;
																setFieldValue(
																	`cdv_detail.${i}.actual`,
																	e.target.value
																);
																setFieldValue(
																	`cdv_detail.${i}.balance`,
																	balanced
																);
															}}
															required={true}
															withLabel={false}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</td>
													<td className='border border-black mx-auto'>
														<div className='flex'>
															{i + 1 === values.cdv_detail.length ? (
																<a
																	className='flex mt-2 text-[20px] text-blue-600 cursor-pointer hover:text-blue-400'
																	onClick={() =>
																		arrayDetail.push({
																			id: "",
																			type_cdv: "Consumable",
																			cdvId: res.cdvId,
																			total: 0,
																			description: "",
																			actual: 0,
																			balance: 0,
																		})
																	}
																>
																	<Plus size={23} className='mt-1' />
																</a>
															) : null}
															{i === 0 &&
															values.cdv_detail.length === 1 ? null : (
																<a
																	className='flex ml-4 mt-2 text-[20px] text-red-600 w-full hover:text-red-400 cursor-pointer'
																	onClick={() => arrayDetail.remove(i)}
																>
																	<Trash2 size={22} className='mt-1 mr-1' />
																</a>
															)}
														</div>
													</td>
												</tr>
											))}
											<tr>
												<td
													className='border border-black text-right'
													colSpan={2}
												>
													Total Balance
												</td>
												<td className='border border-black pl-2'>
													{rupiahFormat(totalBalances(values.cdv_detail).toString())}
												</td>
												<td className='border border-black'></td>
											</tr>
										</tbody>
									</table>
								</div>
							)}
						/>

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
									) : content === "add" ? (
										"Save"
									) : (
										"Edit"
									)}
								</button>
							</div>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};
