import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputSelectSearch,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { GetPurchase, AddPurchaseReceive } from "../../../services";
import { toast } from "react-toastify";
import moment from "moment";
import { getIdUser } from "../../../configs/session";
import { ChevronDown, ChevronUp, Trash2, Plus } from "react-feather";
import { Disclosure } from "@headlessui/react";
import { formatRupiah } from "@/src/utils";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	id: string;
	date_receive: any;
	id_receive: string;
	detailMr: any;
	srDetail: any;
}

export const FormCreatePurchaseReceive = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listPurchase, setListPurchase] = useState<any>([]);
	const [PurchaseDate, setPurchaseDate] = useState<any>(null);
	const [suplier, setSuplier] = useState<string>("");
	const [type, setType] = useState<string>("");
	const [suplierAddress, setSuplierAddress] = useState<string>("");
	const [suplierPhone, setSuplierPhone] = useState<string>("");
	const [suplierFax, setSuplierFax] = useState<string>("");
	const [idPurchase, setIdPurchase] = useState<string>("");
	const [idPR, setIdPR] = useState<string>("");
	const [data, setData] = useState<data>({
		id: "",
		date_receive: new Date(),
		id_receive: "",
		detailMr: [],
		srDetail: [],
	});

	useEffect(() => {
		setIdPR(generateIdNum());
		getPurchase();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getPurchase = async () => {
		let dataList: any = [];
		try {
			const response = await GetPurchase();
			if (response) {
				response.data.result.map((res: any) => {
					dataList.push({
						value: res,
						type: res.id_so ? "po" : "pu",
						label: res.id_so ? res.id_so : res.idPurchase,
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

	const addReceive = async (payload: any) => {
		setIsLoading(true);
		let mr: any = [];
		let sr: any = [];
		const formData = new FormData();
		payload.detailMr.map((res: any) => {
			console.log(res)
			mr.push({
				id: res.id,
				qty_receive: parseInt(res.qty_receive),
				status_stock: res.status_stock === "" ? "non" : res.status_stock,
			});
			if(res.file_receive){
				formData.append("file_receive", res.file_receive)
			}
		});
		payload.srDetail.map((res: any) => {
			sr.push({
				id: res.id,
				qty_receive: res.qtyAppr,
			});
		});
		// let data: any = {
		// 	id: idPurchase,
		// 	type: type,
		// 	date_receive: payload.date_receive,
		// 	id_receive: idPR,
		// 	detailMr: mr,
		// 	srDetail: sr,
		// };
		formData.append("id", idPurchase);
		formData.append("type", type);
		formData.append("date_receive", payload.date_receive);
		formData.append("id_receive", idPR);
		formData.append("detailMr", JSON.stringify(mr));
		formData.append("SrDetail", JSON.stringify(sr));
		if (idPurchase === "") {
			toast.warning("Choice Purchase Number", {
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
			try {
				const response = await AddPurchaseReceive(formData);
				if (response) {
					toast.success("Purchase Receive Success", {
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
				toast.error("Purchase Receive Failed", {
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

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto  h-[calc(100vh-100px)]'>
			<Formik
				initialValues={{ ...data }}
				// validationSchema={departemenSchema}
				onSubmit={(values) => {
					addReceive(values);
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
						<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='id_receive'
									name='id_receive'
									placeholder='ID Receive'
									label='ID Receive'
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
									id='date_receive'
									name='date_receive'
									placeholder='Date Of Receive'
									label='Date Of Receive'
									type='text'
									value={moment(values.date_receive).format("DD-MMMM-YYYY")}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
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
										setType(e.type);
										if (e.type === "po") {
											setIdPurchase(e.value.id);
											setPurchaseDate(e.value.date_prepared);
											setSuplier(e.value.supplier.supplier_name);
											setSuplierAddress(
												`${e.value.supplier.addresses_sup} - ${e.value.supplier.cities}`
											);
											setSuplierPhone(
												`${
													e.value.supplier.SupplierContact.length === 0
														? ""
														: `+62${e.value.supplier.SupplierContact[0].phone}`
												}`
											);
											setSuplierFax(e.value.supplier.fax);
											if (e.value.detailMr.length > 0) {
												setFieldValue("detailMr", e.value.detailMr);
												setFieldValue("srDetail", []);
											} else {
												setFieldValue("srDetail", e.value.SrDetail);
												setFieldValue("detailMr", []);
											}
										} else {
											setIdPurchase(e.value.id);
											if (e.value.detailMr.length > 0) {
												setFieldValue("detailMr", e.value.detailMr);
												setFieldValue("srDetail", []);
											} else {
												setFieldValue("srDetail", e.value.SrDetail);
												setFieldValue("detailMr", []);
											}
										}
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
							</div>
						</Section>
						{type === "po" ? (
							<>
								<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<Input
											id='purchase_date'
											name='purchase_date'
											placeholder='Purchase Date'
											label='Purchase Date'
											type='text'
											value={
												PurchaseDate === null
													? ""
													: moment(PurchaseDate).format("DD-MMMM-YYYY")
											}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<Input
											id='suplier'
											name='suplier'
											placeholder='Suplier / Vendor'
											label='Suplier / Vendor'
											type='text'
											value={suplier}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<Input
											id='idPurchase'
											name='idPurchase'
											placeholder='Suplier DO'
											label='Suplier DO'
											type='text'
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
								</Section>
								<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<Input
											id='address'
											name='address'
											placeholder='Address'
											label='Address'
											type='text'
											value={suplierAddress}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<Input
											id='phone'
											name='phone'
											placeholder='Phone'
											label='Phone'
											type='text'
											value={suplierPhone}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<Input
											id='fax'
											name='fax'
											placeholder='Fax'
											label='Fax'
											type='text'
											value={suplierFax}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
								</Section>
								<div className='w-full mt-4'>
									<h5 className='font-semibold text-lg'>Detail Purchase</h5>
									{values.detailMr.length > 0 ? (
										<FieldArray
											name='detailMr'
											render={(arrayMr) => {
												return values.detailMr.map((res: any, i: number) => {
													return (
														<Section
															className='grid md:grid-cols-5 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'
															key={i}
														>
															<div className='w-full'>
																<Input
																	id={`detailMr.${i}.job_no`}
																	name={`detailMr.${i}.job_no`}
																	placeholder='Job No'
																	label='Job No'
																	type='text'
																	value={res.mr.job_no}
																	disabled={true}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div>
															<div className='w-full'>
																<Input
																	id={`detailMr.${i}.material`}
																	name={`detailMr.${i}.material`}
																	placeholder='Material Name'
																	label='Material Name'
																	type='text'
																	value={`${res.Material_Master.name} ${
																		res.Material_Master.spesifikasi
																			? res.Material_Master.spesifikasi
																			: ""
																	}`}
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
																	placeholder='Qty Purchase'
																	label='Qty Purchase'
																	type='text'
																	value={res.qtyAppr}
																	disabled={true}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div>
															<div className='w-full'>
																<Input
																	id={`detailMr.${i}.qty_receive`}
																	name={`detailMr.${i}.qty_receive`}
																	placeholder='Qty Receive'
																	label='Qty Receive'
																	type='number'
																	value={res.qty_receive}
																	onChange={(e: any) => {
																		setFieldValue(
																			`detailMr.${i}.qty_receive`,
																			e.target.value
																		);
																	}}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div>
															<div className='w-full'>
																<Input
																	id={`detailMr.${i}.file_receive`}
																	name={`detailMr.${i}.file_receive`}
																	placeholder='File'
																	label='File'
																	type='file'
																	accept='image/*, .pdf'
																	onChange={(e: any) =>
																		setFieldValue(
																			`detailMr.${i}.file_receive`,
																			e.target.files[0]
																		)
																	}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div>
															<div className='w-full'>
																{i > 0 ? (
																	<a
																		className='inline-flex text-red-500 cursor-pointer text-xl mt-8'
																		onClick={() => {
																			arrayMr.remove(i);
																		}}
																	>
																		<Trash2 size={22} className='mr-1 mt-1' />{" "}
																		Remove
																	</a>
																) : null}
															</div>
														</Section>
													);
												});
											}}
										/>
									) : null}
									{values.srDetail.length > 0 ? (
										<FieldArray
											name='srDetail'
											render={(arraySr) => {
												return values.srDetail.map((res: any, i: number) => {
													return (
														<Section
															className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'
															key={i}
														>
															<div className='w-full'>
																<Input
																	id={`srDetail.${i}.job_no`}
																	name={`srDetail.${i}.job_no`}
																	placeholder='Job No'
																	label='Job No'
																	type='text'
																	value={res.sr.job_no}
																	disabled={true}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div>
															{/* <div className='w-full'>
																<Input
																	id={`srDetail.${i}.part`}
																	name={`srDetail.${i}.part`}
																	placeholder='Part Name'
																	label='Part Name'
																	type='text'
																	value={res.part}
																	disabled={true}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div> */}
															<div className='w-full'>
																<Input
																	id={`srDetail.${i}.description`}
																	name={`srDetail.${i}.description`}
																	placeholder='Service Description'
																	label='Service Description'
																	type='text'
																	value={res.desc}
																	disabled={true}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div>
															<div className='w-full'>
																<Input
																	id={`srDetail.${i}.qty`}
																	name={`srDetail.${i}.qty`}
																	placeholder='Qty'
																	label='Qty'
																	type='number'
																	value={res.qtyAppr}
																	disabled={true}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div>
															<div className='w-full'>
																<Input
																	id={`srDetail.${i}.qty_receive`}
																	name={`srDetail.${i}.qty_receive`}
																	placeholder='Qty Receive'
																	label='Qty Receive'
																	type='number'
																	value={res.qty_receive}
																	onChange={(e: any) => {
																		setFieldValue(
																			`srDetail.${i}.qty_receive`,
																			e.target.value
																		);
																	}}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div>
															<div className='w-full'>
																{i > 0 ? (
																	<a
																		className='inline-flex text-red-500 cursor-pointer text-xl mt-8'
																		onClick={() => {
																			arraySr.remove(i);
																		}}
																	>
																		<Trash2 size={22} className='mr-1 mt-1' />{" "}
																		Remove
																	</a>
																) : null}
															</div>
														</Section>
													);
												});
											}}
										/>
									) : null}
								</div>
								{values.detailMr.length === 0 &&
								values.srDetail.length === 0 ? null : (
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
							</>
						) : (
							<>
								<div className='w-full mt-4'>
									<h5 className='font-semibold text-lg'>Detail Purchase</h5>
									{values.detailMr.length > 0 ? (
										<FieldArray
											name='detailMr'
											render={(arrayMr) => {
												return values.detailMr.map((res: any, i: number) => {
													return (
														<Section
															className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'
															key={i}
														>
															<div className='w-full'>
																<Input
																	id={`detailMr.${i}.job_no`}
																	name={`detailMr.${i}.job_no`}
																	placeholder='Job No'
																	label='Job No'
																	type='text'
																	value={res.mr.job_no}
																	disabled={true}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div>
															<div className='w-full'>
																<Input
																	id={`detailMr.${i}.material`}
																	name={`detailMr.${i}.material`}
																	placeholder='Material Name'
																	label='Material Name'
																	type='text'
																	value={`${res.Material_Master.name} ${res.Material_Master.spesifikasi}`}
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
																	placeholder='Qty Purchase'
																	label='Qty Purchase'
																	type='text'
																	value={res.qtyAppr}
																	disabled={true}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div>
															<div className='w-full'>
																<Input
																	id={`detailMr.${i}.qty_receive`}
																	name={`detailMr.${i}.qty_receive`}
																	placeholder='Qty Receive'
																	label='Qty Receive'
																	type='number'
																	value={res.qty_receive}
																	onChange={(e: any) => {
																		setFieldValue(
																			`detailMr.${i}.qty_receive`,
																			e.target.value
																		);
																	}}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div>
															{/* <div className='w-full'>
																<InputSelect
																	id={`detailMr.${i}.status_stock`}
																	name={`detailMr.${i}.status_stock`}
																	placeholder='Status'
																	label='Status'
																	onChange={(e:any) => {
																		setFieldValue(`detailMr.${i}.status_stock`, e.target.value)
																	}}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																>
																	<option value='non' selected>
																		Non
																	</option>
																	<option value='stock'>Stock</option>
																</InputSelect>
															</div> */}
															<div className='w-full'>
																{i > 0 ? (
																	<a
																		className='inline-flex text-red-500 cursor-pointer text-xl mt-8'
																		onClick={() => {
																			arrayMr.remove(i);
																		}}
																	>
																		<Trash2 size={22} className='mr-1 mt-1' />{" "}
																		Remove
																	</a>
																) : null}
															</div>
														</Section>
													);
												});
											}}
										/>
									) : null}
									{values.srDetail.length > 0 ? (
										<FieldArray
											name='srDetail'
											render={(arraySr) => {
												return values.srDetail.map((res: any, i: number) => {
													return (
														<Section
															className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'
															key={i}
														>
															<div className='w-full'>
																<Input
																	id={`srDetail.${i}.job_no`}
																	name={`srDetail.${i}.job_no`}
																	placeholder='Job No'
																	label='Job No'
																	type='text'
																	value={res.sr.job_no}
																	disabled={true}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div>
															{/* <div className='w-full'>
																<Input
																	id={`srDetail.${i}.part`}
																	name={`srDetail.${i}.part`}
																	placeholder='Part Name'
																	label='Part Name'
																	type='text'
																	value={res.part}
																	disabled={true}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div> */}
															<div className='w-full'>
																<Input
																	id={`srDetail.${i}.description`}
																	name={`srDetail.${i}.description`}
																	placeholder='Service Description'
																	label='Service Description'
																	type='text'
																	value={res.desc}
																	disabled={true}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div>
															<div className='w-full'>
																<Input
																	id={`srDetail.${i}.qty`}
																	name={`srDetail.${i}.qty`}
																	placeholder='Qty'
																	label='Qty'
																	type='number'
																	value={res.qtyAppr}
																	disabled={true}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div>
															<div className='w-full'>
																<Input
																	id={`srDetail.${i}.qty_receive`}
																	name={`srDetail.${i}.qty_receive`}
																	placeholder='Qty Receive'
																	label='Qty Receive'
																	type='number'
																	value={res.qty_receive}
																	onChange={(e: any) => {
																		setFieldValue(
																			`srDetail.${i}.qty_receive`,
																			e.target.value
																		);
																	}}
																	required={true}
																	withLabel={true}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</div>
															<div className='w-full'>
																{i > 0 ? (
																	<a
																		className='inline-flex text-red-500 cursor-pointer text-xl mt-8'
																		onClick={() => {
																			arraySr.remove(i);
																		}}
																	>
																		<Trash2 size={22} className='mr-1 mt-1' />{" "}
																		Remove
																	</a>
																) : null}
															</div>
														</Section>
													);
												});
											}}
										/>
									) : null}
								</div>
								{values.detailMr.length === 0 &&
								values.srDetail.length === 0 ? null : (
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
							</>
						)}
					</Form>
				)}
			</Formik>
		</div>
	);
};
