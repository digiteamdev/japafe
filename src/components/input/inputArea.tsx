interface props {
	id?: string;
	className?: string;
	type?: string;
	placeholder?: string;
	label?: string;
	value?: string;
	name?: string;
	disabled?: boolean;
    row?: number;
	required?: boolean;
	withLabel?: boolean;
	onChange?: any;
}

export const InputArea = ({
	row,
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
}: 
props) => {
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
			<textarea
                rows={row}
				disabled={disabled}
				name={name}
				id={id}
				placeholder={placeholder}
				value={value}
				className={`${className}`}
				required={required}
				onChange={onChange}
			/>
		</div>
	);
};