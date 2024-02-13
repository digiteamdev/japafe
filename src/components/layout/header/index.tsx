import { useEffect, useState } from "react";
import { Menu, Search } from 'react-feather';
import { Dropdown } from '../menu';
import { getUsername, getImage } from '../../../configs/session';

interface props {
	isSidebar?: boolean;
	showSidebar?: () => void;
}

export const Header = ({ isSidebar, showSidebar }: props) => {

	const [username, setUsername] = useState<any>();
	const [image, setImage] = useState<any>(null);

	useEffect( () => {
		let photo = getImage()
		let user = getUsername()
		if (user === undefined) {
			setUsername("")
		}else{
			setUsername(user)
		}
		if (image !== undefined) {
			setImage(photo)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<nav className={`${ isSidebar ? 'md:pl-80' : 'md:pl-3' } fixed z-10 w-full bg-blue-100 transition-all duration-500 ease-in-out`}>
			<div className='py-3 px-3 lg:px-5 lg:pl-3'>
				<div className='flex justify-between items-center'>
					<div className='flex justify-start items-center w-full'>
						<button
							type='button'
							onClick={showSidebar}
							className='hidden p-2 mr-4 rounded-full text-red-500 cursor-pointer lg:inline hover:text-white hover:bg-red-500'
						>
                            <Menu size={28}/>
						</button>
						<button
							onClick={showSidebar}
							className='p-2 mr-2 text-red-500 rounded-full cursor-pointer lg:hidden hover:text-white hover:bg-red-500 focus:bg-red-500 focus:ring-2 focus:ring-red-100 focus:text-white'
						>
                            <Menu size={28}/>
						</button>
						<div className='relative mt-1 w-full'>
							{/* <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none text-primary-500'>
								<Search size={28}/>
							</div>
							<input
								type='text'
								name='search'
								className='bg-white text-lg border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-[90%] outline-primary-600 pl-11 p-2.5'
								placeholder='Search'
							/> */}
						</div>
					</div>
					<div className='flex items-center'>
						<p className='mr-2'>{ username }</p>
						<Dropdown />
					</div>
				</div>
			</div>
		</nav>
	);
};
