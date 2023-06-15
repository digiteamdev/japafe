import { Section } from "../../../components";
import moment from "moment";

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
										{dataSelected.nama_type}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl mt-2'>Material Spesification</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
                                <thead>
                                    <tr>
                                        <th className="w-[50%] bg-gray-300 pl-2 border">Detail Spesification</th>
                                        <th className="w-[25%] bg-gray-300 pl-2 border">Jumlah</th>
                                        <th className="w-[25%] bg-gray-300 pl-2 border">Unit</th>
                                    </tr>
                                </thead>
                                {
                                    dataSelected.Material_Spek.length > 0 ? (
                                        dataSelected.Material_Spek.map( (res: any, i: number) => (
                                            <tbody key={i}>
                                                <tr>
                                                    <td className='w-[50%] pl-2 border border-gray-200'>
                                                        { res.detail }
                                                    </td>
                                                    <td className='w-[25%] pl-2 border border-gray-200'>
                                                        { res.jumlah }
                                                    </td>
                                                    <td className='w-[25%] pl-2 border border-gray-200'>
                                                        { res.unit }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        ))
                                    ) : null
                                }
							</table>
						</div>
					</Section>
				</>
			) : null}
		</div>
	);
};
