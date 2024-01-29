import { useEffect, useState } from "react";
import moment from "moment";
import { Section } from "../../../components";
import { formatRupiah } from "@/src/utils";
import { PdfCashAdvance } from "./pdfCashAdvance";
import { Check, X, Printer } from "react-feather";
import { getPosition } from "../../../configs/session";
import { toast } from "react-toastify";
import { ApproveCashSpv, ApproveCashManager } from "../../../services";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewCashAdvance = ({
	dataSelected,
	content,
	showModal,
}: props) => {
	const [isModal, setIsModal] = useState<boolean>(false);
	const [dataPPN, setDataPPN] = useState<any>([]);
	const [position, setPosition] = useState<any>([]);

	useEffect(() => {
		let positionAkun = getPosition();
		if (positionAkun !== undefined) {
			setPosition(positionAkun);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const total = (data:any) => {
		let total: number = 0
		data.map((res:any) => {
			total = total + res.total
		})
		return formatRupiah(total.toString())
	}

	const approve = async (val: string) => {
		try {
			if (val === "Supervisor") {
				const response = await ApproveCashSpv(dataSelected.id);
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
				const response = await ApproveCashManager(dataSelected.id);
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
			if (!data.status_valid_spv) {
				return (
					<>
						<button
							className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => showModalPdf(true)}
						>
							<div className='flex px-1 py-1'>
								<Printer size={16} className='mr-1' /> Print
							</div>
						</button>
						<button
							className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => approve("Supervisor")}
						>
							<div className='flex px-1 py-1'>
								<Check size={16} className='mr-1' /> Valid SPV
							</div>
						</button>
					</>
				);
			} else {
				return (
					<>
						<button
							className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => showModalPdf(true)}
						>
							<div className='flex px-1 py-1'>
								<Printer size={16} className='mr-1' /> Print
							</div>
						</button>
						<button
							className={`justify-center rounded-full border border-transparent bg-gray-500 hover:bg-gray-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => approve("Supervisor")}
						>
							<div className='flex px-1 py-1'>
								<X size={16} className='mr-1' /> Unvalid SPV
							</div>
						</button>
					</>
				);
			}
		} else if (position === "Manager") {
			if (!data.status_valid_manager) {
				return (
					<>
						<button
							className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => showModalPdf(true)}
						>
							<div className='flex px-1 py-1'>
								<Printer size={16} className='mr-1' /> Print
							</div>
						</button>
						<button
							className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => approve("Manager")}
						>
							<div className='flex px-1 py-1'>
								<Check size={16} className='mr-1' /> Valid Manager
							</div>
						</button>
					</>
				);
			} else {
				return (
					<>
						<button
							className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => showModalPdf(true)}
						>
							<div className='flex px-1 py-1'>
								<Printer size={16} className='mr-1' /> Print
							</div>
						</button>
						<button
							className={`justify-center rounded-full border border-transparent bg-gray-500 hover:bg-gray-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
							onClick={() => approve("Manager")}
						>
							<div className='flex px-1 py-1'>
								<Check size={16} className='mr-1' /> Unvalid Manager
							</div>
						</button>
					</>
				);
			}
		}
	};

	const showModalPdf = (val: boolean) => {
		setIsModal(val);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<PdfCashAdvance
				isModal={isModal}
				dataSelected={dataSelected}
				total={total(dataSelected.cdv_detail)}
				showModalPdf={showModalPdf}
			/>
			{dataSelected ? (
				<>
					<div className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1'>
						<div className='text-right mr-6'>
							{showButtonValid(dataSelected)}
						</div>
					</div>
					<h1 className='font-bold text-xl'>Cash Advance</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										ID
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.id_cash_advance}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Date
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{moment(dataSelected.date_cash_advance).format(
											"DD-MMMM-YYYY"
										)}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Request By
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.employee.employee_name}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Job No
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.job_no}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Customer
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{ dataSelected.wor === null ? "" : dataSelected.wor.customerPo.quotations.Customer.name}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Subject
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{ dataSelected.wor === null ? "" : dataSelected.wor.subject}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Payment Type
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.status_payment}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Note
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.note}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<Section className='grid grid-cols-1 gap-2 mt-2'>
						<table className="w-full">
							<thead>
								<th className="border border-black text-center">Type</th>
								<th className="border border-black text-center">Description</th>
								<th className="border border-black text-center">Value</th>
							</thead>
							<tbody>
								{ dataSelected.cdv_detail.map( (res: any, i: number) => {
									return(
										<tr key={i}>
											<td className="border border-black text-center">{ res.type_cdv }</td>
											<td className="border border-black text-center">{ res.description }</td>
											<td className="border border-black text-center">{ formatRupiah(res.total.toString()) }</td>
										</tr>
									)
								}) }
								<tr>
									<td className="border border-black text-right pr-5" colSpan={2}>Total</td>
									<td className="border border-black text-center">{ total(dataSelected.cdv_detail) }</td>
								</tr>
							</tbody>
						</table>
					</Section>
				</>
			) : null}
		</div>
	);
};
