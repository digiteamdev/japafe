import { Section } from "../../../components";

interface props {
	dataSelected: any;
}

export const ViewMaterial = ({ dataSelected }: props) => {
	
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Material</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Material Code
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.kd_material}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Material Name
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.material_name}
									</td>
								</tr>
                                <tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Material Type
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.grup_material.material_name}
									</td>
								</tr>
                                <tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Satuan
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.satuan}
									</td>
								</tr>
                                <tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Detail
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.detail}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl mt-3'>Material Spesifikasi</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead>
									<tr>
										<th className='w-[50%] pl-2 border border-gray-200 text-center'>Spesifikasi Name</th>
										<th className='w-[20%] pl-2 border border-gray-200 text-center'>Stock</th>
										<th className='w-[30%] pl-2 border border-gray-200 text-center'>Harga</th>
									</tr>
								</thead>
								<tbody>
									{
										dataSelected.Material_Stock.length > 0 ? (
											dataSelected.Material_Stock.map( (res: any, i: number) => {
												return (
													<tr key={i}>
														<td className='w-[50%] pl-2 border border-gray-200 text-center'>
															{res.spesifikasi}
														</td>
														<td className='w-[20%] pl-2 border border-gray-200 text-center'>
															{res.jumlah_Stock}
														</td>
														<td className='w-[30%] pl-2 border border-gray-200 text-center'>
															{res.harga}
														</td>
													</tr>
												)
											})
										) : null
									}
								</tbody>
							</table>
						</div>
					</Section>
				</>
			) : null}
		</div>
	);
};
