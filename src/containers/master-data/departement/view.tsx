import { Section } from "../../../components";

interface props {
	dataSelected: any;
}

export const ViewDepartement = ({
	dataSelected
}: props) => {
	console.log(dataSelected)
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Departement</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Name
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.name}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl mt-2'>Sub Departement</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2 mb-3'>
						<div className='w-full'>
							{dataSelected.sub_depart.length !== 0
								? dataSelected.sub_depart.map(
										(res: any, i: number) => {
											return (
												<table className='w-full mt-2' key={i}>
													<tr>
														<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
															Name Sub Departement
														</td>
														<td className='w-[50%] pl-2 border border-gray-200'>
															{res.name}
														</td>
													</tr>
												</table>
											);
										}
								) : (
									<table className='w-full'>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
                                            Name Sub Departement
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											-
										</td>
									</tr>
								</table>
								) }
						</div>
					</Section>
				</>
			) : null}
		</div>
	);
};
