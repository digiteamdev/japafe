import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import moment from "moment";
import {
	Input,
	InputSelect,
	Section,
} from "../../../components";
import { FieldArray, Form, Formik } from "formik";
import { getIdUser } from "@/src/configs/session";
import { ApprovalMr, GetMrId } from "@/src/services";
import { toast } from "react-toastify";
import { ArrowLeft, Check, Printer, Send } from "react-feather";

export const ViewApprovalMR = () => {
	const router = useRouter();
	const params = useParams<{ id: string }>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [userId, setUserId] = useState<string>("");
	const [data, setData] = useState<any>(null);

	useEffect(() => {
		let idUser = getIdUser();
		if (idUser !== undefined) {
			setUserId(idUser);
		}
		if (params) {
			getMrById(params.id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params]);

	const getMrById = async (id: string) => {
		setIsLoading(true);
		try {
			const response = await GetMrId(id);
			if (response.data) {
				let listDetail: any = [];
				response.data.result.detailMr.map((res: any) => {
					let stock: any = 0;
					res.Material_Main?.Material_Master?.map((spek: any) => {
						if(spek.name == res.spesifikasi){
							stock = spek.jumlah_Stock
						}
					})
					listDetail.push({
						id: res.id,
						mrappr: res.mrappr,
						supId: res.supId,
						material: res.name_material,
						spesifikasi: res.spesifikasi,
						qty: res.qty,
						stock: stock,
						note: res.note,
						qtyAppr: res.qty,
						file: res.file,
					});
				});
				setData({
					...response.data.result,
					detailMr: listDetail,
				});
			}
		} catch (error: any) {
			setData(undefined);
		}
		setIsLoading(false);
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

	const approveMr = async (payload: any) => {
		setIsLoading(true);
		let listDetail: any = [];
		let remove: any = [];
		let isWarning: boolean = false;
		payload.detailMr.map((res: any) => {
			if (res.mrappr !== null) {
				if (res.mrappr === "Remove") {
					remove.push({
						id: res.id,
					});
				} else {
					listDetail.push({
						id: res.id,
						mrappr: res.mrappr,
						name_material: res.material,
						spesifikasi: res.spesifikasi,
						// supId: res.supId,
						qtyAppr: parseInt(res.qtyAppr),
					});
				}
				isWarning = false;
			}
		});
		let data = {
			// id: payload.id,
			idApprove: generateIdNum(),
			dateApprove: new Date(),
			approveById: userId,
			detailMr: listDetail,
			delete: remove,
		};
		if (!isWarning) {
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
					router.push("/purchasing-logistic/approval-mr");
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
		}
		setIsLoading(false);
	};

	return (
		<div className='mt-14 lg:mt-20 md:mt-20 sm:mt-20 xs:mt-24'>
			{isLoading ? (
				<div className='w-full text-center'>
					<>
						<svg
							role='status'
							className='inline mr-3 w-4 h-4 text-black animate-spin'
							viewBox='0 0 100 101'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
								fill='#000000'
							/>
							<path
								d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
								fill='currentColor'
							/>
						</svg>
						Loading
					</>
				</div>
			) : data ? (
				<>
					<div className='grid sm:grid-cols-1 md:grid-cols-2 gap-2'>
						<div className='flex items-center w-full'>
							<div className='bg-red-200 p-[12px] flex justify-center items-center rounded-[23px]'>
								<Send className='w-[36px] h-[36px]' />
							</div>
							<div className='ml-[13px]'>
								<h1 className='text-3xl font-bold'>Material Request</h1>
							</div>
						</div>
					</div>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Job No
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{data.job_no}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										No MR
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{data.no_mr}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Date MR
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{moment(data.date_mr).format("DD-MMMM-YYYY")}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Request By
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{data.user.employee.employee_name}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Departement
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{data.user.employee.sub_depart.name}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl py-2'>Detail Material Request</h1>
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
							<Form>
								<FieldArray
									name='detailMr'
									render={
										(arrayMr) => (
											<table className='w-full'>
												<thead>
													<tr>
														<th className='text-center'>Material</th>
														<th className='text-center'>Spesification</th>
														<th className='text-center'>Type</th>
														<th className='text-center'>Qty</th>
														<th className='text-center'>Qty Approval</th>
														<th className='text-center'>Stock</th>
														<th className='text-center'>Note</th>
														<th className='text-center'>File</th>
													</tr>
												</thead>
												<tbody>
													{values.detailMr.map((result: any, i: number) => {
														return (
															<tr key={i}>
																<td className='pr-1 w-[20%]'>
																	<Input
																		id={`detailMr.${i}.material`}
																		name={`detailMr.${i}.material`}
																		placeholder='Material Name'
																		label='Material Name'
																		type='text'
																		value={result.material}
																		onChange={(e: any) => {
																			setFieldValue(
																				`detailMr.${i}.material`,
																				e.target.value
																			);
																		}}
																		disabled={false}
																		required={true}
																		withLabel={false}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-xs rounded-lg block w-full p-2 outline-primary-600'
																	/>
																</td>
																<td className='pr-1 w-[20%]'>
																	<Input
																		id={`detailMr.${i}.spesifikasi`}
																		name={`detailMr.${i}.spesifikasi`}
																		placeholder='Spesification'
																		label='Spesification'
																		type='text'
																		value={result.spesifikasi}
																		onChange={(e: any) => {
																			setFieldValue(
																				`detailMr.${i}.spesifikasi`,
																				e.target.value
																			);
																		}}
																		disabled={false}
																		required={true}
																		withLabel={false}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-xs rounded-lg block w-full p-2 outline-primary-600'
																	/>
																</td>
																<td className='pr-1 w-[10%]'>
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
																		withLabel={false}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-xs rounded-lg block w-full p-2 outline-primary-600'
																	>
																		<option defaultValue='no data' selected>
																			Choose Type
																		</option>
																		<option value='PO'>PO</option>
																		<option value='DP'>DP</option>
																		<option
																			value='Stock'
																			disabled={
																				result.stock === 0 ? true : false
																			}
																		>
																			Stock
																		</option>
																		<option value='Remove'>Remove</option>
																	</InputSelect>
																</td>
																<td className='pr-1 w-[5%]'>
																	<Input
																		id={`detailMr.${i}.qty`}
																		name={`detailMr.${i}.qty`}
																		placeholder='Stock'
																		label='Stock'
																		type='number'
																		disabled={true}
																		value={result.qty}
																		required={true}
																		withLabel={false}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-xs rounded-lg w-full block p-2 outline-primary-600 text-center'
																	/>
																</td>
																<td className='pr-1 w-[10%]'>
																	<Input
																		id={`detailMr.${i}.qtyAppr`}
																		name={`detailMr.${i}.qtyAppr`}
																		placeholder='Qty Appr'
																		label='Stock'
																		type='number'
																		disabled={false}
																		value={result.qtyAppr}
																		onChange={(e: any) => {
																			setFieldValue(
																				`detailMr.${i}.qtyAppr`,
																				e.target.value
																			);
																		}}
																		required={true}
																		withLabel={false}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-xs rounded-lg w-full block p-2 outline-primary-600 text-center'
																	/>
																</td>
																<td className='pr-1 w-[5%]'>
																	<Input
																		id={`detailMr.${i}.stock`}
																		name={`detailMr.${i}.stock`}
																		placeholder='Stock'
																		label='Stock'
																		type='number'
																		disabled={true}
																		value={result.stock}
																		required={true}
																		withLabel={false}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-xs rounded-lg block w-full p-2 outline-primary-600 text-center'
																	/>
																</td>
																<td className='w-[20%]'>
																	<Input
																		id={`detailMr.${i}.note`}
																		name={`detailMr.${i}.note`}
																		placeholder='Note'
																		label='Note'
																		type='text'
																		disabled={true}
																		value={result.note}
																		required={true}
																		withLabel={false}
																		className='bg-white border border-primary-300 text-gray-900 sm:text-xs rounded-lg block w-full p-2 outline-primary-600'
																	/>
																</td>
																<td className='w-[10%] text-center'>
																	{result.file ? (
																		<a
																			href={result.file}
																			target='_blank'
																			className='text-blue-500 underline hover:text-blue-700'
																		>
																			Show File
																		</a>
																	) : (
																		"-"
																	)}
																</td>
															</tr>
														);
													})}
												</tbody>
											</table>
										)
										// values.detailMr.map((result: any, i: number) => {
										// 	return (
										// 		<div key={i}>
										// 			<Section className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-4'>
										// 				<div className='w-full'>
										// 					<Input
										// 						id={`detailMr.${i}.no_mr`}
										// 						name={`detailMr.${i}.no_mr`}
										// 						placeholder='No MR'
										// 						label='No MR'
										// 						type='string'
										// 						disabled={true}
										// 						value={result.no_mr}
										// 						required={true}
										// 						withLabel={true}
										// 						className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										// 					/>
										// 				</div>
										// 				<div className='w-full'>
										// 					<InputSelect
										// 						id={`detailMr.${i}.mrappr`}
										// 						name={`detailMr.${i}.mrappr`}
										// 						placeholder='Type'
										// 						label='Type'
										// 						onChange={(e: any) => {
										// 							setFieldValue(
										// 								`detailMr.${i}.mrappr`,
										// 								e.target.value
										// 							);
										// 						}}
										// 						required={true}
										// 						withLabel={true}
										// 						className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										// 					>
										// 						<option defaultValue='no data' selected>
										// 							Choose Type
										// 						</option>
										// 						<option value='PO'>PO</option>
										// 						<option value='DP'>DP</option>
										// 						<option value='Stock'>Stock</option>
										// 					</InputSelect>
										// 				</div>
										// 				<div className='w-full'>
										// 					<InputSelectSearch
										// 						datas={listSupplier}
										// 						id='supId'
										// 						name='supId'
										// 						placeholder='Supplier'
										// 						label='Supplier'
										// 						onChange={(e: any) => {
										// 							setFieldValue(
										// 								`detailMr.${i}.supId`,
										// 								e.value.id
										// 							);
										// 						}}
										// 						required={true}
										// 						withLabel={true}
										// 						className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
										// 					/>
										// 				</div>
										// 				<div className='w-full'>
										// 					<Input
										// 						id={`detailMr.${i}.material`}
										// 						name={`detailMr.${i}.material`}
										// 						placeholder='Material Name'
										// 						label='Material Name'
										// 						type='text'
										// 						value={result.material}
										// 						disabled={true}
										// 						required={true}
										// 						withLabel={true}
										// 						className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										// 					/>
										// 				</div>
										// 				<div className='w-full'>
										// 					<Input
										// 						id={`detailMr.${i}.user`}
										// 						name={`detailMr.${i}.user`}
										// 						placeholder='Request By'
										// 						label='Request By'
										// 						type='string'
										// 						value={result.user}
										// 						disabled={true}
										// 						required={true}
										// 						withLabel={true}
										// 						className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										// 					/>
										// 				</div>
										// 			</Section>
										// 			<Section className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-4 border-b-[3px] border-b-red-500 pb-2'>
										// 				<div className='w-full'>
										// 					<Input
										// 						id={`detailMr.${i}.qty`}
										// 						name={`detailMr.${i}.qty`}
										// 						placeholder='Qty'
										// 						label='Qty'
										// 						type='number'
										// 						value={result.qty}
										// 						disabled={true}
										// 						required={true}
										// 						withLabel={true}
										// 						className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										// 					/>
										// 				</div>
										// 				<div className='w-full'>
										// 					<Input
										// 						id={`detailMr.${i}.stock`}
										// 						name={`detailMr.${i}.stock`}
										// 						placeholder='Stock'
										// 						label='Stock'
										// 						type='number'
										// 						disabled={true}
										// 						value={result.stock}
										// 						required={true}
										// 						withLabel={true}
										// 						className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										// 					/>
										// 				</div>
										// 				<div className='w-full'>
										// 					<Input
										// 						id={`detailMr.${i}.qtyAppr`}
										// 						name={`detailMr.${i}.qtyAppr`}
										// 						placeholder='Qty Approval'
										// 						label='Qty Approval'
										// 						type='number'
										// 						onChange={(e: any) => {
										// 							setFieldValue(
										// 								`detailMr.${i}.qtyAppr`,
										// 								e.target.value
										// 							);
										// 						}}
										// 						value={result.qtyAppr}
										// 						required={true}
										// 						withLabel={true}
										// 						className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										// 					/>
										// 				</div>
										// 				<div className='w-full'>
										// 					<Input
										// 						id={`detailMr.${i}.note`}
										// 						name={`detailMr.${i}.note`}
										// 						placeholder='Note'
										// 						label='Note'
										// 						type='text'
										// 						value={result.note}
										// 						required={true}
										// 						withLabel={true}
										// 						className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										// 					/>
										// 				</div>
										// 			</Section>
										// 		</div>
										// 	);
										// })
									}
								/>
								{values.detailMr.length > 0 ? (
									<div className='mt-8 flex justify-end'>
										<div className='flex gap-2 items-center'>
											<button
												type='button'
												className='inline-flex justify-center rounded-full border border-transparent bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
												disabled={isLoading}
												onClick={() => {
													router.push("/purchasing-logistic/approval-mr");
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
													<>
														<ArrowLeft size={22} className='mr-1' /> Back
													</>
												)}
											</button>
										</div>
										<div className='flex gap-2 items-center ml-2'>
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
													<>
														<Check size={22} className='mr-1' /> Approve
													</>
												)}
											</button>
										</div>
									</div>
								) : null}
							</Form>
						)}
					</Formik>
				</>
			) : (
				<div className='w-full text-center'>
					<p className='my-auto'>Material Request Not Found</p>
				</div>
			)}
		</div>
	);
};
