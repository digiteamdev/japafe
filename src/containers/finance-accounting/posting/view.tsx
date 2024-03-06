import { Section } from "../../../components";
import { Posting } from "../../../services";
import { formatRupiah } from "../../../utils/index";
import { Check } from "react-feather";
import moment from "moment";
import { toast } from "react-toastify";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

export const ViewPosting = ({ dataSelected, content, showModal }: props) => {

    const total = (data: any, type: string) => {
        let total: number = 0;
        data.map((res: any) => {
            if (res.status_transaction === type) {
                total = total + res.grandtotal;
            }
        });
        return formatRupiah(total.toString());
    };

    const posting = async () => {
        try {
			const response = await Posting(dataSelected.id);
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
	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			{dataSelected ? (
				<>
					<div className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1'>
						<div>
							<h1 className='font-bold text-xl'>Posting</h1>
						</div>
						<div className='text-right mr-6'>
							<button
								className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
								onClick={() => posting()}
							>
								<div className='flex px-1 py-1'>
									<Check size={16} className='mr-1' /> Posting
								</div>
							</button>
						</div>
					</div>
					<Section className='grid grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								<tbody>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Reference
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{dataSelected.id_cashier}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Date
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>
											{moment(dataSelected.date_cashier).format("DD-MMMM-YYYY")}
										</td>
									</tr>
									<tr>
										<td className='w-[50%] bg-gray-300 pl-2 border border-gray-200'>
											Job No
										</td>
										<td className='w-[50%] pl-2 border border-gray-200'>-</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Section>
					<Section className='grid grid-cols-1 gap-2 mt-2'>
						<table className='w-full'>
							<thead>
								<tr>
									<th className='border border-black text-center'>Code</th>
									<th className='border border-black text-center'>
										Account Name
									</th>
									<th className='border border-black text-center'>Type</th>
									<th className='border border-black text-center'>Debit</th>
									<th className='border border-black text-center'>Kredit</th>
								</tr>
							</thead>
							<tbody>
								{dataSelected.journal_cashier.map((res: any, i: number) => {
									return (
										<tr key={i}>
											<td className='border border-black text-center'>
												{res.coa.coa_code}
											</td>
											<td className='border border-black text-center'>
												{res.coa.coa_name}
											</td>
											<td className='border border-black text-center'>
												{res.status_transaction}
											</td>
											<td className='border border-black text-center'>
												{res.status_transaction === "Debet"
													? formatRupiah(res.grandtotal.toString())
													: "-"}
											</td>
											<td className='border border-black text-center'>
												{res.status_transaction === "Kredit"
													? formatRupiah(res.grandtotal.toString())
													: "-"}
											</td>
										</tr>
									);
								})}
								<tr>
									<td
										className='border border-black text-right pr-2'
										colSpan={3}
									>
										Total
									</td>
									<td className='border border-black text-center'>
										{total(dataSelected.journal_cashier, "Debet")}
									</td>
									<td className='border border-black text-center'>
										{total(dataSelected.journal_cashier, "Kredit")}
									</td>
								</tr>
							</tbody>
						</table>
					</Section>
				</>
			) : null}
		</div>
	);
};
