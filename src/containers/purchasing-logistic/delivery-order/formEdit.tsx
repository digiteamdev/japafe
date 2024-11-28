import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputArea,
	InputSelectSearch,
	InputDate,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import {
	GetBom,
	AddDo,
    EditDo
} from "../../../services";
import { toast } from "react-toastify";
import moment from "moment";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "react-feather";

interface props {
	content: string;
	dataSelected: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	note: string;
	no_job: string;
	worId: any;
	address: string;
	contact: string;
	phone: string;
	your_project: string;
	your_ref: string;
	ship_to: string;
	date_do: any;
	DOdetail: [
		{
			id: string;
			doId: string;
			desc: string;
			qty: number;
			note: string;
			unit: string;
		}
	];
}

export const FormEditDo = ({ content, dataSelected, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listWor, setListWor] = useState<any>([]);
	const [wor, setWor] = useState<any>([]);
    const [deleteDetail, setDeleteDetail] = useState<any>([]);
	const [data, setData] = useState<data>({
		note: "",
		no_job: "",
		worId: null,
		address: "",
		contact: "",
		phone: "",
		your_project: "",
		your_ref: "",
		ship_to: "",
		date_do: new Date(),
		DOdetail: [
			{
				id: "",
				doId: "",
				desc: "",
				qty: 0,
				note: "",
				unit: "",
			},
		],
	});

	useEffect(() => {
		getWor();
		settingData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		let detail: any = [];
		dataSelected.DOdetail?.map((res: any) => {
			detail.push({
				id: res.id,
				doId: res.doId,
				desc: res.desc,
				qty: res.qty,
				note: res.note,
				unit: res.unit,
			});
		});
		setWor({
			label:
				dataSelected.worId === null
					? "Internal"
					: `${dataSelected.no_job} - ${dataSelected.wor?.customerPo.quotations.Customer.name}`,
			value: dataSelected.worId === null ? "Internal" : dataSelected.wor,
		});
		setData({
			note: dataSelected.note,
			no_job: dataSelected.no_job,
			worId: dataSelected.worId,
			address: dataSelected.address,
			contact: dataSelected.contact,
			phone: dataSelected.phone,
			your_project: dataSelected.your_project,
			your_ref: dataSelected.your_ref,
			ship_to: dataSelected.ship_to,
			date_do: new Date(dataSelected.date_do),
			DOdetail: detail,
		});
	};

	const getWor = async () => {
		let datasWor: any = [
			{
				value: [
					{
						job_no: "Internal",
					},
				],
				label: "Internal",
			},
		];
		try {
			const response = await GetBom();
			if (response) {
				response.data.result.map((res: any) => {
					datasWor.push({
						value: res,
						label: `${res.job_no} - ${res.customerPo.quotations.Customer.name}`,
					});
				});
				setListWor(datasWor);
			}
		} catch (error) {
			setListWor(datasWor);
		}
	};

	const editDo = async (payload: any) => {
		setIsLoading(true);
		try {
            let dataBody: any = { ...payload, 'delete': deleteDetail }
			const response = await EditDo(dataSelected.id,payload);
			if (response.data) {
				toast.success("Edit Delivery Order Success", {
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
			toast.error("Edit Delivery Order Failed", {
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

    const detailDelete = (data: any) => {
        let listDelete: any = deleteDetail;
        if(data.id !== ""){
            listDelete.push({
                id: data.id
            })
        }
        setDeleteDetail(listDelete)
    }

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			<Formik
				initialValues={data}
				// validationSchema={departemenSchema}
				onSubmit={(values) => {
					editDo(values);
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
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputDate
									id='date_do'
									label='Date'
									value={values.date_do}
									onChange={(value: any) => setFieldValue("date_do", value)}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								<InputSelectSearch
									datas={listWor}
									id='wor'
									name='wor'
									placeholder='Job No'
									label='Job No'
									onChange={(e: any) => {
										setWor(e);
										if (e.label === "Internal") {
											setFieldValue("no_job", "");
											setFieldValue("worId", null);
										} else {
											setFieldValue("no_job", e.value.job_no);
											setFieldValue("worId", e.value.id);
											setFieldValue(
												"ship_to",
												e.value.customerPo?.quotations?.Customer?.name
											);
											setFieldValue(
												"contact",
												e.value.customerPo?.quotations?.CustomerContact
													?.contact_person
											);
											setFieldValue(
												"phone",
												e.value.customerPo?.quotations?.CustomerContact?.phone
											);
											setFieldValue(
												"address",
												e.value.customerPo?.quotations?.Customer?.address[0]
													?.address_workshop
											);
										}
									}}
									value={wor}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='ship_to'
									name='ship_to'
									placeholder='Ship to'
									label='Ship to'
									type='text'
									onChange={handleChange}
									value={values.ship_to}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='contact'
									name='contact'
									placeholder='Contact'
									label='Contact'
									type='text'
									onChange={handleChange}
									value={values.contact}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='phone'
									name='phone'
									placeholder='phone'
									label='phone'
									type='text'
									onChange={handleChange}
									value={values.phone}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputArea
									id='address'
									name='address'
									placeholder='Address'
									label='Address'
									type='text'
									onChange={handleChange}
									value={values.address}
									row={2}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='your_ref'
									name='your_ref'
									placeholder='Reference'
									label='Reference'
									type='text'
									onChange={handleChange}
									value={values.your_ref}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='your_project'
									name='your_project'
									placeholder='Project'
									label='Project'
									type='text'
									onChange={handleChange}
									value={values.your_project}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<h1 className='text-xl font-bold mt-3'>Description</h1>
						<FieldArray
							name='DOdetail'
							render={(arrayDetail) => {
								return (
									<>
										{values.DOdetail.map((res: any, i: number) => {
											return (
												<Section
													className='grid md:grid-cols-5 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2 border-b-[3px] border-b-red-500 pb-2'
													key={i}
												>
													<div className='w-full'>
														<InputArea
															id={`DOdetail.${i}.desc`}
															name={`DOdetail.${i}.desc`}
															placeholder='Description'
															label='Description'
															type='text'
															onChange={(e: any) => {
																setFieldValue(
																	`DOdetail.${i}.desc`,
																	e.target.value
																);
															}}
															value={res.desc}
															row={2}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`DOdetail.${i}.qty`}
															name={`DOdetail.${i}.qty`}
															placeholder='Quantity'
															label='Quantity'
															type='number'
															value={res.qty}
															onChange={(e: any) => {
																setFieldValue(
																	`DOdetail.${i}.qty`,
																	parseInt(e.target.value)
																);
															}}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<Input
															id={`DOdetail.${i}.unit`}
															name={`DOdetail.${i}.unit`}
															placeholder='Unit'
															label='Unit'
															type='text'
															onChange={(e: any) => {
																setFieldValue(
																	`DOdetail.${i}.unit`,
																	e.target.value
																);
															}}
															value={res.unit}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<InputArea
															id={`DOdetail.${i}.note`}
															name={`DOdetail.${i}.note`}
															placeholder='Note'
															label='Note'
															type='text'
															onChange={(e: any) => {
																setFieldValue(
																	`DOdetail.${i}.note`,
																	e.target.value
																);
															}}
															value={res.note}
															row={2}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full flex'>
														{i + 1 === values.DOdetail.length ? (
															<a
																className='flex mt-14 text-[20px] text-blue-600 cursor-pointer hover:text-blue-400'
																onClick={() =>
																	arrayDetail.push({
																		id: "",
																		doId: "",
																		desc: "",
																		qty: 0,
																		note: "",
																		unit: "",
																	})
																}
															>
																<Plus size={23} className='mt-1' />
																Add
															</a>
														) : null}
														{i === 0 && values.DOdetail.length === 1 ? null : (
															<a
																className='flex ml-4 mt-14 text-[20px] text-red-600 w-full hover:text-red-400 cursor-pointer'
																onClick={() => {
                                                                    arrayDetail.remove(i)
                                                                    detailDelete(res)
                                                                }}
															>
																<Trash2 size={22} className='mt-1 mr-1' />
																Remove
															</a>
														)}
													</div>
												</Section>
											);
										})}
									</>
								);
							}}
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
										"Save"
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
