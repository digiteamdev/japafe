import { Printer, FilePlus, Search } from "react-feather";
import { ReactNode } from "react";
import { InputSelect } from "../input/inputSelect";

interface props {
	title?: string;
	print?: boolean;
	marketing?: boolean;
	timeSheet?: boolean;
	mr?: boolean;
	showModal: (val: boolean, content: string, realod: boolean) => void;
	search: (page: number, perpage: number, search: string) => void;
	changeDivisi: (data: string) => void;
	changeTimeSheet: (data: string) => void;
	changeMr: (data: string) => void;
	children: ReactNode;
}

export const Content = ({
	title,
	print,
	marketing,
	timeSheet,
	mr,
	showModal,
	changeDivisi,
	changeTimeSheet,
	changeMr,
	search,
	children,
}: props) => {
	return (
		<div className='bg-white w-full rounded-lg shadow-md p-5 mt-[37px]'>
			<div className='flex flex-wrap lg:flex-nowrap md:flex-nowrap'>
				<div className='flex flex-wrap lg:flex-nowrap md:flex-nowrap w-full mr-2'>
					<div className='lg:w-[65%] md:w-[65%] mr-3 sm:mb-2 sm:w-full xs:mb-2 xs:w-full'>
						<div className='relative w-full'>
							<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-primary-500 z-0'>
								<Search />
							</div>
							<input
								type='text'
								className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
								placeholder={`Search ${title}`}
								onChange={(e) => search(1, 10, e.target.value)}
							/>
						</div>
					</div>
					{/* <div className='lg:w-[10%] md:w-[10%] mr-3 sm:mb-2 sm:w-full xs:mb-2 xs:w-full'>
						{print ? (
							<button className='bg-white hover:bg-gray-200 text-black py-2 px-4 rounded-lg inline-flex items-center border border-primary-300 w-full mr-3'>
								<Printer size={18} />
								<span className='ml-2'>Print</span>
							</button>
						) : null}
					</div> */}
					{marketing ? (
						<div className='lg:w-[35%] md:w-[35%] mr-3 sm:mb-2 sm:w-full xs:mb-2 xs:w-full'>
							<InputSelect
								id=''
								name=''
								placeholder='Material'
								label='Material'
								onChange={(event: any) => {
									changeDivisi(event.target.value);
								}}
								required={true}
								withLabel={false}
								className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
							>
								<option value='S'>SWASTA</option>
								<option value='B'>BUMN</option>
							</InputSelect>
						</div>
					) : null}
					{timeSheet ? (
						<div className='lg:w-[35%] md:w-[35%] mr-3 sm:mb-2 sm:w-full xs:mb-2 xs:w-full'>
							<InputSelect
								id=''
								name=''
								placeholder='Material'
								label='Material'
								onChange={(event: any) => {
									changeTimeSheet(event.target.value);
								}}
								required={true}
								withLabel={false}
								className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
							>
								<option value=''>All</option>
								<option value='worktime'>Work Time</option>
								<option value='overtime'>Over Time</option>
							</InputSelect>
						</div>
					) : null}
					{mr ? (
						<div className='lg:w-[35%] md:w-[35%] mr-3 sm:mb-2 sm:w-full xs:mb-2 xs:w-full'>
							<InputSelect
								id=''
								name=''
								placeholder='Status'
								label='Status'
								onChange={(event: any) => {
									changeMr(event.target.value);
								}}
								required={true}
								withLabel={false}
								className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
							>
								<option value=''>All</option>
								<option value='Request'>Request</option>
								<option value='Approval'>Approval</option>
								<option value='Purchase'>Purchase</option>
								<option value='Receive'>Receive</option>
								<option value='Finish'>Finish</option>
								<option value='Reject'>Reject</option>
							</InputSelect>
						</div>
					) : null}
					<div className='lg:w-[35%] md:w-[35%] mr-3 sm:mb-2 sm:w-full xs:mb-2 xs:w-full'>
						{print ? (
							<button
								className='bg-primary-100 hover:bg-primary-50 text-black py-2 px-4 rounded-lg inline-flex justify-center border border-primary-300 w-full'
								onClick={() => showModal(true, "add", false)}
							>
								<FilePlus size={18} className='mt-[5px]' />
								<span className='ml-2'>New {title}</span>
							</button>
						) : null}
					</div>
				</div>
			</div>
			{children}
		</div>
	);
};
