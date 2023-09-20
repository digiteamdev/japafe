import { Fragment } from 'react';
import { useRouter } from "next/router";
import Link from "next/link";
import { Menu, Transition } from '@headlessui/react';
import { User } from 'react-feather';
import { removeToken } from '../../../configs/session';
import { Logout } from '../../../services/';
import { toast } from 'react-toastify';

export const Dropdown = () => {

    const router = useRouter();

    const logout = async () =>{
        try {
			const response = await Logout();
			if (response) {
                removeToken()
                router.push('/')
			}
		} catch (error) {
			toast.error("Logout Failed", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		}
    }

    return (
        <Menu as="div" className="relative inline-block text-left">
        <div>
            <Menu.Button className="flex w-10 h-10 justify-center rounded-full bg-red-500 px-1 py-1 font-bold text-white hover:bg-red-900">
                <User size={30}/>
            </Menu.Button>
        </div>

        <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
                <Menu.Item>
                    <Link href="/user/account">
                        <span
                            className='bg-white text-gray-900 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-200'
                        >
                        Account
                        </span>
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <span
                    className='bg-white text-gray-900 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-200'
                    >
                    Support
                    </span>
                </Menu.Item>
                <Menu.Item>
                    <span
                    className='bg-white text-gray-900 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-200'
                    >
                    License
                    </span>
                </Menu.Item>
                <Menu.Item>
                <span
                    className='bg-white text-gray-900 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-200'
                    onClick={ () => logout() }
                >
                    Sign out
                    </span>
                </Menu.Item>
            </div>
            </Menu.Items>
        </Transition>
        </Menu>
    )
}
