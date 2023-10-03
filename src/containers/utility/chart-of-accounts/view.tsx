import { Section } from "../../../components";

interface props {
	dataSelected: any;
}

export const ViewChartOfAccount = ({
	dataSelected
}: props) => {
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Chart Of Account</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Code
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.coa_code}
									</td>
								</tr>
                                <tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Name
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.coa_name}
									</td>
								</tr>
							</table>
						</div>
					</Section>
				</>
			) : null}
		</div>
	);
};
