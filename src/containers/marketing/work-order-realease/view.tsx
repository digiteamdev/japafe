import { useState } from "react";
import { Section } from "../../../components";
import moment from "moment";
import { ValidateWor } from "../../../services";
import { toast } from "react-toastify";
import { PdfWor } from "./pdfWor";
import { Printer } from "react-feather";

interface props {
	dataSelected: any;
	position: any;
	role: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewWor = ({ dataSelected, content, position, role, showModal }: props) => {

	const [isModal,setIsModal] = useState<boolean>(false)

	const validWor = async () => {
		try {
			const response = await ValidateWor(dataSelected.id);
			if (response.data) {
				toast.success("Validate Work Order Release Success", {
					position: "top-center",
					autoClose: 1000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				showModal(false, content, true);
			}
		} catch (error) {
			toast.error("Validate Work Order Release Failed", {
				position: "top-center",
				autoClose: 1000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		}
	}

	const showModalPdf = (val: boolean) => {
		setIsModal(val)
	}

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			<PdfWor isModal={isModal} data={dataSelected} showModalPdf={showModalPdf}/>
			{dataSelected ? (
				<div>
					<div className="grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
						<div>
							<h1 className='font-bold text-xl'>Work Order Release</h1>
						</div>
						<div className="text-right mr-6">
							<button 
								className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
								onClick={ () => showModalPdf(true)}
							>
								<div className="flex px-1 py-1">
									<Printer size={16} className="mr-1"/> Print
								</div>
							</button>
							{ position === "Director" && role === "MARKETING" || position === "Manager" && role === "MARKETING" || position === "Supervisor" && role === "MARKETING" ? (
								<button 
								className={`justify-center rounded-full border border-transparent ${dataSelected.status === "" || dataSelected.status === 'unvalid' ? "bg-orange-500 hover:bg-orange-400" : "bg-gray-500 hover:bg-gray-400"} px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer`}
								onClick={ () => validWor()}
							>
								{ dataSelected.status === "" || dataSelected.status === 'unvalid' ? (<p className="px-1 py-1">Validate</p>) : (<p className="px-1 py-1">Unvalid</p>) }
							</button>
							) : null }
						</div>
					</div>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								<tbody>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Job No
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.job_no}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Quotation / Customer
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.customerPo.quotations.quo_num} /{" "}
											{dataSelected.customerPo.quotations.Customer.name}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Customer Address
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{
												dataSelected.customerPo.quotations.Customer.address[0]
													.address_workshop
											}
											,{" "}
											{
												dataSelected.customerPo.quotations.Customer.address[0]
													.districts
											}
											,{" "}
											{
												dataSelected.customerPo.quotations.Customer.address[0]
													.cities
											}
											,{" "}
											{
												dataSelected.customerPo.quotations.Customer.address[0]
													.provinces
											}{" "}
											{
												dataSelected.customerPo.quotations.Customer.address[0]
													.ec_postalcode
											}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Subject
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.customerPo.quotations.subject}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Job Description
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{ dataSelected.job_description }
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Priority
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.priority_status} (Quantity:{" "}
											{dataSelected.qty})
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Sales / Estimator
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.employee.employee_name} / {dataSelected.estimator.employee_name}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Date Of Order / Date Schedulle
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{moment(dataSelected.date_of_order).format(
												"DD-MMMM-YYYY"
											)}{" "}
											/{" "}
											{moment(dataSelected.delivery_date).format(
												"DD-MMMM-YYYY"
											)}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Shipping Addres
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.shipping_address}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Equipment
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											Mfg : {dataSelected.eq_mfg} , Rotasi: {dataSelected.eq_rotation} , Model: {dataSelected.eq_model} , Power: {dataSelected.eq_power}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											File
										</td>
										<td className='w-[50%] py-2 px-2 border border-gray-200'>
											{
												dataSelected.file_list === null ? 'Tidak Ada File' : (
													<a
														href={dataSelected.file_list}
														target='_blank'
														className='justify-center rounded-full border border-transparent bg-green-500 px-4 py-1 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer'
													>
														Show File
													</a>
												)
											}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="w-full">
							<h1 className='font-bold text-xl mt-2'>Scope Of work</h1>
							<table className="w-full">
								<thead>
									<tr>
										<th className="border border-black text-center">No</th>
										<th className="border border-black text-center">Standart work scope item</th>
										<th className="border border-black text-center">qty</th>
										<th className="border border-black text-center">Unit</th>
									</tr>
								</thead>
								<tbody>
									{ dataSelected.work_scope_item.map( (res: any, i:number) => {
										return(
											<tr key={i}>
												<td className="border border-black text-center">
													{ i + 1 }
												</td>
												<td className="border border-black pl-2">
													{ res.item }
												</td>
												<td className="border border-black text-center">
													{ res.qty }
												</td>
												<td className="border border-black text-center">
													{ res.unit }
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					</Section>
				</div>
			) : null}
		</div>
	);
};
