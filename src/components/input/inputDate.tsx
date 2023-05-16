import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'react-feather';

interface props {
	id?: string;
	className?: string;
    classNameIcon?: string;
	label?: string;
	value?: any;
	withLabel?: boolean;
	onAction?: () => void;
	onChange?: any;
}

export const InputDate = ({
	id,
	label,
	className,
    classNameIcon,
    value,
	withLabel,
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
					<Calendar color='#48D1CC' size={24}/>
				</div>
                <DatePicker
                    id={id}
                    selected={new Date(value)}
                    onChange={onChange}
                    className={`${className}`}
                    dateFormat="dd-MM-yyyy"
                />
			</div>
		</div>
	);
};