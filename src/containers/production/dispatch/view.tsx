import { useEffect, useState } from "react";
import moment from "moment";
import { Section } from "../../../components";
import { Printer } from "react-feather";
import { PdfDispatch } from "./pdfDispatch";
import {
	DispatchDetailStart,
	DispatchDetailFinish
} from "../../../services";
import { toast } from "react-toastify";
import { getId } from '../../../configs/session';

interface props {
	content: string;
	dataSelected: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewDispatch = ({ content, dataSelected, showModal }: props) => {
	console.log(dataSelected)
	const [dataPart, setDataPart] = useState<any>([]);
	const [activeTabs, setActiveTabs] = useState<any>("");
	const [isModal, setIsModal] = useState<boolean>(false);
	const [dataDetail, setDataDetail] = useState<any>(null);

	useEffect(() => {
		setPart();
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

	const startDetail = async (id: string) => {
		let dataBody = {
			actual : new Date()
		}
		try {
			const response = await DispatchDetailStart(id, dataBody);
			if (response.status === 201) {
				showModal(false, content, true);
				toast.success("Start Dispatch Detail Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
			} else {
				toast.error("Start Dispatch Detail Failed", {
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
		} catch (error) {
			toast.error("Start Dispatch Detail Failed", {
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

	const finishDetail = async (id: string) => {
		let dataBody = {
			finish : new Date(),
			approvebyID: getId(),
		}
		try {
			const response = await DispatchDetailFinish(id, dataBody);
			if (response.status === 201) {
				showModal(false, content, true);
				toast.success("Finish Dispatch Detail Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
			} else {
				toast.error("Finish Dispatch Detail Failed", {
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
		} catch (error) {
			toast.error("Finish Dispatch Detail Failed", {
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

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<PdfDispatch
				isModal={isModal}
				dataDispatch={dataSelected}
				dataDetail={dataDetail}
				showModalPdf={showModalPdf}
			/>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Dispatch</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Id Dispatch
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.id_dispatch}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Tanggal Dispatch
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{moment(dataSelected.dispacth_date).format("DD-MMMM-YYYY")}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Job No
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.timeschedule.wor.job_no} - (
										{dataSelected.timeschedule.wor.customerPo.quotations.Customer.name}
										)
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Equipment / Part
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.timeschedule.wor.customerPo.quotations.eqandpart.map(
											(res: any, i: number) => {
												return (
													<p key={i}>
														{res.equipment.nama + " / " + res.eq_part.nama_part}
													</p>
												);
											}
										)}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					{dataPart.map((res: any, i: number) => (
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
					))}
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<button
							className={`w-[70px] text-justify rounded-md border border-transparent bg-blue-500 hover:bg-blue-400 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => showModalPdf(activeTabs, true)}
						>
							<div className='flex px-1 py-1'>
								<Printer size={16} className='mr-1' /> Print
							</div>
						</button>
						<div className='w-full'>
							<table className='w-full'>
								<thead className='text-center'>
									<tr>
										<th className='border border-black border-collapse'>
											Work Center
										</th>
										<th className='border border-black border-collapse'>
											Start Date
										</th>
										<th className='border border-black border-collapse'>
											Actual
										</th>
										<th className='border border-black border-collapse'>
											Operator
										</th>
										<th className='border border-black border-collapse'>
											Approved By
										</th>
										<th className='border border-black border-collapse'>
											Finish Date
										</th>
										{/* <th className='border border-black border-collapse'></th> */}
									</tr>
								</thead>
								<tbody>
									{dataSelected.dispatchDetail
										.filter((part: any) => {
											return part.part === activeTabs;
										})
										.map((res: any, i: number) => {
											return (
												<tr key={i}>
													<td className='border border-black border-collapse pl-2'>
														{res.workCenter.name}
													</td>
													<td className='border border-black border-collapse pl-2'>
														{moment(res.start).format("DD-MMMM-YYYY")}
													</td>
													<td className='border border-black border-collapse pl-2'>
														{ res.actual === null ? '' : moment(res.actual).format("DD-MMMM-YYYY")}
													</td>
													<td className='border border-black border-collapse pl-2'>
														{res.Employee === null ? '' : res.Employee.employee_name }
													</td>
													<td className='border border-black border-collapse pl-2'>
														{res.approvebyID !== null ? res.approve.employee_name : '-' }
													</td>
													<td className='border border-black border-collapse pl-2'>
														{res.finish === null
															? ""
															: moment(res.finish).format("DD-MMMM-YYYY")}
													</td>
													{/* <td className='border border-black border-collapse pl-2'>
														{ res.approvebyID === null ? (
															<button
																className={`px-2 my-1.5 text-justify rounded-md border border-transparent ${res.actual === null ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400' } text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
																onClick={() => res.actual === null ? startDetail(res.id) : finishDetail(res.id) }
															>
																{ res.actual === null ? "Start" : "Finish" }
															</button>
														) : '' }
													</td> */}
												</tr>
											);
										})}
								</tbody>
							</table>
						</div>
					</Section>
				</>
			) : null}
		</div>
	);
};
