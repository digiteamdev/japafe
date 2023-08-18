import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, FileText } from "react-feather";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Printer } from "react-feather";
import { Section } from "../../../components";

interface props {
	isModal?: boolean;
	data?: any;
	showModalPdf: (val: boolean) => void;
}

export const PdfTimeSchedule = ({ isModal, data, showModalPdf }: props) => {
    
	const printDocument = () => {
		const doc: any = document.getElementById("divToPrint");
		html2canvas(doc).then((canvas) => {
			const imgData = canvas.toDataURL("image/png");
			const pdf: any = new jsPDF("p", "mm", "a4");
			const width = pdf.internal.pageSize.getWidth();
			const height = pdf.internal.pageSize.getHeight();
			pdf.addImage(imgData, "JPEG", 0, 0, width, 0);
			// window.open(pdf.output("bloburl"), "_blank");
			pdf.save(`Bill_of_material_${data.srimg.wor.job_no}.pdf`);
		});
	};

    const showEquipment = (data: any) => {
        let equipment: any = [];
        data.map((res: any) => {
            if (!equipment.includes(res.equipment.nama)) {
                equipment.push(res.equipment.nama);
            }
        });
        return equipment.toString()
    }

	return (
		<div className='z-80'>
			<Transition appear show={isModal} as={Fragment}>
				<Dialog
					as='div'
					className='relative w-full'
					onClose={() => showModalPdf(false)}
				>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-black z-20 bg-opacity-25 w-full h-screen' />
					</Transition.Child>

					<div className='fixed inset-0 z-40 overflow-y-auto w-full'>
						<div className='flex min-h-full items-center justify-center p-4 text-center'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<Dialog.Panel className='w-full max-w-6xl transform overflow-x-auto rounded-lg bg-white text-left align-middle shadow-xl transition-all'>
									<div
										className={`flex items-center justify-between px-5 py-[10px] bg-primary-400`}
									>
										<div className='flex items-center gap-2'>
											<div className='w-10 h-10 rounded-full bg-white flex justify-center items-center'>
												<FileText />
											</div>
											<Dialog.Title
												as='h4'
												className='text-base font-bold leading-6 text-white'
											>
												Download Time Schedule
											</Dialog.Title>
										</div>

										<button
											onClick={() => showModalPdf(false)}
											className='text-white text-sm font-semibold'
										>
											<X />
										</button>
									</div>
									<div className='text-center mt-3'>
										<button
											className={`justify-center rounded-full border border-transparent bg-blue-500 hover:bg-blue-400 px-4 py-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
											onClick={() => printDocument()}
										>
											<div className='flex px-1 py-1'>
												<Printer size={16} className='mr-1' /> Download PDF
											</div>
										</button>
									</div>
									<div
										className='my-4 mx-48 px-2'
										id='divToPrint'
									>
										{data ? (
											<div className="w-full my-4">
                                                <Section className="grid grid-cols-1 gap-2 border-t border-l border-r border-black">
                                                    <p className="text-center font-bold mb-2">BILL OF MATERIAL</p>
                                                </Section>
                                                <Section className="grid grid-cols-2 gap-2 border-t border-l border-r border-black">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="w-full">
                                                            <p className="ml-2 mb-2">JOB NO</p>
                                                        </div>
                                                        <div className="w-full border-r border-black">
                                                            <p className=" mb-2">: { data.srimg.wor.job_no } { data.srimg.wor.refivision }</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="w-full">
                                                            <p className="ml-2 mb-2">CUSTOMER</p>
                                                        </div>
                                                        <div className="w-fullborder-black">
                                                            <p className=" mb-2">: { data.srimg.wor.customerPo.quotations.Customer.name }</p>
                                                        </div>
                                                    </div>
                                                </Section>
                                                <Section className="grid grid-cols-2 gap-2 border-t border-l border-r border-black">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="w-full">
                                                            <p className="ml-2 mb-2">EQUIPMENT</p>
                                                        </div>
                                                        <div className="w-full border-r border-black">
                                                            <p className="mb-2">: { showEquipment(data.srimg.wor.customerPo.quotations.eqandpart) }</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="w-full">
                                                            <p className="ml-2 mb-2">S/N</p>
                                                        </div>
                                                        <div className="w-fullborder-black">
                                                            <p className="mb-2">: -</p>
                                                        </div>
                                                    </div>
                                                </Section>
                                                <Section className="grid grid-cols-2 gap-2 border-t border-l border-r border-black">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="w-full">
                                                            <p className="ml-2 mb-2">O E M</p>
                                                        </div>
                                                        <div className="w-full border-r border-black">
                                                            <p className="mb-2">: { data.srimg.wor.ioem }</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="w-full">
                                                            <p className="ml-2 mb-2">TAG NUMBER</p>
                                                        </div>
                                                        <div className="w-fullborder-black">
                                                            <p className="mb-2">: { data.srimg.wor.itn }</p>
                                                        </div>
                                                    </div>
                                                </Section>
                                                <Section className="grid grid-cols-2 gap-2 border border-black">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="w-full">
                                                            <p className="ml-2 mb-2">MODEL/TYPE</p>
                                                        </div>
                                                        <div className="w-full border-r border-black">
                                                            <p className="mb-2">: { data.srimg.wor.eq_model }</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="w-full">
                                                            <p className="ml-2 mb-2">QUANTITY</p>
                                                        </div>
                                                        <div className="w-fullborder-black">
                                                            <p className="mb-2">: { data.srimg.wor.qty }</p>
                                                        </div>
                                                    </div>
                                                </Section>
                                                <Section className="grid grid-cols-1 gap-2 mt-4">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th className="border border-black text-center pb-2">NO</th>
                                                                <th className="border border-black text-center pb-2">DESCRIPTION</th>
                                                                <th className="border border-black text-center pb-2">MATERIAL</th>
                                                                <th className="border border-black text-center pb-2">REMARK</th>
                                                                <th className="border border-black text-center pb-2">QTY</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            { data.bom_detail.map( (res: any, i: number) => {
                                                                return (
                                                                    <tr key={i}>
                                                                        <td className="border border-black text-center"><p className="mb-2">{ i + 1 }</p></td>
                                                                        <td className="border border-black text-center"><p className="mb-2">{ res.srimgdetail.name_part }</p></td>
                                                                        <td className="border border-black text-center"><p className="mb-2">{ res.Material_master.material_name }</p></td>
                                                                        <td className="border border-black text-center"><p className="mb-2">{ res.srimgdetail.choice }</p></td>
                                                                        <td className="border border-black text-center"><p className="mb-2">{ res.srimgdetail.qty }</p></td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </Section>
                                                <p className="font-bold">REMAINING OF WORK SCOPE</p>
											</div>
										) : null}
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
};
