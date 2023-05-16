import { useEffect } from "react";
import {useRouter} from "next/router";
import { getToken } from "../../../src/configs/session";
import { Quotation } from "../../../src/containers/";
import Layout from "../../../src/components/layout/Layout";
import Head from 'next/head';

export default function QuotationPage() {

	const router = useRouter()
	const token = getToken();
	
	useEffect( () => {
		if (token === undefined) {
			router.push('/')
		}
	}, [])

	return (
		<Layout>
			<Head>
				<title>Quotation</title>
			</Head>
			<main className='w-full h-full bg-white'>
				<Quotation />
			</main>
		</Layout>
	);
}
