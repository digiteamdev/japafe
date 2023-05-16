import { ReactNode } from "react";

interface props {
	className: string;
	children: ReactNode;
}

export const Section = ({
	children,
	className
}: props) => {
	return (
		<div 
        className={className}>
			{children}
        </div>
	);
};
