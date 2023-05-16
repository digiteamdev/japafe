interface props {
	id?: string;
	className?: string;
    classNameIcon?: string;
	type?: string;
	placeholder?: string;
	label?: string;
	value?: string;
	max?: string;
	name?: string;
	disabled?: boolean;
	required?: boolean;
	withLabel?: boolean;
	icon?: any;
	onAction?: () => void;
	onChange?: any;
}

export const InputWithIcon = ({
	type,
	id,
	placeholder,
	label,
	value,
	max,
	name,
	className,
    classNameIcon,
	disabled,
	required,
	withLabel,
	icon,
    onAction,
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
			<div className='relative mb-6'>
				<div 
                    className={`${classNameIcon}`}
                    onClick={onAction}
                >
					{ icon }
				</div>
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
                    onChange={onChange}
				/>
			</div>
		</div>
	);
};
