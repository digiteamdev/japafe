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
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										ID Outgoing Material
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.id_outgoing_material}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Date Prepare
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{moment(dataSelected.date_outgoing_material).format("DD-MMMM-YYYY")}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Reference
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.stock_outgoing_material[0].poandsoId ? dataSelected.stock_outgoing_material[0].poandso?.id_receive : dataSelected.stock_outgoing_material[0].mr ? dataSelected.stock_outgoing_material[0].mr?.no_mr : '-' }
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<Section className="w-full mt-2">
						<table className="w-full">
							<thead>
								<tr>
									<th className="text-center border border-black">No Job</th>
									<th className="text-center border border-black">Material Name</th>
									<th className="text-center border border-black">Outgoing</th>
									<th className="text-center border border-black">Employe</th>
								</tr>
							</thead>
							<tbody>
								{ dataSelected.stock_outgoing_material.map((res: any, i: number) => {
									return(
										<tr key={i}>
											<td className="text-center border border-black">{res?.no_job ? res?.no_job : res?.mr?.job_no }</td>
											<td className="text-center border border-black">{res?.name_material + " " + res?.spesifikasi}</td>
											<td className="text-center border border-black">{res.qty_out }</td>
											<td className="text-center border border-black">{res.request }</td>
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
