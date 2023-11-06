import Select from 'react-select'

interface props {
	id?: string;
	className?: string;
	type?: string;
	placeholder?: string;
	label?: string;
	value?: any;
	name?: string;
	disabled?: boolean;
	required?: boolean;
	withLabel?: boolean;
	onChange?: any;
	datas?: any;
}

export const InputSelectSearch = ({
	id,
	placeholder,
	label,
	value,
	name,
	className,
	disabled,
	required,
	withLabel,
	onChange,
	datas,
}: props) => {
	return (
		<div>
			{withLabel ? (
				<label
					htmlFor={id}
					className='block mb-2 text-sm font-medium text-gray-900'
				>
					{label}
				</label>
			) : null}
			<Select
				// disabled={disabled}
				name={name}
				id={id}
				placeholder={placeholder}
				value={value}
				className={`${className}`}
				required={required}
				onChange={onChange}
				options={datas}
				maxMenuHeight={150}
			/>
		</div>
	);
};
