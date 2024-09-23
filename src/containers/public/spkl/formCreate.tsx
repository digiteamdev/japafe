import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelectSearch,
	InputDate,
	InputArea,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import moment from "moment";
import { Plus, Trash2 } from "react-feather";
import { GetEmployeDepartement, AddSpkl } from "@/src/services";
import { toast } from "react-toastify";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const FormCreateSpkl = ({ content, showModal }: props) => {
	const [employee, setEmployee] = useState<any>([]);
	const [isLoading, setIsloading] = useState<boolean>(false);
	const [data] = useState<any>({
		date: new Date(),
		departement: "",
		shift: "",
		time_sheet_spkl: [
			{
				actual_start: new Date(),
				actual_finish: new Date(),
				employeeId: "",
				job: "",
				job_description: "",
				part_name: "",
			},
		],
	});

	useEffect(() => {
		getEmployee();
	}, []);

	const getEmployee = async () => {
		try {
			const response = await GetEmployeDepartement();
			if (response.data) {
				let listEmployee: any = [];
				response.data.result?.map((res: any) => {
					listEmployee.push({
						label: res.employee_name,
						value: res,
					});
				});
				setEmployee(listEmployee);
			}
		} catch (error) {
			setEmployee([]);
		}
	};

	const addSpkl = async (payload: any) => {
		setIsloading(true);
		try {
			const response = await AddSpkl(payload);
			if (response.data) {
				toast.success("Add Spkl Success", {
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
			toast.error("Add Spkl Failed", {
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
		setIsloading(false);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			<Formik
				initialValues={data}
				// validationSchema={departemenSchema}
				onSubmit={(values) => {
					addSpkl(values);
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
				}) => {
					return (
						<Form>
							<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
								<div>
									<InputDate
										id='date'
										label='Date'
										minDate={new Date()}
										dateFormat='dd/MM/yyyy'
										value={values.date}
										onChange={(value: any) => setFieldValue("date", value)}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
										classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
									/>
								</div>
								{/* <div>
									<InputSelectSearch
										datas={employee}
										id='employeeId'
										name='employeeId'
										placeholder='Employee'
										label='Employee'
										onChange={(e: any) => {
											setFieldValue("employeeId", e.value.id);
											setFieldValue("departement", e.value.sub_depart?.name);
										}}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
									/>
								</div>
								<div>
									<Input
										id='departement'
										name='departement'
										placeholder='Departement'
										label='Departement'
										type='text'
										value={values.departement}
										disabled={true}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div> */}
								<div>
									<Input
										id='shift'
										name='shift'
										placeholder='Shift'
										label='Shift'
										type='text'
										value={values.shift}
										onChange={handleChange}
										disabled={false}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
							</Section>
							<FieldArray
								name='time_sheet_spkl'
								render={(arrayDetail) =>
									values.time_sheet_spkl.map((res: any, i: number) => {
										return (
											<div key={i}>
												<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
													<InputSelectSearch
														datas={employee}
														id={`time_sheet_spkl.${i}.employeeId`}
														name={`time_sheet_spkl.${i}.employeeId`}
														placeholder='Employee'
														label='Employee'
														onChange={(e: any) => {
															setFieldValue(`time_sheet_spkl.${i}.employeeId`, e.value.id);
														}}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
													/>
																										<div className='w-full'>
														<InputDate
															id={`time_sheet_spkl.${i}.start`}
															label='Start'
															minDate={values.date}
															maxDate={values.date}
															showTimeSelect={true}
															showTimeSelectOnly={false}
															value={res.actual_start}
															dateFormat='dd/MM/yyyy, HH:mm'
															onChange={(value: any) => {
																let start = moment(new Date(value));
																let finish = moment(
																	new Date(res.actual_finish)
																);
																let calculate = Math.ceil(
																	moment.duration(finish.diff(start)).asHours()
																);
																setFieldValue(
																	`time_sheet_spkl.${i}.actual_start`,
																	value
																);
															}}
															withLabel={true}
															className='z-50 bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
															classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
														/>
													</div>
													<div className='w-full'>
														<InputDate
															id={`time_sheet_spkl.${i}.actual_finish`}
															label='Finish'
															minDate={values.date}
															showTimeSelect={true}
															showTimeSelectOnly={false}
															value={res.actual_finish}
															dateFormat='dd/MM/yyyy, HH:mm'
															onChange={(value: any) => {
																let start = moment(new Date(res.actual_start));
																let finish = moment(new Date(value));
																let calculate = Math.ceil(
																	moment.duration(finish.diff(start)).asHours()
																);
																setFieldValue(
																	`time_sheet_spkl.${i}.actual_finish`,
																	value
																);
															}}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
															classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
														/>
													</div>
													<div className='w-full'>
														<InputArea
															id={`time_sheet_spkl.${i}.job`}
															name={`time_sheet_spkl.${i}.job`}
															placeholder='Job No'
															label='Job No'
															type='text'
															value={res.job}
															onChange={(e: any) => {
																setFieldValue(
																	`time_sheet_spkl.${i}.job`,
																	e.target.value
																);
															}}
															disabled={false}
															row={3}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<InputArea
															id={`time_sheet_spkl.${i}.part_name`}
															name={`time_sheet_spkl.${i}.part_name`}
															placeholder='Part Name'
															label='Part Name'
															type='text'
															value={res.part_name}
															onChange={(e: any) => {
																setFieldValue(
																	`time_sheet_spkl.${i}.part_name`,
																	e.target.value
																);
															}}
															disabled={false}
															row={3}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<InputArea
															id={`time_sheet_spkl.${i}.job_description`}
															name={`time_sheet_spkl.${i}.job_description`}
															placeholder='Description'
															label='Description'
															type='text'
															value={res.job_description}
															onChange={(e: any) => {
																setFieldValue(
																	`time_sheet_spkl.${i}.job_description`,
																	e.target.value
																);
															}}
															disabled={false}
															row={3}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
												</Section>
												<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2 border-b-[3px] border-b-red-500 pb-2'>
													<div className='flex w-full'>
														{i + 1 === values.time_sheet_spkl.length ? (
															<a
																className='flex mr-4 text-[20px] text-blue-600 cursor-pointer hover:text-blue-400'
																onClick={() =>
																	arrayDetail.push({
																		job: "",
																		job_description: "",
																		employeeId: "",
																		part_name: "",
																		actual_start: new Date(),
																		actual_finish: new Date(),
																	})
																}
															>
																<Plus size={23} className='mt-1' />
																Add
															</a>
														) : null}
														{i === 0 &&
														values.time_sheet_spkl.length === 1 ? null : (
															<a
																className='flex text-[20px] text-red-600 w-full hover:text-red-400 cursor-pointer'
																onClick={() => arrayDetail.remove(i)}
															>
																<Trash2 size={22} className='mt-1 mr-1' />
																Remove
															</a>
														)}
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
										) : content === "add" ? (
											"Save"
										) : (
											"Edit"
										)}
									</button>
								</div>
							</div>
						</Form>
					);
				}}
			</Formik>
		</div>
	);
};
