import { Section } from "../../../components";
import moment from "moment";

interface props {
	dataSelected: any;
}

export const Drawing = ({ dataSelected }: props) => {
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Drawing</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										ID Drawing
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.id_drawing}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Date Drawing
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{moment(dataSelected.date_drawing).format("DD-MMMM-YYYY")}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										No Job
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.timeschedule.wor.job_no} (
										{
											dataSelected.timeschedule.wor.customerPo.quotations
												.Customer.name
										}
										)
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Subject
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.timeschedule.wor.subject}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Job Description
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.timeschedule.wor.job_desk}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl mt-2'>File Drawing</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead>
									<tr>
										<th className='w-[10%]pl-2 border border-black text-center'>
											No
										</th>
										<th className='w-[10%]pl-2 border border-black text-center'>
											File
										</th>
									</tr>
								</thead>
								<tbody>
									{dataSelected.file_drawing.map((res: any, i: number) => {
										return (
											<tr key={i}>
												<td className='w-[10%]pl-2 border border-black text-center'>
													{i + 1}
												</td>
												<td className='w-[90%] pl-2 border border-black text-center p-3'>
													<a
														href={res.file_upload}
														target='_blank'
														className='justify-center rounded-full border border-transparent bg-green-500 px-4 py-1 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer'
													>
														Show File
													</a>
												</td>
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
