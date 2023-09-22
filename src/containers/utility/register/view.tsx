import moment from "moment";
import { Section } from "../../../components";

interface props {
	dataSelected: any;
}

export const ViewUser = ({ dataSelected }: props) => {
	console.log(dataSelected);

    const showRole = (data: any) => {
        let role: any = []
        data.map( (res:any) => {
            role.push(res.role.role_name)
        })
        return role.toString()
    }

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>User</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								<tbody>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											NIK
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.employee.NIK}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Name
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.employee.employee_name}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Username
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.username}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Email
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.employee.email}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Phone Number
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.employee.phone_number}
										</td>
									</tr>
                                    <tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Departement
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.employee.sub_depart.name}
										</td>
									</tr>
                                    <tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Position
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.employee.position}
										</td>
									</tr>
                                    <tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Access Right
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{showRole(dataSelected.userRole)}
										</td>
									</tr>
                                    <tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Start Join
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{moment(dataSelected.employee.start_join).format("DD-MMMM-YYYY")}
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
