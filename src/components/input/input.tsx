interface props {
	id?: string;
	className?: string;
	type?: string;
	placeholder?: string;
	label?: string;
	value?: string;
	max?: any;
	min?: any;
	pattern?: string;
	name?: string;
	accept?: string;
	disabled?: boolean;
	required?: boolean;
	withLabel?: boolean;
	ref?: any;
	onChange?: any;
}

export const Input = ({
	type,
	id,
	placeholder,
	label,
	value,
	max,
	pattern,
	min,
	name,
	accept,
	className,
	disabled,
	required,
	withLabel,
	onChange,
	ref
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
			<input
				disabled={disabled}
				type={type}
				name={name}
				id={id}
				placeholder={placeholder}
				value={value}
				className={`${className}`}
				required={required}
				max={max}
				pattern={pattern}
				min={min}
				onChange={onChange}
				ref={ref}
				accept={accept}
				multiple
			/>
		</div>
	);
};