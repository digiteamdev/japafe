import { ReactNode } from "react";

interface props {
	id?: string;
	className?: string;
	type?: string;
	placeholder?: string;
	label?: string;
	value?: string;
	name?: string;
	disabled?: boolean;
	required?: boolean;
	withLabel?: boolean;
	onChange?: any;
	children: ReactNode;
}

export const InputSelect = ({
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
	children,
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
			<select
				disabled={disabled}
				name={name}
				id={id}
				placeholder={placeholder}
				value={value}
				className={`${className}`}
				required={required}
				onChange={onChange}
			>
				{children}
			</select>
		</div>
	);
};
