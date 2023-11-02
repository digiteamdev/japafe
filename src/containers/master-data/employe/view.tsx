import { Section } from "../../../components";
import moment from "moment";
import Image from "next/image";
import { User } from "react-feather";

interface props {
	dataSelected: any;
}

export const ViewEmploye = ({ dataSelected }: props) => {
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Employe</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						{dataSelected.photo === null ? (
							<div className='w-full flex justify-center'>
								<div className='rounded-lg bg-gray-400'>
									<User size={120} />
								</div>
							</div>
						) : (
							<div className='w-full flex justify-center'>
								<Image
									className='rounded-lg'
									src={dataSelected.photo}
									width={100}
									height={100}
									alt='Picture Employe'
								/>
							</div>
						)}
					</Section>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Name
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.employee_name}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										NIK / NIP
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.NIK} / {dataSelected.NIP}
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
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Phone Number
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.phone_number}
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
										Id Card
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.id_card}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Departement
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.sub_depart.departement.name} /{" "}
										{dataSelected.sub_depart.name}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Position
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.position}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Gender
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.gender}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Birth Place / Birth Date
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.birth_place} /{" "}
										{moment(dataSelected.birth_date).format("DD-MMMM-YYYY")}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Address
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.address}, {dataSelected.province},{" "}
										{dataSelected.city}, {dataSelected.districts},{" "}
										{dataSelected.sub_districts}, {dataSelected.ec_postalcode}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Start Join / Status
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{moment(dataSelected.start_join).format("DD-MMMM-YYYY")} /{" "}
										{dataSelected.employee_status}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Remaining Day Off
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.remaining_days_of}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Marital Status
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.marital_status}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl mt-2'>Family</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Spouse Name
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.spouse_name === null
											? " - "
											: dataSelected.spouse_name}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Gender
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.gender_spouse === null
											? " - "
											: dataSelected.gender_spouse}
									</td>
								</tr>
								<tr>
									<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
										Spouse Birth
									</td>
									<td className='w-[50%] pl-2 border border-gray-200'>
										{dataSelected.spouse_birth_place === null
											? " - "
											: `${dataSelected.spouse_birth_place} / ${moment(
													dataSelected.spouse_birth_date
											  ).format("DD-MMMM-YYYY")}`}
									</td>
								</tr>
							</table>
							{dataSelected.Employee_Child.length !== 0
								? dataSelected.Employee_Child.map((res: any, i: number) => {
										return (
											<table className='w-full' key={i}>
												<tr>
													<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
														Name Child
													</td>
													<td className='w-[50%] pl-2 border border-gray-200'>
														{res.name}
													</td>
												</tr>
												<tr>
													<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
														Gender
													</td>
													<td className='w-[50%] pl-2 border border-gray-200'>
														{res.gender_child}
													</td>
												</tr>
												<tr>
													<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
														Birth Date
													</td>
													<td className='w-[50%] pl-2 border border-gray-200'>
														{res.child_birth_place} /{" "}
														{moment(res.child_birth_date).format(
															"DD-MMMM-YYYY"
														)}
													</td>
												</tr>
											</table>
										);
								  })
								: null}
						</div>
					</Section>
					<h1 className='font-bold text-xl mt-2'>Education</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							{dataSelected.Educational_Employee.length !== 0 ? (
								dataSelected.Educational_Employee.map((res: any, i: number) => {
									return (
										<table className='w-full mt-2' key={i}>
											<tr>
												<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
													Education
												</td>
												<td className='w-[50%] pl-2 border border-gray-200'>
													{res.last_edu}
												</td>
											</tr>
											<tr>
												<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
													School Name
												</td>
												<td className='w-[50%] pl-2 border border-gray-200'>
													{res.school_name}
												</td>
											</tr>
											<tr>
												<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
													Graduation
												</td>
												<td className='w-[50%] pl-2 border border-gray-200'>
													{res.graduation}
												</td>
											</tr>
											<tr>
												<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
													Degree
												</td>
												<td className='w-[50%] pl-2 py-2 border border-gray-200'>
													<a
														href={res.ijazah}
														target='_blank'
														className='justify-center rounded-full border border-transparent bg-green-500 px-4 py-1 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
													>
														{" "}
														show Degree{" "}
													</a>
												</td>
											</tr>
										</table>
									);
								})
							) : (
								<table className='w-full'>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Education
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>-</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											School Name
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>-</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Graduation
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>-</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Degree
										</td>
										<td className='w-[50%] pl-2 py-2 border border-gray-200'>
											-
										</td>
									</tr>
								</table>
							)}
						</div>
					</Section>
					<h1 className='font-bold text-xl mt-2'>Certificate</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2 mb-3'>
						<div className='w-full'>
							{dataSelected.Certificate_Employee.length !== 0 ? (
								dataSelected.Certificate_Employee.map((res: any, i: number) => {
									return (
										<table className='w-full mt-2' key={i}>
											<tr>
												<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
													Certificate Name
												</td>
												<td className='w-[50%] pl-2 border border-gray-200'>
													{res.certificate_name}
												</td>
											</tr>
											<tr>
												<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
													Ceritificate
												</td>
												<td className='w-[50%] pl-2 py-2 border border-gray-200'>
													<a
														href={res.certificate_img}
														target='_blank'
														className='justify-center rounded-full border border-transparent bg-green-500 px-4 py-1 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer'
													>
														{" "}
														Show Certificate{" "}
													</a>
												</td>
											</tr>
										</table>
									);
								})
							) : (
								<table className='w-full'>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Certificate Name
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>-</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Certificate
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>-</td>
									</tr>
								</table>
							)}
						</div>
					</Section>
				</>
			) : null}
		</div>
	);
};
