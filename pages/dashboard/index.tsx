import { useEffect } from "react";
import {useRouter} from "next/router";
import { getToken } from "../../src/configs/session";
import { Dashboard } from "../../src/containers/";
import Layout from "../../src/components/layout/Layout";
import Head from "next/head";

export default function DashboardPage() {
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
				<title>Dashboard</title>
			</Head>
			<main className='w-full h-full bg-white'>
				<Dashboard />
			</main>
		</Layout>
	);
}
