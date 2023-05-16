import { Section } from "../../../components";
import moment from "moment";

interface props {
	dataSelected: any;
}

export const ViewWor = ({ dataSelected }: props) => {

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Work Order Release</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								<tbody>
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
											Quotation / Customer
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.customerPo.quotations.quo_auto} /{" "}
											{dataSelected.customerPo.quotations.Customer.name}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Customer Address
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{
												dataSelected.customerPo.quotations.Customer.address[0]
													.address_workshop
											}
											,{" "}
											{
												dataSelected.customerPo.quotations.Customer.address[0]
													.districts
											}
											,{" "}
											{
												dataSelected.customerPo.quotations.Customer.address[0]
													.cities
											}
											,{" "}
											{
												dataSelected.customerPo.quotations.Customer.address[0]
													.provinces
											}{" "}
											{
												dataSelected.customerPo.quotations.Customer.address[0]
													.ec_postalcode
											}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Subject
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.subject}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Contract No (SPK)
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.contract_no_spk}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Priority
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.priority_status} (Quantity:{" "}
											{dataSelected.qty})
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Date Of Order / Delivery Date
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{moment(dataSelected.date_of_order).format(
												"DD-MMMM-YYYY"
											)}{" "}
											/{" "}
											{moment(dataSelected.delivery_date).format(
												"DD-MMMM-YYYY"
											)}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Shipping Addres
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.shipping_address}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Equipment
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{
												dataSelected.customerPo.quotations.eqandpart[0]
													.equipment.nama
											} - Manufacture : {dataSelected.eq_mfg} , Rotasi: {dataSelected.eq_rotation} , Model: {dataSelected.eq_model} , Power: {dataSelected.eq_power}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Estimate Man Hour
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.estimated_man_our} Hour
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Scope Of Work
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.scope_of_work}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Note
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.noted}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											File
										</td>
										<td className='w-[50%] py-2 px-2 border border-gray-200'>
											<a
												href={dataSelected.file_list}
												target='_blank'
												className='justify-center rounded-full border border-transparent bg-green-500 px-4 py-1 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer'
											>
												Show File
											</a>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Section>
				</>
			) : null}
		</div>
	);
};
