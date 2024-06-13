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
import { GetBom, GetAllCoa, CreateJournal } from "../../../services";
import { toast } from "react-toastify";
import moment from "moment";
import { formatRupiah } from "@/src/utils";
import { Calendar, Plus, Trash2, X } from "react-feather";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	worId: string;
	note: string;
	journal_general: any;
}

export const FormCreateGeneralLedger = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [idCashier, setIdCashier] = useState<string>("");
	const [Wor, setWor] = useState<any>([]);
	const [listWor, setListWor] = useState<any>([]);
	const [listCoa, setListCoa] = useState<any>([]);
	const [data, setData] = useState<data>({
		worId: "",
		note: "",
		journal_general: [],
	});

	useEffect(() => {
		getWor();
		getCoa();
		setData({
			worId: "",
			note: "",
			journal_general: [
				{
					coa_id: "",
					status_transaction: "Debet",
					grandtotal: 0,
					note: ""
				},
				{
					coa_id: "",
					status_transaction: "Kredit",
					grandtotal: 0,
					note: ""
				},
			],
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getWor = async () => {
		let datasWor: any = [
			{
				value: { id: null },
				label: "Internal",
			},
		];
		try {
			const response = await GetBom();
			if (response) {
				response.data.result.map((res: any) => {
					if (res.job_no !== "") {
						datasWor.push({
							value: res,
							label: `${res.job_no} - ${res.customerPo.quotations.Customer.name}`,
						});
					}
				});
				setListWor(datasWor);
			}
		} catch (error) {
			setListWor(datasWor);
		}
	};

	const getCoa = async () => {
		setIsLoading(true);
		let dataCoa: any = [];
		try {
			const response = await GetAllCoa();
			if (response.data) {
				response.data.result.map((res: any) => {
					dataCoa.push({
						label: `${res.coa_code} ${res.coa_name}`,
						value: res,
					});
				});
				setListCoa(dataCoa);
			}
		} catch (error: any) {
			setListCoa(dataCoa);
		}
		setIsLoading(false);
	};

	const createJournal = async (payload: any) => {
		let data: any = [];
		payload.journal_general.map((res: any) => {
			data.push({
				coa_id: res.coa_id,
				note: res.note,
				status_transaction: res.status_transaction,
				grandtotal: res.grandtotal,
			});
		});
		let dataBody = {
			worId: payload.worId,
			note: payload.note,
			journal_general: data
		}
		try {
			const response = await CreateJournal(dataBody);
			if (response) {
				toast.success("Add General Ledger Success", {
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
			toast.error("Add General Ledger Failed", {
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
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<Formik
				initialValues={data}
				// validationSchema={kontraBonSchema}
				onSubmit={(values) => {
					createJournal(values);
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
						<h1 className='text-xl font-bold mt-3'>General Ledger</h1>
						<Section className='grid md:grid-cols-3 sm:grid-cols-1 mt-2 gap-2'>
							<div className='w-full'>
								<Input
									id='date'
									name='date'
									placeholder='Date'
									label='Date'
									type='text'
									value={moment(new Date()).format("LL")}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputSelectSearch
									datas={listWor}
									id='job_no'
									name='job_no'
									placeholder='Job No'
									label='Job No'
									onChange={(e: any) => {
										setWor(e.value);
										setFieldValue('worId', e.value.id)
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputArea
									id='note'
									name='note'
									placeholder='Note'
									label='Note'
									type='text'
									value={values.note}
									onChange={handleChange}
									disabled={false}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<FieldArray
							name='journal_general'
							render={(arrays) =>
								values.journal_general.map((result: any, i: number) => {
									return (
										<div key={i}>
											<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 pt-2'>
												<div className='w-full'>
													<InputSelectSearch
														datas={listCoa}
														id={`journal_general.${i}.coa_id`}
														name={`journal_general.${i}.coa_id`}
														placeholder='Journal'
														label='Journal'
														onChange={(e: any) => {
															setFieldValue(`journal_general.${i}.coa_id`, e.value.id);
														}}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<InputSelect
														id={`journal_general.${i}.status_transaction`}
														name={`journal_general.${i}.status_transaction`}
														placeholder='Status'
														label='Status'
														onChange={handleChange}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													>
														<option
															value='Debet'
															selected={
																result.status_transaction === "Debet"
																	? true
																	: false
															}
														>
															Debet
														</option>
														<option
															value='Kredit'
															selected={
																result.status_transaction === "Kredit"
																	? true
																	: false
															}
														>
															Kredit
														</option>
													</InputSelect>
												</div>
												<div className='w-full'>
													<Input
														id={`journal_general.${i}.grandtotal`}
														name={`journal_general.${i}.grandtotal`}
														placeholder='Total'
														label='Total'
														type='text'
														required={true}
														pattern='\d*'
														onChange={(e: any) => {
															let total = parseInt(
																e.target.value.replace(/\./g, "")
															);
															setFieldValue(`journal_general.${i}.grandtotal`, total);
														}}
														withLabel={true}
														value={formatRupiah(result.grandtotal.toString())}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
											</Section>
											<div className='flex w-full'>
												{i + 1 === values.journal_general.length ? (
													<a
														className='flex mt-2 text-[20px] text-blue-600 cursor-pointer hover:text-blue-400'
														onClick={() =>
															arrays.push({
																coa_id: "",
																status_transaction: "Debet",
																grandtotal: 0,
																note: ""
															})
														}
													>
														<Plus size={23} className='mt-1' />
														Add
													</a>
												) : null}
												{i === 0 && values.journal_general.length === 1 ? null : (
													<a
														className='flex ml-4 mt-2 text-[20px] text-red-600 w-full hover:text-red-400 cursor-pointer'
														onClick={() => arrays.remove(i)}
													>
														<Trash2 size={22} className='mt-1 mr-1' />
														Remove
													</a>
												)}
											</div>
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
