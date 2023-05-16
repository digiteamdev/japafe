import { Section } from "../../../components";

interface props {
	dataSelected: any;
}

export const ViewEquipment = ({ dataSelected }: props) => {
	
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Equipment</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								<tbody>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Equipment Image
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											<img src={dataSelected.eq_image} className="px-2 py-2 object-cover h-50 w-50" />
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Equipment Name
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.nama}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Description
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.keterangan_eq}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl mt-2'>Part</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead>
                                    <tr>
                                        <th className='w-[10%] pl-2 border border-gray-200 text-center font-semibold'>
                                            Image
                                        </th>
                                        <th className='w-[60%] pl-2 border border-gray-200 text-center font-semibold'>
                                            Name
                                        </th>
                                        <th className='w-[30%] pl-2 border border-gray-200 text-center font-semibold'>
                                            Description
                                        </th>
                                    </tr>
                                </thead>
									{dataSelected.eq_part.length > 0 ? (
										dataSelected.eq_part.map((res: any, i: number) => (
											<tbody>
												<tr key={i}>
													<td className='w-[10%] pl-2 border border-gray-200'>
                                                    <img src={res.part_img} className="px-2 py-2 object-cover h-24 w-24" />
													</td>
													<td className='w-[60%] pl-2 border border-gray-200'>
														{res.nama_part}
													</td>
													<td className='w-[30%] pl-2 border border-gray-200'>
														{res.keterangan_part}
													</td>
												</tr>
											</tbody>
										))
									) : (
										<tbody>
											<tr>
												<td className='w-[50%] pl-2 border border-gray-200'>
													-
												</td>
												<td className='w-[50%] pl-2 border border-gray-200'>
													-
												</td>
												<td className='w-[50%] pl-2 border border-gray-200'>
													-
												</td>
											</tr>
										</tbody>
									)}
							</table>
						</div>
					</Section>
				</>
			) : null}
		</div>
	);
};
