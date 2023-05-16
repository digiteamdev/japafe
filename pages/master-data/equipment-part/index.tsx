import { useEffect } from "react";
import {useRouter} from "next/router";
import { getToken } from "../../../src/configs/session";
import { Equipment } from "../../../src/containers/";
import Layout from "../../../src/components/layout/Layout";
import Head from 'next/head';

export default function EquipmentPage() {

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
				<title>Equipment & Part</title>
			</Head>
			<main className='w-full h-full bg-white'>
				<Equipment />
			</main>
		</Layout>
	);
}
