import moment from "moment";
import { Section } from "../../../components";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewApprovalMR = ({ dataSelected, content, showModal }: props) => {
	
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Material Request</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										ID Approval MR
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.idApprove}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Date Approval MR
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{moment(dataSelected.dateApprove).format("DD-MMMM-YYYY")}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Approval By
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.user.employee.employee_name}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<table>
							<thead>
								<tr>
									<th className='border border-black text-center p-0'>Job No</th>
									<th className='border border-black text-center p-0'>Type</th>
									<th className='border border-black text-center p-0'>Supplier</th>
									<th className='border border-black text-center p-0'>
										Material Name / Material Spesifikasi
									</th>
									<th className='border border-black text-center p-0'>Qty</th>
									<th className='border border-black text-center p-0'>
										Qty Approval
									</th>
									<th className='border border-black text-center p-0'>Note</th>
								</tr>
							</thead>
							<tbody>
								{dataSelected.detailMr.map((res: any, i: number) => {
									return (
										<tr key={i}>
											<td className='border border-black text-center  p-0'>
												{res.mr.job_no }
											</td>
											<td className='border border-black text-center p-0'>
												{res.mrappr}
											</td>
											<td className='border border-black text-center p-0'>
												{res.supplier.supplier_name}
											</td>
											<td className='border border-black text-center p-0'>
												{res.Material_Master.name} {res.Material_Master.spesifikasi}
											</td>
											<td className='border border-black text-center p-0'>
												{res.qty}
											</td>
											<td className='border border-black text-center p-0'>
												{res.qtyAppr}
											</td>
											<td className='border border-black text-center p-0'>
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
