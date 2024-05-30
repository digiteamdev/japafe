import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock } from "react-feather";

interface props {
	id?: string;
	className?: string;
	classNameIcon?: string;
	label?: string;
	name?: string;
	minDate?: any;
	maxDate?: any;
	value?: any;
	dateFormat?: string;
	showTimeSelect?: boolean;
	showTimeSelectOnly?: boolean;
	disabled?: boolean;
	withLabel?: boolean;
	onAction?: () => void;
	onChange?: any;
}

export const InputDate = ({
	id,
	label,
	className,
	classNameIcon,
	showTimeSelect,
	showTimeSelectOnly,
	minDate,
	maxDate,
	name,
	value,
	withLabel,
	disabled,
	dateFormat,
	onAction,
	onChange,
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
			<div className='relative mb-6'>
				<div className={`${classNameIcon}`} onClick={onAction}>
					<Calendar color='#48D1CC' size={24} />
				</div>
				<DatePicker
					id={id}
					name={name}
					selected={new Date(value)}
					onChange={onChange}
					className={`${className}`}
					showTimeSelect={showTimeSelect}
					showTimeSelectOnly={showTimeSelectOnly}
					dateFormat={dateFormat}
					timeFormat='HH:mm'
					minDate={new Date(minDate)}
					maxDate={new Date(maxDate)}
					disabled={disabled}
				/>
			</div>
		</div>
	);
};

export const InputTime = ({
	id,
	label,
	className,
	classNameIcon,
	name,
	value,
	withLabel,
	onAction,
	onChange,
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
			<div className='relative mb-6'>
				<div className={`${classNameIcon}`} onClick={onAction}>
					<Clock color='#48D1CC' size={24} />
				</div>
				<DatePicker
					id={id}
					name={name}
					selected={new Date(value)}
					className={`${className}`}
					onChange={onChange}
					showTimeSelect
					showTimeSelectOnly
					timeIntervals={15}
					timeCaption='Time'
					dateFormat='h:mm aa'
				/>
			</div>
		</div>
	);
};
