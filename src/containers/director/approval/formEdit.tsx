import { useEffect, useState } from "react";
import moment from "moment";
import { ApprovalPrMr, ApprovalPoSo } from "../../../services";
import { Section, Input, InputSelect } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { formatRupiah } from "../../../utils";
import { getPosition } from "../../../configs/session";
import { Check, X } from "react-feather";
import { toast } from "react-toastify";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const FormEditApproval = ({
	dataSelected,
	content,
	showModal,
}: props) => {
	const [dataSuplier, setDataSuplier] = useState<any>([]);
	const [dataPPN, setDataPPN] = useState<any>([]);
	const [position, setPosition] = useState<any>([]);
	const [PoSo, setPoSo] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [data, setData] = useState<any>({
		detailMr: [],
		SrDetail: [],
	});

	useEffect(() => {
		let dataSuplier: any = [];
		let dataPPN: any = [];
		let positionAkun = getPosition();
		setData(dataSelected);
		if (positionAkun !== undefined) {
			setPosition(positionAkun);
		}
		if (dataSelected) {
			dataSelected.detailMr.map((res: any) => {
				if (!dataSuplier.includes(res.supplier.supplier_name)) {
					dataSuplier.push(res.supplier.supplier_name);
					dataPPN.push({
						supplier: res.supplier.supplier_name,
						ppn: res.supplier.ppn,
					});
				}
			});
			dataSelected.SrDetail.map((res: any) => {
				if (!dataSuplier.includes(res.supplier.supplier_name)) {
					dataSuplier.push(res.supplier.supplier_name);
					dataPPN.push({
						supplier: res.supplier.supplier_name,
						ppn: res.supplier.ppn,
						pph: res.supplier.pph,
						tax: res.taxPsrDmr,
					});
				}
			});
		}
		setDataPPN(dataPPN);
		setDataSuplier(dataSuplier);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const price = (total: number, disc: number) => {
		let priceSr: number = total + disc;
		return priceSr.toString();
	};

	const reject = () => {
		let dataPayload = {
			statusApprove: {
				status_manager_director: "reject",
			},
		};
		if(PoSo){
			approvePoSoDirector(dataPayload, "Reject")
		}else{
			approveDirector(dataPayload, "Reject");
		}
	};

	const approve = () => {
		let dataPayload = {
			statusApprove: {
				status_manager_director: "approve",
			},
		};
		if(dataSelected.idPurchase){
			approveDirector(dataPayload, "Approve");
		}else{
			approvePoSoDirector(dataPayload, "Approve")
		}
	};

	const revisi = (payload: any) => {
		let dataRevisi: any = []
		let dataRevisiSr: any = []
		payload.detailMr.map( (res: any) => {
			dataRevisi.push({
				id: res.id,
				note_revision: res.note_revision,
			})
		})
		payload.SrDetail.map( (res: any) => {
			dataRevisiSr.push({
				id: res.id,
				note_revision: res.note_revision,
			})
		})
		let dataPayload = {
			statusApprove: {
				status_manager_director: "revision"
			},
			revision: dataRevisi,
			revision_sr: dataRevisiSr
		};
		if(PoSo){
			approvePoSoDirector(dataPayload, "Revisi")
		}else{
			approveDirector(dataPayload, "Revisi");
		}
	};

	const approveDirector = async (payload: any, status: string) => {
		setIsLoading(true);
		try {
			const response = await ApprovalPrMr(dataSelected.id, payload);
			if (response.status === 201) {
				toast.success(`${status} Success`, {
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
			} else {
				toast.error(`${status} Failed`, {
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
		} catch (error) {
			toast.error(`${status} Failed`, {
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

	const approvePoSoDirector = async (payload: any, status: string) => {
		setIsLoading(true);
		try {
			const response = await ApprovalPoSo(dataSelected.id, payload);
			if (response.status === 201) {
				toast.success(`${status} Success`, {
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
			} else {
				toast.error(`${status} Failed`, {
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
		} catch (error) {
			toast.error(`${status} Failed`, {
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

	const title = () => {
		if(dataSelected.idPurchase){
			if(dataSelected.idPurchase.startsWith("PSR")){
				return "Purchase Service Request"
			}else if(dataSelected.idPurchase.startsWith("DSR")){
				return "Direct Service Purchase"
			}else if(dataSelected.idPurchase.startsWith("PR")){
				return "Purchase Material Request"
			}else{
				return "Direct Material Request"
			}
		}else{
			if(dataSelected.id_so.startsWith("PO")){
				return "Purchase Order Material"
			}else{
				return "Purchase Order Service"
			}
		}
	}

	const titleID = () => {
		if(dataSelected.idPurchase){
			if(dataSelected.idPurchase.startsWith("PSR")){
				return "ID Purchase Service Request"
			}else if(dataSelected.idPurchase.startsWith("DSR")){
				return "ID Direct Service Purchase"
			}else if(dataSelected.idPurchase.startsWith("PR")){
				return "ID Purchase Material Request"
			}else{
				return "ID Direct Material Request"
			}
		}else{
			if(dataSelected.id_so.startsWith("PO")){
				return "ID Purchase Order Material"
			}else{
				return "ID Purchase Order Service"
			}
		}
	}

	const titleDate = () => {
		if(dataSelected.idPurchase){
			if(dataSelected.idPurchase.startsWith("PSR")){
				return "Date Purchase Service Request"
			}else if(dataSelected.idPurchase.startsWith("DSR")){
				return "Date Direct Service Purchase"
			}else if(dataSelected.idPurchase.startsWith("PR")){
				return "Date Purchase Material Request"
			}else{
				return "Date Direct Material Request"
			}
		}else{
			if(dataSelected.id_so.startsWith("PO")){
				return "Date Purchase Order Material"
			}else{
				return "Date Purchase Order Service"
			}
		}
	}

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>
						{ title() }
					</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										{ titleID() }
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{ dataSelected.idPurchase ? dataSelected.idPurchase : dataSelected.id_so}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										{ titleDate() }
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{ dataSelected.dateOfPurchase ? moment(dataSelected.dateOfPurchase).format("DD-MMMM-YYYY") : moment(dataSelected.date_prepared).format("DD-MMMM-YYYY") }
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<Formik
						initialValues={data}
						onSubmit={(values) => {
							revisi(values);
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
								{dataSelected.detailMr.length > 0 ? (
									<FieldArray
										name='detailMr'
										render={(arrayMr) => {
											return (
												<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
													{dataSuplier.length > 0
														? dataSuplier.map((res: any, i: number) => {
																return (
																	<div key={i}>
																		<h5>Suplier : {res}</h5>
																		<table className='w-full mt-2'>
																			<thead>
																				<tr>
																					<th className='border border-black text-center'>
																						Material / Material Spesifikasi
																					</th>
																					<th className='border border-black text-center'>
																						Qty
																					</th>
																					<th className='border border-black text-center'>
																						Price
																					</th>
																					<th className='border border-black text-center'>
																						Note Revision
																					</th>
																				</tr>
																			</thead>
																			<tbody>
																				{values.detailMr
																					.filter((fil: any) => {
																						return (
																							fil.supplier.supplier_name === res
																						);
																					})
																					.map((result: any, idx: number) => {
																						return (
																							<tr key={idx}>
																								<td className='border border-black text-center'>
																									{
																										result.Material_Stock
																											.Material_master
																											.material_name
																									}{" "}
																									/{" "}
																									{
																										result.Material_Stock
																											.spesifikasi
																									}
																								</td>
																								<td className='border border-black text-center'>
																									{result.qtyAppr}
																								</td>
																								<td className='border border-black text-center'>
																									{formatRupiah(
																										result.Material_Stock.harga.toString()
																									)}
																								</td>
																								<td className='border border-black text-center'>
																									<Input
																										id={`detailMr.${i}.note_revision`}
																										name={`detailMr.${i}.note_revision`}
																										type='text'
																										placeholder='Note Revision'
																										onChange={(e: any) => {
																											setFieldValue(
																												`detailMr.${i}.note_revision`,
																												e.target.value
																											);
																										}}
																										value={result.note_revision}
																										required={true}
																										withLabel={true}
																										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																									/>
																								</td>
																							</tr>
																						);
																					})}
																			</tbody>
																		</table>
																	</div>
																);
														  })
														: null}
												</Section>
											);
										}}
									/>
								) : null}
								{dataSelected.SrDetail.length > 0 ? (
									<FieldArray
										name='SrDetail'
										render={(arraySr) => {
											return (
												<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
													{dataSuplier.length > 0
														? dataSuplier.map((res: any, i: number) => {
																return (
																	<div key={i}>
																		<h5>Suplier : {res}</h5>
																		<table className='w-full mt-2'>
																			<thead>
																				<tr>
																					<th className='border border-black text-center'>
																						Part / Item
																					</th>
																					<th className='border border-black text-center'>
																						Service Description
																					</th>
																					<th className='border border-black text-center'>
																						Qty
																					</th>
																					<th className='border border-black text-center'>
																						Price
																					</th>
																					<th className='border border-black text-center'>
																						Note Revision
																					</th>
																				</tr>
																			</thead>
																			<tbody>
																				{values.SrDetail.filter((fil: any) => {
																					return (
																						fil.supplier.supplier_name === res
																					);
																				}).map((result: any, idx: number) => {
																					return (
																						<tr key={idx}>
																							<td className='border border-black text-center'>
																								{result.part}
																							</td>
																							<td className='border border-black text-center'>
																								{result.workCenter.name}
																							</td>
																							<td className='border border-black text-center'>
																								{result.qty}
																							</td>
																							<td className='border border-black text-center'>
																								{formatRupiah(
																									price(
																										result.total,
																										result.disc
																									)
																								)}
																							</td>
																							<td className='border border-black text-center'>
																								<Input
																									id={`SrDetail.${i}.note_revision`}
																									name={`SrDetail.${i}.note_revision`}
																									type='text'
																									placeholder='Note Revision'
																									onChange={(e: any) => {
																										setFieldValue(
																											`SrDetail.${i}.note_revision`,
																											e.target.value
																										);
																									}}
																									value={result.note_revision}
																									required={true}
																									withLabel={true}
																									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																								/>
																							</td>
																						</tr>
																					);
																				})}
																			</tbody>
																		</table>
																	</div>
																);
														  })
														: null}
												</Section>
											);
										}}
									/>
								) : null}
								<div className='mt-8 flex justify-end'>
									<div className='flex gap-2 items-center'>
										<button
											type='button'
											className='inline-flex justify-center rounded-full border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
											disabled={isLoading}
											onClick={() => {
												approve();
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
												"Approve"
											)}
										</button>
									</div>
									<div className='flex gap-2 items-center mx-2'>
										<button
											type='button'
											className='inline-flex justify-center rounded-full border border-transparent bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
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
												"Revision"
											)}
										</button>
									</div>
									<div className='flex gap-2 items-center'>
										<button
											type='button'
											className='inline-flex justify-center rounded-full border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
											disabled={isLoading}
											onClick={() => {
												reject();
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
												"Reject"
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
