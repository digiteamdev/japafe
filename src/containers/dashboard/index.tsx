import { DataOverview } from "./data";

export const Dashboard = () => {

	return (
		<div className='mt-14 lg:mt-20 md:mt-20 sm:mt-20'>
			<div className='flex items-center mt-5 gap-5 lg:flex-row flex-col'>
				{DataOverview.map((value, i) => {
					return (
						<div
							className='flex border rounded-xl shadow-md py-4 px-5 w-full justify-between'
							key={i}
						>
							<div>
								<h4 className='text-base font-semibold text-gray-500'>
									{value.name}
								</h4>
								<h2 className='mt-3 text-3xl font-semibold text-gray-600'>
									{value.total}
								</h2>
								<h4 className='mt-3 text-base font-semibold text-gray-400'>
									<span className='text-green-400'>{value.percentage}</span>{" "}
									Customer from last month
								</h4>
							</div>
							<div
								className='bg-red-500 p-2 flex justify-center items-center'
								style={{ width: "62px", height: "60px", borderRadius: 23 }}
							>
								{value.icon}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
