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

export const ViewSpd = ({ dataSelected, content, showModal }: props) => {
	console.log(dataSelected);

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>SPD</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Employe
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected?.user?.employee?.employee_name}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Date
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{moment(dataSelected?.date).format("DD-MMMM-YYYY")}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Berangkat
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
                                        {moment(dataSelected?.berangkat).format("DD-MM-YYYY, h:mm a")}
									</td>
								</tr>
                                <tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Kembali
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
                                        {moment(dataSelected?.kembali).format("DD-MM-YYYY, h:mm a")}
									</td>
								</tr>
                                <tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Tujuan
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected?.tujuan}
									</td>
								</tr>
                                <tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Aktivitas
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected?.aktivitas}
									</td>
								</tr>
                                <tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Cash advance
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected?.cash_advance?.id_cash_advance}
									</td>
								</tr>
                                <tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Note
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected?.note}
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
