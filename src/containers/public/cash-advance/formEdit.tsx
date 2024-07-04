import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputSelectSearch,
	InputArea,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { EditCashAdvance, GetEmployeCash, GetBom } from "../../../services";
import { Plus, Trash2 } from "react-feather";
import { toast } from "react-toastify";
import { getIdUser } from "../../../configs/session";
import { formatRupiah } from "@/src/utils";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	id_cash_advance: string;
	worId: string;
	wor: any;
	job_no: string;
	userId: string;
	status_payment: string;
	detail: any;
    date_cash_advance: any;
	grand_tot: number;
	note: string;
}

export const FormEditCashAdvance = ({
	dataSelected,
	content,
	showModal,
}: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listWor, setListWor] = useState<any>([]);
    const [listDelete, setListDelete] = useState<any>([]);
	const [data, setData] = useState<data>({
		id_cash_advance: "",
		worId: "",
		job_no: "",
		userId: "",
        date_cash_advance: new Date(),
		wor: {},
		detail: [
			{
                id: "",
				type_cdv: "Consumable",
				total: 0,
				description: "",
			},
		],
		status_payment: "Cash",
		grand_tot: 0,
		note: dataSelected.note,
	});

	useEffect(() => {
		settingData();
		getWor();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		let detail: any = [];
		dataSelected.cdv_detail.map((res: any) => {
			detail.push({
				id: res.id,
				type_cdv: res.type_cdv,
				total: res.total,
				description: res.description,
			});
		});
		setData({
			id_cash_advance: dataSelected.id_cash_advance,
			worId: dataSelected.worId,
			wor: {
				label: dataSelected.wor
					? dataSelected.wor.job_no +
					  " - " +
					  dataSelected.wor.customerPo.quotations.Customer.name
					: "Internal",
			},
			job_no: dataSelected.wor ? dataSelected.wor.job_no : "Internal",
			userId: dataSelected.userId,
			detail: detail,
			status_payment: dataSelected.status_payment,
            date_cash_advance: dataSelected.date_cash_advance,
			grand_tot: dataSelected.grand_tot,
			note: "",
		});
	};

	const getWor = async () => {
		var dateObj = new Date();
		var year = dateObj.getUTCFullYear();
		let datasWor: any = [
			{
				value: {
					id: null,
					job_no: "Internal",
				},
				label: "Internal",
			},
		];
		try {
			const response = await GetBom();
			if (response) {
				response.data.result.map((res: any) => {
					datasWor.push({
						value: res,
						label: res.job_no + " - " + res.customerPo.quotations.Customer.name,
					});
				});
				setListWor(datasWor);
			}
		} catch (error) {
			setListWor(datasWor);
		}
	};

	const editCashAdvance = async (payload: any) => {
		setIsLoading(true);
		let detail: any = [];
		let total: number = 0;
		payload.detail.map((res: any) => {
			if (res.total !== 0 || res.description !== "") {
				total = total + parseInt(res.total);
				detail.push({
                    id: res.id,
                    cdvId: dataSelected.id,
					type_cdv: res.type_cdv,
					total: parseInt(res.total),
					description: res.description,
				});
			}
		});
		let data = {
			worId: payload.worId,
			userId: payload.userId,
			status_payment: payload.status_payment,
			note: payload.note,
			date_cash_advance: payload.date_cash_advance,
			cdv_detail: detail,
            delete: listDelete
		};
		try {
			const response = await EditCashAdvance(data, dataSelected.id);
			if (response.data) {
				toast.success("Edit Cash Advance Success", {
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
			toast.error("Edit Cash Advances Failed", {
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

    const deleted = async (id: string) => {
		let list_delete: any = listDelete
        listDelete.push({
            id: id
        })
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			<Formik
				initialValues={{ ...data }}
				// validationSchema={departemenSchema}
				onSubmit={(values) => {
					editCashAdvance(values);
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
						<h1 className='text-xl font-bold mt-3'>Cash Advance</h1>
						<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputSelectSearch
									datas={listWor}
									id='worId'
									name='worId'
									placeholder='Job No'
									label='Job No'
									onChange={(e: any) => {
										setFieldValue("worId", e.value.id);
										setFieldValue("wor", e);
										setFieldValue("job_no", e.value.job_no);
									}}
									value={values.wor}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputSelect
									id='status_payment'
									name='status_payment'
									placeholder='Payment'
									label='Payment'
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option
										value='Cash'
										selected={values.status_payment === "Cash" ? true : false}
									>
										Cash
									</option>
									<option
										value='Transfer'
										selected={
											values.status_payment === "Transfer" ? true : false
										}
									>
										Transfer
									</option>
								</InputSelect>
							</div>
						</Section>
						<FieldArray
							name='detail'
							render={(arrayDetail) => (
								<div>
									{values.detail.map((res: any, i: number) => (
										<Section
											className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'
											key={i}
										>
											<div className='w-full'>
												<InputSelect
													id={`detail.${i}.type_cdv`}
													name={`detail.${i}.type_cdv`}
													placeholder='Type'
													label='Type'
													onChange={(e: any) => {
														setFieldValue(`detail.${i}.type_cdv`, e.target.value);
													}}
													required={true}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												>
													<option value='Consumable' selected={res.type_cdv === "Consumable" ? true : false}>Consumable</option>
													<option value='Investasi' selected={res.type_cdv === "Investasi" ? true : false}>Investasi</option>
													<option value='Service' selected={res.type_cdv === "Service" ? true : false}>Service</option>
													<option value='Operasional' selected={res.type_cdv === "Operasional" ? true : false}>Operasional</option>
													<option value='SDM' selected={res.type_cdv === "SDM" ? true : false}>SDM</option>
												</InputSelect>
											</div>
											<div className='w-full'>
												<Input
													id={`detail.${i}.total`}
													name={`detail.${i}.total`}
													placeholder='Amount'
													label='Amount'
													type='text'
													pattern='\d*'
													value={formatRupiah(res.total.toString())}
													onChange={(e: any) => {
														setFieldValue(`detail.${i}.total`, e.target.value.replaceAll(".", ""));
													}}
													required={true}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												/>
											</div>
											<div className='w-full'>
												<InputArea
													id={`detail.${i}.description`}
													name={`detail.${i}.description`}
													placeholder='Decription'
													label='Decription'
													type='text'
													value={res.description}
													onChange={(e: any) => {
														setFieldValue(
															`detail.${i}.description`,
															e.target.value
														);
													}}
													disabled={false}
													required={true}
													row={1}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
												/>
											</div>
											<div className='flex w-full'>
												{i + 1 === values.detail.length ? (
													<a
														className='flex mt-10 text-[20px] text-blue-600 cursor-pointer hover:text-blue-400'
														onClick={() =>
															arrayDetail.push({
																id: "",
																type_cdv: "Consumable",
																total: 0,
																description: "",
															})
														}
													>
														<Plus size={23} className='mt-1' />
														Add
													</a>
												) : null}
												{i === 0 && values.detail.length === 1 ? null : (
													<a
														className='flex ml-4 mt-10 text-[20px] text-red-600 w-full hover:text-red-400 cursor-pointer'
														onClick={() => {
                                                            if(res.id !== ""){
                                                                deleted(res.id)
                                                            }
                                                            arrayDetail.remove(i)
                                                        }}
													>
														<Trash2 size={22} className='mt-1 mr-1' />
														Remove
													</a>
												)}
											</div>
										</Section>
									))}
								</div>
							)}
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
