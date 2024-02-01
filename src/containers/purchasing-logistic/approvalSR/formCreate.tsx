import { useState, useEffect } from "react";
import { Section, Input, InputSelect } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import {
	GetMRForApproval,
	GetAllSupplier,
	GetDetailSr,
	ApprovalSr,
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
	idApprove: string;
	dateApprove: any;
	approveById: string;
	srDetail: any;
}

export const FormCreateApprovalSr = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listSupplier, setListSupplier] = useState<any>([]);
	const [userId, setUserId] = useState<string>("");
	const [IdApproval, setIdApproval] = useState<string>("");
	const [data, setData] = useState<data>({
		id: "",
		idApprove: "",
		dateApprove: new Date(),
		approveById: "",
		srDetail: [],
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
			const response = await GetDetailSr();
			if (response) {
				let detail: any = [];
				let idAppr: string = generateIdNum();
				response.data.result.map((res: any) => {
					detail.push({
						id: res.id,
						mrappr: res.mrappr,
						supId: res.supId,
						part: res.part,
						qty: res.qty,
						service: res.workCenter.name,
						note: res.note,
						qtyAppr: res.qtyAppr,
						no_sr: res.sr.no_sr,
						job_no: res.job_no,
						user: res.sr.user.employee.employee_name,
					});
				});
				setIdApproval(idAppr);
				setData({
					id: "",
					idApprove: idAppr,
					dateApprove: new Date(),
					approveById: userId,
					srDetail: detail,
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
			"SA" +
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 10000);
		return id;
	};

	const approveSr = async (payload: data) => {
		setIsLoading(true);
		let listDetail: any = [];
		payload.srDetail.map((res: any) => {
			listDetail.push({
				id: res.id,
				srappr: res.srappr,
				supId: res.supId,
				qtyAppr: parseInt(res.qtyAppr),
			});
		});
		let data = {
			// id: payload.id,
			idApprove: payload.idApprove,
			dateApprove: new Date(),
			approveById: userId,
			srDetail: listDetail,
		};
		try {
			const response = await ApprovalSr(data);
			if (response.data) {
				toast.success("Approval Service Request Success", {
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
			toast.error("Approval Service Request Failed", {
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
					approveSr(values);
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
							name='srDetail'
							render={(arrayMr) =>
								values.srDetail.map((result: any, i: number) => {
									return (
										<div key={i}>
											{/* <Disclosure defaultOpen>
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
														</Disclosure.Panel>
													</div>
												)}
											</Disclosure> */}
											<Section className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-4'>
												<div className='w-full'>
													<Input
														id={`srDetail.${i}.no_sr`}
														name={`srDetail.${i}.no_sr`}
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
														id={`srDetail.${i}.srappr`}
														name={`srDetail.${i}.srappr`}
														placeholder='Type'
														label='Type'
														onChange={(e: any) => {
															setFieldValue(
																`srDetail.${i}.srappr`,
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
														<option value='SO'>SO</option>
														<option value='DSO'>DSO</option>
													</InputSelect>
												</div>
												<div className='w-full'>
													<InputSelect
														id={`srDetail.${i}.supId`}
														name={`srDetail.${i}.supId`}
														placeholder='Vendor'
														label='Vendor'
														onChange={(e: any) => {
															setFieldValue(
																`srDetail.${i}.supId`,
																e.target.value
															);
														}}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													>
														<option value='no data' selected>
															Choose Vendor
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
														id={`srDetail.${i}.part`}
														name={`srDetail.${i}.part`}
														placeholder='Part/Item'
														label='Part/Item'
														type='text'
														value={result.part}
														disabled={true}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<Input
														id={`srDetail.${i}.service`}
														name={`srDetail.${i}.service`}
														placeholder='Service Description'
														label='Service Description'
														type='text'
														value={result.service}
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
														id={`srDetail.${i}.user`}
														name={`srDetail.${i}.user`}
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
												<div className='w-full'>
													<Input
														id={`srDetail.${i}.qty`}
														name={`srDetail.${i}.qty`}
														placeholder='Qty'
														label='Qty'
														type='number'
														disabled={true}
														value={result.qty}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<Input
														id={`srDetail.${i}.qtyAppr`}
														name={`srDetail.${i}.qtyAppr`}
														placeholder='Qty Approve'
														label='Qty Approve'
														type='number'
														onChange={(e: any) => {
															setFieldValue(
																`srDetail.${i}.qtyAppr`,
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
														id={`srDetail.${i}.note`}
														name={`srDetail.${i}.note`}
														placeholder='Note'
														label='Note'
														type='text'
														onChange={(e: any) => {
															setFieldValue(
																`srDetail.${i}.note`,
																e.target.value
															);
														}}
														value={result.note}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													{values.srDetail.length === 1 ? null : (
														<a
															className='inline-flex text-red-500 cursor-pointer mt-10'
															onClick={() => {
																arrayMr.remove(i);
															}}
														>
															<Trash2 size={18} className='mr-1 mt-1' /> Remove
															Service Request
														</a>
													)}
												</div>
											</Section>
										</div>
									);
								})
							}
						/>
						{values.srDetail.length > 0 ? (
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
						) : null}
					</Form>
				)}
			</Formik>
		</div>
	);
};
