import { Section } from "../../../components";
import moment from "moment";

interface props {
	dataSelected: any;
}

export const ViewHoliday = ({
	dataSelected
}: props) => {
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Holiday</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Date Holiday
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{moment(dataSelected.date_holiday).format('DD-MMMM-YYYY')}
									</td>
								</tr>
                                <tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Description
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.description}
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
