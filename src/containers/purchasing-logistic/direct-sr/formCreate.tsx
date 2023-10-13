import { useState, useEffect } from "react";
import { Section, Input, InputSelect } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import {
	GetAllSupplier,
	GetAllSRPo,
	GetAllCoa,
	AddPrSr,
} from "../../../services";
import { toast } from "react-toastify";
import moment from "moment";
import { getIdUser } from "../../../configs/session";
import { ChevronDown, ChevronUp, Trash2 } from "react-feather";
import { Disclosure } from "@headlessui/react";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	dateOfPurchase: any;
	idPurchase: string;
	detailMr: any;
}

export const FormCreateDirectSr = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listSupplier, setListSupplier] = useState<any>([]);
	const [listMr, setListMr] = useState<any>([]);
	const [listCoa, setListCoa] = useState<any>([]);
	const [userId, setUserId] = useState<string>("");
	const [idPR, setIdPR] = useState<string>("");
	const [data, setData] = useState<data>({
		dateOfPurchase: new Date(),
		idPurchase: "",
		detailMr: [],
	});

	useEffect(() => {
		let idUser = getIdUser();
		if (idUser !== undefined) {
			setUserId(idUser);
		}
		setIdPR(generateIdNum());
		getSupplier();
		getSrPo();
		getCoa();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getSrPo = async () => {
		try {
			const response = await GetAllSRPo("DSO");
			if (response) {
				let detail: any = [];
				response.data.result.map((res: any) => {
					detail.push({
						id: res.id,
						no_sr: res.sr.no_sr,
						user: res.sr.user.employee.employee_name,
						supId: res.supId,
						tax: res.tax,
						akunId: res.akunId,
						disc: res.disc,
						currency: "IDR",
						total: res.total,
						material: res.part,
						service: res.workCenter.name,
						qty: res.qtyAppr,
						note: res.note,
						price: 0,
						job_no: res.sr.wor.job_operational
							? res.sr.wor.job_no_mr
							: res.sr.wor.job_no,
					});
				});
				setData({
					dateOfPurchase: new Date(),
					idPurchase: generateIdNum(),
					detailMr: detail,
				});
				setListMr(response.data.result);
			}
		} catch (error) {
			setListMr([]);
		}
	};

	const getCoa = async () => {
		try {
			const response = await GetAllCoa();
			if (response) {
				setListCoa(response.data.result);
			}
		} catch (error) {
			setListCoa([]);
		}
	};

	const getSupplier = async () => {
		try {
			const response = await GetAllSupplier();
			if (response) {
				setListSupplier(response.data.result);
			}
		} catch (error) {}
	};

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		var year = dateObj.getUTCFullYear();
		const id =
			"DSR" +
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 1000);
		return id;
	};

	const totalHarga = (harga: number, qty: number, disc: number) => {
		let totalHarga = harga * qty - disc;
		return totalHarga;
	};

	const purchaseSr = async (payload: data) => {
		setIsLoading(true);
		let listDetail: any = [];
		payload.detailMr.map((res: any) => {
			listDetail.push({
				id: res.id,
				supId: res.supId,
				taxPsrDmr: res.tax,
				akunId: res.akunId,
				currency: res.currency,
				qtyAppr: parseInt(res.qty),
				price: parseInt(res.price), 
				disc: parseInt(res.disc),
				total: parseInt(res.total),
			});
		});
		let data = {
			dateOfPurchase: payload.dateOfPurchase,
			idPurchase: payload.idPurchase,
			srDetail: listDetail,
		};
		try {
			const response = await AddPrSr(data);
			if (response.data) {
				toast.success("Purchase Service Request Success", {
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
			toast.error("Purchase Service Request Failed", {
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
					purchaseSr(values);
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
								<Input
									id='idPurchase'
									name='idPurchase'
									placeholder='ID Purchase'
									label='ID Purchase'
									type='text'
									value={idPR}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='datePR'
									name='datePR'
									placeholder='Date Of Purchase'
									label='Date Of Purchase'
									type='text'
									value={moment(new Date()).format("DD-MMMM-YYYY")}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<FieldArray
							name='detailMr'
							render={(arrayMr) =>
								values.detailMr.map((result: any, i: number) => {
									return (
										<div key={i}>
											<Disclosure defaultOpen>
												{({ open }) => (
													<div>
														<Disclosure.Button className='flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 mt-2'>
															<h4 className='text-lg font-bold'>
																Job No : {result.job_no}
															</h4>
															<h4 className='text-lg font-bold'>
																{open ? <ChevronDown /> : <ChevronUp />}
															</h4>
														</Disclosure.Button>
														<Disclosure.Panel>
															<Section className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-4'>
																<div className='w-full'>
																	<Input
																		id={`detailMr.${i}.no_sr`}
																		name={`detailMr.${i}.no_sr`}
																		placeholder='No SR'
																		label='No SR'
																		type='text'
																		value={result.no_sr}
																		disabled={true}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	<InputSelect
																		id={`detailMr.${i}.tax`}
																		name={`detailMr.${i}.tax`}
																		placeholder='Tax'
																		label='Tax'
																		onChange={(e: any) => {
																			setFieldValue(
																				`detailMr.${i}.tax`,
																				e.target.value
																			);
																		}}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	>
																		<option defaultValue='no data' selected>
																			Choose Type
																		</option>
																		<option
																			value='ppn'
																			selected={result.tax === "ppn"}
																		>
																			PPN
																		</option>
																		<option
																			value='pph'
																			selected={result.tax === "pph"}
																		>
																			PPH
																		</option>
																		<option
																			value='ppn_and_pph'
																			selected={result.tax === "ppn_and_pph"}
																		>
																			PPN dan PPH
																		</option>
																		<option value='nontax'>No Tax</option>
																	</InputSelect>
																</div>
																<div className='w-full'>
																	<InputSelect
																		id={`detailMr.${i}.supId`}
																		name={`detailMr.${i}.supId`}
																		placeholder='Suplier'
																		label='Suplier'
																		onChange={(e: any) => {
																			setFieldValue(
																				`detailMr.${i}.supId`,
																				e.target.value
																			);
																		}}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	>
																		<option value='no data' selected>
																			Choose Suplier
																		</option>
																		{listSupplier.length === 0 ? (
																			<option value='no data'>No data</option>
																		) : (
																			listSupplier.map(
																				(res: any, i: number) => {
																					return (
																						<option
																							value={res.id}
																							key={i}
																							selected={res.id === result.supId}
																						>
																							{res.supplier_name}
																						</option>
																					);
																				}
																			)
																		)}
																	</InputSelect>
																</div>
																<div className='w-full'>
																	<InputSelect
																		id={`detailMr.${i}.akunId`}
																		name={`detailMr.${i}.akunId`}
																		placeholder='Akun'
																		label='Akun'
																		onChange={(e: any) => {
																			setFieldValue(
																				`detailMr.${i}.akunId`,
																				e.target.value
																			);
																		}}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	>
																		<option value='no data' selected>
																			Choose Akun
																		</option>
																		{listCoa.length === 0 ? (
																			<option value='no data'>No data</option>
																		) : (
																			listCoa.map((res: any, i: number) => {
																				return (
																					<option
																						value={res.id}
																						key={i}
																						// selected={res.id === result.material}
																					>
																						{res.coa_name}
																					</option>
																				);
																			})
																		)}
																	</InputSelect>
																</div>
																<div className='w-full'>
																	<Input
																		id={`detailMr.${i}.material`}
																		name={`detailMr.${i}.material`}
																		placeholder='Part / Item'
																		label='Part / Item'
																		type='text'
																		value={result.material}
																		disabled={true}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
															</Section>
															<Section className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-4'>
																<div className='w-full'>
																	<Input
																		id={`detailMr.${i}.service`}
																		name={`detailMr.${i}.service`}
																		placeholder='Description Service'
																		label='Description Service'
																		type='text'
																		value={result.service}
																		disabled={true}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	<Input
																		id={`detailMr.${i}.qty`}
																		name={`detailMr.${i}.qty`}
																		placeholder='Qty'
																		label='Qty'
																		type='number'
																		value={result.qty}
																		onChange={(e: any) => {
																			setFieldValue(
																				`detailMr.${i}.total`,
																				totalHarga(
																					result.price,
																					e.target.value,
																					result.disc
																				)
																			);
																			setFieldValue(
																				`detailMr.${i}.qty`,
																				e.target.value
																			);
																		}}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	<InputSelect
																		id={`detailMr.${i}.currency`}
																		name={`detailMr.${i}.currency`}
																		placeholder='Currency'
																		label='Currency'
																		onChange={(e: any) => {
																			setFieldValue(
																				`detailMr.${i}.Currency`,
																				e.target.value
																			);
																		}}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	>
																		<option value='IDR' selected>
																			IDR
																		</option>
																		<option value='EUR'>EUR</option>
																		<option value='SGD'>SGD</option>
																		<option value='USD'>USD</option>
																		<option value='YEN'>YEN</option>
																	</InputSelect>
																</div>
																<div className='w-full'>
																	<Input
																		id={`detailMr.${i}.note`}
																		name={`detailMr.${i}.note`}
																		placeholder='Note'
																		label='Note'
																		type='text'
																		value={result.note}
																		disabled={true}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	<Input
																		id={`detailMr.${i}.price`}
																		name={`detailMr.${i}.price`}
																		placeholder='Price'
																		label='Price'
																		type='number'
																		onChange={(e: any) => {
																			setFieldValue(
																				`detailMr.${i}.total`,
																				totalHarga(
																					e.target.value,
																					result.qty,
																					result.disc
																				)
																			);
																			setFieldValue(
																				`detailMr.${i}.price`,
																				e.target.value
																			);
																		}}
																		value={result.price}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
															</Section>
															<Section className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-4'>
																<div className='w-full'>
																	<Input
																		id={`detailMr.${i}.disc`}
																		name={`detailMr.${i}.disc`}
																		placeholder='Discount'
																		label='Discount'
																		type='number'
																		onChange={(e: any) => {
																			setFieldValue(
																				`detailMr.${i}.total`,
																				totalHarga(
																					result.price,
																					result.qty,
																					e.target.value
																				)
																			);
																			setFieldValue(
																				`detailMr.${i}.disc`,
																				e.target.value
																			);
																		}}
																		value={result.disc}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	<Input
																		id={`detailMr.${i}.total`}
																		name={`detailMr.${i}.total`}
																		placeholder='Total Price'
																		label='Total Price'
																		type='number'
																		value={result.total}
																		disabled={true}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	{values.detailMr.length === 1 ? null : (
																		<a
																			className='inline-flex text-red-500 cursor-pointer mt-10'
																			onClick={() => {
																				arrayMr.remove(i);
																			}}
																		>
																			<Trash2 size={18} className='mr-1 mt-1' />{" "}
																			Remove Material Request
																		</a>
																	)}
																</div>
															</Section>
														</Disclosure.Panel>
													</div>
												)}
											</Disclosure>
										</div>
									);
								})
							}
						/>
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
