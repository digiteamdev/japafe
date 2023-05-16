import { Search } from "react-feather";

interface props {
	type?: string;
	placeholder?: string;
	name?: string;
	onChange: (page: number, perpage: number, search:string) => void;
}

export const InputSearch = ({
	type,
	placeholder,
	name,
	onChange
}: props) => {
	return (
		<div className='relative w-full'>
			<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-primary-500'>
				<Search />
			</div>
			<input
				type={type}
				name={name}
				className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
				placeholder={placeholder}
				onChange={ (e) => onChange(1,10,e.target.value)}
			/>
		</div>
	);
};
