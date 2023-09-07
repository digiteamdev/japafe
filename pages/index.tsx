import { useEffect } from "react";
import { useRouter } from "next/router";
import { CardLogin } from "../src/containers";
import Logo1 from "../src/assets/logo/logo-ISO-9001.png";
import Logo2 from "../src/assets/logo/Logo-ISO-45001.png";
import Logo3 from "../src/assets/logo/Logo-ISO-14001.png";
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
				<title>DWITAMA E-WIS | Login</title>
				{/* <link rel='shortcut icon' href='/static/favicon-16x16.png' /> */}
			</Head>
			<div className='w-2/4 h-screen items-center justify-center hidden md:flex lg:flex bg-blue-200 p-6'>
				<div className='h-[50%]'>
					<p className='text-xl font-semibold text-justify tracking-tighter'>
						PT Dwitama Mulya Persada Adalah perusahaan swasta nasional yang
						memfokuskan kegiatan bisnisnya dalam menawarkan berbagai solusi dan
						penyelesaian masalah maupun kendala yang dihadapi oleh banyak bidang
						industri.
					</p>
					<p className='text-xl font-semibold text-justify tracking-tighter'>
						Kegiatan usaha kami mencakup, Pembuatan dan perbaikan rotating
						parts, Pembuatan komponen presisi, Pembuatan dan perbaikan babbitt
						bearing, Perbaikan unit pompa, & Perbaikan turbin.
					</p>
					<div className='flex mt-20 justify-center'>
						<Image
							src={Logo1}
							className='w-[20%] h-[20%]'
							loading='eager'
							priority={true}
							alt='logo'
						/>
						<Image
							src={Logo2}
							className='w-[16%] h-[20%] ml-10'
							loading='eager'
							priority={true}
							alt='logo'
						/>
						<Image
							src={Logo3}
							className='w-[16%] h-[20%] ml-10'
							loading='eager'
							priority={true}
							alt='logo'
						/>
					</div>
					{/* <Image
						src={Hero}
						className='w-[90%] h-[80%]'
						loading='eager'
						priority={true}
						alt='logo'
					/> */}
				</div>
			</div>
			<div className='lg:w-2/4 md:w-2/4 w-full bg-white h-screen flex items-center justify-center'>
				<CardLogin />
			</div>
		</main>
	);
}
