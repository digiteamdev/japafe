import { Section } from "../../../components";

interface props {
	dataSelected: any;
}

export const ViewSuplier = ({ dataSelected }: props) => {

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Supplier</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								<tbody>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Supplier Name
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.supplier_name}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Supplier Type
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.type_supplier}
										</td>
									</tr>
                                    <tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Office Email
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.office_email}
										</td>
									</tr>
                                    <tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											NPWP
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.NPWP}
										</td>
									</tr>
                                    <tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											PPH / PPN
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.pph}% / {dataSelected.ppn}%
										</td>
									</tr>
                                    <tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Address
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.addresses_sup}
										</td>
									</tr>
                                    <tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.provinces}, {dataSelected.cities}, {dataSelected.districts},{dataSelected.sub_districts}, {dataSelected.ec_postalcode},    
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl mt-2'>Bank Account</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								<tbody>
									{dataSelected.SupplierBank.length > 0 ? (
										dataSelected.SupplierBank.map((res: any, i: number) => (
											<>
												<tr key={i}>
													<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
														bank_name
													</td>
													<td className='w-[50%] pl-2 border border-gray-200'>
														{res.bank_name}
													</td>
												</tr>
												<tr>
													<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
														Account Number
													</td>
													<td className='w-[50%] pl-2 border border-gray-200'>
														{res.rekening}
													</td>
												</tr>
												<tr>
													<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
														Account Name
													</td>
													<td className='w-[50%] pl-2 border border-gray-200'>
														{res.account_name}
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
									{dataSelected.SupplierContact.length > 0 ? (
										dataSelected.SupplierContact.map((res: any, i: number) => (
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
