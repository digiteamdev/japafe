import { useEffect, useState } from "react";
import moment from "moment";
import { Section } from "../../../components";
import { ApproveSrSpv, ApproveSrManager } from "../../../services";
import { getPosition } from "../../../configs/session";
import { Check, X, Printer } from "react-feather";
import { toast } from "react-toastify";
import { PdfSr } from "./pdfSr";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewSR = ({ dataSelected, content, showModal }: props) => {
	const [position, setPosition] = useState<any>([]);
	const [isModal, setIsModal] = useState<boolean>(false);

	useEffect(() => {
		let positionAkun = getPosition();
		if (positionAkun !== undefined) {
			setPosition(positionAkun);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const approve = async (val: string) => {
		try {
			if (val === "Supervisor") {
				const response = await ApproveSrSpv(dataSelected.id);
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
				const response = await ApproveSrManager(dataSelected.id);
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

	const showModalPdf = (val: boolean) => {
		setIsModal(val);
	};

	const showButtonValid = (data: any) => {
		if (dataSelected.statusSr === "Request") {
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
					<button
						className={`justify-center rounded-full border border-transparent bg-gray-500 hover:bg-gray-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
						onClick={() => approve("Supervisor")}
					>
						<div className='flex px-1 py-1'>
							<X size={16} className='mr-1' /> Unvalid SPV
						</div>
					</button>;
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
		}
	};
	console.log(dataSelected);
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{/* <PdfSr
				isModal={isModal}
				data={dataSelected}
				showModalPdf={showModalPdf}
			/> */}
			{dataSelected ? (
				<>
					<div className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1'>
						<div className='text-right mr-6'>
							<button
								className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
								onClick={() => showModalPdf(true)}
							>
								<div className='flex px-1 py-1'>
									<Printer size={16} className='mr-1' /> Print
								</div>
							</button>
							{showButtonValid(dataSelected)}
						</div>
					</div>
					<h1 className='font-bold text-xl'>Service Request</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										No SR
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.no_sr}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Job No
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.job_no}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Date Sr
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{moment(dataSelected.date_sr).format("DD-MMMM-YYYY")}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Request By
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.user.username}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Valid Supervisor
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.status_spv === "valid"
											? dataSelected.status_spv
											: "Unvalid"}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Valid Manager
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.status_manager === "valid"
											? dataSelected.status_manager
											: "Unvalid"}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<table>
							<thead>
								<tr>
									<th className='border border-black text-center'>
										Service Description
									</th>
									<th className='border border-black text-center'>Quantity</th>
									<th className='border border-black text-center'>Unit</th>
									<th className='border border-black text-center'>File</th>
									<th className='border border-black text-center'>Note</th>
								</tr>
							</thead>
							<tbody>
								{dataSelected.SrDetail.map((res: any, i: number) => {
									return (
										<tr key={i}>
											<td className='border border-black text-center'>
												{res.desc}
											</td>
											<td className='border border-black text-center'>
												{res.qty}
											</td>
											<td className='border border-black text-center'>
												{res.unit}
											</td>
											<td className='border border-black text-center'>
												{res.file ? (
													<a
														href={res.file}
														target='_blank'
														className='text-blue-500 underline hover:text-blue-700'
													>
														Show File
													</a>
												) : (
													"-"
												)}
											</td>
											<td className='border border-black text-center'>
												{res.note}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</Section>
				</>
			) : null}
		</div>
	);
};
