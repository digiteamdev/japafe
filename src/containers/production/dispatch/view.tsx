import moment from "moment";
import { Section } from "../../../components";

interface props {
	dataSelected: any;
}

export const ViewDispatch = ({
	dataSelected
}: props) => {
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
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
										{ moment(dataSelected.dispacth_date).format("DD-MMMM-YYYY")}
									</td>
								</tr>
                                <tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Job No
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{ dataSelected.srimg.wor.job_no } - ({ dataSelected.srimg.wor.customerPo.quotations.Customer.name })
									</td>
								</tr>
                                <tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Equipment / Part
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{ dataSelected.srimg.wor.customerPo.quotations.eqandpart.map( (res: any, i: number) => {
                                            return <p key={i}>{ res.equipment.nama + " / " + res.eq_part.nama_part }</p>
                                        })}
									</td>
								</tr>
							</table>
						</div>
					</Section>
                    <Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
                        <div className="w-full">
                            <table className="w-full">
                                <thead className="text-center">
                                    <tr>
                                        <th className="border border-black border-collapse">Work Center</th>
                                        <th className="border border-black border-collapse">Start Date</th>
                                        <th className="border border-black border-collapse">Actual</th>
                                        <th className="border border-black border-collapse">Operator</th>
                                        <th className="border border-black border-collapse">Approved By</th>
                                        <th className="border border-black border-collapse">Finish Date</th>
                                        <th className="border border-black border-collapse">Remark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { dataSelected.dispatchDetail.map( (res: any, i: number) => {
                                        return (
                                            <tr key={i}>
                                                <td className="border border-black border-collapse pl-2">{ res.workCenter.name }</td>
                                                <td className="border border-black border-collapse pl-2">{ moment(res.start).format('DD-MMMM-YYYY') }</td>
                                                <td className="border border-black border-collapse pl-2">{ res.actual }</td>
                                                <td className="border border-black border-collapse pl-2">{ res.Employee.employee_name }</td>
                                                <td className="border border-black border-collapse pl-2">{ res.approvebyID }</td>
                                                <td className="border border-black border-collapse pl-2">{ res.finish === null ? '' : moment(res.finish).format('DD-MMMM-YYYY') }</td>
                                                <td className="border border-black border-collapse pl-2">{ res.remark }</td>
                                            </tr>
                                        )
                                    }) }
                                </tbody>
                            </table>
                        </div>
                    </Section>
				</>
			) : null}
		</div>
	);
};
