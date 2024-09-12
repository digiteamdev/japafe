import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputSelectSearch,
	InputDate,
	InputArea,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import moment from "moment";
import { Plus, Trash2 } from "react-feather";
import { GetEmployeDepartement } from "@/src/services";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const FormCreateSpkl = ({ content, showModal }: props) => {
	const [data, setData] = useState<any>({
		employeeId: "",
		date: new Date(),
		departement: "",
		shift: "",
		detail: [
			{
				job_no: "",
				description: "",
				actual_start: new Date(),
				actual_finish: new Date(),
			},
		],
	});

    const getEmployee = async () => {
        try {
            const response = await GetEmployeDepartement()
            console.log(response)
        } catch (error) {
            
        }
    }

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			<Formik
				initialValues={data}
				// validationSchema={departemenSchema}
				onSubmit={(values) => {
					console.log(values);
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
							<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
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
								<div>
									<InputSelectSearch
										datas={[]}
										id='employeeId'
										name='employeeId'
										placeholder='Employee'
										label='Employee'
										onChange={(e: any) => {}}
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
								</div>
								<div>
									<Input
										id='shift'
										name='shift'
										placeholder='Shift'
										label='Shift'
										type='text'
										value={values.shift}
										disabled={true}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
							</Section>
							<FieldArray
								name='detail'
								render={(arrayDetail) =>
									values.detail.map((res: any, i: number) => {
										return (
											<div key={i}>
												<Section className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2 border-b-[3px] border-b-red-500 pb-2'>
													<div className='w-full'>
														<InputArea
															id={`detail.${i}.job_no`}
															name={`detail.${i}.job_no`}
															placeholder='Job No'
															label='Job No'
															type='text'
															value={res.job_no}
															onChange={handleChange}
															disabled={false}
															row={3}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<InputArea
															id={`detail.${i}.description`}
															name={`detail.${i}.description`}
															placeholder='Description'
															label='Description'
															type='text'
															value={res.description}
															onChange={handleChange}
															disabled={false}
															row={3}
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														/>
													</div>
													<div className='w-full'>
														<InputDate
															id={`detail.${i}.start`}
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
																	`time_sheet_add.${i}.actual_start`,
																	value
																);
																setFieldValue(
																	`time_sheet_add.${i}.total_hours`,
																	`${calculate} jam`
																);
															}}
															withLabel={true}
															className='z-50 bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
															classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
														/>
													</div>
													<div className='w-full'>
														<InputDate
															id={`time_sheet_add.${i}.actual_finish`}
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
																	`time_sheet_add.${i}.actual_finish`,
																	value
																);
																setFieldValue(
																	`time_sheet_add.${i}.total_hours`,
																	`${calculate} jam`
																);
															}}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
															classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
														/>
													</div>
													<div className='flex w-full'>
														{i + 1 === values.detail.length ? (
															<a
																className='flex mr-4 text-[20px] text-blue-600 cursor-pointer hover:text-blue-400'
																onClick={() =>
																	arrayDetail.push({
																		job_no: "",
																		description: "",
																		actual_start: new Date(),
																		actual_finish: new Date(),
																	})
																}
															>
																<Plus size={23} className='mt-1' />
																Add
															</a>
														) : null}
														{i === 0 && values.detail.length === 1 ? null : (
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
						</Form>
					);
				}}
			</Formik>
		</div>
	);
};
