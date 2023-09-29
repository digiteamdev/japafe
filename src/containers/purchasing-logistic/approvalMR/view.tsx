import moment from "moment";
import { Section } from "../../../components";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewApprovalMR = ({ dataSelected, content, showModal }: props) => {

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Material Request</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										No MR
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.no_mr}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										ID Approval MR
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.idMrAppr}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Job No
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.bom === null ? dataSelected.wor.job_no_mr : dataSelected.wor.job_no}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Date Approval MR
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{moment(dataSelected.dateOfAppr).format("DD-MMMM-YYYY")}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Request By
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.user.employee.employee_name}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Approval By
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.approvebyMr.employee.employee_name}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Departement
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.user.employee.sub_depart.name}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<table>
							<thead>
								<tr>
									<th className='border border-black text-center'>Type</th>
									<th className='border border-black text-center'>Supplier</th>
									<th className='border border-black text-center'>
										Material Name
									</th>
									<th className='border border-black text-center'>
										Material Spesifikasi
									</th>
									<th className='border border-black text-center'>Qty</th>
									<th className='border border-black text-center'>Qty Approval</th>
									<th className='border border-black text-center'>Note</th>
								</tr>
							</thead>
							<tbody>
								{dataSelected.detailMr.map((res: any, i: number) => {
									return (
										<tr key={i}>
											<td className='border border-black text-center'>
												{res.mrappr}
											</td>
											<td className='border border-black text-center'>
												{res.supplier.supplier_name}
											</td>
											<td className='border border-black text-center'>
												{res.Material_Stock.Material_master.material_name}
											</td>
											<td className='border border-black text-center'>
												{res.Material_Stock.spesifikasi}
											</td>
											<td className='border border-black text-center'>
												{res.qty}
											</td>
											<td className='border border-black text-center'>
												{res.qtyAppr}
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
