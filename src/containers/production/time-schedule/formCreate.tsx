import { useState, useEffect, Fragment } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputSelectSearch,
	InputDate,
	InputArea,
} from "../../../components";
import { Formik, Form } from "formik";
import {
	GetAllWorSchedule,
	AddSchedule,
	GetAllActivity,
	GetAllHoliday,
	AddActivity,
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
import { Dialog, Transition } from "@headlessui/react";
import { activitySchema } from "../../../schema/master-data/activity/activitySchema";
import "gantt-task-react/dist/index.css";
import { toast } from "react-toastify";
import moment from "moment";
import { Plus, Trash2, Edit, X } from "react-feather";
import { monthDiff, getMonthName, countDay } from "../../../utils/dateFunction";

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

interface dataActivity {
	name: string;
}

export const FormCreateSchedule = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [isShowGantt, setIsShowGantt] = useState<boolean>(false);
	const [isCreateActivity, setIsCreateActivity] = useState<boolean>(false);
	const [listWor, setListWor] = useState<any>([]);
	const [listActivity, setListActivity] = useState<any>([]);
	const [customer, setCustomer] = useState<string>("");
	const [subject, setSubject] = useState<string>("");
	const [jobDesc, setJobDesc] = useState<string>("");
	const [note, setNote] = useState<string>("");
	const [row, setRow] = useState<number>(0);
	const [activity, setActivity] = useState<any>([]);
	const [activityId, setActivityId] = useState<string>("");
	const [activityStar, setActivityStar] = useState<any>(new Date());
	const [activityEnd, setActivityEnd] = useState<any>(new Date());
	const [starDate, setStartDate] = useState<any>(new Date());
	const [endDate, setEndDate] = useState<any>(new Date());
	const [holiday, setHoliday] = useState<string>("no");
	const [idAutoNum, setIdAutoNum] = useState<string>("");
	const [numMoth, setNumMonth] = useState<number>(0);
	const [numDate, setNumDate] = useState<number>(12);
	const [numHoliday, setNumHoliday] = useState<number>(0);
	const [listMoth, setListMonth] = useState<any>([]);
	const [listDate, setListDate] = useState<any>([]);
	const [listDateHoliday, setListDateHoliday] = useState<any>([]);
	const [dateHoliday, setDateHoliday] = useState<any>([]);
	const [dataSelected, setDataSelected] = useState<any>([]);
	const [dataRow, setDataRow] = useState<any>(0);
	const [tasks, setTask] = useState<any>([
		{
			start: new Date(),
			end: new Date(),
			name: "-",
			id: "",
			progress: 0,
			duration: 0,
			holiday: 0,
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
	const [dataActivity, setDataActivity] = useState<dataActivity>({
		name: "",
	});

	useEffect(() => {
		getWor();
		generateIdNum();
		getHolidays();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getWor = async () => {
		let datasWor: any = [];
		try {
			const response = await GetAllWorSchedule();
			if (response.data) {
				response.data.result.map((res: any) => {
					datasWor.push({
						value: res,
						label: `${res.job_no} - ${res.customerPo.quotations.Customer.name}`,
					});
				});
				setListWor(datasWor);
			}
		} catch (error: any) {
			setListWor(datasWor);
		}
	};

	const selectWor = (data: any) => {
		let listDates: any = [];
		let datasActivity: any = [];
		let countHoliday = 0;
		let durationDay = countDay(data.date_of_order, data.delivery_date);
		if (holiday === "yes") {
			for (var i = 0; i < durationDay; i++) {
				if (i === 0) {
					let unixTime = Math.floor(new Date(activityStar).getTime() / 1000);
					listDates.push(new Date(unixTime * 1000));
				} else {
					let unixTime = Math.floor(
						new Date(activityStar).getTime() / 1000 + 86400 * i
					);
					listDates.push(new Date(unixTime * 1000));
				}
			}
			for (var i = 0; i < listDates.length; i++) {
				let holiday = checkHoliday(listDates[i], "duration");
				countHoliday = countHoliday + parseInt(holiday.toString());
			}
		}
		setCustomer(data.customerPo.quotations.Customer.name);
		setSubject(data.customerPo.quotations.subject);
		setJobDesc(data.job_description);
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
				progress: 0,
				duration: durationDay - countHoliday,
				holiday: countHoliday,
				color: "#facc15",
				left: 0,
				leftHoliday: 0,
				width: 60 * durationDay,
				widthHoliday: 60 * (durationDay - countHoliday),
			},
		]);
		setNumMonth(
			monthDiff(new Date(data.date_of_order), new Date(data.delivery_date)) + 1
		);
		showMonth(
			monthDiff(new Date(data.date_of_order), new Date(data.delivery_date)) + 1,
			data.date_of_order,
			data.delivery_date
		);
		showDate(data.date_of_order, data.delivery_date);
		data.work_scope_item.map((res: any) => {
			datasActivity.push({
				value: res,
				label: res.item,
			});
		});
		setListActivity(datasActivity);
		setActivity([]);
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name === "worId") {
			if (event.target.value !== "no data") {
				let data = JSON.parse(event.target.value);
				let listDates: any = [];
				let countHoliday = 0;
				let durationDay = countDay(data.date_of_order, data.delivery_date);
				if (holiday === "yes") {
					for (var i = 0; i < durationDay; i++) {
						if (i === 0) {
							let unixTime = Math.floor(
								new Date(activityStar).getTime() / 1000
							);
							listDates.push(new Date(unixTime * 1000));
						} else {
							let unixTime = Math.floor(
								new Date(activityStar).getTime() / 1000 + 86400 * i
							);
							listDates.push(new Date(unixTime * 1000));
						}
					}
					for (var i = 0; i < listDates.length; i++) {
						let holiday = checkHoliday(listDates[i], "duration");
						countHoliday = countHoliday + parseInt(holiday.toString());
					}
				}
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
						progress: 0,
						duration: durationDay - countHoliday,
						holiday: countHoliday,
						color: "#facc15",
						left: 0,
						leftHoliday: 0,
						width: 60 * durationDay,
						widthHoliday: 60 * (durationDay - countHoliday),
					},
				]);
				setNumMonth(
					monthDiff(
						new Date(data.date_of_order),
						new Date(data.delivery_date)
					) + 1
				);
				showMonth(
					monthDiff(
						new Date(data.date_of_order),
						new Date(data.delivery_date)
					) + 1, data.date_of_order, data.delivery_date
				);
				showDate(data.date_of_order, data.delivery_date);
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
						progress: 0,
						duration: 0,
						holiday: 0,
						left: 0,
						leftHoliday: 0,
						width: 0,
						widthHoliday: 0,
						color: "",
					},
				]);
				setIsShowGantt(false);
			}
		} else if (event.target.name === "activity") {
			if (event.target.value !== "no data" && event.target.value !== "create") {
				let data = JSON.parse(event.target.value);
				setActivity(data.name);
				setActivityId(data.id);
			} else {
				setActivity("");
				setActivityId("");
			}
		} else if (event.target.name === "holiday") {
			if (event.target.value === "yes") {
				let newTasks: any = [];
				tasks.map((res: any) => {
					let listDates: any = [];
					let countHoliday = 0;
					let durationDay = countDay(res.start, res.end);
					let countHolidayRange = 0;
					let listDatesRange: any = [];
					let rangeDay = countDay(starDate, res.start);
					for (var i = 0; i < rangeDay; i++) {
						if (i === 0) {
							let unixTime = Math.floor(new Date(starDate).getTime() / 1000);
							listDatesRange.push(new Date(unixTime * 1000));
						} else {
							let unixTime = Math.floor(
								new Date(starDate).getTime() / 1000 + 86400 * i
							);
							listDatesRange.push(new Date(unixTime * 1000));
						}
					}
					for (var i = 0; i < durationDay; i++) {
						if (i === 0) {
							let unixTime = Math.floor(new Date(res.start).getTime() / 1000);
							listDates.push(new Date(unixTime * 1000));
						} else {
							let unixTime = Math.floor(
								new Date(res.start).getTime() / 1000 + 86400 * i
							);
							listDates.push(new Date(unixTime * 1000));
						}
					}
					for (var i = 0; i < listDates.length; i++) {
						let holiday = checkHoliday(listDates[i], "duration");
						countHoliday = countHoliday + parseInt(holiday.toString());
					}
					for (var i = 0; i < listDatesRange.length; i++) {
						let holiday = checkHoliday(listDatesRange[i], "duration");
						countHolidayRange =
							countHolidayRange + parseInt(holiday.toString());
					}
					newTasks.push({
						start: res.start,
						end: res.end,
						name: res.name,
						id: res.id,
						progress: res.progress,
						duration: durationDay - countHoliday,
						holiday: countHoliday,
						color: res.color,
						left: res.left,
						leftHoliday:
							res.id === "Task" ? 0 : 60 * (rangeDay - countHolidayRange) - 60,
						width: res.width,
						widthHoliday: 60 * (durationDay - countHoliday),
					});
				});
				setTask(newTasks);
			} else {
				let newTasks: any = [];
				tasks.map((res: any) => {
					let listDates: any = [];
					let durationDay = countDay(res.start, res.end);
					for (var i = 0; i < durationDay; i++) {
						if (i === 0) {
							let unixTime = Math.floor(new Date(res.start).getTime() / 1000);
							listDates.push(new Date(unixTime * 1000));
						} else {
							let unixTime = Math.floor(
								new Date(res.start).getTime() / 1000 + 86400 * i
							);
							listDates.push(new Date(unixTime * 1000));
						}
					}
					newTasks.push({
						start: res.start,
						end: res.end,
						name: res.name,
						id: res.id,
						progress: res.progress,
						duration: durationDay,
						holiday: res.holiday,
						color: res.color,
						left: res.left,
						leftHoliday: res.leftHoliday,
						width: res.width,
						widthHoliday: res.widthHoliday,
					});
				});
				setTask(newTasks);
			}
		}
	};

	const addTask = () => {
		let newTaks: any = [];
		let listDates: any = [];
		let countHoliday = 0;
		let countHolidayRange = 0;
		let listDatesRange: any = [];
		let rangeJob = countDay(starDate, endDate);
		let rangeDay = countDay(starDate, activityStar);
		let durationDay = countDay(activityStar, activityEnd);
		for (var i = 0; i < rangeDay; i++) {
			if (i === 0) {
				let unixTime = Math.floor(new Date(starDate).getTime() / 1000);
				listDatesRange.push(new Date(unixTime * 1000));
			} else {
				let unixTime = Math.floor(
					new Date(starDate).getTime() / 1000 + 86400 * i
				);
				listDatesRange.push(new Date(unixTime * 1000));
			}
		}
		for (var i = 0; i < durationDay; i++) {
			if (i === 0) {
				let unixTime = Math.floor(new Date(activityStar).getTime() / 1000);
				listDates.push(new Date(unixTime * 1000));
			} else {
				let unixTime = Math.floor(
					new Date(activityStar).getTime() / 1000 + 86400 * i
				);
				listDates.push(new Date(unixTime * 1000));
			}
		}
		if (holiday === "yes") {
			for (var i = 0; i < listDates.length; i++) {
				let holiday = checkHoliday(listDates[i], "duration");
				countHoliday = countHoliday + parseInt(holiday.toString());
			}
			for (var i = 0; i < listDatesRange.length; i++) {
				let holiday = checkHoliday(listDatesRange[i], "duration");
				countHolidayRange = countHolidayRange + parseInt(holiday.toString());
			}
		}

		tasks.map((res: any, i: any) => {
			if (i === 0) {
				newTaks.push({
					start: res.start,
					end: res.end,
					name: res.name,
					id: res.id,
					activity: res.activity,
					progress: res.progress,
					gapleft: 0,
					gaprigth: 0,
					duration: res.duration,
					holiday: res.holiday,
					left: res.left,
					leftHoliday: res.leftHoliday,
					width: res.width,
					widthHoliday: res.Holiday,
					color: res.color,
				});
			} else {
				if (i === parseInt(row.toString())) {
					newTaks.push({
						start: activityStar,
						end: activityEnd,
						name: activity.label,
						id: activityId,
						activity: activity,
						progress: 0,
						duration: durationDay - countHoliday,
						gapleft: rangeDay - 1,
						gaprigth: CountGapRight(rangeJob, (durationDay - countHoliday) + (rangeDay - 1)),
						holiday: countHoliday,
						color: "#60a5fa",
						left: 60 * rangeDay - 60,
						leftHoliday: 60 * (rangeDay - countHolidayRange) - 60,
						width: 60 * durationDay,
						widthHoliday: 60 * (durationDay - countHoliday),
					});
					newTaks.push({
						start: res.start,
						end: res.end,
						name: res.name,
						id: res.id,
						activity: res.activity,
						progress: res.progress,
						duration: res.duration,
						gapleft: res.gapleft,
						gaprigth: res.gaprigth,
						holiday: res.holiday,
						left: res.left,
						leftHoliday: res.leftHoliday,
						width: res.width,
						widthHoliday: res.Holiday,
						color: res.color,
					});
				} else {
					newTaks.push({
						start: res.start,
						end: res.end,
						name: res.name,
						id: res.id,
						activity: res.activity,
						progress: res.progress,
						duration: res.duration,
						gapleft: res.gapleft,
						gaprigth: res.gaprigth,
						holiday: res.holiday,
						left: res.left,
						leftHoliday: res.leftHoliday,
						width: res.width,
						color: res.color,
						widthHoliday: res.Holiday,
					});
				}
			}
		});
		if (tasks.length === parseInt(row.toString())) {
			newTaks.push({
				start: activityStar,
				end: activityEnd,
				name: activity.label,
				activity: activity,
				id: activityId,
				progress: 0,
				duration: durationDay - countHoliday,
				gapleft: rangeDay - 1,
				gaprigth: CountGapRight(rangeJob, (durationDay - countHoliday) + (rangeDay - 1)),
				holiday: countHoliday,
				color: "#60a5fa",
				left: 60 * rangeDay - 60,
				leftHoliday: 60 * (rangeDay - countHolidayRange) - 60,
				width: 60 * durationDay,
				widthHoliday: 60 * (durationDay - countHoliday),
			});
		}
		setTask(newTaks);
	};

	const editTask = () => {
		let newTaks: any = [];
		let taskEdit: any = [];
		let listDates: any = [];
		let countHoliday = 0;
		let countHolidayRange = 0;
		let listDatesRange: any = [];
		let rangeJob = countDay(starDate, endDate);
		let rangeDay = countDay(starDate, activityStar);
		let durationDay = countDay(activityStar, activityEnd);
		for (var i = 0; i < rangeDay; i++) {
			if (i === 0) {
				let unixTime = Math.floor(new Date(starDate).getTime() / 1000);
				listDatesRange.push(new Date(unixTime * 1000));
			} else {
				let unixTime = Math.floor(
					new Date(starDate).getTime() / 1000 + 86400 * i
				);
				listDatesRange.push(new Date(unixTime * 1000));
			}
		}
		for (var i = 0; i < durationDay; i++) {
			if (i === 0) {
				let unixTime = Math.floor(new Date(activityStar).getTime() / 1000);
				listDates.push(new Date(unixTime * 1000));
			} else {
				let unixTime = Math.floor(
					new Date(activityStar).getTime() / 1000 + 86400 * i
				);
				listDates.push(new Date(unixTime * 1000));
			}
		}
		if (holiday === "yes") {
			for (var i = 0; i < listDates.length; i++) {
				let holiday = checkHoliday(listDates[i], "duration");
				countHoliday = countHoliday + parseInt(holiday.toString());
			}
			for (var i = 0; i < listDatesRange.length; i++) {
				let holiday = checkHoliday(listDatesRange[i], "duration");
				countHolidayRange = countHolidayRange + parseInt(holiday.toString());
			}
		}
		tasks.map((res: any, i: number) => {
			if (dataRow !== i) {
				taskEdit.push(res);
			}
		});
		taskEdit.map((res: any, i: any) => {
			if (i === 0) {
				newTaks.push({
					start: res.start,
					end: res.end,
					name: res.name,
					id: res.id,
					activity: res.activity,
					progress: res.progress,
					duration: res.duration,
					gapleft: res.gapleft,
					gaprigth: res.gaprigth,
					holiday: res.holiday,
					left: res.left,
					leftHoliday: res.leftHoliday,
					width: res.width,
					widthHoliday: res.Holiday,
					color: res.color,
				});
			} else {
				if (i === parseInt(row.toString())) {
					newTaks.push({
						start: activityStar,
						end: activityEnd,
						name: activity.label,
						id: activityId,
						activity: activity,
						progress: 0,
						duration: durationDay - countHoliday,
						gapleft: rangeDay - 1,
						gaprigth: rangeJob - (durationDay - countHoliday) + (rangeDay - 1),
						holiday: countHoliday,
						color: "#60a5fa",
						left: 60 * rangeDay - 60,
						leftHoliday: 60 * (rangeDay - countHolidayRange) - 60,
						width: 60 * durationDay,
						widthHoliday: 60 * (durationDay - countHoliday),
					});
					newTaks.push({
						start: res.start,
						end: res.end,
						name: res.name,
						id: res.id,
						activity: res.activity,
						progress: res.progress,
						duration: res.duration,
						gapleft: res.gapleft,
						gaprigth: res.gaprigth,
						holiday: res.holiday,
						left: res.left,
						leftHoliday: res.leftHoliday,
						width: res.width,
						color: res.color,
						widthHoliday: res.Holiday,
					});
				} else {
					newTaks.push({
						start: res.start,
						end: res.end,
						name: res.name,
						id: res.id,
						activity: res.activity,
						progress: res.progress,
						duration: res.duration,
						gapleft: res.gapleft,
						gaprigth: res.gaprigth,
						holiday: res.holiday,
						left: res.left,
						leftHoliday: res.leftHoliday,
						width: res.width,
						color: res.color,
						widthHoliday: res.Holiday,
					});
				}
			}
		});
		if (taskEdit.length === parseInt(row.toString())) {
			newTaks.push({
				start: activityStar,
				end: activityEnd,
				name: activity.label,
				id: activityId,
				activity: activity,
				progress: 0,
				duration: durationDay - countHoliday,
				gapleft: rangeDay - 1,
				gaprigth: rangeJob - (durationDay - countHoliday) + (rangeDay - 1),
				holiday: countHoliday,
				color: "#60a5fa",
				left: 60 * rangeDay - 60,
				leftHoliday: 60 * (rangeDay - countHolidayRange) - 60,
				width: 60 * durationDay,
				widthHoliday: 60 * (durationDay - countHoliday),
			});
		}
		setIsEdit(false);
		setTask(newTaks);
	};

	const removeTask = () => {
		let newTasks: any = [];
		tasks.map((res: any, i: number) => {
			if (dataRow !== i) {
				newTasks.push(res);
			}
		});
		setActivityStar(tasks[0].start);
		setActivityEnd(tasks[0].end);
		setIsEdit(false);
		setTask(newTasks);
	};

	const cancelTask = () => {
		setActivityStar(tasks[0].start);
		setActivityEnd(tasks[0].end);
		setIsEdit(false);
	};

	const CountGapRight = (rangeJob: number, duration: number) => {
		return rangeJob - duration
	}

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		var year = dateObj.getUTCFullYear();
		const id =
			year.toString() +
			"/" +
			month.toString() +
			"/" +
			"TS-DW/" +
			Math.floor(Math.random() * 10000) +
			1;
		setIdAutoNum(id);
	};

	const addSchedule = async (payload: any) => {
		setIsLoading(true);
		let dataBody: any;
		let aktivitas: any = [];
		tasks.map((res: any, i: number) => {
			if (i !== 0) {
				aktivitas.push({
					workId: res.id,
					days: res.duration,
					holiday_count: res.holiday,
					progress: res.progress,
					startday: res.start,
					endday: res.end,
				});
			}
		});
		dataBody = {
			idTs: idAutoNum,
			worId: payload.worId,
			timesch: payload.timesch,
			holiday: holiday === "yes" ? true : false,
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

	const showMonth = (countMoth: number, start: any, end: any) => {
		let listMoths: any = [];
		for (var i = 0; i < countMoth; i++) {
			let rangeDay = countDay(start, end);
			let countDate: number = 0;
			for (var idx = 0; idx < rangeDay; idx++) {
				if (idx === 0) {
					let unixTime = Math.floor(new Date(start).getTime() / 1000);
					let mothDate = getMonthName(new Date(unixTime * 1000).getMonth());
					if (mothDate === getMonthName(new Date(starDate).getMonth() + i)) {
						countDate = countDate + 1;
					}
				} else {
					let unixTime = Math.floor(
						new Date(start).getTime() / 1000 + 86400 * idx
					);
					let mothDate = getMonthName(new Date(unixTime * 1000).getMonth());
					if (mothDate === getMonthName(new Date(starDate).getMonth() + i)) {
						countDate = countDate + 1;
					}
				}
			}
			listMoths.push({
				moth: getMonthName(new Date(starDate).getMonth() + i),
				countDate: countDate,
			});
		}
		setListMonth(listMoths);
	};

	const showDate = (start: any, end: any) => {
		let listDates: any = [];
		let listDatesHoliday: any = [];
		let rangeDay = countDay(start, end);
		for (var i = 0; i < rangeDay; i++) {
			if (i === 0) {
				let unixTime = Math.floor(new Date(start).getTime() / 1000);
				listDatesHoliday.push(new Date(unixTime * 1000));
				listDates.push(new Date(unixTime * 1000));
			} else {
				let unixTime = Math.floor(new Date(start).getTime() / 1000 + 86400 * i);
				if (checkHoliday(new Date(unixTime * 1000), "") !== "none") {
					listDatesHoliday.push(new Date(unixTime * 1000));
				}
				listDates.push(new Date(unixTime * 1000));
			}
		}
		setNumDate(listDates.length);
		setListDate(listDates);
		setListDateHoliday(listDatesHoliday);
		showHoliday(listDates);
	};

	const showHoliday = (listDate: any) => {
		let count: number = 0;
		listDate.map((res: any, i: number) => {
			dateHoliday.map((result: any, idx: number) => {
				if (
					moment(result.date_holiday).format("DD-MMMM-YYYY") ===
					moment(res).format("DD-MMMM-YYYY")
				) {
					count = count + 1;
				}
			});
		});
		setNumHoliday(count);
		setIsShowGantt(true);
	};

	const getHolidays = async () => {
		try {
			const response = await GetAllHoliday();
			if (response.data) {
				setDateHoliday(response.data.result);
			}
		} catch (error) {
			setDateHoliday([]);
		}
	};

	const checkHoliday = (dataDate: any, use: string) => {
		let display = "";
		let count = 0;
		for (var i = 0; i < dateHoliday.length; i++) {
			if (
				moment(dateHoliday[i].date_holiday).format("DD-MMMM-YYYY") ===
				moment(dataDate).format("DD-MMMM-YYYY")
			) {
				display = "none";
				count = count + 1;
				break;
			}
		}
		if (use === "duration") {
			return count;
		} else {
			return display;
		}
	};

	const editActivity = (data: any, row: any) => {
		setRow(row);
		setDataRow(row);
		setDataSelected(data);
		setActivityId(data.id);
		setActivity(data.name);
		setActivityStar(data.start);
		setActivityEnd(data.end);
		setIsEdit(true);
	};

	const addActivity = async (data: any) => {
		setIsLoading(true);
		try {
			const response = await AddActivity(data);
			if (response) {
				toast.success("Add Activity Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				setIsCreateActivity(false);
			}
		} catch (error) {
			toast.error("Add Activity Failed", {
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

	const showCreateActivity = (data: any) => {
		setData(data);
		setIsCreateActivity(true);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			{isCreateActivity ? (
				<Formik
					initialValues={dataActivity}
					validationSchema={activitySchema}
					onSubmit={(values) => {
						addActivity(values);
					}}
					enableReinitialize
				>
					{({ handleChange, handleSubmit, errors, touched, values }) => (
						<Form>
							<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
								<Input
									id='name'
									name='name'
									placeholder='Activity Name'
									label='Activity Name'
									type='text'
									required={true}
									disabled={isLoading}
									withLabel={true}
									value={values.name}
									onChange={handleChange}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{errors.name && touched.name ? (
									<span className='text-red-500 text-xs'>{errors.name}</span>
								) : null}
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
									<button
										type='button'
										className='inline-flex justify-center rounded-full border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
										disabled={isLoading}
										onClick={() => {
											setIsCreateActivity(false);
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
											"Cancel"
										)}
									</button>
								</div>
							</div>
						</Form>
					)}
				</Formik>
			) : (
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
							<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<InputDate
										id='timesch'
										label='Time Schedule Date'
										value={new Date()}
										onChange={(value: any) => setFieldValue("timesch", value)}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
										classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
									/>
								</div>
								<div className='w-full'>
									<InputSelectSearch
										datas={listWor}
										id='worId'
										name='worId'
										placeholder='Job No'
										label='Job No'
										onChange={(e: any) => {
											selectWor(e.value);
											setFieldValue("worId", e.value.id);
										}}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
									/>
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
								<div className='w-full'>
									<InputArea
										id='subject'
										name='subject'
										placeholder='Subject'
										label='Subject'
										required={true}
										disabled={true}
										value={subject}
										row={2}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
							</Section>
							<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<InputArea
										id='jobDesc'
										name='jobDesc'
										placeholder='Job Description'
										label='Job Description'
										required={true}
										disabled={true}
										value={jobDesc}
										row={2}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
								<div className='w-full'>
									<Input
										id='startDate'
										placeholder='Start Date'
										label='Start Date'
										type='text'
										value={moment(new Date(starDate)).format('DD MMMM yyyy')}
										disabled={true}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
								<div className='w-full'>
									<Input
										id='endDate'
										placeholder='End Date'
										label='End Date'
										type='text'
										value={moment(new Date(endDate)).format('DD MMMM yyyy')}
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
											setHoliday(event.target.value);
										}}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									>
										<option defaultValue='no' selected>
											No
										</option>
										<option value='yes'>Yes</option>
									</InputSelect>
								</div>
							</Section>
							{isShowGantt ? (
								<>
									<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
										<div className='w-full'>
											<InputSelectSearch
												datas={listActivity}
												id='activity'
												name='activity'
												placeholder='Activity'
												label='Activity'
												value={activity}
												onChange={(e: any) => {
													setActivity(e);
													setActivityId(e.value.id);
												}}
												required={true}
												withLabel={true}
												className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
											/>
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
										<div className='w-full'>
											<InputSelect
												id='row'
												name='row'
												placeholder='Row'
												label='Row'
												onChange={(event: any) => {
													setRow(event.target.value);
												}}
												required={true}
												withLabel={true}
												className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
											>
												<option value={tasks.length} selected>
													Choose Row
												</option>
												{tasks.map((res: any, i: number) => {
													if (isEdit) {
														return (
															<>
																{i === tasks.length - 1 ? null : (
																	<option
																		key={i}
																		value={i + 1}
																		selected={dataRow === i + 1 ? true : false}
																	>
																		{i + 1}
																	</option>
																)}
															</>
														);
													} else {
														return (
															<option key={i} value={i + 1}>
																{i + 1}
															</option>
														);
													}
												})}
											</InputSelect>
										</div>
									</Section>
									{isEdit ? (
										<div className='flex mt-3'>
											<button
												type='button'
												className='flex bg-green-600 text-white rounded-md p-1 hover:bg-green-400'
												onClick={() => editTask()}
											>
												<Edit size={18} className='mt-1 mr-1' />
												Edit
											</button>
											<button
												type='button'
												className='flex text-white bg-red-600 rounded-md p-1 ml-4 hover:bg-red-400'
												onClick={() => removeTask()}
											>
												<Trash2 size={18} className='mt-1 mr-1' />
												Remove
											</button>
											<button
												type='button'
												className='flex text-white bg-orange-600 rounded-md p-1 ml-4 hover:bg-orange-400'
												onClick={() => cancelTask()}
											>
												<X size={18} className='mt-1 mr-1' />
												Cancel
											</button>
										</div>
									) : (
										<div>
											<button
												type='button'
												className='flex text-white bg-blue-600 rounded-md p-1 hover:bg-blue-400'
												onClick={() => addTask()}
											>
												<Plus size={18} className='mt-1 mr-1' />
												Add Task
											</button>
										</div>
									)}
									<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-8 text-xs'>
										<table className='w-full'>
											<thead></thead>
											<tbody>
												<tr>
													<td
														className='border border-black text-center w-[2%]'
														rowSpan={2}
													>
														No
													</td>
													<td
														className='border border-black text-center w-[20%]'
														rowSpan={2}
													>
														Activity
													</td>
													{listMoth.map((res: any, i: number) => {
														return (
															<td
																className='border border-black text-center'
																key={i}
																colSpan={res.countDate}
															>
																{res.moth}
															</td>
														);
													})}
												</tr>
												<tr>
													{listDate.map((res: any, i: number) => {
														return (
															<td
																className='border border-black text-center'
																key={i}
															>
																{moment(res).format("D")}
															</td>
														);
													})}
												</tr>
												{tasks.map((res: any, i: number) => {
													return (
														<tr key={i}>
															<td className='border border-black text-center w-[2%]'>
																{i === 0 ? '' : i}
															</td>
															<td className='border border-black text-center w-[20%]'>
																{res.name}
															</td>
															{res.gapleft > 0 ? (
																<td
																	className='border border-black border-r-0'
																	colSpan={res.gapleft}
																>
																	<div></div>
																</td>
															) : null}
															<td
																className={`border border-black ${
																	res.gapleft > 0 ? "border-l-0" : ""
																} ${res.gaprigth > 0 ? "border-r-0" : ""}`}
																colSpan={res.duration}
															>
																<div
																	className={`${
																		res.id === "Task"
																			? "bg-orange-500"
																			: "bg-yellow-500"
																	} w-full h-3 rounded-lg cursor-pointer`}
																	data-te-toggle='tooltip'
																	title={`
																		Activity: ${res.name} \nStart Date: ${moment(res.start).format(
																		"DD MMMM yyyy"
																	)}\nEnd Date: ${moment(res.end).format(
																		"DD MMMM yyyy"
																	)}\nDuration: ${res.duration} day`}
																	onClick={() => {
																		i === 0 ? "" : editActivity(res, i);
																		setActivity({
																			value: res.activity,
																			label: res.name,
																		});
																	}}
																></div>
															</td>
															{res.gaprigth > 0 ? (
																<td
																	className='border border-black border-l-0'
																	colSpan={res.gaprigth}
																>
																	<div></div>
																</td>
															) : null}
														</tr>
													);
												})}
											</tbody>
										</table>
										{/* <div className='flex'>
											<div className='w-[40%]'>
												<div className='flex w-full'>
													<div className='w-[10%]'>
														<div className='w-full border-t border-l border-gray-500 p-[2px]'>
															&nbsp;
														</div>
														<div className='w-full border-l  text-center border-gray-500 p-[2px]'>
															No
														</div>
														<div className='w-full border-l border-gray-500 p-[2px]'>
															&nbsp;
														</div>
													</div>
													<div className='w-full'>
														<div className='grid grid-cols-4 w-full'>
															<div className='w-full border-t border-l border-r border-gray-500 p-[2px]'>
																&nbsp;
															</div>
															<div className='w-full border-t border-r border-gray-500 p-[2px]'>
																&nbsp;
															</div>
															<div className='w-full border-t border-r border-gray-500 p-[2px]'>
																&nbsp;
															</div>
															<div className='w-full border-t border-r border-gray-500 p-[2px]'>
																&nbsp;
															</div>
															<div className='w-full text-center border-l border-r border-gray-500 p-[2px]'>
																Aktivitas
															</div>
															<div className='w-full border-r border-gray-500 text-center p-[2px]'>
																Start Date
															</div>
															<div className='w-full border-r border-gray-500 text-center p-[2px]'>
																End Date
															</div>
															<div className='w-full border-r border-gray-500 text-center p-[2px]'>
																Duration
															</div>
															<div className='w-full border-l border-r border-gray-500 p-[2px]'>
																&nbsp;
															</div>
															<div className='w-full border-r border-gray-500 p-[2px]'>
																&nbsp;
															</div>
															<div className='w-full border-r border-gray-500 p-[2px]'>
																&nbsp;
															</div>
															<div className='w-full border-r border-gray-500 p-[2px]'>
																&nbsp;
															</div>
														</div>
													</div>
												</div>
												{tasks.map((res: any, i: number) => {
													return (
														<div className='flex w-full' key={i}>
															<div className='w-[10%]'>
																<div
																	className={`w-full border-l border-t border-gray-500 text-justify m-auto h-14 p-2 ${
																		i === tasks.length - 1 ? "border-b" : ""
																	}`}
																>
																	<p className='text-center text-xs'>
																		{i === 0 ? "-" : i}
																	</p>
																</div>
															</div>
															<div className='w-full'>
																<div className='grid grid-cols-4 w-full'>
																	<div
																		className={`w-full text-xs border-l border-r border-t border-gray-500 text-justify m-auto h-14 p-2 ${
																			i === tasks.length - 1 ? "border-b" : ""
																		}`}
																	>
																			{res.name}
																	</div>
																	<div
																		className={`w-full border-r border-t border-gray-500 text-justify m-auto h-14 p-2 ${
																			i === tasks.length - 1 ? "border-b" : ""
																		}`}
																	>
																		<p className='text-center text-xs'>
																			{moment(res.start).format("DD-MM-YYYY")}
																		</p>
																	</div>
																	<div
																		className={`w-full border-r border-t border-gray-500 text-justify m-auto h-14 p-2 ${
																			i === tasks.length - 1 ? "border-b" : ""
																		}`}
																	>
																		<p className='text-center text-xs'>
																			{moment(res.end).format("DD-MM-YYYY")}
																		</p>
																	</div>
																	<div
																		className={`w-full border-r border-t border-gray-500 text-justify m-auto h-14 p-2 ${
																			i === tasks.length - 1 ? "border-b" : ""
																		}`}
																	>
																		<p className='text-center text-xs'>
																			{res.duration} Days
																		</p>
																	</div>
																</div>
															</div>
														</div>
													);
												})}
											</div>
											<div className='w-[60%]'>
												<div className='grid grid-cols-1 w-full overflow-auto'>
													<div
														style={{
															width: `${
																holiday === "yes"
																	? 60 * listDateHoliday.length
																	: 60 * numDate
															}px`,
														}}
														className={`border-t border-r border-gray-500 p-[2px]`}
													>
														<div className='text-center'>Calender</div>
													</div>
													<div
														style={{
															width: `${
																holiday === "yes"
																	? 60 * listDateHoliday.length
																	: 60 * numDate
															}px`,
															gridTemplateColumns: `repeat(${numMoth}, minmax(0, 1fr))`,
														}}
														className={`grid border-t border-b border-r border-gray-500 p-[2px]`}
													>
														{listMoth.map((res: any, i: number) => {
															return (
																<div key={i} className='w-full text-center'>
																	{res}
																</div>
															);
														})}
													</div>
													<div
														style={{
															width: `${
																holiday === "yes"
																	? 60 * listDateHoliday.length
																	: 60 * numDate
															}px`,
														}}
														className={`flex border-gray-500`}
													>
														{holiday === "yes"
															? listDateHoliday.map((res: any, i: number) => {
																	return (
																		<div
																			key={i}
																			style={{
																				width: "60px",
																				display: `${
																					holiday === "yes"
																						? checkHoliday(res, "chart")
																						: ""
																				}`,
																			}}
																			className={`w-full text-center ${
																				i !== listDateHoliday.length + 1
																					? "border-r"
																					: ""
																			} border-b border-gray-500`}
																		>
																			{moment(res).format("dd DD")}
																		</div>
																	);
															  })
															: listDate.map((res: any, i: number) => {
																	return (
																		<div
																			key={i}
																			style={{
																				width: "60px",
																				display: `${
																					holiday === "yes"
																						? checkHoliday(res, "chart")
																						: ""
																				}`,
																			}}
																			className={`w-full text-center ${
																				i !== listDate.length + 1
																					? "border-r"
																					: ""
																			} border-b border-gray-500`}
																		>
																			{moment(res).format("dd DD")}
																		</div>
																	);
															  })}
													</div>
													{tasks.map((result: any, idx: number) => {
														return (
															<div
																key={idx}
																style={{
																	width: `${
																		holiday === "yes"
																			? 60 * listDateHoliday.length
																			: 60 * numDate
																	}px`,
																}}
																className={`flex relative ${
																	idx === tasks.length - 1 ? "border-b" : ""
																} border-gray-500 h-14`}
															>
																{holiday === "yes"
																	? listDateHoliday.map(
																			(res: any, i: number) => {
																				return (
																					<div
																						key={i}
																						style={{
																							width: `${
																								holiday === "yes"
																									? 60 * listDateHoliday.length
																									: 60 * numDate
																							}px`,
																							display: `${
																								holiday === "yes"
																									? checkHoliday(res, "chart")
																									: ""
																							}`,
																						}}
																						className={`text-center border-r border-gray-400 p-4`}
																					>
																						<p className='p-[1px]'>&nbsp;</p>
																					</div>
																				);
																			}
																	  )
																	: listDate.map((res: any, i: number) => {
																			return (
																				<div
																					key={i}
																					style={{
																						width: `${
																							holiday === "yes"
																								? 60 * listDateHoliday.length
																								: 60 * numDate
																						}px`,
																						display: `${
																							holiday === "yes"
																								? checkHoliday(res, "chart")
																								: ""
																						}`,
																					}}
																					className={`text-center border-r border-gray-400 p-4`}
																				>
																					<p className='p-[1px]'>&nbsp;</p>
																				</div>
																			);
																	  })}
																<div
																	style={{
																		width: `${
																			holiday === "yes"
																				? result.widthHoliday
																				: result.width
																		}px`,
																		left: `${
																			holiday === "yes"
																				? result.leftHoliday
																				: result.left
																		}px`,
																		backgroundColor: `${result.color}`,
																	}}
																	className={`absolute p-2 my-2 bg-blue-400 rounded-lg cursor-pointer`}
																	data-te-toggle='tooltip'
																	title={`
																		Activity: ${result.name} \nDuration: ${result.duration} day \nProgress: ${result.progress}%`}
																	onClick={() =>
																		idx === 0 ? "" : editActivity(result, idx)
																	}
																>
																	<p className='p-0 text-center font-semibold text-xs'>
																		{result.duration} days
																	</p>
																</div>
															</div>
														);
													})}
												</div>
											</div>
										</div> */}
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
								</>
							) : null}
						</Form>
					)}
				</Formik>
			)}
		</div>
	);
};
