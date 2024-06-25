import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { Bell } from "react-feather";
import { listNotification } from "../../../utils"
import { removeToken, getImage } from "../../../configs/session";
import { Logout } from "../../../services/";
import { toast } from "react-toastify";
import Image from "next/image";

interface props {
	data: any;
	count: number;
}

export const Notification = ({ data, count }: props) => {
	const router = useRouter();
	useEffect(() => {
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Menu as='div' className='relative inline-block'>
			<div className='justify-center rounded-full'>
				<Menu.Button>
					{count > 0 ? (
						<div className='absolute bg-red-400 justify-center rounded-full px-2 py-1 left-3 top-[-10px]'>
							<p className='text-[12px]'>{count}</p>
						</div>
					) : null}
					<Bell size={32} />
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter='transition ease-out duration-100'
				enterFrom='transform opacity-0 scale-95'
				enterTo='transform opacity-100 scale-100'
				leave='transition ease-in duration-75'
				leaveFrom='transform opacity-100 scale-100'
				leaveTo='transform opacity-0 scale-95'
			>
				<Menu.Items className='absolute right-0 z-10 mt-2 lg:max-h-60 md:max-h-60 sm:max-h-60 xs:max-h-60 lg:w-96 md:w-96 sm:w-64 xs:w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-auto'>
					{data.length === 0 ? (
						<div className='py-1'>
							<div className='p-2 text-center'>
								<Menu.Item>
									<p>no notifications</p>
								</Menu.Item>
							</div>
						</div>
					) : (
						<div className='py-1'>
							<div className='p-2'>
								{data.map((res: any, i: number) => {
									return (
										<Menu.Item key={i} as='div' className="hover:bg-gray-200">
											{listNotification(res, res.type)}
										</Menu.Item>
									);
								})}
							</div>
						</div>
					)}
				</Menu.Items>
			</Transition>
		</Menu>
	);
};
