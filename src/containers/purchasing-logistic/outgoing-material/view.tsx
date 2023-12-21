import moment from "moment";
import { Section } from "../../../components";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewOutgoingMaterial = ({ dataSelected, content, showModal }: props) => {

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Outgoing Material</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										ID Outgoing Material
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.id_outgoing_material}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Date Prepare
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{moment(dataSelected.date_outgoing_material).format("DD-MMMM-YYYY")}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Reference
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.stock_outgoing_material[0].poandsoId === null ? "-" : dataSelected.stock_outgoing_material[0].poandso.id_receive }
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<Section className="w-full mt-2">
						<table className="w-full">
							<thead>
								<tr>
									<th className="text-center border border-black">Material Name</th>
									<th className="text-center border border-black">No Job</th>
									<th className="text-center border border-black">Outgoing</th>
									<th className="text-center border border-black">Employe</th>
								</tr>
							</thead>
							<tbody>
								{ dataSelected.stock_outgoing_material.map((res: any, i: number) => {
									return(
										<tr key={i}>
											<td className="text-center border border-black">{res.Material_Stock === null ? res.poandso.detailMr[0].Material_Stock.spesifikasi : res.Material_Stock.spesifikasi }</td>
											<td className="text-center border border-black">{res.poandsoId === null ? "-" : res.poandso.detailMr[0].mr.wor.wor_job_job_operational ? res.poandso.detailMr[0].mr.wor.job_no_mr : res.poandso.detailMr[0].mr.wor.job_no }</td>
											<td className="text-center border border-black">{res.qty_out }</td>
											<td className="text-center border border-black">{res.poandsoId === null ?res.employee.employee_name : res.poandso.detailMr[0].mr.user.employee.employee_name }</td>
										</tr>
									)
								}) }
							</tbody>
						</table>
					</Section>
				</>
			) : null}
		</div>
	);
};
