import Head from "next/head";
import { Absensi } from "@/src/containers";

export default function Home() {
	return (
		<main className='w-full flex items-center h-screen'>
			<Head>
				<title>DWITAMA E-WIS | Absensi</title>
			</Head>
			<Absensi />
			{/* <div className='w-screen h-screen items-center justify-center flex space-x-2 bg-blue-200 p-6'>
			</div> */}
		</main>
	);
}
