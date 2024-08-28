import { useEffect, useState } from "react";
import moment from "moment";
import { Section } from "../../../components";
import { ApproveMrSpv, ApproveMrManager } from "../../../services";
import { getPosition } from "../../../configs/session";
import { Check, X, Printer } from "react-feather";
import { toast } from "react-toastify";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewAbsensi = ({ dataSelected, content, showModal }: props) => {
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
				const response = await ApproveMrSpv(dataSelected.id);
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
				const response = await ApproveMrManager(dataSelected.id);
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
		if (dataSelected.statusMr === "Request") {
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
		}
	};

	const showModalPdf = (val: boolean) => {
		setIsModal(val);
	};
	console.log(dataSelected);
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{/* <PdfMr
				isModal={isModal}
				data={dataSelected}
				showModalPdf={showModalPdf}
			/> */}
			{dataSelected ? (
				<>
					<div className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1'>
						{/* <div className='text-right mr-6'>
							<button
								className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
								onClick={() => showModalPdf(true)}
							>
								<div className='flex px-1 py-1'>
									<Printer size={16} className='mr-1' /> Print
								</div>
							</button>
							{showButtonValid(dataSelected)}
						</div> */}
					</div>
					{/* <h1 className='font-bold text-xl'>Material Request</h1> */}
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										employee
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.employee?.employee_name}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Date Absen
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{moment(dataSelected.createdAt).format("DD-MMMM-YYYY")}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Check in
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.scan_in_time
											? moment(dataSelected.scan_in_time).format("HH:mm:ss")
											: "-"}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Image Check in
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.scan_in ? (
											<img
												src={`data:image/jpeg;base64${window.atob(
													dataSelected.scan_in
												)}`}
												className='w-20 rounded-xl'
											/>
										) : (
											"-"
										)}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Check out
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.scan_out_time
											? moment(dataSelected.scan_out_time).format("HH:mm:ss")
											: "-"}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Image Check out
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.scan_out ? (
											<img
												src={`data:image/jpeg;base64${window.atob(
													dataSelected.scan_out
												)}`}
												className='w-20 rounded-xl'
											/>
										) : (
											"-"
										)}
									</td>
								</tr>
							</table>
						</div>
					</Section>
				</>
			) : null}
		</div>
	);
};
