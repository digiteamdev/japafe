import { useState } from "react";
import { Section } from "../../../components";
import { Printer } from "react-feather";
import { PdfBillOfMaterial } from "./PdfBillOfMaterial";

interface props {
	dataSelected: any;
}

export const ViewBillOfMaterial = ({ dataSelected }: props) => {
	const [isModal, setIsModal] = useState<boolean>(false);

	const showModalPdf = (val: boolean) => {
		setIsModal(val);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			{/* <PdfBillOfMaterial
				isModal={isModal}
				data={dataSelected}
				showModalPdf={showModalPdf}
			/> */}
			{dataSelected ? (
				<>
					<div className='grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-2'>
					<h1 className='font-bold text-xl'>Bill Of Material</h1>
						{/* <div className='text-right mr-6'>
							<button
								className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
								onClick={() => showModalPdf(true)}
							>
								<div className='flex px-1 py-1'>
									<Printer size={16} className='mr-1' /> Print
								</div>
							</button>
						</div> */}
					</div>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										ID Summary
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.srimg.id_summary}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										No Job
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.srimg.timeschedule.wor.job_no}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Customer
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.srimg.timeschedule.wor.customerPo.quotations.Customer.name}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Subject
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.srimg.timeschedule.wor.customerPo.quotations.subject}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-4'>
						<table>
							<thead>
								<tr>
									<th className='border border-black text-center'>Material Name</th>
									<th className='border border-black text-center'>Satuan</th>
									<th className='border border-black text-center'>Quantity</th>
									<th className='border border-black text-center'>Dimensi</th>
								</tr>
							</thead>
							<tbody>
								{dataSelected.bom_detail.map((res: any, i: number) => {
									return (
										<tr key={i}>
											<td className='border border-black text-center'>
												{res.Material_Master.name} {res.Material_Master.spesifikasi}
											</td>
											<td className='border border-black text-center'>
												{res.Material_Master.satuan}
											</td>
											<td className='border border-black text-center'>
												{res.qty}
											</td>
											<td className='border border-black text-center'>{res.dimensi}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</Section>
				</>
			) : null}
		</div>
	);
};
