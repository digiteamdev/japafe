import { useEffect } from "react";
import {useRouter} from "next/router";
import { getToken } from "../../../src/configs/session";
import { Mr } from "../../../src/containers";
import Layout from "../../../src/components/layout/Layout";
import Head from 'next/head';

export default function MaterialNameInfoPage() {
	
	const router = useRouter()
	const token = getToken();
	
	useEffect( () => {
		if (token === undefined) {
			router.push('/')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Layout>
			<Head>
				<title>JAPA MIS | Material Request</title>
			</Head>
			<main className='w-full h-full bg-white'>
				<Mr />
			</main>
		</Layout>
	);
}