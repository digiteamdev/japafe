import moment from "moment";
import { Section } from "../../../components";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewPurchaseReceive = ({ dataSelected, content, showModal }: props) => {
    
    return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Purchase Receive</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										ID Receive
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.id_receive}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Date Receive
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{moment(dataSelected.date_receive).format("DD-MMMM-YYYY")}
									</td>
								</tr>
                                <tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										ID Purchase
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.id_so}
									</td>
								</tr>
                                <tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Date Purchase
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
                                    {moment(dataSelected.date_prepared).format("DD-MMMM-YYYY")}
									</td>
								</tr>
                                <tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										DO Id
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										
									</td>
								</tr>
							</table>
						</div>
					</Section>
                    <h5 className='font-bold text-lg my-4'>Detail Purchase Receive</h5>
                    { dataSelected.detailMr.length > 0 ? (
                        <Section className="grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="border border-black p-1 text-center">
                                            Job No
                                        </th>
                                        <th className="border border-black p-1 text-center">
                                            No MR
                                        </th>
                                        <th className="border border-black p-1 text-center">
                                            Supplier
                                        </th>
                                        <th className="border border-black p-1 text-center">
                                            Material Name
                                        </th>
                                        <th className="border border-black p-1 text-center">
                                            Qty Pruchase
                                        </th>
                                        <th className="border border-black p-1 text-center">
                                            Qty Receive
                                        </th>
                                        <th className="border border-black p-1 text-center">
                                            File Receive
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { dataSelected.detailMr.map( (res:any, i: number) => (
                                        <tr key={i}>
                                            <td className="border border-black p-1 text-center">
                                                { res.mr.job_no }
                                            </td>
                                            <td className="border border-black p-1 text-center">
                                                { res.mr.no_mr }
                                            </td>
                                            <td className="border border-black p-1 text-center">
                                                { res.supplier?.supplier_name }
                                            </td>
                                            <td className="border border-black p-1 text-center">
                                                {res.name_material + " " + res.spesifikasi}
                                            </td>
                                            <td className="border border-black p-1 text-center">
                                                { res.qtyAppr }
                                            </td>
                                            <td className="border border-black p-1 text-center">
                                                { res.qty_receive }
                                            </td>
											<td className='border border-black text-center'>
												{ res.file_receive ? (
													<a href={res.file_receive} target="_blank" className="text-blue-500 underline hover:text-blue-700 cursor-pointer">Show File</a>
												) : '-' }
											</td>
                                        </tr>
                                    ) ) }
                                </tbody>
                            </table>
                        </Section>
                    ) : null }
                    { dataSelected.SrDetail.length > 0 ? (
                        <Section className="grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="border border-black p-2 text-center">
                                            Job No
                                        </th>
                                        <th className="border border-black p-2 text-center">
                                            No SR
                                        </th>
                                        <th className="border border-black p-2 text-center">
                                            Supplier
                                        </th>
                                        <th className="border border-black p-2 text-center">
                                            Service Description
                                        </th>
                                        <th className="border border-black p-2 text-center">
                                            Qty
                                        </th>
                                        <th className="border border-black p-2 text-center">
                                            Qty Recieve
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { dataSelected.SrDetail.map( (res:any, i: number) => (
                                        <tr key={i}>
                                            <td className="border border-black p-2 text-center">
                                                { res.sr.job_no }
                                            </td>
                                            <td className="border border-black p-2 text-center">
                                                { res.sr.no_sr }
                                            </td>
                                            <td className="border border-black p-2 text-center">
                                                { res.supplier?.supplier_name }
                                            </td>
                                            <td className="border border-black p-2 text-center">
                                                { res.desc }
                                            </td>
                                            <td className="border border-black p-2 text-center">
                                                { res.qtyAppr }
                                            </td>
                                            <td className="border border-black p-2 text-center">
                                                { res.qty_receive }
                                            </td>
                                        </tr>
                                    ) ) }
                                </tbody>
                            </table>
                        </Section>
                    ) : null }
				</>
			) : null}
		</div>
	);
};
