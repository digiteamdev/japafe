import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelectSearch,
	InputArea,
	InputSelect,
	InputDate,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { cashierSchema } from "../../../schema/finance-accounting/cashier/cashierSchema";
import {
	ReSchedulleKontrabon,
	AddCashier,
	GetAllKontra,
} from "../../../services";
import { toast } from "react-toastify";
import moment from "moment";
import { formatRupiah } from "@/src/utils";
import { Calendar, X } from "react-feather";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	kontrabon: any;
}

export const FormCreateDuePayment = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [idCashier, setIdCashier] = useState<string>("");
	const [data, setData] = useState<data>({
		kontrabon: [],
	});

	useEffect(() => {
		getKontrabon();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getKontrabon = async () => {
		setIsLoading(true);
		let dataKontrabon: any = [];
		try {
			const response = await GetAllKontra();
			if (response.data) {
				response.data.result.map((res: any) => {
					dataKontrabon.push({
						...res,
						reSchedulle: false,
						date: res.due_date,
					});
				});
				setData({
					kontrabon: dataKontrabon,
				});
			}
		} catch (error: any) {
			setData({
				kontrabon: dataKontrabon,
			});
		}
		setIsLoading(false);
	};

	const addCashier = async (payload: any) => {
		setIsLoading(true);
		let totalDebet: number = 0;
		let totalKredit: number = 0;
		let jurnal: any = [];
		payload.journal_cashier.map((res: any) => {
			jurnal.push({
				coa_id: res.coa_id,
				status_transaction: res.status_transaction,
				grandtotal: res.grandtotal,
			});
			if (res.status_transaction === "Debet") {
				totalDebet = totalDebet + res.grandtotal;
			} else {
				totalKredit = totalKredit + res.grandtotal;
			}
		});
		let data = {
			id_cashier: idCashier,
			status_payment: payload.status_payment,
			kontrabonId: payload.kontrabonId,
			cdvId: payload.id_cash_advance,
			date_cashier: payload.date_cashier,
			note: payload.note,
			total: payload.total,
			journal_cashier: jurnal,
		};
		if (totalDebet === 0 || totalKredit === 0) {
			toast.warning("Journal total has not been filled in", {
				position: "top-center",
				autoClose: 1000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		} else if (totalDebet !== totalKredit) {
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
		} else if (totalDebet === totalKredit) {
			try {
				const response = await AddCashier(data);
				if (response) {
					toast.success("Add Cashier Success", {
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
				toast.error("Add Cashier Failed", {
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
		} else {
		}
		setIsLoading(false);
	};

	const reSchedulleKontrabon = async (id: string, date: Date) => {
		setIsLoading(true);
		try {
			const response = await ReSchedulleKontrabon(id, {due_date: date});
			if (response) {
				toast.success("Reschedulle kontrabon Success", {
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
		} catch (error) {
			toast.error("Reschedulle kontrabon Failed", {
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
		setIsLoading(false);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<Formik
				initialValues={data}
				// validationSchema={kontraBonSchema}
				onSubmit={(values) => {
					addCashier(values);
				}}
				enableReinitialize
			>
				{({
					handleChange,
					setFieldValue,
					handleSubmit,
					errors,
					touched,
					values,
				}) => (
					<Form>
						<FieldArray
							name='kontrabon'
							render={(arrays) =>
								values.kontrabon.map((result: any, i: number) => {
									console.log(result);
									return (
										<div key={i}>
											<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 pt-2'>
												<div className='w-full'>
													<Input
														id={`kontrabon.${i}.id_kontrabon`}
														name={`kontrabon.${i}.id_kontrabon`}
														placeholder='Id Kontrabon'
														label='Id Kontrabon'
														type='text'
														required={true}
														disabled={true}
														withLabel={true}
														value={result.id_kontrabon}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<InputArea
														id={`kontrabon.${i}.id_kontrabon`}
														name={`kontrabon.${i}.id_kontrabon`}
														placeholder='Description'
														label='Description'
														type='text'
														required={true}
														disabled={true}
														withLabel={true}
														value={
															result.purchaseID === null
																? `${result.term_of_pay_po_so.poandso.note} ${result.term_of_pay_po_so.limitpay} ${result.term_of_pay_po_so.percent}%`
																: result.purchase.note
														}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<Input
														id={`kontrabon.${i}.grandtotal`}
														name={`kontrabon.${i}.grandtotal`}
														placeholder='Value'
														label='Value'
														type='text'
														required={true}
														disabled={true}
														withLabel={true}
														value={formatRupiah(result.grandtotal.toString())}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													{result.reSchedulle ? (
														<div className='flex'>
															<InputDate
																id='dueDate'
																label='Reschedulle'
																value={result.date}
																minDate={new Date()}
																onChange={(value: any) => {
																	setFieldValue(`kontrabon.${i}.date`, value);
																	reSchedulleKontrabon(result.id, value);
																	arrays.remove(i) 
																}}
																withLabel={true}
																className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
																classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
															/>
															<a
																type='button'
																className='text-red-500 rounded-lg mt-8 cursor-pointer hover:text-red-300'
																onClick={() => {
																	setFieldValue(
																		`kontrabon.${i}.reSchedulle`,
																		false
																	);
																}}
															>
																<X size={32} className='mr-1 mt-1' />
															</a>
														</div>
													) : (
														<button
															type='button'
															className='inline-flex bg-blue-700 text-white rounded-lg p-2 mt-7 hover:bg-blue-400'
															onClick={() => {
																setFieldValue(
																	`kontrabon.${i}.reSchedulle`,
																	true
																);
															}}
														>
															<Calendar size={18} className='mr-1 mt-1' />{" "}
															Reschedulle
														</button>
													)}
												</div>
											</Section>
										</div>
									);
								})
							}
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
										"Valid"
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
