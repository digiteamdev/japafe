import { Section } from "../../../components";

interface props {
	dataSelected: any;
}

export const ViewCustomer = ({ dataSelected }: props) => {
	
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Customer</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								<tbody>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Name Customer
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.name}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Email
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.email}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl mt-2'>Address</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								<tbody>
									{dataSelected.address.length > 0 ? (
										dataSelected.address.map((res: any, i: number) => (
											<>
												<tr key={i}>
													<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
														Address Workshop
													</td>
													<td className='w-[50%] pl-2 border border-gray-200'>
														{res.address_workshop}
													</td>
												</tr>
												<tr>
													<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
														Address Recipient
													</td>
													<td className='w-[50%] pl-2 border border-gray-200'>
														{res.recipient_address}
													</td>
												</tr>
												<tr>
													<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
														Address
													</td>
													<td className='w-[50%] pl-2 border border-gray-200'>
														{res.provinces}, {res.cities}, {res.districts},{" "}
														{res.sub_districts}, {res.ec_postalcode}
													</td>
												</tr>
											</>
										))
									) : (
										<>
											<tr>
												<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
													Address Person
												</td>
												<td className='w-[50%] pl-2 border border-gray-200'>
													-
												</td>
											</tr>
											<tr>
												<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
													Address Workshopx
												</td>
												<td className='w-[50%] pl-2 border border-gray-200'>
													-
												</td>
											</tr>
											<tr>
												<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
													Address Recipient
												</td>
												<td className='w-[50%] pl-2 border border-gray-200'>
													-
												</td>
											</tr>
											<tr>
												<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
													Address
												</td>
												<td className='w-[50%] pl-2 border border-gray-200'>
													-
												</td>
											</tr>
										</>
									)}
								</tbody>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl mt-2'>Contact Person</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								<tbody>
									{dataSelected.contact.length > 0 ? (
										dataSelected.contact.map((res: any, i: number) => (
											<>
												<tr key={i}>
													<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
														Contact Person
													</td>
													<td className='w-[50%] pl-2 border border-gray-200'>
														{res.contact_person}
													</td>
												</tr>
												<tr>
													<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
														Phone
													</td>
													<td className='w-[50%] pl-2 border border-gray-200'>
														+62{res.phone}
													</td>
												</tr>
												<tr>
													<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
														Email
													</td>
													<td className='w-[50%] pl-2 border border-gray-200'>
														{res.email_person}
													</td>
												</tr>
											</>
										))
									) : (
										<>
											<tr>
												<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
													Contact Person
												</td>
												<td className='w-[50%] pl-2 border border-gray-200'>
													-
												</td>
											</tr>
											<tr>
												<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
													-
												</td>
												<td className='w-[50%] pl-2 border border-gray-200'>
													-
												</td>
											</tr>
											<tr>
												<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
													Email
												</td>
												<td className='w-[50%] pl-2 border border-gray-200'>
													-
												</td>
											</tr>
										</>
									)}
								</tbody>
							</table>
						</div>
					</Section>
				</>
			) : null}
		</div>
	);
};
