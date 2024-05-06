import { PropsWithChildren,useState } from "react";
import { Header, SideNav } from "../../components/";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Layout = (props: PropsWithChildren) => {
	const [isSidebar, setIsSidebar] = useState<boolean>(false);

	const showSidebar = () => {
		setIsSidebar(!isSidebar);
	};

	return (
		<>
			<SideNav isSidebar={isSidebar} showSidebar={showSidebar} />
			<Header isSidebar={isSidebar} showSidebar={showSidebar} />
			<div
				className={`overflow-auto bg-white transition-all duration-500 ease-in-out ${
					isSidebar ? "p-3 pl-72" : "p-3 pl-4"
				}`}
			>
				{props.children}
			</div>
			<ToastContainer />
		</>
	);
};

export default Layout;