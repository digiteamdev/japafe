import { useEffect, useState } from "react";
import {useRouter} from "next/router";
import { removeToken } from "../../configs/session";
import { DataOverview } from "./data";
import { GetCustomer, GetEmploye, GetSupplier } from "../../services";

export const Dashboard = () => {

	const router = useRouter();
	const [totalCustomer, setTotalCustomer] = useState<number>(0);
	const [totalEmploye, setTotalEmploye] = useState<number>(0);
	const [totalSupplier, setTotalSupplier] = useState<number>(0);

	useEffect( () => {
		getCustomer();
		getEmploye();
		getSupplier();
	}, [])

	const getCustomer = async () => {
		try {
			const response = await GetCustomer(1,10);
			if (response.data) {
				setTotalCustomer(response.data.totalData);
			}
		} catch (error:any) {
			if(error.response.data.login){
				setTotalCustomer(0);
			}else{
				removeToken();
				router.push('/');
			}
		}
	};

	const getEmploye = async () => {
		try {
			const response = await GetEmploye(1,10);
			if (response.data) {
				setTotalEmploye(response.data.totalData);
			}
		} catch (error: any) {
			if(error.response.data.login){
				setTotalEmploye(0);
			}else{
				removeToken();
				router.push('/');
			}
		}
	};

	const getSupplier = async () => {
		try {
			const response = await GetSupplier(1,10);
			if (response.data) {
				setTotalSupplier(response.data.totalData);
			}
		} catch (error: any) {
			if(error.response.data.login){
				setTotalSupplier(0);
			}else{
				removeToken();
				router.push('/');
			}
		}
	};

	return (
		<div className='mt-14 lg:mt-20 md:mt-20 sm:mt-20'>
			<div className='flex items-center mt-5 gap-5 lg:flex-row flex-col'>
				{DataOverview.map((value, i) => {
					return (
						<div
							className='flex border rounded-xl shadow-md py-4 px-5 w-full justify-between'
							key={i}
						>
							<div>
								<h4 className='text-base font-semibold text-gray-500'>
									{value.name}
								</h4>
								<h2 className='mt-3 text-3xl font-semibold text-gray-600'>
									{ value.id === 'customer' ? totalCustomer : value.id === 'employe' ? totalEmploye : totalSupplier }
								</h2>
								{/* <h4 className='mt-3 text-base font-semibold text-gray-400'>
									<span className='text-green-400'>{value.percentage}</span>{" "}
									Customer from last month
								</h4> */}
							</div>
							<div
								className='bg-red-500 p-2 flex justify-center items-center'
								style={{ width: "62px", height: "60px", borderRadius: 23 }}
							>
								{value.icon}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
