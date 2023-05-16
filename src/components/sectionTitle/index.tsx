interface props {
	title?: string;
    icon?: any;
    total?: number;
}


export const SectionTitle = ({title,icon,total} : props) => {
    return (
        <div className="flex items-center">
            <div className="bg-red-200 p-[12px] flex justify-center items-center rounded-[23px]">
                {icon}
            </div>

            <div className="ml-[13px]">
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-small">{total} {title}</p>
            </div>
        </div>
    )
}