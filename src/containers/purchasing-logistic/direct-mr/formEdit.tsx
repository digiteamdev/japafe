import { useState, useEffect } from "react";
import { Section, Input, InputSelect, InputArea } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import {
	GetAllSupplier,
	GetAllMRPo,
	GetAllCoa,
	EditPrMr,
} from "../../../services";
import { toast } from "react-toastify";
import moment from "moment";
import { getIdUser } from "../../../configs/session";
import { ChevronDown, ChevronUp, Trash2 } from "react-feather";
import { Disclosure } from "@headlessui/react";

interface props {
	content: string;
	dataSelected: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	dateOfPurchase: any;
	idPurchase: string;
	note: string;
	id: string;
	detailMr: any;
}

export const FormEditDirectMr = ({
	content,
	dataSelected,
	showModal,
}: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listSupplier, setListSupplier] = useState<any>([]);
	const [listMr, setListMr] = useState<any>([]);
	const [listCoa, setListCoa] = useState<any>([]);
	const [userId, setUserId] = useState<string>("");
	const [idPR, setIdPR] = useState<string>("");
	const [data, setData] = useState<data>({
		dateOfPurchase: new Date(),
		idPurchase: "",
		note: "",
		id: "",
		detailMr: [],
	});

	useEffect(() => {
		let idUser = getIdUser();
		if (idUser !== undefined) {
			setUserId(idUser);
		}
		setIdPR(generateIdNum());
		getSupplier();
		// getMrPo();
		getCoa();
		settingData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		let detail: any = [];
		dataSelected.detailMr.map((res: any) => {
			detail.push({
				id: res.id,
				supId: res.supId,
				taxpr: res.taxpr,
				akunId: res.akunId,
				disc: res.disc,
				currency: res.currency,
				total: res.total,
				material: res.Material_Stock.spesifikasi,
				qty: res.qtyAppr,
				note: res.note,
				note_revision: res.note_revision,
				job_no: res.mr.job_no,
				no_mr: res.mr.no_mr,
				user: res.mr.user.employee.employee_name,
				price: res.price
			});
		});
		setData({
			dateOfPurchase: dataSelected.dateOfPurchase,
			idPurchase: dataSelected.idPurchase,
			id: dataSelected.id,
			note: dataSelected.note,
			detailMr: detail,
		});
	};

	const getMrPo = async () => {
		try {
			const response = await GetAllMRPo(1,1,"PO");
			if (response) {
				let detail: any = [];
				response.data.result.map((res: any, i: number) => {
					detail.push({
						id: res.id,
						supId: res.supId,
						taxpr: res.taxpr,
						akunId: res.akunId,
						disc: res.disc,
						currency: "IDR",
						total: res.Material_Stock.harga * res.qtyAppr,
						material: res.Material_Stock.spesifikasi,
						qty: res.qtyAppr,
						note: res.note,
						note_revision: res.note_revision,
						price: res.Material_Stock.harga,
						job_no: res.mr.job_no,
					});
				});
				setData({
					dateOfPurchase: new Date(),
					idPurchase: generateIdNum(),
					id: "",
					note: "",
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
			"PR" +
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 10000);
		return id;
	};

	const totalHarga = (harga: number, qty: number, disc: number) => {
		let totalHarga = harga * qty - disc;
		return totalHarga;
	};

	const purchaseMr = async (payload: data) => {
		setIsLoading(true);
		let listDetail: any = [];
		payload.detailMr.map((res: any) => {
			listDetail.push({
				id: res.id,
				supId: res.supId,
				taxpr: res.taxpr,
				akunId: res.akunId,
				currency: res.currency,
				qtyAppr: parseInt(res.qty),
				price: parseInt(res.price), 
				disc: parseInt(res.disc),
				total: parseInt(res.total)
			});
		});
		let data = {
			id: payload.id,
			note: payload.note,
			detailMr: listDetail,
		};
		try {
			const response = await EditPrMr(data);
			if (response.data) {
				toast.success("Edit Purchase Material Request Success", {
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
			toast.error("Edit Purchase Material Request Failed", {
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
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			<Formik
				initialValues={{ ...data }}
				// validationSchema={departemenSchema}
				onSubmit={(values) => {
					purchaseMr(values);
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
									value={values.idPurchase}
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
									value={moment(values.dateOfPurchase).format("DD-MMMM-YYYY")}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
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
																		id={`detailMr.${i}.no_mr`}
																		name={`detailMr.${i}.no_mr`}
																		placeholder='No MR'
																		label='No MR'
																		type='text'
																		value={result.no_mr}
																		disabled={true}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	<InputSelect
																		id={`detailMr.${i}.taxpr`}
																		name={`detailMr.${i}.taxpr`}
																		placeholder='Tax'
																		label='Tax'
																		onChange={(e: any) => {
																			setFieldValue(
																				`detailMr.${i}.taxpr`,
																				e.target.value
																			);
																		}}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	>
																		<option value='ppn' selected={ result.taxpr === 'ppn' ? true : false }>PPN</option>
																		<option value='noneppn' selected={ result.taxpr === 'noneppn' ? true : false }>Non PPN</option>
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
																		{listCoa.length === 0 ? (
																			<option value='no data'>No data</option>
																		) : (
																			listCoa.map((res: any, i: number) => {
																				return (
																					<option
																						value={res.id}
																						key={i}
																						selected={res.id === result.akunId}
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
																		placeholder='Material Name'
																		label='Material Name'
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
																		id={`detailMr.${i}.qty`}
																		name={`detailMr.${i}.qty`}
																		placeholder='Qty'
																		label='Qty'
																		type='number'
																		value={result.qty}
																		onChange={ (e: any) => {
																			setFieldValue(
																				`detailMr.${i}.total`,
																				totalHarga(
																					result.price,
																					e.target.value,
																					result.disc
																				)
																			);
																			setFieldValue(`detailMr.${i}.qty`, e.target.value)
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
																		value={result.price}
																		onChange={(e: any) => {
																			setFieldValue(
																				`detailMr.${i}.total`,
																				totalHarga(
																					e.target.value,
																					result.qty,
																					result.disc
																				)
																			);
																			setFieldValue(`detailMr.${i}.price`, e.target.value)
																		}}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
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
															</Section>
															<Section className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-4'>
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
																	<Input
																		id={`detailMr.${i}.user`}
																		name={`detailMr.${i}.user`}
																		placeholder='Request By'
																		label='Request By'
																		type='text'
																		value={result.user}
																		disabled={true}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																{ result.note_revision === null ? null : (
																	<div className='w-full'>
																		<Input
																			id={`detailMr.${i}.note_revision`}
																			name={`detailMr.${i}.note_revision`}
																			placeholder='Note Revision'
																			label='Note Revision'
																			type='text'
																			value={result.note_revision}
																			disabled={true}
																			required={true}
																			withLabel={true}
																			className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																		/>
																	</div>
																) }
																{/* <div className='w-full'>
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
																</div> */}
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
