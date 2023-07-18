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
	const [listMoth, setListMonth] = useState<any>([]);
	const [listDate, setListDate] = useState<any>([]);
	const [aktivitas, setAktivitas] = useState<any>([]);
	const [holiday, setHoliday] = useState<any>([]);
	// const [tableCalender, setTableCalender] = useState<any>([]);

	useEffect(() => {
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
			) + 1
		);
		showDate();
		getHolidays();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		let dataAktivitas: any = [];
		dataSelected.aktivitas.map((res: any) => {
			let rangeDay = countDay(dataSelected.wor.date_of_order, res.startday);
			dataAktivitas.push({
				...res,
				left: 60 * rangeDay - 30,
				width: 60 * (res.days + res.holiday_count) - 60,
			});
		});
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

	const showDate = () => {
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
	};

	const getHolidays = async () => {
		try {
			const response = await GetAllHoliday();
			if (response.data) {
				setHoliday(response.data.result);
			}
		} catch (error) {
			setHoliday([]);
		}
	};

	const checkHoliday = (dataDate: any) => {
		let color = "";
		for (var i = 0; i < holiday.length; i++) {
			if (
				moment(holiday[i].date_holiday).format("DD-MMMM-YYYY") ===
				moment(dataDate).format("DD-MMMM-YYYY")
			) {
				color = "#FA8072";
				break;
			}
		}
		return color;
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
							{dataSelected.holiday ? (
								<div className='flex justify-end'>
									<div
										style={{ backgroundColor: "#FA8072" }}
										className='w-4 h-4'
									></div>
									<div className='ml-2'>Holiday</div>
								</div>
							) : (
								""
							)}
							<div className='flex'>
								<div className='w-[40%]'>
									<div className='grid grid-cols-3 w-full'>
										<div className='w-full border-t border-l border-r border-gray-500 p-[2px]'>
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
										<div className='w-full border-l border-r border-gray-500 p-[2px]'>
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
											<div className='grid grid-cols-3 w-full' key={i}>
												<div className='w-full border border-gray-500 text-justify p-4'>
													<p className='text-center'>
														{res.masterAktivitas.name}
													</p>
												</div>
												<div className='w-full border border-gray-500 text-justify p-4'>
													<p className='text-center'>
														{moment(res.startday).format("DD-MM-YYYY")}
													</p>
												</div>
												<div className='w-full border border-gray-500 text-justify p-4'>
													<p className='text-center'>
														{moment(res.endday).format("DD-MM-YYYY")}
													</p>
												</div>
											</div>
										);
									})}
								</div>
								<div className='w-[60%]'>
									<div className='grid grid-cols-1 w-full overflow-auto'>
										<div
											style={{ width: `${60 * numDate}px` }}
											className={`border-t border-r border-gray-500 p-[2px]`}
										>
											<div className='text-center'>Calender</div>
										</div>
										<div
											style={{ width: `${60 * numDate}px` }}
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
											style={{ width: `${60 * numDate}px` }}
											className={`flex border-gray-500`}
										>
											{listDate.map((res: any, i: number) => {
												return (
													<div
														key={i}
														style={{ width: "60px" }}
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
													style={{ width: `${60 * numDate}px` }}
													className={`flex relative ${
														idx === aktivitas.length - 1 ? "border-b" : ""
													} border-gray-500`}
												>
													{listDate.map((res: any, i: number) => {
														return (
															<div
																key={i}
																style={{
																	width: `${60 * numDate}px`,
																	backgroundColor: `${
																		dataSelected.holiday
																			? checkHoliday(res)
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
															left: `${result.left}px`,
														}}
														className={`absolute p-2 my-2 bg-blue-400 rounded-lg cursor-move`}
														data-te-toggle='tooltip'
														title={`Activity: ${result.masterAktivitas.name} \nDuration: ${result.days} day \nProgress: ${result.progress}%`}
													>
														<p className='p-0 text-center font-semibold'>
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
