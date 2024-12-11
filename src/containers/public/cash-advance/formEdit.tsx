import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputSelectSearch,
	InputArea,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { departemenSchema } from "../../../schema/master-data/departement/departementSchema";
import { AddCashAdvance, GetEmployeCash, GetBom, EditCashAdvance } from "../../../services";
import { Plus, Trash2 } from "react-feather";
import { toast } from "react-toastify";
import { getIdUser } from "../../../configs/session";
import { formatRupiah } from "@/src/utils";

interface props {
	content: string;
	dataSelected: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	id_cash_advance: string;
	employeeId: string;
	worId: string;
	job_no: string;
	userId: string;
	status_payment: string;
	currency: string;
	detail: any;
	total: number;
	description: string;
	note: string;
	date_cash_advance: Date;
	selectJob: any;
	selectPayment: any;
}

export const FormEditCashAdvance = ({ content, dataSelected, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [caID, setCaID] = useState<string>("");
	const [listEmploye, setListEmploye] = useState<any>([]);
	const [userId, setUserId] = useState<string>("");
	const [listWor, setListWor] = useState<any>([]);
	const [data, setData] = useState<data>({
		id_cash_advance: "",
		employeeId: "",
		worId: "",
		job_no: "",
		userId: "",
		detail: [
			{
				type: "Consumable",
				value: 0,
				description: "",
			},
		],
		currency: "IDR",
		status_payment: "Cash",
		total: 0,
		description: "",
		note: "",
		date_cash_advance: new Date(),
		selectJob: {},
		selectPayment: {},
	});

	useEffect(() => {
		getEmploye();
		getEmployeById();
		getWor();
		generateIdNum();
		settingData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		setData({
			id_cash_advance: dataSelected?.id_cash_advance,
			employeeId: dataSelected?.employeeId,
			worId: dataSelected?.worId,
			job_no: dataSelected?.job_no,
			userId: dataSelected?.userId,
			detail: [
				{
					type: "Consumable",
					value: 0,
					description: "",
				},
			],
			currency: "IDR",
			status_payment: dataSelected?.status_payment,
			total: dataSelected?.grand_tot,
			description: "",
			note: dataSelected?.note,
			date_cash_advance: new Date(dataSelected?.date_cash_advance),
			selectJob: {
				label: dataSelected?.job_no === "Internal" ? "Internal" : dataSelected?.wor?.job_no + " - " + dataSelected?.wor?.customerPo?.quotations?.Customer?.name,
				value: dataSelected?.job_no === "Internal" ? { id: null, job_no: "Internal" } : dataSelected?.wor
			},
			selectPayment: {},
		})
	};

	const getEmployeById = async () => {
		const id = getIdUser();
		if (id !== undefined) {
			setUserId(id);
		}
	};

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		var year = dateObj.getUTCFullYear();
		const id =
			"CA" +
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 10000);
		setCaID(id);
	};

	const getEmploye = async () => {
		let listemploye: any = [];
		try {
			const response = await GetEmployeCash();
			if (response) {
				response.data.result.map((res: any) => {
					listemploye.push({
						label: res.employee_name,
						value: res,
					});
				});
			}
		} catch (error) {
			listemploye = [];
		}
		setListEmploye(listemploye);
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

	const addCashAdvance = async (payload: any) => {
		setIsLoading(true);
		let detail: any = [];
		payload.detail.map((res: any) => {
			if (res.value !== "" || res.description !== "") {
				detail.push({
					type_cdv: res.type,
					total: parseInt(res.value),
					description: res.description,
				});
			}
		});
		let data = {
			id_cash_advance: caID,
			employeeId: payload.employeeId,
			worId: payload.worId,
			job_no: payload.job_no,
			userId: userId,
			status_payment: payload.status_payment,
			note: payload.note,
			date_cash_advance: payload.date_cash_advance,
			cdv_detail: detail,
			grand_tot: parseFloat(payload.total),
			description: payload.description,
		};
		try {
			const response = await EditCashAdvance(data, dataSelected?.id);
			if (response.data) {
				toast.success("Add Cash Advance Success", {
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
			toast.error("Add Cash Advances Failed", {
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
					addCashAdvance(values);
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
									value={values.selectJob}
									onChange={(e: any) => {
										setFieldValue("worId", e.value.id);
										setFieldValue("job_no", e.value.job_no);
										setFieldValue("selectJob", e);
									}}
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
									<option value='Cash' selected={values.status_payment === "Cash" ? true : false}>Cash</option>
									<option value='Transfer' selected={values.status_payment === "Transfer" ? true : false}>Transfer</option>
								</InputSelect>
							</div>
							<div className='w-full'>
								<Input
									id='total'
									name='total'
									placeholder='Amount'
									label='Amount'
									type='text'
									pattern='\d*'
									value={formatRupiah(values.total.toString())}
									onChange={(e: any) => {
										setFieldValue(
											`total`,
											e.target.value.replaceAll(".", "")
										);
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
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
									row={2}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>

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
