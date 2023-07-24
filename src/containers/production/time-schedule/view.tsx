import { useEffect, useState } from "react";
import { Section } from "../../../components";
import { GetAllHoliday } from "../../../services";
import { monthDiff, getMonthName, countDay } from "../../../utils/dateFunction";
import moment from "moment";

interface props {
	content: string;
	dataSelected: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewSchedule = ({ content, dataSelected, showModal }: props) => {
	const [numMoth, setNumMonth] = useState<number>(0);
	const [numDate, setNumDate] = useState<number>(0);
	const [numHoliday, setNumHoliday] = useState<number>(0);
	const [listMoth, setListMonth] = useState<any>([]);
	const [listDate, setListDate] = useState<any>([]);
	const [aktivitas, setAktivitas] = useState<any>([]);
	const [holiday, setHoliday] = useState<any>([]);
	// const [tableCalender, setTableCalender] = useState<any>([]);

	useEffect(() => {
		getHolidays()
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
			) + 1
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if(holiday.length > 0 && aktivitas.length === 0){
			settingData()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [holiday]);

	const settingData = () => {
		let dataAktivitas: any = [];
		if(dataSelected){
			dataSelected.aktivitas.map((res: any) => {
				let listDatesRange: any = [];
				let countHolidayRange: any = 0;
				let rangeDay = countDay(dataSelected.wor.date_of_order, res.startday);
				let durationDay = countDay(res.startday, res.endday);
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
					left: 60 * rangeDay - 30,
					leftHoliday: 60 * (rangeDay - countHolidayRange) - 30,
					width: 60 * res.days - 60,
					widthHoliday: 60 * durationDay - 60,
				});
			});
		}
		setAktivitas(dataAktivitas);
	};

	const showMonth = (countMoth: number) => {
		let listMoths: any = [];
		for (var i = 0; i < countMoth; i++) {
			listMoths.push(
				getMonthName(new Date(dataSelected.wor.date_of_order).getMonth() + i)
			);
		}
		setListMonth(listMoths);
	};

	const showDate = (holiday: any) => {
		let listDates: any = [];
		let rangeDay = countDay(
			dataSelected.wor.date_of_order,
			dataSelected.wor.delivery_date
		);
		let lengthDay = 11;
		if (rangeDay > 11) {
			lengthDay = rangeDay;
		}
		for (var i = 0; i < lengthDay; i++) {
			if (i === 0) {
				let unixTime = Math.floor(
					new Date(dataSelected.wor.date_of_order).getTime() / 1000
				);
				listDates.push(new Date(unixTime * 1000));
			} else {
				let unixTime = Math.floor(
					new Date(dataSelected.wor.date_of_order).getTime() / 1000 + 86400 * i
				);
				listDates.push(new Date(unixTime * 1000));
			}
		}
		setNumDate(listDates.length);
		setListDate(listDates);
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

	const getHolidays = async () => {
		try {
			const response = await GetAllHoliday();
			if (response.data) {
				setHoliday(response.data.result);
				showDate(response.data.result);
			}
		} catch (error) {
			setHoliday([]);
		}
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

	return (
		<div className='px-5 pb-2 mt-4 overflow-hidden'>
			<h1 className='font-bold text-xl'>Time Schedulle</h1>
			{dataSelected ? (
				<>
					{numMoth > 0 ? (
						<>
							<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2 mb-3'>
								<table className='w-full'>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Id Time Schedulle
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.idTs}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Job No
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.wor.job_no}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Customer
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.wor.customerPo.quotations.Customer.name}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Start date / End date
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
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
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Holiday
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.holiday ? "Not Working" : "Working"}
										</td>
									</tr>
								</table>
							</Section>
							<h1 className='font-bold text-xl'>Aktivity</h1>
							<div className='flex'>
								<div className='w-[40%]'>
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
									{aktivitas.map((res: any, i: number) => {
										return (
											<div className='grid grid-cols-4 w-full' key={i}>
												<div className='w-full border border-gray-500 text-justifym-auto h-14 p-2'>
													<p className='text-center text-xs'>
														{res.masterAktivitas.name}
													</p>
												</div>
												<div className='w-full border border-gray-500 text-justify m-auto h-14 p-2'>
													<p className='text-center text-xs'>
														{moment(res.startday).format("DD-MM-YYYY")}
													</p>
												</div>
												<div className='w-full border border-gray-500 text-justify m-auto h-14 p-2'>
													<p className='text-center text-xs'>
														{moment(res.endday).format("DD-MM-YYYY")}
													</p>
												</div>
												<div className='w-full border border-gray-500 text-justify m-auto h-14 p-2'>
													<p className='text-center text-xs'>{res.days} days</p>
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
													dataSelected.holiday
														? 60 * (numDate - numHoliday + 1)
														: 60 * (numDate - numHoliday)
												}px`,
											}}
											className={`border-t border-r border-gray-500 p-[2px]`}
										>
											<div className='text-center'>Calender</div>
										</div>
										<div
											style={{
												width: `${
													dataSelected.holiday
														? 60 * (numDate - numHoliday + 1)
														: 60 * (numDate - numHoliday)
												}px`,
											}}
											className={`grid grid-cols-${numMoth} border-t border-b border-r border-gray-500 p-[2px]`}
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
													dataSelected.holiday
														? 60 * (numDate - numHoliday + 1)
														: 60 * (numDate - numHoliday)
												}px`,
											}}
											className={`flex border-gray-500`}
										>
											{listDate.map((res: any, i: number) => {
												return (
													<div
														key={i}
														style={{
															width: "60px",
															display: `${
																dataSelected.holiday
																	? checkHoliday(res, "date")
																	: ""
															}`,
														}}
														className={`w-full text-center ${
															i !== listDate.length + 1 ? "border-r" : ""
														} border-b border-gray-500`}
													>
														{moment(res).format("dd DD")}
													</div>
												);
											})}
										</div>
										{aktivitas.map((result: any, idx: number) => {
											return (
												<div
													key={idx}
													style={{
														width: `${
															dataSelected.holiday
																? 60 * (numDate - numHoliday + 1)
																: 60 * (numDate - numHoliday)
														}px`,
													}}
													className={`flex relative ${
														idx === aktivitas.length - 1 ? "border-b" : ""
													} border-gray-500 h-14`}
												>
													{listDate.map((res: any, i: number) => {
														return (
															<div
																key={i}
																style={{
																	width: `${
																		dataSelected.holiday
																			? 60 * (numDate - numHoliday + 1)
																			: 60 * (numDate - numHoliday)
																	}px`,
																	display: `${
																		dataSelected.holiday
																			? checkHoliday(res, "date")
																			: ""
																	}`,
																}}
																className={`text-center  ${
																	i !== listDate.length + 1
																		? "border-r border-b-gray-200"
																		: ""
																} ${
																	i === listDate.length - 1
																		? "border-black"
																		: "border-gray-200"
																} p-4`}
															>
																<p className='p-[1px]'>&nbsp;</p>
															</div>
														);
													})}
													<div
														style={{
															width: `${result.width}px`,
															left: `${
																dataSelected.holiday
																	? result.leftHoliday
																	: result.left
															}px`,
														}}
														className={`absolute p-2 my-2 bg-blue-400 rounded-lg`}
														data-te-toggle='tooltip'
														title={`Activity: ${result.masterAktivitas.name} \nDuration: ${result.days} day \nProgress: ${result.progress}%`}
													>
														<p className='p-0 text-center font-semibold  text-xs'>
															{result.masterAktivitas.name}
														</p>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</>
					) : null}
				</>
			) : null}
		</div>
	);
};
