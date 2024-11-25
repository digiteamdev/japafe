import { rupiahFormat } from "@/src/utils";
import { Section } from "../../../components";
import moment from "moment";
import { useEffect, useState } from "react";
import { ApprovalDirrectService } from "@/src/services";
import { toast } from "react-toastify";
import { FieldArray, Form, Formik } from "formik";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewApprovalDirrectService = ({
	dataSelected,
	content,
	showModal,
}: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [data, setData] = useState<any>([]);

	useEffect(() => {
		setData(dataSelected);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const grandTotal = (data: any) => {
		let total: any = 0;
		data?.map((res: any) => {
			total += res.total;
		});
		return total;
	};

	const approvalPurchaseDirrect = async (payload: any) => {
		setIsLoading(true);
		try {
			const body: any = {
				statusApprove: {
					status_manager_director: payload.status_manager_director,
				},
				reject: payload.SrDetail,
                SrDetail: payload.SrDetail
			};
            
			const response = await ApprovalDirrectService(dataSelected?.id, body);
			if (response.status === 201) {
				toast.success("Approve Dirrect Service Success", {
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
				toast.error("Approve Dirrect Service Failed", {
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
		} catch (error: any) {
			toast.error("Approve Dirrect Service Failed", {
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
			{dataSelected ? (
				<Formik
					initialValues={{ ...data }}
					onSubmit={(values) => {
						approvalPurchaseDirrect(values);
					}}
					enableReinitialize
				>
					{({ handleSubmit, setFieldValue, handleChange, values }) => (
						<Form>
							<h1 className='font-bold text-xl'>Dirrect service</h1>
							<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<table className='w-full'>
										<tr>
											<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
												ID Purchase
											</td>
											<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
												{dataSelected.idPurchase}
											</td>
										</tr>
										<tr>
											<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
												Date Purchase
											</td>
											<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
												{moment(dataSelected.dateOfPurchase).format(
													"DD-MMMM-YYYY"
												)}
											</td>
										</tr>
									</table>
								</div>
							</Section>
							<h1 className='font-bold text-xl'>Detail service</h1>
							<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full text-xs'>
									<table className='w-full'>
										<thead>
											<tr>
												<th className='p-1 border border-black text-center'>
													Job no
												</th>
												<th className='p-1 border border-black text-center'>
													No SR
												</th>
												<th className='p-1 border border-black text-center'>
													Vendor
												</th>
												<th className='p-1 border border-black text-center'>
													Description
												</th>
												<th className='p-1 border border-black text-center'>
													Qty
												</th>
												<th className='p-1 border border-black text-center'>
													Price
												</th>
												<th className='p-1 border border-black text-center'>
													Discount
												</th>
												<th className='p-1 border border-black text-center'>
													Total
												</th>
											</tr>
										</thead>
										<tbody>
											<FieldArray
												name='SrDetail'
												render={(arrayDetail) => (
													<>
														{values?.SrDetail?.map((res: any, i: number) => {
															return (
																<tr key={i}>
																	<td className='p-1 border border-black text-center'>
																		{res.sr?.job_no}
																	</td>
																	<td className='p-1 border border-black text-center'>
																		{res.sr?.no_sr}
																	</td>
																	<td className='p-1 border border-black text-center'>
																		{res.supplier?.supplier_name}
																	</td>
																	<td className='p-1 border border-black text-center'>
																		{res.desc}
																	</td>
																	<td className='p-1 border border-black text-center'>
																		{res.qtyAppr}
																	</td>
																	<td className='p-1 border border-black text-center'>
																		{rupiahFormat(res.price.toString())}
																	</td>
																	<td className='p-1 border border-black text-center'>
																		{rupiahFormat(res.disc.toString())}
																	</td>
																	<td className='p-1 border border-black text-center'>
																		{rupiahFormat(res.total.toString())}
																	</td>
																</tr>
															);
														})}
													</>
												)}
											/>
											<tr>
												<td
													className='p-1 border border-black text-right'
													colSpan={7}
												>
													Grand total
												</td>
												<td className='p-1 border border-black text-center'>
													{rupiahFormat(
														grandTotal(dataSelected?.SrDetail).toString()
													)}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</Section>
							<div className='mt-8 flex justify-end space-x-2'>
								<div className='flex gap-2 items-center'>
									<button
										type='submit'
										className='inline-flex justify-center rounded-full border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
										disabled={isLoading}
										onClick={() => {
											setFieldValue("status_manager_director", "approve");
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
								<div className='flex gap-2 items-center'>
									<button
										type='submit'
										className='inline-flex justify-center rounded-full border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
										disabled={isLoading}
										onClick={() => {
											setFieldValue("status_manager_director", "reject");
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
			) : null}
		</div>
	);
};
