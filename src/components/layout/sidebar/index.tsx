/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "../../../assets/script/Logo";
import { ListNav } from "./listSidebar";
import { useRouter } from "next/router";
import { ChevronDown, ChevronUp, X } from "react-feather";

interface props {
	isSidebar?: boolean;
	innerRef?: any;
	showSidebar?: () => void;
}

export const SideNav = ({ isSidebar, innerRef, showSidebar }: props) => {
	const router = useRouter();
	const [link, setLink] = useState<any>("dashboard");
	const [subMenu, setSubMenu] = useState<any>(null);
	const [page, setPage] = useState<string>("dashboard");

	useEffect(() => {
		let route = router.pathname;
		let arrayRouter = route.split("/");
		if (arrayRouter.length == 1) {
			setLink(arrayRouter[1]);
			setPage(arrayRouter[1]);
			setSubMenu(null);
		} else {
			setLink(arrayRouter[1]);
			setPage(arrayRouter[1]);
			setSubMenu(arrayRouter[2]);
		}
	}, [router]);

	return (
		<aside
			ref={innerRef}
			className={`z-20 bg-blue-100 lg:block md:block w-full md:w-64 lg:w-64 h-full fixed transition-all duration-500 ease-in-out ${
				isSidebar ? "translate-x-0 block" : "translate-x-[-300px] invisible"
			}`}
		>
			<div>
				<div className='w-full p-4 flex justify-between'>
					<div className='block md:hidden lg:hidden'>
						<div>
							<Logo />
						</div>
					</div>
					<div className='hidden md:flex lg:flex items-center'>
						<div className='ml-4'>
							<Logo />
						</div>
					</div>
					<div className='none md:hidden lg:hidden'>
						<button onClick={showSidebar}>
							<X color='black' size={28} />
						</button>
					</div>
				</div>
			</div>
			<div className='scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300 h-[80%] overflow-y-scroll'>
				<ul className='relative mt-4 mb-6'>
					{ListNav.map((value, index) => {
						if (value.subMenu === null) {
							return (
								<Link key={index} href={value.link}>
									<li
										className={`pl-4 mx-[12px] my-2 rounded-lg cursor-pointer py-2 ${
											page === value.id
												? "bg-red-500 hover:bg-red-400"
												: "hover:bg-red-300"
										}`}
									>
										<p
											className={`w-full text-md font-bold ${
												page === value.id ? "text-white" : "text-black"
											}`}
										>
											{value.title}
										</p>
									</li>
								</Link>
							);
						} else {
							return (
								<div key={index}>
									<li
										className={`pl-4 mx-[12px] my-2 rounded-lg cursor-pointer py-2  ${
											page === value.id ? "bg-red-500 hover:bg-red-400" : "hover:bg-red-300"
										}`}
										onClick={() => {
											if (value.subMenu) {
												if (link) {
													if (link === value.id) {
														setLink(null);
													} else {
														setLink(value.id);
													}
												} else {
													setLink(value.id);
												}
											}
										}}
									>
										<div
											className={`flex items-center justify-between pr-2 w-full ${
												page === value.id ? "" : "hover:bg-red-300"
											}`}
										>
											<span
												className={`w-full text-md font-bold ${
													page === value.id
														? "text-white"
														: "text-black"
												}`}
											>
												{value.title}
											</span>
											{link === value.id ? (
												<ChevronDown color='black' size={28} />
											) : (
												<ChevronUp color='black' size={28} />
											)}
										</div>
									</li>

									{link === value.id ? (
										<ul>
											{value.subMenu
												? value.subMenu.map((result,i) => {
														return (
															<Link
																href={result.link}
																className={`${
																	subMenu === result.id
																		? "text-red-500"
																		: "text-black"
																} font-bold`}
																key={i}
															>
																<li
																	className={`ml-4 mt-2 rounded-md cursor-pointer pl-4 py-2 border-l-2 hover:border-red-500 ${
																		subMenu === result.id
																			? "border-red-500"
																			: ""
																	}`}
																	key={result.title}
																>
																	{result.title}
																</li>
															</Link>
														);
												}) : null}
										</ul>
									) : null}
								</div>
							);
						}
					})}
				</ul>
			</div>
			<div className='mx-[24px] my-5 text-center'>
				<p className='text-xs text-black'>
					© {new Date().getFullYear()} Digi Techno Indonesia
				</p>
				<p className='text-xs text-black'>All Rights Reserved.</p>
			</div>
		</aside>
	);
};
