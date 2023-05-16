import { ReactNode } from "react";

interface props {
	className?: string;
	disabled?: boolean;
	children: ReactNode;
    onClick?: () => void;
}

export const Button = ({
	children,
	className,
	disabled,
    onClick
}: props) => {
	return (
		<button
			type='submit'
			disabled={disabled}
			className={`${className}`}
            onClick={onClick}
		>
			{children}
		</button>
	);
};
