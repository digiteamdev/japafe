import { useEffect, useState } from "react";
import { Section } from "../../../components";
import {
	GetAllHoliday,
	ApproveScheduleSpv,
	ApproveScheduleManager,
} from "../../../services";
import { monthDiff, getMonthName, countDay } from "../../../utils/dateFunction";
import { PdfTimeSchedule } from "./pdfTimeSchedule";
import { getPosition } from "../../../configs/session";
import moment from "moment";
import { Printer, Check, X } from "react-feather";
import { toast } from "react-toastify";

interface props {
	content: string;
	dataSelected: any;
	holiday: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewSchedule = ({
	content,
	dataSelected,
	holiday,
	showModal,
}: props) => {
	const [numMoth, setNumMonth] = useState<number>(0);
	const [numDate, setNumDate] = useState<number>(0);
	const [numHoliday, setNumHoliday] = useState<number>(0);
	const [listMoth, setListMonth] = useState<any>([]);
	const [listDate, setListDate] = useState<any>([]);
	const [position, setPosition] = useState<any>([]);
	const [listDateHoliday, setListDateHoliday] = useState<any>([]);
	const [aktivitas, setAktivitas] = useState<any>([]);
	const [isModal, setIsModal] = useState<boolean>(false);
	// const [tableCalender, setTableCalender] = useState<any>([]);

	useEffect(() => {
		let positionAkun = getPosition();
		if (positionAkun !== undefined) {
			setPosition(positionAkun);
		}
		showDate();
		settingData();
		setNumMonth(
			monthDiff(
				new Date(dataSelected.wor.date_of_order),
				new Date(dataSelected.wor.delivery_date)
			) + 1
		);
		showMonth(
			monthDiff(
				new Date(dataSelected.wor.date_of_order),
				new Date(dataSelected.wor.delivery_date)
			) + 1, dataSelected.wor.date_of_order, dataSelected.wor.delivery_date
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		let dataAktivitas: any = [];
		if (dataSelected) {
			let listDates: any = [];
			let countHoliday = 0;
			let durationDay = countDay(
				dataSelected.wor.date_of_order,
				dataSelected.wor.delivery_date
			);
			if (dataSelected.holiday) {
				for (var i = 0; i < durationDay; i++) {
					if (i === 0) {
						let unixTime = Math.floor(
							new Date(dataSelected.wor.date_of_order).getTime() / 1000
						);
						listDates.push(new Date(unixTime * 1000));
					} else {
						let unixTime = Math.floor(
							new Date(dataSelected.wor.date_of_order).getTime() / 1000 +
								86400 * i
						);
						listDates.push(new Date(unixTime * 1000));
					}
				}
				for (var i = 0; i < listDates.length; i++) {
					let holiday = checkHoliday(listDates[i], "duration");
					countHoliday = countHoliday + parseInt(holiday.toString());
				}
			}
			dataAktivitas.push({
				start: new Date(dataSelected.wor.date_of_order),
				end: new Date(dataSelected.wor.delivery_date),
				name: dataSelected.wor.job_no,
				id: "Task",
				progress: 0,
				duration: durationDay - countHoliday,
				holiday: countHoliday,
				color: "#facc15",
				left: 0,
				width: 60 * (durationDay - countHoliday),
				gapleft: 0,
				gaprigth: 0
			});
			dataSelected.aktivitas.map((res: any) => {
				let listDatesRange: any = [];
				let countHolidayRange: any = 0;
				let rangeDay = countDay(dataSelected.wor.date_of_order, res.startday);
				if (dataSelected.holiday) {
					for (var i = 0; i < rangeDay; i++) {
						if (i === 0) {
							let unixTime = Math.floor(
								new Date(dataSelected.wor.date_of_order).getTime() / 1000
							);
							listDatesRange.push(new Date(unixTime * 1000));
							let holiday = checkHoliday(new Date(unixTime * 1000), "duration");
							countHolidayRange =
								countHolidayRange + parseInt(holiday.toString());
						} else {
							let unixTime = Math.floor(
								new Date(dataSelected.wor.date_of_order).getTime() / 1000 +
									86400 * i
							);
							listDatesRange.push(new Date(unixTime * 1000));
							let holiday = checkHoliday(new Date(unixTime * 1000), "duration");
							countHolidayRange =
								countHolidayRange + parseInt(holiday.toString());
						}
					}
				}
				dataAktivitas.push({
					...res,
					gapleft: rangeDay - 1,
					gaprigth: CountGapRight(durationDay, res.days + (rangeDay - 1) ),
					left: 60 * (rangeDay - countHolidayRange) - 60,
					width: 60 * res.days,
				});
			});
		}
		setAktivitas(dataAktivitas);
	};

	const CountGapRight = (rangeJob: number, duration: number) => {
		return rangeJob - duration
	}

	const showMonth = (countMoth: number, start: any, end: any) => {
		let listMoths: any = [];
		for (var i = 0; i < countMoth; i++) {
			let rangeDay = countDay(start, end);
			let countDate: number = 0;
			for (var idx = 0; idx < rangeDay; idx++) {
				if (idx === 0) {
					let unixTime = Math.floor(new Date(start).getTime() / 1000);
					let mothDate = getMonthName(new Date(unixTime * 1000).getMonth());
					if (mothDate === getMonthName(new Date(start).getMonth() + i)) {
						countDate = countDate + 1;
					}
				} else {
					let unixTime = Math.floor(
						new Date(start).getTime() / 1000 + 86400 * idx
					);
					let mothDate = getMonthName(new Date(unixTime * 1000).getMonth());
					if (mothDate === getMonthName(new Date(start).getMonth() + i)) {
						countDate = countDate + 1;
					}
				}
			}
			listMoths.push({
				moth: getMonthName(new Date(start).getMonth() + i),
				countDate: countDate,
			});
		}
		setListMonth(listMoths);
	};

	const showDate = () => {
		let listDates: any = [];
		let listDatesHoliday: any = [];
		let rangeDay = countDay(
			dataSelected.wor.date_of_order,
			dataSelected.wor.delivery_date 
		);
		for (var i = 0; i < rangeDay; i++) {
			if (i === 0) {
				let unixTime = Math.floor(
					new Date(dataSelected.wor.date_of_order).getTime() / 1000
				);
				if (checkHoliday(new Date(unixTime * 1000), "") !== "none") {
					listDatesHoliday.push(new Date(unixTime * 1000));
				}
				listDates.push(new Date(unixTime * 1000));
			} else {
				let unixTime = Math.floor(
					new Date(dataSelected.wor.date_of_order).getTime() / 1000 + 86400 * i
				);
				if (checkHoliday(new Date(unixTime * 1000), "") !== "none") {
					listDatesHoliday.push(new Date(unixTime * 1000));
				}
				listDates.push(new Date(unixTime * 1000));
			}
		}
		setNumDate(listDates.length);
		setListDate(listDates);
		setListDateHoliday(listDatesHoliday);
		if (dataSelected.holiday) {
			showHoliday(listDates, holiday);
		}
	};

	const showHoliday = (listDate: any, dateHoliday: any) => {
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
	};

	const checkHoliday = (dataDate: any, type: string) => {
		let display = "";
		let countHoliday = 0;
		for (var i = 0; i < holiday.length; i++) {
			if (
				moment(holiday[i].date_holiday).format("DD-MMMM-YYYY") ===
				moment(dataDate).format("DD-MMMM-YYYY")
			) {
				display = "none";
				countHoliday = countHoliday + 1;
				break;
			}
		}
		if (type === "duration") {
			return countHoliday;
		} else {
			return display;
		}
	};

	const showModalPdf = (val: boolean) => {
		setIsModal(val);
	};

	const approve = async (val: string) => {
		try {
			if (val === "Supervisor") {
				const response = await ApproveScheduleSpv(dataSelected.id);
				if (response.status === 201) {
					toast.success("Approve Success", {
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
				} else {
					toast.error("Approve Failed", {
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
			} else {
				const response = await ApproveScheduleManager(dataSelected.id);
				if (response.status === 201) {
					toast.success("Approve Success", {
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
				} else {
					toast.error("Approve Failed", {
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
			}
		} catch (error) {
			toast.error("Approve Failed", {
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
	};

	const showButtonValid = (data: any) => {
		if (position === "Supervisor") {
			if (data.status_spv === null || data.status_spv === "unvalid") {
				return (
					<button
						className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
						onClick={() => approve("Supervisor")}
					>
						<div className='flex px-1 py-1'>
							<Check size={16} className='mr-1' /> Valid SPV
						</div>
					</button>
				);
			} else {
				return (
					<button
						className={`justify-center rounded-full border border-transparent bg-gray-500 hover:bg-gray-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
						onClick={() => approve("Supervisor")}
					>
						<div className='flex px-1 py-1'>
							<X size={16} className='mr-1' /> Unvalid SPV
						</div>
					</button>
				);
			}
		} else if (position === "Manager") {
			if (data.status_manager === "unvalid" || data.status_manager === null) {
				return (
					<button
						className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
						onClick={() => approve("Manager")}
					>
						<div className='flex px-1 py-1'>
							<Check size={16} className='mr-1' /> Valid Manager
						</div>
					</button>
				);
			} else {
				return (
					<button
						className={`justify-center rounded-full border border-transparent bg-gray-500 hover:bg-gray-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
						onClick={() => approve("Manager")}
					>
						<div className='flex px-1 py-1'>
							<Check size={16} className='mr-1' /> Unvalid Manager
						</div>
					</button>
				);
			}
		}
	};

	const calculatePlanning = (date: any) => {
		let bobot: number = 0
		aktivitas.map( (res:any, i:number) => {
			let datePlanning = Math.floor(new Date(res.startday).getTime() / 1000)
			if( i !== 0){
				if( datePlanning <= date ){
					bobot = bobot + res.bobot
				}
			}
		})
		return `${bobot}%`
	}
	
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			{/* <PdfTimeSchedule
				isModal={isModal}
				dataSelected={dataSelected}
				showModalPdf={setIsModal}
				aktivitas={aktivitas}
				listDateHoliday={listDateHoliday}
				listDate={listDate}
				listMoth={listMoth}
				numMoth={numMoth}
				holiday={holiday}
			/> */}
			<h1 className='font-bold text-xl'>Time Schedulle</h1>
			{dataSelected ? (
				<>
					<div className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1'>
						<div className='text-right mr-6'>
							{/* <button
								className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
								onClick={() => showModalPdf(true)}
							>
								<div className='flex px-1 py-1'>
									<Printer size={16} className='mr-1' /> Print
								</div>
							</button> */}
							{showButtonValid(dataSelected)}
						</div>
					</div>
					{aktivitas.length > 0 ? (
						<>
							<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2 mb-3'>
								<table className='w-full'>
									<tr>
										<td className='sm:w-[50%] md:w-[25%]  bg-gray-300 pl-2 border border-gray-200'>
											Id Time Schedulle
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.idTs}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Job No
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.wor.job_no}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Customer
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.wor.customerPo.quotations.Customer.name}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Start date / End date
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{moment(dataSelected.wor.date_of_order).format(
												"DD-MMMM-YYYY"
											)}{" "}
											/{" "}
											{moment(dataSelected.wor.delivery_date).format(
												"DD-MMMM-YYYY"
											)}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Holiday
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{dataSelected.holiday ? "Not Working" : "Working"}
										</td>
									</tr>
									{/* <tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Approval Supervisor
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.status_spv === "valid"
												? dataSelected.status_spv
												: "Unvalid"}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Approval Manager
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.status_manager === "valid"
												? dataSelected.status_manager
												: "Unvalid"}
										</td>
									</tr> */}
								</table>
							</Section>
							<h1 className='font-bold text-xl'>Aktivity</h1>
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
										{aktivitas.map((res: any, i: number) => {
											if(i !== 0){
												return (
													<tr key={i}>
														<td className='border border-black text-center w-[2%]'>
															{i === 0 ? '' : i}
														</td>
														<td className='border border-black text-center w-[20%]'>
															{ i === 0 ? res.name : res.work_scope_item.item}
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
															className={`border border-black p-2 ${
																res.gapleft > 0 ? "border-l-0" : ""
															} ${res.gaprigth > 0 ? "border-r-0" : ""}`}
															colSpan={ i === 0 ? res.duration : res.days}
														>
															<div
																className={`${
																	res.id === "Task"
																		? "bg-orange-500"
																		: "bg-yellow-500"
																} w-full h-4 rounded-lg cursor-pointer text-center text-xs`}
																data-te-toggle='tooltip'
																title={`
																			Activity: ${ i === 0 ? res.name : res.work_scope_item.item} \nStart Date: ${moment(res.start).format(
																	"DD MMMM yyyy"
																)}\nEnd Date: ${moment(res.end).format(
																	"DD MMMM yyyy"
																)}\nDuration: ${res.days} day`}
															>{ res.bobot }%</div>
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
												)
											}
										})}
										<tr>
											<td className="mt-2 text-center border border-black" colSpan={2}>Planning</td>
											{listDate.map((res: any, i: number) => {
												return (
													<td
														className='border border-black text-center bg-blue-500'
														key={i}
													>
														{ calculatePlanning(Math.floor(res / 1000)) }
													</td>
												);
											})}
										</tr>
										<tr>
											<td className="mt-2 text-center border border-black" colSpan={2}>Actual</td>
											{listDate.map((res: any, i: number) => {
												return (
													<td
														className='border border-black text-center bg-green-500'
														key={i}
													>
														0%
													</td>
												);
											})}
										</tr>
									</tbody>
								</table>
							</Section>
						</>
					) : null}
				</>
			) : null}
		</div>
	);
};
