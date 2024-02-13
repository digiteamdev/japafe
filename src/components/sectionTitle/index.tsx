interface props {
	title?: string;
	icon?: any;
	total?: number;
    informasi?: any;
}

export const SectionTitle = ({ title, icon, total, informasi }: props) => {
	return (
		<div className='grid grid-cols-2 gap-2'>
			<div className='flex items-center w-full'>
				<div className='bg-red-200 p-[12px] flex justify-center items-center rounded-[23px]'>
					{icon}
				</div>

				<div className='ml-[13px]'>
					<h1 className='text-3xl font-bold'>{title}</h1>
					<p className='text-small'>
						{total} {title}
					</p>
				</div>
			</div>

            {informasi}
		</div>
	);
};
