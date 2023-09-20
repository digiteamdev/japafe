import { useEffect } from "react";
import {useRouter} from "next/router";
import { getToken } from "../../../src/configs/session";
import { Account } from "../../../src/containers";
import Layout from "../../../src/components/layout/Layout";
import Head from 'next/head';

export default function ChangePasswordPage() {
	
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
				<title>DWITAMA E-WIS | Account</title>
			</Head>
			<main className='w-full h-full bg-white'>
				<Account />
			</main>
		</Layout>
	);
}
