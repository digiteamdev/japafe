import { useEffect, useState } from "react";
import moment from "moment";
import { Section } from "../../../components";
import { formatRupiah } from "@/src/utils";
import { Check, X, Printer } from "react-feather";
import { getPosition } from "../../../configs/session";
import { toast } from "react-toastify";
import { ApproveCashSpv, ApproveCashManager } from "../../../services";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewSpjCashAdvance = ({
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
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
                <h1 className='font-bold text-xl'>SPJ Cash Advance</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										ID Spj Cash Advance
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.id_spj}
									</td>
								</tr>
                                <tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Reference
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
										{dataSelected.wor === null ? "" : dataSelected.wor.customerPo.quotations.Customer.name}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Subject
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.wor === null ? "" : dataSelected.wor.subject}
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
                                <th className="border border-black text-center">Actual</th>
								<th className="border border-black text-center">Balance</th>
							</thead>
							<tbody>
								{ dataSelected.cdv_detail.map( (res: any, i: number) => {
									return(
										<tr key={i}>
											<td className="border border-black text-center">{ res.type_cdv }</td>
											<td className="border border-black text-center">{ res.description }</td>
											<td className="border border-black text-center">{ formatRupiah(res.total.toString()) }</td>
                                            <td className="border border-black text-center">{ formatRupiah(res.actual.toString()) }</td>
                                            <td className="border border-black text-center">{ res.balance.toString().startsWith('-') ? `-${formatRupiah(res.balance.toString())}` : formatRupiah(res.balance.toString()) }</td>
										</tr>
									)
								}) }
								<tr>
									<td className="border border-black text-right pr-5" colSpan={4}>Total</td>
									<td className="border border-black text-center">{ dataSelected.grand_tot.toString().startsWith('-') ? `-${formatRupiah(dataSelected.grand_tot.toString())}` : formatRupiah(dataSelected.grand_tot.toString()) }</td>
								</tr>
							</tbody>
						</table>
					</Section>
				</>
			) : null}
		</div>
	);
};
