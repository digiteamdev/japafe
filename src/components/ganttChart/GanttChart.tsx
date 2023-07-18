import { ReactNode } from "react";

interface props {
	widthTable?: string;
    gridCols?: string;
	aktivitas: ReactNode;
    listMonth: ReactNode;
    listDate: ReactNode;
    tasks: ReactNode;
	onClick?: () => void;
}

export const GanttChart = ({
	aktivitas,
    listMonth,
    listDate,
    tasks,
	widthTable,
    gridCols,
	onClick,
}: props) => {
	return (
		<div className='flex'>
			<div className='w-[40%]'>
				<div className='grid grid-cols-4 w-full'>
					<div className='w-full border-t border-l border-r border-gray-500 p-[2px]'>
						&nbsp;
					</div>
					<div className='w-full border-t border-r border-gray-500 p-[2px]'>
						&nbsp;
					</div>
					<div className='w-full border-t border-r border-gray-500 p-[2px]'>
						&nbsp;
					</div>
					<div className='w-full border-t border-r border-gray-500 p-[2px]'>
						&nbsp;
					</div>
					<div className='w-full text-center border-l border-r border-gray-500 p-[2px]'>
						Aktivitas
					</div>
					<div className='w-full border-r border-gray-500 text-center p-[2px]'>
						Start Date
					</div>
					<div className='w-full border-r border-gray-500 text-center p-[2px]'>
						End Date
					</div>
					<div className='w-full text-center border-r border-gray-500 p-[2px]'>
						Durasi
					</div>
					<div className='w-full border-l border-r border-gray-500 p-[2px]'>
						&nbsp;
					</div>
					<div className='w-full border-r border-gray-500 p-[2px]'>&nbsp;</div>
					<div className='w-full border-r border-gray-500 p-[2px]'>&nbsp;</div>
					<div className='w-full border-r border-gray-500 p-[2px]'>&nbsp;</div>
				</div>
                { aktivitas }
				{/* {aktivitas.map((res: any, i: number) => {
					return (
						<div className='grid grid-cols-4 w-full' key={i}>
							<div className='w-full border border-gray-500 text-justify'>
								<p className='text-center'>{res.masterAktivitas.name}</p>
							</div>
							<div className='w-full border border-gray-500 text-justify'>
								<p className='text-center'>
									{moment(res.startday).format("DD-MM-YYYY")}
								</p>
							</div>
							<div className='w-full border border-gray-500 text-justify'>
								<p className='text-center'>
									{moment(res.endday).format("DD-MM-YYYY")}
								</p>
							</div>
							<div className='w-full border border-gray-500 text-justify'>
								<p className='text-center'>{res.days}</p>
							</div>
						</div>
					);
				})} */}
			</div>
			<div className='w-[60%]'>
				<div className='grid grid-cols-1 w-full overflow-auto'>
					<div
						className={`${widthTable} border-t border-r border-gray-500 p-[2px]`}
					>
						<div className='text-center'>Calender</div>
					</div>
					<div
						className={`grid ${gridCols} ${widthTable} border-t border-b border-r border-gray-500 p-[2px]`}
					>
                        { listMonth }
						{/* {listMoth.map((res: any, i: number) => {
							return (
								<div key={i} className='w-full text-center'>
									{res}
								</div>
							);
						})} */}
					</div>
					<div className={`flex ${widthTable} border-gray-500`}>
						{ listDate }
                        {/* {listDate.map((res: any, i: number) => {
							return (
								<div
									key={i}
									className={`w-full text-center ${
										i !== listDate.length + 1 ? "border-r" : ""
									} border-b border-gray-500`}
								>
									<p>{moment(res).format("dd DD")}</p>
								</div>
							);
						})} */}
					</div>
                        { tasks }
					{/* {aktivitas.map((result: any, idx: number) => {
						console.log(result);
						return (
							<div
								key={idx}
								className={`flex relative w-[${
									50 * numDate
								}px] border-gray-500`}
							>
								{listDate.map((res: any, i: number) => {
									return (
										<div
											key={i}
											className={`w-full text-center  ${
												i !== listDate.length + 1 ? "border-r" : ""
											} border-gray-200`}
										>
											<p className='p-[1px]'>&nbsp;</p>
										</div>
									);
								})}
								<div
									className={`absolute l-[${result.left}px] w-[${result.width}px] p-2 m-2 bg-blue-400 rounded-lg cursor-move`}
								></div>
							</div>
						);
					})} */}
				</div>
			</div>
		</div>
	);
};
