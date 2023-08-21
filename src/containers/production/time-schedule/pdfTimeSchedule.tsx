import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, FileText } from "react-feather";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Printer } from "react-feather";
import { Section } from "../../../components";
import moment from "moment";

interface props {
	isModal?: boolean;
	dataSelected?: any;
    aktivitas?: any;
    listDateHoliday?: any;
    listDate?: any;
    numMoth?: any;
    listMoth?: any;
    holiday?: any;
	showModalPdf: (val: boolean) => void;
}

export const PdfTimeSchedule = ({
	isModal,
	dataSelected,
    aktivitas,
    listDateHoliday,
    listDate,
    numMoth,
    listMoth,
    holiday,
	showModalPdf,
}: props) => {
	const printDocument = () => {
		const doc: any = document.getElementById("divToPrint");
		html2canvas(doc).then((canvas) => {
			const imgData = canvas.toDataURL("image/png");
			const pdf: any = new jsPDF("p", "mm", "a4");
			const width = pdf.internal.pageSize.getWidth();
			const height = pdf.internal.pageSize.getHeight();
			pdf.addImage(imgData, "JPEG", 0, 10, width, 0);
			// window.open(pdf.output("bloburl"), "_blank");
			pdf.save(`Time_schedulle_${dataSelected.wor.job_no}.pdf`);
		});
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
		<div className='z-80'>
			<Transition appear show={isModal} as={Fragment}>
				<Dialog
					as='div'
					className='relative w-full'
					onClose={() => showModalPdf(false)}
				>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-black z-20 bg-opacity-25 w-full h-screen' />
					</Transition.Child>

					<div className='fixed inset-0 z-40 overflow-y-auto w-full'>
						<div className='flex min-h-full items-center justify-center p-4 text-center'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<Dialog.Panel className='w-full max-w-6xl transform overflow-x-auto rounded-lg bg-white text-left align-middle shadow-xl transition-all'>
									<div
										className={`flex items-center justify-between px-5 py-[10px] bg-primary-400`}
									>
										<div className='flex items-center gap-2'>
											<div className='w-10 h-10 rounded-full bg-white flex justify-center items-center'>
												<FileText />
											</div>
											<Dialog.Title
												as='h4'
												className='text-base font-bold leading-6 text-white'
											>
												Download Time Schedule
											</Dialog.Title>
										</div>

										<button
											onClick={() => showModalPdf(false)}
											className='text-white text-sm font-semibold'
										>
											<X />
										</button>
									</div>
									<div className='text-center mt-3'>
										<button
											className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
											onClick={() => printDocument()}
										>
											<div className='flex px-1 py-1'>
												<Printer size={16} className='mr-1' /> Download PDF
											</div>
										</button>
									</div>
									<div className='my-4 mx-48 px-2' id='divToPrint'>
										{dataSelected ? (
											<div className='w-full my-4'>
												<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2 mb-3'>
													<table className='w-full'>
														<tr>
															<td className='w-[50%] pl-2 pb-2 border border-gray-200'>
																Id Time Schedulle
															</td>
															<td className='w-[50%] pl-2 pb-2 border border-gray-200'>
																{dataSelected.idTs}
															</td>
														</tr>
														<tr>
															<td className='w-[50%] pl-2 pb-2 border border-gray-200'>
																Job No
															</td>
															<td className='w-[50%] pl-2 pb-2 border border-gray-200'>
																{dataSelected.wor.job_no}
															</td>
														</tr>
														<tr>
															<td className='w-[50%] pl-2 pb-2 border border-gray-200'>
																Customer
															</td>
															<td className='w-[50%] pl-2 pb-2 border border-gray-200'>
																{
																	dataSelected.wor.customerPo.quotations
																		.Customer.name
																}
															</td>
														</tr>
														<tr>
															<td className='w-[50%] pl-2 pb-2 border border-gray-200'>
																Start date / End date
															</td>
															<td className='w-[50%] pl-2 pb-2 border border-gray-200'>
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
															<td className='w-[50%] pl-2 pb-2 border border-gray-200'>
																Holiday
															</td>
															<td className='w-[50%] pl-2 pb-2 border border-gray-200'>
																{dataSelected.holiday
																	? "Not Working"
																	: "Working"}
															</td>
														</tr>
													</table>
												</Section>
												<div className='flex'>
													<div className='w-[20%]'>
														<div className='flex w-full'>
															<div className='w-[20%]'>
																<div className='w-full border-t border-l border-gray-500 p-[6px]'>
																	&nbsp;
																</div>
																<div className='w-full border-l text-center border-gray-500 p-[6px]'>
																	No
																</div>
																<div className='w-full border-l border-gray-500 p-[6px]'>
																	&nbsp;
																</div>
															</div>
															<div className='w-full'>
																<div className='grid grid-cols-1 w-full'>
																	<div className='w-full border-t border-l border-r border-gray-500 p-[6px]'>
																		&nbsp;
																	</div>
																	<div className='w-full text-center border-l border-r border-gray-500 p-[6px]'>
																		Aktivitas
																	</div>
                                                                    <div className='w-full border-l border-r border-gray-500 p-[6px]'>
																		&nbsp;
																	</div>
																</div>
															</div>
														</div>
														{aktivitas.map((res: any, i: number) => {
															return (
																<div className='flex w-full' key={i}>
																	<div className='w-[20%]'>
																		<div
																			className={`w-full border-l border-t border-gray-500 text-justifym-auto h-14 p-2 ${
																				i === aktivitas.length - 1
																					? "border-b"
																					: ""
																			}`}
																		>
																			<p className='text-center text-xs p-[5px]'>
																				{i === 0 ? "-" : i}
																			</p>
																		</div>
																	</div>
																	<div className='w-full'>
																		<div className='grid grid-cols-1 w-full'>
																			<div
																				className={`w-full border-l border-r border-t border-gray-500 text-justifym-auto h-14 p-2 ${
																					i === aktivitas.length - 1
																						? "border-b"
																						: ""
																				}`}
																			>
																				<p className='text-center text-xs'>
																					{i === 0
																						? res.name
																						: res.masterAktivitas.name}
																				</p>
																			</div>
																		</div>
																	</div>
																</div>
															);
														})}
													</div>
													<div className='w-[80%]'>
														<div className='grid grid-cols-1 w-full overflow-auto'>
															<div
																style={{
																	width: `${
																		dataSelected.holiday
																			? 60 * listDateHoliday.length
																			: 60 * listDate.length
																	}px`,
																}}
																className={`border-t border-r border-gray-500 p-[2px]`}
															>
																<div className='text-center pb-2'>Calender</div>
															</div>
															<div
																style={{
																	width: `${
																		dataSelected.holiday
																			? 60 * listDateHoliday.length
																			: 60 * listDate.length
																	}px`,
																	gridTemplateColumns: `repeat(${numMoth}, minmax(0, 1fr))`,
																}}
																className={`grid border-t border-b border-r border-gray-500 p-[2px]`}
															>
																{listMoth.map((res: any, i: number) => {
																	return (
																		<div key={i} className='w-full text-center pb-2'>
																			{res}
																		</div>
																	);
																})}
															</div>
															<div
																style={{
																	width: `${
																		dataSelected.holiday
																			? 60 * listDateHoliday.length
																			: 60 * listDate.length
																	}px`,
																}}
																className={`flex border-gray-500`}
															>
																{dataSelected.holiday
																	? listDateHoliday.map(
																			(res: any, i: number) => {
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
																							i !== listDateHoliday.length + 1
																								? "border-r"
																								: ""
																						} border-b border-gray-500 pb-2`}
																					>
																						{moment(res).format("dd DD")}
																					</div>
																				);
																			}
																	  )
																	: listDate.map((res: any, i: number) => {
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
																						i !== listDate.length + 1
																							? "border-r"
																							: ""
																					} border-b border-gray-500 pb-2`}
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
																					? 60 * listDateHoliday.length
																					: 60 * listDate.length
																			}px`,
																		}}
																		className={`flex relative ${
																			idx === aktivitas.length - 1
																				? "border-b"
																				: ""
																		} border-gray-500 h-14`}
																	>
																		{dataSelected.holiday
																			? listDateHoliday.map(
																					(res: any, i: number) => {
																						return (
																							<div
																								key={i}
																								style={{
																									width: `${
																										dataSelected.holiday
																											? 60 *
																											  listDateHoliday.length
																											: 60 * listDate.length
																									}px`,
																									display: `${
																										dataSelected.holiday
																											? checkHoliday(
																													res,
																													"date"
																											  )
																											: ""
																									}`,
																								}}
																								className={`text-center border-r border-gray-400 border-b-gray-400 p-4`}
																							>
																								<p className='p-[1px]'>
																									&nbsp;
																								</p>
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
																									dataSelected.holiday
																										? 60 *
																										  listDateHoliday.length
																										: 60 * listDate.length
																								}px`,
																								display: `${
																									dataSelected.holiday
																										? checkHoliday(res, "date")
																										: ""
																								}`,
																							}}
																							className={`text-center border-r border-gray-400 border-b-gray-400 p-4`}
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
																			className={`absolute my-2 ${
																				idx === 0
																					? "bg-orange-400"
																					: "bg-blue-400"
																			} rounded-lg`}
																			data-te-toggle='tooltip'
																			title={`Activity: ${
																				idx === 0
																					? result.name
																					: result.masterAktivitas.name
																			} \nDuration: ${
																				idx === 0
																					? result.duration
																					: result.days
																			} day \nProgress: ${result.progress}%`}
																		>
																			<div
																				style={{
																					width:
																						idx === 0
																							? "100%"
																							: result.progress === 0
																							? "1%"
																							: result.progress + "%",
																				}}
																				className={`${
																					idx === 0
																						? "bg-orange-600"
																						: "bg-blue-600"
																				} p-2 rounded-lg`}
																			>
																				<p className='p-0 m-0 text-center font-semibold  text-xs'>
																					{idx === 0
																						? result.name
																						: result.progress + "%"}
																				</p>
																			</div>
																			{/* <p className='p-0 text-center font-semibold  text-xs'>
															{ idx === 0 ? result.duration : result.days} days
														</p> */}
																		</div>
																	</div>
																);
															})}
														</div>
													</div>
												</div>
											</div>
										) : null}
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
};
