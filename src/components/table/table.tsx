import { ReactNode } from "react";

interface props {
	header: {name: string}[];
	children: ReactNode;
}

export const Table = ({ header, children }: props) => {
	return (
        <table className="min-w-full text-left text-sm font-gray-200">
			<thead className="border-b bg-gray-100 font-medium">
            	<tr>
					{ header?.map( (res,i) => {
						return (
							// <th scope="col" className={`px-6 py-4 ${i === 0 || i === header.length - 1 ? 'text-center' : ''} text-md`} key={i}>{res.name}</th>
							<th scope="col" className={`p-1 text-center text-md`} key={i}>{res.name}</th>
						)
					}) }
				</tr>
			</thead>
			<tbody>
				{ children }
			</tbody>
		</table>
	);
};