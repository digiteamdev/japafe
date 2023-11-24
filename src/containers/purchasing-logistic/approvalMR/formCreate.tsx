import { useState, useEffect } from "react";
import { Section, Input, InputSelect } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import {
	GetMRForApproval,
	GetAllSupplier,
	GetMrValid,
	ApprovalMr,
} from "../../../services";
import { Disclosure } from "@headlessui/react";
import { toast } from "react-toastify";
import moment from "moment";
import { getIdUser } from "../../../configs/session";
import { ChevronDown, ChevronUp, Trash2 } from "react-feather";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	id: string;
	idMrAppr: string;
	dateOfAppr: any;
	approveById: string;
	detailMr: [
		{
			id: string;
			mrappr: string;
			supId: string;
			material: string;
			qty: string;
			note: string;
			qtyAppr: number;
			no_mr: string;
			job_no: string;
			stock: string;
			user: string;
		}
	];
}

export const FormCreateApprovalMr = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listSupplier, setListSupplier] = useState<any>([]);
	const [listMr, setListMr] = useState<any>([]);
	const [isDetail, setIsDetail] = useState<boolean>(false);
	const [user, setUser] = useState<string>("");
	const [userId, setUserId] = useState<string>("");
	const [IdApproval, setIdApproval] = useState<string>("");
	const [jobNo, setJobNo] = useState<string>("");
	const [data, setData] = useState<data>({
		id: "",
		idMrAppr: "",
		dateOfAppr: "",
		approveById: "",
		detailMr: [
			{
				id: "",
				mrappr: "",
				supId: "",
				material: "",
				qty: "",
				note: "",
				qtyAppr: 0,
				no_mr: "",
				job_no: "",
				stock: "",
				user: "",
			},
		],
	});

	useEffect(() => {
		let idUser = getIdUser();
		if (idUser !== undefined) {
			setUserId(idUser);
		}
		getSupplier();
		getMr();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getMr = async () => {
		try {
			const response = await GetMRForApproval();
			if (response) {
				let detail: any = [];
				let idAppr: string = generateIdNum();
				response.data.result.map((res: any) => {
					detail.push({
						id: res.id,
						mrappr: res.mrappr,
						supId: res.supId,
						material:
							res.Material_Stock.Material_master.material_name +
							" - " +
							res.Material_Stock.spesifikasi,
						qty: res.qty,
						note: res.note,
						qtyAppr: 0,
						no_mr: res.mr.no_mr,
						job_no: res.mr.wor.job_operational
							? res.mr.wor.job_no_mr
							: res.mr.wor.job_no,
						stock: res.Material_Stock.jumlah_Stock,
						user: res.mr.user.employee.employee_name,
					});
				});
				setIdApproval(idAppr);
				setData({
					id: "",
					idMrAppr: idAppr,
					dateOfAppr: new Date(),
					approveById: userId,
					detailMr: detail,
				});
			}
		} catch (error) {}
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
			"MP" +
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 10000);
		return id;
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name === "no_mr") {
			if (event.target.value !== "no data") {
				let data = JSON.parse(event.target.value);
				let detail: any = [];
				data.detailMr.map((res: any) => {
					detail.push({
						id: res.id,
						mrappr: "",
						supId: "",
						material: res.Material_Stock.spesifikasi,
						qty: res.qty,
						note: res.note,
						qtyAppr: res.qtyAppr,
					});
				});
				setData({
					id: data.id,
					idMrAppr: generateIdNum(),
					dateOfAppr: new Date(),
					approveById: userId,
					detailMr: detail,
				});
				setUser(data.user.employee.employee_name);
				setJobNo(data.bom === null ? data.wor.job_no_mr : data.wor.job_no);
				setIsDetail(true);
			} else {
				setUser("");
				setJobNo("");
				setIsDetail(false);
			}
		}
	};

	const approveMr = async (payload: data) => {
		setIsLoading(true);
		let listDetail: any = [];
		payload.detailMr.map((res: any) => {
			listDetail.push({
				id: res.id,
				mrappr: res.mrappr,
				supId: res.supId,
				qtyAppr: parseInt(res.qtyAppr),
			});
		});
		let data = {
			// id: payload.id,
			idApprove: payload.idMrAppr,
			dateApprove: new Date(),
			approveById: userId,
			detailMr: listDetail,
		};
		try {
			const response = await ApprovalMr(data);
			if (response.data) {
				toast.success("Approval Material Request Success", {
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
			toast.error("Approval Material Request Failed", {
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
					approveMr(values);
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
						<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='idApproval'
									name='idApproval'
									placeholder='ID Approval'
									label='ID Approval'
									type='text'
									value={IdApproval}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='requestBy'
									name='requestBy'
									placeholder='Date Of Approve'
									label='Date Of Approve'
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
											<Section className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-4'>
												<div className='w-full'>
													<Input
														id={`detailMr.${i}.no_mr`}
														name={`detailMr.${i}.no_mr`}
														placeholder='No MR'
														label='No MR'
														type='string'
														disabled={true}
														value={result.no_mr}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<InputSelect
														id={`detailMr.${i}.mrappr`}
														name={`detailMr.${i}.mrappr`}
														placeholder='Type'
														label='Type'
														onChange={(e: any) => {
															setFieldValue(
																`detailMr.${i}.mrappr`,
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
														<option value='PO'>PO</option>
														<option value='DP'>DP</option>
														<option value='Stock'>Stock</option>
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
															listSupplier.map((res: any, i: number) => {
																return (
																	<option
																		value={res.id}
																		key={i}
																		// selected={res.id === result.material}
																	>
																		{res.supplier_name}
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
												<div className='w-full'>
													<Input
														id={`detailMr.${i}.user`}
														name={`detailMr.${i}.user`}
														placeholder='Request By'
														label='Request By'
														type='string'
														value={result.user}
														disabled={true}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
											</Section>
											<Section className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-4 border-b border-b-gray-500 pb-2'>
												<div className='w-full'>
													<Input
														id={`detailMr.${i}.qty`}
														name={`detailMr.${i}.qty`}
														placeholder='Qty'
														label='Qty'
														type='number'
														value={result.qty}
														disabled={true}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<Input
														id={`detailMr.${i}.stock`}
														name={`detailMr.${i}.stock`}
														placeholder='Stock'
														label='Stock'
														type='number'
														disabled={true}
														value={result.stock}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<Input
														id={`detailMr.${i}.qtyAppr`}
														name={`detailMr.${i}.qtyAppr`}
														placeholder='Qty Approval'
														label='Qty Approval'
														type='number'
														onChange={(e: any) => {
															setFieldValue(
																`detailMr.${i}.qtyAppr`,
																e.target.value
															);
														}}
														value={result.qtyAppr}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<Input
														id={`detailMr.${i}.note`}
														name={`detailMr.${i}.note`}
														placeholder='Note'
														label='Note'
														type='text'
														value={result.note}
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
															<Trash2 size={18} className='mr-1 mt-1' /> Remove
															Material Request
														</a>
													)}
												</div>
											</Section>
											{/* <Disclosure defaultOpen>
												{({ open }) => (
													<div>
														<Disclosure.Button className='flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 mt-2'>
															<h4 className='text-lg font-bold'>
																No MR : {result.no_mr}
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
																		type='string'
																		disabled={true}
																		value={result.no_mr}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	<InputSelect
																		id={`detailMr.${i}.mrappr`}
																		name={`detailMr.${i}.mrappr`}
																		placeholder='Type'
																		label='Type'
																		onChange={(e: any) => {
																			setFieldValue(
																				`detailMr.${i}.mrappr`,
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
																		<option value='PO'>PO</option>
																		<option value='DP'>DP</option>
																		<option value='Stock'>Stock</option>
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
																							// selected={res.id === result.material}
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
																<div className='w-full'>
																	<Input
																		id={`detailMr.${i}.user`}
																		name={`detailMr.${i}.user`}
																		placeholder='Request By'
																		label='Request By'
																		type='string'
																		value={result.user}
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
																		disabled={true}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	<Input
																		id={`detailMr.${i}.stock`}
																		name={`detailMr.${i}.stock`}
																		placeholder='Stock'
																		label='Stock'
																		type='number'
																		disabled={true}
																		value={result.stock}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	<Input
																		id={`detailMr.${i}.qtyAppr`}
																		name={`detailMr.${i}.qtyAppr`}
																		placeholder='Qty Approval'
																		label='Qty Approval'
																		type='number'
																		onChange={(e: any) => {
																			setFieldValue(
																				`detailMr.${i}.qtyAppr`,
																				e.target.value
																			);
																		}}
																		value={result.qtyAppr}
																		required={true}
																		withLabel={true}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																	/>
																</div>
																<div className='w-full'>
																	<Input
																		id={`detailMr.${i}.note`}
																		name={`detailMr.${i}.note`}
																		placeholder='Note'
																		label='Note'
																		type='text'
																		value={result.note}
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
											</Disclosure> */}
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
									) : (
										"Approval"
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
