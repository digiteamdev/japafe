import moment from "moment";
import { Section } from "../../../components";

interface props {
	dataSelected: any;
}

export const ViewSR = ({ dataSelected }: props) => {

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Service Request</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										No SR
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.no_sr} - {moment(dataSelected.date_sr).format('DD-MMMM-YYYY')}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Job No
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{ dataSelected.dispacth.srimg.timeschedule.wor.job_operational ? dataSelected.dispacth.srimg.timeschedule.wor.job_no_mr : dataSelected.dispacth.srimg.timeschedule.wor.job_no }
									</td>
								</tr>
                                <tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Request By
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.user.username}
									</td>
								</tr>
							</table>
						</div>
					</Section>
                    <Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
                        <table>
                            <thead>
                                <tr>
                                    <th className="border border-black text-center">
                                        Part Name
                                    </th>
                                    <th className="border border-black text-center">
                                        Service Description
                                    </th>
                                    <th className="border border-black text-center">
                                        Quantity
                                    </th>
                                    <th className="border border-black text-center">
                                        Unit
                                    </th>
                                    <th className="border border-black text-center">
                                        Note
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                { dataSelected.SrDetail.map( (res: any, i: number) => {
                                    return (
                                        <tr key={i}>
                                            <td className="border border-black text-center">
                                                { res.part }
                                            </td>
                                            <td className="border border-black text-center">
                                                { res.workCenter.name }
                                            </td>
                                            <td className="border border-black text-center">
                                                { res.qty }
                                            </td>
                                            <td className="border border-black text-center">
                                                { res.unit }
                                            </td>
                                            <td className="border border-black text-center">
                                                { res.note }
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </Section>
				</>
			) : null}
		</div>
	);
};
