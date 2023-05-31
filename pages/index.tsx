import { useEffect } from "react";
import { useRouter } from "next/router";
import { CardLogin } from "../src/containers";
import Hero from "../src/assets/logo/hero-login.svg";
import Image from "next/image";
import { getToken } from "../src/configs/session";
import Head from "next/head";

export default function Home() {
	const router = useRouter();
	const token = getToken();

	useEffect(() => {
		if (token !== undefined) {
			router.push("/dashboard");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<main className='w-full flex items-center h-screen'>
			<Head>
				<title>JAPA MIS | Login</title>
				<link rel='shortcut icon' href='/public/favicon-16x16.png' />
			</Head>
			<div className='w-2/4 h-screen items-center justify-center hidden md:flex lg:flex bg-blue-200 p-6'>
				<Image
					src={Hero}
					className='w-[90%] h-[80%]'
					loading='eager'
					priority={true}
					alt='logo'
				/>
			</div>
			<div className='lg:w-2/4 md:w-2/4 w-full bg-white h-screen flex items-center justify-center'>
				<CardLogin />
			</div>
		</main>
	);
}
