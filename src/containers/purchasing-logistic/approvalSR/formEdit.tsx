import { useState, useEffect } from "react";
import { Section, Input, InputSelect } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { GetAllSupplier, GetSrValid, ApprovalSr } from "../../../services";
import { toast } from "react-toastify";
import moment from "moment";
import { getIdUser } from "../../../configs/session";

interface props {
	content: string;
	dataSelected: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	id: string;
	idSrAppr: string;
	dateOfAppr: any;
	approveById: string;
	detailSr: [
		{
			id: string;
			srappr: string;
			part: string;
			service: string;
			qty: string;
			note: string;
			supId: string;
			qtyAppr: number;
		}
	];
}

export const FormEditApprovalSr = ({
	content,
	dataSelected,
	showModal,
}: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listSupplier, setListSupplier] = useState<any>([]);
	const [listMr, setListMr] = useState<any>([]);
	const [isDetail, setIsDetail] = useState<boolean>(false);
	const [user, setUser] = useState<string>("");
	const [userId, setUserId] = useState<string>("");
	const [jobNo, setJobNo] = useState<string>("");
	const [noSr, setNoSr] = useState<string>("");
	const [dateSrAppr, setDateSrAppr] = useState<any>(new Date());
	const [data, setData] = useState<data>({
		id: "",
		idSrAppr: "",
		dateOfAppr: new Date(),
		approveById: "",
		detailSr: [
			{
				id: "",
				srappr: "",
				part: "",
				service: "",
				qty: "",
				note: "",
				supId: "",
				qtyAppr: 0,
			},
		],
	});

	useEffect(() => {
		let idUser = getIdUser();
		if (idUser !== undefined) {
			setUserId(idUser);
		}
		getSupplier();
		getSr();
		settingData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		let detail: any = [];
		dataSelected.SrDetail.map((res: any) => {
			detail.push({
				id: res.id,
				srappr: res.srappr,
				part: res.part,
				service: res.workCenter.name,
				qty: res.qty,
				note: res.note,
				supId: res.supId,
				qtyAppr: 0,
			});
		});
		setJobNo(
			dataSelected.wor.job_operational
				? dataSelected.wor.job_no_mr
				: dataSelected.wor.job_no
		);
		setUser(dataSelected.user.employee.employee_name);
		setDateSrAppr(dataSelected.dateOfAppr);
		setNoSr(dataSelected.no_sr);
		setData({
			id: dataSelected.id,
			idSrAppr: dataSelected.idSrAppr,
			dateOfAppr: dataSelected.dateOfAppr,
			approveById: dataSelected.approvedById,
			detailSr: detail,
		});
	};

	const getSr = async () => {
		try {
			const response = await GetSrValid();
			if (response) {
				setListMr(response.data.result);
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

	const approveSr = async (payload: data) => {
		setIsLoading(true);
		let listDetail: any = [];
		payload.detailSr.map((res: any) => {
			listDetail.push({
				id: res.id,
				srappr: res.srappr,
				supId: res.supId,
				qtyAppr: parseInt(res.qtyAppr),
			});
		});
		let data = {
			id: payload.id,
			idSrAppr: payload.idSrAppr,
			dateOfAppr: payload.dateOfAppr,
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
									id='no_sr'
									name='no_sr'
									placeholder='No SR'
									label='No SR'
									type='text'
									value={noSr}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='jobNo'
									name='jobNo'
									placeholder='Job No'
									label='Job No'
									type='text'
									value={jobNo}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='date'
									name='date'
									placeholder='Date Approval Service Request'
									label='Date Approval Service Request'
									type='text'
									value={moment(dateSrAppr).format("DD-MMMM-YYYY")}
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
									placeholder='Request By'
									label='Request By'
									type='text'
									value={user}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<FieldArray
							name='detailSr'
							render={(arrayMr) =>
								values.detailSr.map((result: any, i: number) => {
									return (
										<div key={i}>
											<Section className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-4'>
												<div className='w-full'>
													<InputSelect
														id={`detailSr.${i}.srappr`}
														name={`detailSr.${i}.srappr`}
														placeholder='Type'
														label='Type'
														onChange={(e: any) => {
															setFieldValue(
																`detailSr.${i}.srappr`,
																e.target.value
															);
														}}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													>
														<option defaultValue='no data'>
															Choose Type
														</option>
														<option value='SO' selected={ result.srappr === 'SO' }>SO</option>
														<option value='DSO' selected={ result.srappr === 'DSO' }>DSO</option>
													</InputSelect>
												</div>
												<div className='w-full'>
													<InputSelect
														id={`detailSr.${i}.supId`}
														name={`detailSr.${i}.supId`}
														placeholder='Suplier'
														label='Suplier'
														onChange={(e: any) => {
															setFieldValue(
																`detailSr.${i}.supId`,
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
																		selected={res.id === result.supId}
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
														id={`detailSr.${i}.part`}
														name={`detailSr.${i}.part`}
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
														id={`detailSr.${i}.service`}
														name={`detailSr.${i}.service`}
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
												<div className='w-full'>
													<Input
														id={`detailSr.${i}.qty`}
														name={`detailSr.${i}.qty`}
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
														id={`detailSr.${i}.note`}
														name={`detailSr.${i}.note`}
														placeholder='Note'
														label='Note'
														type='text'
														value={result.note}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
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
