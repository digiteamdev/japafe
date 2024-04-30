import { useEffect, useState } from "react";
import moment from "moment";
import { Section } from "../../../components";
import { ApproveMrSpv, ApproveMrManager } from "../../../services";
import { getPosition } from "../../../configs/session";
import { Check, X, Printer } from "react-feather";
import { toast } from "react-toastify";

interface props {
	dataSelected: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewTimeSheet = ({ dataSelected, showModal }: props) => {
	const [position, setPosition] = useState<any>([]);
	const [isModal, setIsModal] = useState<boolean>(false);

	useEffect(() => {
		let positionAkun = getPosition();
		if (positionAkun !== undefined) {
			setPosition(positionAkun);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Time Sheet</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Employe
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.user.employee.employee_name}
									</td>
                                </tr>
                                <tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Departement
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.user.employee.sub_depart.name}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Type
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.type_timesheet === 'overtime' ? 'Over Time' : 'Work Time'}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<table>
							<thead>
								<tr>
									<th className='border border-black text-center'>Date</th>
									<th className='border border-black text-center'>Job</th>
									<th className='border border-black text-center'>Part Name</th>
									<th className='border border-black text-center'>
										Job Description
									</th>
									<th className='border border-black text-center'>Start</th>
									<th className='border border-black text-center'>Finish</th>
									<th className='border border-black text-center'>Total</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className='border border-black text-center'>
										{moment(dataSelected.date).format('DD/MM/YYYY')}
									</td>
									<td className='border border-black text-center'>
										{dataSelected.job}
									</td>
                                    <td className='border border-black text-center'>
										{dataSelected.part_name}
									</td>
                                    <td className='border border-black whitespace-pre text-center'>
										{dataSelected.job_description}
									</td>
                                    <td className='border border-black text-center'>
										{moment(dataSelected.actual_start).format('LT')}
									</td>
									<td className='border border-black text-center'>
										{moment(dataSelected.actual_finish).format('LT')}
									</td>
									<td className='border border-black text-center'>
										{dataSelected.total_hours}
									</td>
								</tr>
							</tbody>
						</table>
					</Section>
				</>
			) : null}
		</div>
	);
};
