import { useState, useEffect } from "react";
import { Section, Input, InputSelect, InputDate } from "../../../components";
import { Formik, Form } from "formik";
import {
	GetAllWorSchedule,
	AddSchedule,
	GetAllActivity,
} from "../../../services";
import {
	Gantt,
	Task,
	EventOption,
	StylingOption,
	ViewMode,
	DisplayOption,
	GanttProps,
} from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { toast } from "react-toastify";
import { locale } from "moment";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	idTs: string;
	worId: string;
	timesch: any;
	holiday: boolean;
	aktivitas: [
		{
			aktivitasId: string;
			days: number;
			startday: any;
			endday: any;
		}
	];
}

export const FormCreateSchedule = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listWor, setListWor] = useState<any>([]);
	const [listActivity, setListActivity] = useState<any>([]);
	const [customer, setCustomer] = useState<string>("");
	const [subject, setSubject] = useState<string>("");
	const [jobDesc, setJobDesc] = useState<string>("");
	const [note, setNote] = useState<string>("");
	const [activity, setActivity] = useState<string>("");
	const [activityId, setActivityId] = useState<string>("");
	const [activityStar, setActivityStar] = useState<any>(new Date());
	const [activityEnd, setActivityEnd] = useState<any>(new Date());
	const [starDate, setStartDate] = useState<any>(new Date());
	const [endDate, setEndDate] = useState<any>(new Date());
	const [idAutoNum, setIdAutoNum] = useState<string>("");
	const [tasks, setTask] = useState<any>([
		{
			start: new Date(),
			end: new Date(),
			name: "-",
			id: "Task",
			type: "project",
			progress: 50,
			isDisabled: false,
			hideChildren: false,
			styles: {
				progressColor: "#ffbb54",
			},
		},
	]);
	const [data, setData] = useState<data>({
		idTs: "",
		worId: "",
		timesch: new Date(),
		holiday: false,
		aktivitas: [
			{
				aktivitasId: "",
				days: 0,
				startday: "",
				endday: "",
			},
		],
	});

	useEffect(() => {
		getWor();
		getActivity();
		generateIdNum();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getWor = async () => {
		try {
			const response = await GetAllWorSchedule();
			if (response.data) {
				setListWor(response.data.result);
			}
		} catch (error: any) {
			setListWor([]);
		}
	};

	const getActivity = async () => {
		try {
			const response = await GetAllActivity();
			if (response.data) {
				setListActivity(response.data.result);
			}
		} catch (error: any) {
			setListActivity([]);
		}
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name === "worId") {
			if (event.target.value !== "no data") {
				let data = JSON.parse(event.target.value);
				setCustomer(data.customerPo.quotations.Customer.name);
				setSubject(data.subject);
				setJobDesc(data.job_desk);
				setNote(data.noted);
				setStartDate(data.date_of_order);
				setEndDate(data.delivery_date);
				setActivityStar(new Date(data.date_of_order));
				setActivityEnd(new Date(data.delivery_date));
				setTask([
					{
						start: new Date(data.date_of_order),
						end: new Date(data.delivery_date),
						name: data.job_no,
						id: "Task",
						type: "project",
						progress: 0,
						isDisabled: false,
						hideChildren: false,
						styles: {
							progressColor: "#ffbb54",
						},
					},
				]);
			} else {
				setCustomer("");
				setSubject("");
				setJobDesc("");
				setNote("");
				setStartDate(new Date());
				setEndDate(new Date());
				setActivityStar(new Date());
				setActivityEnd(new Date());
				setTask([
					{
						start: new Date(),
						end: new Date(),
						name: "-",
						id: "Task",
						type: "project",
						progress: 0,
						isDisabled: false,
						hideChildren: false,
						styles: {
							progressColor: "#ffbb54",
						},
					},
				]);
			}
		} else if (event.target.name === "activity") {
			if (event.target.value !== "no data") {
				let data = JSON.parse(event.target.value);
				setActivity(data.name);
				setActivityId(data.id);
			} else {
				setActivity("");
				setActivityId("");
			}
		}
	};

	const addTask = () => {
		let newTaks: any = [];
		tasks.map((res: any) => {
			newTaks.push({
				start: res.start,
				end: res.end,
				name: res.name,
				id: res.id,
				type: res.type,
				progress: res.progress,
				isDisabled: res.isDisabled,
				hideChildren: res.hideChildren,
				styles: res.styles,
			});
		});
		newTaks.push({
			start: activityStar,
			end: activityEnd,
			name: activity,
			id: activityId,
			type: "task",
			progress: 0,
			isDisabled: false,
			hideChildren: false,
			styles: {
				backgroundColor: "#60a5fa",
				progressColor: "#ffbb54",
			},
		});
		setTask(newTaks);
	};

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		var year = dateObj.getUTCFullYear();
		const id =
			year.toString() +
			"/" +
			month.toString() +
			"/" +
			"TS-JAPA/" +
			Math.floor(Math.random() * 100) +
			1;
		setIdAutoNum(id);
	};

	const addSchedule = async (payload: any) => {
		setIsLoading(true);
		let dataBody: any;
		let aktivitas: any = [];
		tasks.map((res: any, i: number) => {
			if (i !== 0) {
				var Difference_In_Time = res.end.getTime() - res.start.getTime();

				var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

				aktivitas.push({
					aktivitasId: res.id,
					days: Math.round(Difference_In_Days),
					startday: res.start,
					endday: res.end,
				});
			}
		});
		dataBody = {
			idTs: idAutoNum,
			worId: payload.worId,
			timesch: payload.timesch,
			holiday: payload.holiday,
			aktivitas: aktivitas,
		};
		try {
			const response = await AddSchedule(dataBody);
			if (response.data) {
				toast.success("Add Time Schedulle Success", {
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
			toast.error("Add Time Schedulle Failed", {
				position: "top-center",
				autoClose: 1000,
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

	const handleTaskChange = (task: any) => {
		let newTasks = tasks.map((t: any) => (t.id === task.id ? task : t));
		if (task.project) {
			const [start, end] = getStartEndDateForProject(newTasks, task.project);
			const project =
				newTasks[newTasks.findIndex((t: any) => t.id === task.project)];
			if (
				project.start.getTime() !== start.getTime() ||
				project.end.getTime() !== end.getTime()
			) {
				const changedProject = { ...project, start, end };
				newTasks = newTasks.map((t: any) =>
					t.id === task.project ? changedProject : t
				);
			}
		}
		setTask(newTasks);
	};

	const getStartEndDateForProject = (tasks: any, projectId: any) => {
		const projectTasks = tasks.filter((t: any) => t.project === projectId);
		let start = projectTasks[0].start;
		let end = projectTasks[0].end;
		for (let i = 0; i < projectTasks.length; i++) {
			const task = projectTasks[i];
			if (start.getTime() > task.start.getTime()) {
				start = task.start;
			}
			if (end.getTime() < task.end.getTime()) {
				end = task.end;
			}
		}
		return [start, end];
	};

	// console.log(task);
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<Formik
				initialValues={{ ...data }}
				// validationSchema={sumarySchema}
				onSubmit={(values) => {
					addSchedule(values);
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
					<Form onChange={handleOnChanges}>
						<h1 className='text-xl font-bold mt-3'>Time Schedule</h1>
						<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputDate
									id='timesch'
									label='Time Schedule Date'
									value={values.timesch === null ? new Date() : values.timesch}
									onChange={(value: any) => setFieldValue("timesch", value)}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								<InputSelect
									id='worId'
									name='worId'
									placeholder='Job No'
									label='Job No'
									onChange={(event: any) => {
										if (event.target.value !== "no data") {
											let data = JSON.parse(event.target.value);
											setFieldValue("worId", data.id);
										}
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option value='no data' selected>
										Choose Job No WOR
									</option>
									{listWor.length === 0 ? (
										<option value='no data'>No Data Job No WOR</option>
									) : (
										listWor.map((res: any, i: number) => {
											return (
												<option value={JSON.stringify(res)} key={i}>
													{res.job_no} -{" "}
													{res.customerPo.quotations.Customer.name}
												</option>
											);
										})
									)}
								</InputSelect>
							</div>
							<div className='w-full'>
								<Input
									id='customer'
									name='customer'
									placeholder='Customer'
									label='Customer'
									type='text'
									value={customer}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='subject'
									name='subject'
									placeholder='Subject'
									label='Subject'
									type='text'
									value={subject}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputDate
									id='startDate'
									label='Start Date'
									value={starDate}
									withLabel={true}
									disabled={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								<InputDate
									id='endDate'
									label='end Date'
									value={endDate}
									withLabel={true}
									disabled={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='jobDesc'
									name='jobDesc'
									placeholder='Job Description'
									label='Job Description'
									type='text'
									value={jobDesc}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='noted'
									name='noted'
									placeholder='Noted'
									label='Noted'
									type='text'
									value={note}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputSelect
									id='holiday'
									name='holiday'
									placeholder='Holiday Exception'
									label='Holiday Exception'
									onChange={(event: any) => {
										if (event.target.value !== "no data") {
											if (event.target.value === "yes") {
												setFieldValue("holiday", true);
											} else {
												setFieldValue("holiday", false);
											}
										} else {
											setFieldValue("holiday", false);
										}
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option value='no data' selected>
										Choose Holiday
									</option>
									<option value='yes'>Yes</option>
									<option value='no'>No</option>
								</InputSelect>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-8'>
							<div className='w-full'>
								<InputSelect
									id='activity'
									name='activity'
									placeholder='Activity'
									label='Activity'
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option value='no data' selected>
										Choose Activity
									</option>
									{listActivity.length === 0 ? (
										<option value='no data'>No Data Activity</option>
									) : (
										listActivity.map((res: any, i: number) => {
											return (
												<option value={JSON.stringify(res)} key={i}>
													{res.name}
												</option>
											);
										})
									)}
								</InputSelect>
							</div>
							<div className='w-full'>
								<InputDate
									id='start'
									label='Start date'
									value={activityStar}
									onChange={(e: any) => setActivityStar(e)}
									withLabel={true}
									minDate={new Date(starDate)}
									maxDate={new Date(endDate)}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								<InputDate
									id='end'
									label='End date'
									value={activityEnd}
									onChange={(e: any) => setActivityEnd(e)}
									withLabel={true}
									minDate={new Date(starDate)}
									maxDate={new Date(endDate)}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
						</Section>
						<button type='button' className="inline-flex justify-center rounded-full border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2" onClick={() => addTask()}>
							Add
						</button>
						<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-8'>
							<div className={`w-full`}>
								<Gantt
									tasks={tasks}
									viewMode={ViewMode.Day}
									locale='ID'
									onDateChange={handleTaskChange}
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
