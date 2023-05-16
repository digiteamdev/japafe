import { Section } from "../../../components";

interface props {
	dataSelected: {
		id: string;
		name: string;
	};
}

export const ViewDepartement = ({
	dataSelected
}: props) => {
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
				<table>
                    <tr>
                        <td className="w-[15%]">
                            Departement Name
                        </td>
                        <td className="w-[1%]">
                            :
                        </td>
                        <td className="w-[59%]">
                            { dataSelected.name }
                        </td>
                    </tr>
                </table>
			</Section>
		</div>
	);
};
