import { useEffect, useState } from "react";
import moment from "moment";
import { Section } from "../../../components";
import { Printer } from "react-feather";
import { PdfDispatch } from "./pdfDispatch";
import { DispatchDetailStart, DispatchDetailFinish } from "../../../services";
import { toast } from "react-toastify";
import { getId } from "../../../configs/session";

interface props {
	content: string;
	dataSelected: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewDispatch = ({ content, dataSelected, showModal }: props) => {
	const [dataPart, setDataPart] = useState<any>([]);
	const [activeTabs, setActiveTabs] = useState<any>("");
	const [isModal, setIsModal] = useState<boolean>(false);
	const [dataDetail, setDataDetail] = useState<any>(null);

	useEffect(() => {
		// setPart();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const setPart = () => {
		let part: any = [];
		dataSelected.dispatchDetail.map((res: any) => {
			if (!part.includes(res.part)) {
				part.push(res.part);
			}
		});
		setActiveTabs(part[0]);
		setDataPart(part);
	};

	const showModalPdf = (res: any, val: boolean) => {
		setDataDetail(res);
		setIsModal(val);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			{/* <PdfDispatch
				isModal={isModal}
				dataDispatch={dataSelected}
				dataDetail={dataDetail}
				showModalPdf={showModalPdf}
			/> */}
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Dispatch</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Job No
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.srimg.timeschedule.wor.job_no}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Customer
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{
											dataSelected.srimg.timeschedule.wor.customerPo.quotations
												.Customer.name
										}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Subject
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{
											dataSelected.srimg.timeschedule.wor.customerPo.quotations
												.subject
										}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Tanggal Dispatch
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{moment(dataSelected.dispacth_date).format("DD-MMMM-YYYY")}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Equipment
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.srimg.equipment} - {dataSelected.srimg.model}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					{/* {dataPart.map((res: any, i: number) => (
						<button
							key={i}
							className={`text-base font-semibold my-2 mr-4 ${
								res === activeTabs
									? "text-[#66B6FF] border-b-4 border-[#66B6FF]"
									: "text-[#9A9A9A]"
							}`}
							onClick={() => setActiveTabs(res)}
						>
							{res}
						</button>
					))} */}
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						{/* <button
							className={`w-[70px] text-justify rounded-md border border-transparent bg-blue-500 hover:bg-blue-400 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => showModalPdf(activeTabs, true)}
						>
							<div className='flex px-1 py-1'>
								<Printer size={16} className='mr-1' /> Print
							</div>
						</button> */}
						<div className='w-full text-sm'>
							<table className='w-full'>
								<thead className='text-center'>
									<tr>
										<th className='border border-black border-collapse'>
											Aktivitas
										</th>
										<th className='border border-black border-collapse'>
											Start - end
										</th>
										<th className='border border-black border-collapse'>
											Actual
										</th>
										<th className='border border-black border-collapse'>
											Departemen
										</th>
										<th className='border border-black border-collapse'>
											Operator
										</th>
									</tr>
								</thead>
								<tbody>
									{dataSelected.dispatchDetail.map(
										(res: any, i: number) => {
											return (
												<tr key={i}>
													<td className='border border-black border-collapse text-center'>
														{ res.aktivitas.work_scope_item.item }
													</td>
													<td className='border border-black border-collapse text-center'>
														{ moment(res.aktivitas.startday).format('DD-MM-YYYY') } - { moment(res.aktivitas.endday).format('DD-MM-YYYY') }
													</td>
													<td className='border border-black border-collapse text-center'>
														{ res.aktivitas.actual_start === null ? "-" : `${moment(res.aktivitas.actual_start).format('DD-MM-YY, h:mm:ss a')}` } { res.aktivitas.actual_finish === null ? "-" : ` - ${moment(res.aktivitas.actual_finish).format('DD-MM-YY, h:mm:ss a')}` }
													</td>
													<td className='border border-black border-collapse text-center'>
														{ res.sub_depart.name }
													</td>
													<td className='border border-black border-collapse text-center'>
														{ res.operator.map( (res: any, i: number) => {
															return(
																<p key={i}>{ res.Employee.employee_name } { res.start !== null ? (
																	`( ${moment(res.start).format('DD-MM-YY, h:mm:ss a')} ${ res.finish !== null ? ( ` - ${moment(res.finish).format('DD-MM-YY, h:mm:ss a') }`) : "" } )`
																) : null } </p>
															)
														})}
													</td>
												</tr>
											);
										}
									)}
								</tbody>
							</table>
						</div>
					</Section>
				</>
			) : null}
		</div>
	);
};
