import { useEffect, useState } from "react";
import {
	Input,
	InputSelect,
	InputSelectSearch,
	Section,
} from "../../../components";
import { GetAllCoa, Posting } from "../../../services";
import { formatRupiah } from "../../../utils/index";
import { Plus, Trash2 } from "react-feather";
import moment from "moment";
import { toast } from "react-toastify";
import { FieldArray, Form, Formik } from "formik";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	journal: [
		{
			id: string;
			coa_id: string;
			coa_name: string;
			coa_select: any;
			status_transaction: string;
			grandtotal: number;
			status: boolean;
			cashier_id: string | null;
			poandsoId: string | null;
		}
	];
}

export const ViewPosting = ({ dataSelected, content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [dataCoa, setDataCoa] = useState<any>([]);
	const [journalDelete, setJuornalDelete] = useState<any>([]);
	const [data, setData] = useState<data>({
		journal: [
			{
				id: "",
				coa_id: "",
				coa_name: "",
				coa_select: {},
				status_transaction: "",
				grandtotal: 0,
				status: true,
				cashier_id: null,
				poandsoId: null,
			},
		],
	});

	useEffect(() => {
		let journal: any = [];
		getCoa();
		dataSelected.journal_cashier.map((res: any) => {
			journal.push({
				id: res.id,
				coa_id: res.coa_id,
				coa_name: res.coa.coa_name,
				coa_select: {
					label: res.coa.coa_name,
					value: res.coa,
				},
				status_transaction: res.status_transaction,
				grandtotal: res.grandtotal,
				status: true,
				poandsoId: dataSelected.id_so ? dataSelected.id : null,
				cashier_id: dataSelected.id_so ? null : dataSelected.id,
			});
		});
		setData({
			journal: journal,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const total = (data: any, type: string) => {
		let total: number = 0;
		data.map((res: any) => {
			if (res.status_transaction === type) {
				total = total + parseInt(res.grandtotal);
			}
		});
		return formatRupiah(total.toString());
	};

	const getCoa = async () => {
		setIsLoading(true);
		let dataCoa: any = [];
		try {
			const response = await GetAllCoa();
			if (response.data) {
				response.data.result.map((res: any) => {
					dataCoa.push({
						label: res.coa_name,
						value: res,
					});
				});
				setDataCoa(dataCoa);
			}
		} catch (error: any) {
			setDataCoa(dataCoa);
		}
		setIsLoading(false);
	};

	const posting = async (payload: any) => {
		setIsLoading(true);
		let listJournal: any = [];
		let totalDebit: number = 0;
		let totalKredit: number = 0;
		payload.journal.map((res: any) => {
			listJournal.push({
				coa_id: res.coa_id,
				grandtotal: parseInt(res.grandtotal),
				status_transaction: res.status_transaction,
				id: res.id,
				status: res.status,
				cashier_id: res.cashier_id,
				poandsoId: res.poandsoId,
			});
			if (res.status_transaction === "Kredit") {
				totalKredit = totalKredit + parseInt(res.grandtotal);
			} else {
				totalDebit = totalDebit + parseInt(res.grandtotal);
			}
		});
		let data: any = {
			journal: listJournal,
			delete: journalDelete,
		};
		if (totalKredit !== totalDebit) {
			toast.warning("debits and credits are not balanced", {
				position: "top-center",
				autoClose: 1000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		} else {
			try {
				const response = await Posting(data);
				if (response.data) {
					toast.success("Posting Journal Success", {
						position: "top-center",
						autoClose: 1000,
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
				toast.error("Posting Journal Failed", {
					position: "top-center",
					autoClose: 1000,
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

	const deleteJournal = (id: string) => {
		let listDelete: any = journalDelete;
		listDelete.push({ id: id });
		setJuornalDelete(listDelete);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<Section className='grid grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								<tbody>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Reference
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.id_receive
												? dataSelected.id_receive
												: dataSelected.id_cashier}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Date
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.id_receive
												? moment(dataSelected.date_prepared).format(
														"DD-MMMM-YYYY"
												  )
												: moment(dataSelected.date_cashier).format(
														"DD-MMMM-YYYY"
												  )}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Job No
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											-
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Section>
					{dataSelected.id_so ? (
						<>
							<h1 className='font-bold text-lg mt-2'>Material</h1>
							<Section className='grid grid-cols-1 gap-2 mt-2 text-xs'>
								<table className='w-full'>
									<thead>
										<tr>
											<th className='border border-black text-center'>
												Material
											</th>
											<th className='border border-black text-center'>Qty</th>
											<th className='border border-black text-center'>Unit</th>
											<th className='border border-black text-center'>Price</th>
											<th className='border border-black text-center'>
												Total Price
											</th>
										</tr>
									</thead>
									<tbody>
										{dataSelected.detailMr.map((res: any, i: number) => {
											return (
												<tr key={i}>
													<td className='border border-black text-center'>
														{res.Material_Master.name}
													</td>
													<td className='border border-black text-center'>
														{res.qtyAppr}
													</td>
													<td className='border border-black text-center'>
														{res.Material_Master.satuan}
													</td>
													<td className='border border-black text-center'>
														{formatRupiah(res.price.toString())}
													</td>
													<td className='border border-black text-center'>
														{formatRupiah(res.total.toString())}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</Section>
						</>
					) : (
						<>
							<h1 className='font-bold text-lg mt-2'>Cashier</h1>
							<Section className='grid grid-cols-1 gap-2 mt-2 text-xs'>
								<table className='w-full'>
									<thead>
										<tr>
											<th className='border border-black text-center'>
												Pay To
											</th>
											<th className='border border-black text-center'>
												Description
											</th>
											<th className='border border-black text-center'>
												Total Pay
											</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td className='border border-black text-center'>
												{dataSelected.pay_to}
											</td>
											<td className='border border-black text-center'>
												{dataSelected.note}
											</td>
											<td className='border border-black text-center'>
												{formatRupiah(dataSelected.total.toString())}
											</td>
										</tr>
									</tbody>
								</table>
							</Section>
						</>
					)}
					<h1 className='font-bold text-lg mt-2'>Journal</h1>
					<Formik
						initialValues={{ ...data }}
						// validationSchema={departemenSchema}
						onSubmit={(values) => {
							posting(values);
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
								<table className='w-full mt-2 text-xs'>
									<thead>
										<tr>
											<th className='text-center w-[30%]'>Account</th>
											<th className='text-center w-[20%]'>Type</th>
											<th className='text-center w-[20%]'>Debit</th>
											<th className='text-center w-[20%]'>Kredit</th>
											<th className='text-center w-[10%]'></th>
										</tr>
									</thead>
									<tbody>
										<FieldArray
											name='journal'
											render={(arrayJournal) => {
												return values.journal.map((res: any, i: number) => {
													return (
														<tr key={i}>
															<td className=''>
																<InputSelectSearch
																	datas={dataCoa}
																	id='coa'
																	name='coa'
																	placeholder='Account'
																	label='Account'
																	value={res.coa_select}
																	onChange={(e: any) => {
																		setFieldValue(`journal.${i}.coa_select`, e);
																		setFieldValue(
																			`journal.${i}.coa_id`,
																			e.value.id
																		);
																		setFieldValue(
																			`journal.${i}.coa_name`,
																			e.label
																		);
																	}}
																	required={true}
																	withLabel={false}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600 mt-1'
																/>
															</td>
															<td className='text-center'>
																<InputSelect
																	id={`journal.${i}.status_transaction`}
																	name={`journal.${i}.status_transaction`}
																	placeholder='Type'
																	label='Type'
																	onChange={(e: any) => {
																		setFieldValue(
																			`journal.${i}.status_transaction`,
																			e.target.value
																		);
																	}}
																	required={true}
																	withLabel={false}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600 mt-2'
																>
																	<option
																		value='Debet'
																		selected={
																			res.status_transaction === "Debet"
																				? true
																				: false
																		}
																	>
																		Debit
																	</option>
																	<option
																		value='Kredit'
																		selected={
																			res.status_transaction === "Kredit"
																				? true
																				: false
																		}
																	>
																		Kredit
																	</option>
																</InputSelect>
															</td>
															<td className='text-center'>
																<Input
																	id={`journal.${i}.grandtotal`}
																	name={`journal.${i}.grandtotal`}
																	placeholder='Debet'
																	type='text'
																	pattern='\d*'
																	value={
																		res.status_transaction === "Debet"
																			? formatRupiah(res.grandtotal.toString())
																			: "-"
																	}
																	onChange={(e: any) => {
																		let total = e.target.value
																			.toString()
																			.replaceAll(".", "");
																		setFieldValue(
																			`journal.${i}.grandtotal`,
																			total
																		);
																	}}
																	disabled={
																		res.status_transaction === "Debet"
																			? false
																			: true
																	}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</td>
															<td className='text-center'>
																<Input
																	id={`journal.${i}.grandtotal`}
																	name={`journal.${i}.grandtotal`}
																	placeholder='Kredit'
																	type='text'
																	pattern='\d*'
																	value={
																		res.status_transaction === "Kredit"
																			? formatRupiah(res.grandtotal.toString())
																			: "-"
																	}
																	onChange={(e: any) => {
																		let total = e.target.value
																			.toString()
																			.replaceAll(".", "");
																		setFieldValue(
																			`journal.${i}.grandtotal`,
																			total
																		);
																	}}
																	disabled={
																		res.status_transaction === "Kredit"
																			? false
																			: true
																	}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</td>
															<td className='text-center'>
																{i === values.journal.length - 1 ? (
																	<a
																		className='inline-flex text-green-500 mr-1 mt-3 cursor-pointer'
																		onClick={() => {
																			arrayJournal.push({
																				id: "",
																				coa_id: "",
																				coa_name: "",
																				coa_select: {},
																				status_transaction: "Debet",
																				grandtotal: 0,
																				status: true,
																				poandsoId: dataSelected.id_so ? dataSelected.id : null,
																				cashier_id: dataSelected.id_so ? null : dataSelected.id,
																			});
																		}}
																	>
																		<Plus size={28} className='mr-1 mt-1' />
																	</a>
																) : null}
																{values.journal.length !== 1 ? (
																	<a
																		className='inline-flex text-red-500 cursor-pointer mt-3'
																		onClick={() => {
																			if (res.id !== "") {
																				deleteJournal(res.id);
																				arrayJournal.remove(i);
																			} else {
																				arrayJournal.remove(i);
																			}
																		}}
																	>
																		<Trash2 size={26} className='mr-1 mt-1' />
																	</a>
																) : null}
															</td>
														</tr>
													);
												});
											}}
										/>
										<tr>
											<td
												className='text-right pr-2 font-semibold text-lg'
												colSpan={2}
											>
												Total
											</td>
											<td className='text-center'>
												<Input
													id='grandtotalDebit'
													name='grandtotalDebit'
													placeholder='Debit'
													type='text'
													pattern='\d*'
													value={total(values.journal, "Debet")}
													disabled={true}
													required={true}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												/>
											</td>
											<td className='text-center'>
												<Input
													id='grandtotalKredit'
													name='grandtotalKredit'
													placeholder='Kredit'
													type='text'
													pattern='\d*'
													value={total(values.journal, "Kredit")}
													disabled={true}
													required={true}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												/>
											</td>
										</tr>
									</tbody>
								</table>
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
												"Posting"
											)}
										</button>
									</div>
								</div>
							</Form>
						)}
					</Formik>
				</>
			) : null}
		</div>
	);
};
