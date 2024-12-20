import { useEffect, useState } from "react";
import {
	Section,
	Input,
	InputDate,
	InputSelect,
	InputTime,
	InputArea,
	InputSelectSearch,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { AddTimeSheet, GetEmployeById, GetSpkl } from "../../../services";
import { toast } from "react-toastify";
import { getIdUser } from "@/src/configs/session";
import moment from "moment";
import { Plus, Trash2 } from "react-feather";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	date: any;
	userId: string;
	type_timesheet: string;
	spklId: any;
	time_sheet_add: [
		{
			job: string;
			job_description: string;
			part_name: string;
			actual_start: any;
			actual_finish: any;
			total_hours: string;
		}
	];
}

export const FormCreateTimeSheet = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isOvertime, setIsOvertime] = useState<boolean>(false);
	const [typeSheet, setTypeSheet] = useState<string>("overtime");
	const [userID, setUserId] = useState<string>("");
	const [employe, setEmploye] = useState<string>("");
	const [depart, setDepart] = useState<string>("");
	const [minDate, setMinDate] = useState<any>(new Date());
	const [listSpkl, setListSpkl] = useState<any>([]);
	const [data, setData] = useState<data>({
		date: new Date(),
		userId: "",
		type_timesheet: "worktime",
		spklId: null,
		time_sheet_add: [
			{
				job: "",
				job_description: "",
				part_name: "",
				actual_start: new Date(),
				actual_finish: new Date(),
				total_hours: "",
			},
		],
	});

	useEffect(() => {
		getEmploye();
		dateInput();
		getSpkl();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getEmploye = async () => {
		try {
			const id = getIdUser();
			const response = await GetEmployeById(id);
			if (response) {
				setEmploye(response.data.result.employee.employee_name);
				setUserId(response.data.result.employee.id);
				setDepart(response.data.result.employee.sub_depart.name);
				setData({
					date: new Date(),
					userId: id ? id : "",
					type_timesheet: "worktime",
					spklId: null,
					time_sheet_add: [
						{
							job: "",
							job_description: "",
							part_name: "",
							actual_start: new Date(),
							actual_finish: new Date(),
							total_hours: "",
						},
					],
				});
			}
		} catch (error) {}
	};

	const getSpkl = async () => {
		try {
			const response = await GetSpkl(0, 0, "");
			if (response) {
				let spkl: any = [
					{
						label: "Work Time Sheet",
						value: "worktime",
					},
				];
				response.data.result.map((res: any) => {
					spkl.push({
						label: "Over time - " + res.no_spkl,
						value: res,
					});
				});
				setListSpkl(spkl);
			}
		} catch (error) {
			setListSpkl([
				{
					label: "Work Time Sheet",
					value: "worktime",
				},
			]);
		}
	};

	const dateInput = () => {
		let minDate: any = moment().subtract(3, "days");
		setMinDate(minDate);
	};

	const addTimeSheet = async (data: any) => {
		setIsLoading(true);
		try {
			const response = await AddTimeSheet(data);
			if (response) {
				toast.success("Add Time Sheet Success", {
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
			toast.error("Add Time Sheet Failed", {
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
				initialValues={data}
				// validationSchema={activitySchema}
				onSubmit={(values) => {
					addTimeSheet(values);
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
								<Input
									id='employe'
									name='employe'
									placeholder='Employe'
									label='Employe'
									type='text'
									value={employe}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='departement'
									name='departement'
									placeholder='Departement'
									label='Departement'
									type='text'
									value={depart}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputDate
									id='date'
									label='date'
									// minDate={minDate}
									minDate={new Date("2024-05-26")}
									maxDate={new Date()}
									dateFormat='dd/MM/yyyy'
									value={values.date}
									onChange={(value: any) => setFieldValue("date", value)}
									withLabel={true}
									disabled={isOvertime}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								{/* <InputSelect
									id='type_timesheet'
									name='type_timesheet'
									placeholder='Type'
									label='Type'
									onChange={(event: any) => {
										setFieldValue("type_timesheet", event.target.value);
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option value='worktime' selected>
										Work Time Sheet
									</option>
									<option value='overtime'>Over Time Report</option>
								</InputSelect> */}
								<InputSelectSearch
									datas={listSpkl}
									id='type_timesheet'
									name='type_timesheet'
									placeholder='Type'
									label='Type'
									onChange={(e: any) => {
										if (e.value === "worktime") {
											setData({
												date: values.date,
												userId: values.userId,
												type_timesheet: e.value,
												spklId: null,
												time_sheet_add: [{
													job: "",
													job_description: "",
													part_name: "",
													actual_start: new Date(),
													actual_finish: new Date(),
													total_hours: "",
												}]
											});
											setIsOvertime(false);
										} else {
											let listDesc: any = [];
											e.value.time_sheet_spkl?.map((res: any) => {
												let start = moment(new Date(res.actual_start));
												let finish = moment(new Date(res.actual_finish));
												let calculate = Math.ceil(
													moment.duration(finish.diff(start)).asHours()
												);
												listDesc.push({
													job: res.job,
													job_description: res.job_description,
													part_name: res.part_name,
													actual_start: new Date(res.actual_start),
													actual_finish: new Date(res.actual_finish),
													total_hours: `${calculate} jam`,
												});
											});
											setData({
												date: listDesc[0]?.actual_start,
												userId: values.userId,
												type_timesheet: "overtime",
												spklId: e.value.id,
												time_sheet_add: listDesc,
											});
											setIsOvertime(true);
										}
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
								/>
							</div>
						</Section>
						<FieldArray
							name='time_sheet_add'
							render={(arrayTime) =>
								values.time_sheet_add.map((res: any, i: number) => {
									return (
										<div key={i} className=''>
											<Section className='grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2'>
												<div className='w-full'>
													<InputArea
														id={`time_sheet_add.${i}.job`}
														name={`time_sheet_add.${i}.job`}
														placeholder='Job No'
														label='Job No'
														type='text'
														value={res.job}
														onChange={handleChange}
														disabled={isOvertime}
														row={3}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<InputArea
														id={`time_sheet_add.${i}.part_name`}
														name={`time_sheet_add.${i}.part_name`}
														placeholder='Part Name'
														label='Part Name'
														type='text'
														value={res.part_name}
														onChange={handleChange}
														disabled={isOvertime}
														row={3}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<InputArea
														id={`time_sheet_add.${i}.job_description`}
														name={`time_sheet_add.${i}.job_description`}
														placeholder='Process / Job Description'
														label='Process / Job Description'
														type='text'
														value={res.job_description}
														onChange={handleChange}
														disabled={isOvertime}
														row={3}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
											</Section>
											<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2'>
												<div className='w-full'>
													<InputDate
														id={`time_sheet_add.${i}.actual_start`}
														label='Start'
														minDate={values.date}
														maxDate={values.date}
														showTimeSelect={true}
														showTimeSelectOnly={false}
														value={res.actual_start}
														dateFormat='dd/MM/yyyy, HH:mm'
														onChange={(value: any) => {
															let start = moment(new Date(value));
															let finish = moment(new Date(res.actual_finish));
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
														disabled={isOvertime}
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
														disabled={isOvertime}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
														classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
													/>
												</div>
												<div className='w-full'>
													<Input
														id={`time_sheet_add.${i}.total_hours`}
														name={`time_sheet_add.${i}.total_hours`}
														placeholder='Total'
														label='Total'
														type='text'
														value={res.total_hours}
														disabled={true}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
											</Section>
											<div className='flex w-full border-b-[3px] border-b-red-500 pb-2 mb-2'>
												{i + 1 === values.time_sheet_add.length ? (
													<a
														className='flex mt-2 text-[20px] text-blue-600 cursor-pointer hover:text-blue-400'
														onClick={() =>
															arrayTime.push({
																job: "",
																job_description: "",
																part_name: "",
																actual_start: new Date(),
																actual_finish: new Date(),
																total_hours: "",
															})
														}
													>
														<Plus size={23} className='mt-1' />
														Add
													</a>
												) : null}
												{(i === 0 && values.time_sheet_add.length === 1) ||
												isOvertime ? null : (
													<a
														className='flex ml-4 mt-2 text-[20px] text-red-600 w-full hover:text-red-400 cursor-pointer'
														onClick={() => arrayTime.remove(i)}
													>
														<Trash2 size={22} className='mt-1 mr-1' />
														Remove
													</a>
												)}
											</div>
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
				)}
			</Formik>
		</div>
	);
};
