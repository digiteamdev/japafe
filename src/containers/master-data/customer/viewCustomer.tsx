import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Section } from "../../../components";
import { GetCustomerById } from "../../../services";
import { User, ArrowLeft } from "react-feather";
import { useRouter } from "next/router";

interface props {
	customer: any;
}

export const ViewCustomer = () => {
	const router = useRouter();
	const params = useParams<{ id: string }>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [customer, setCustomer] = useState<any>("");

	useEffect(() => {
		if (params) {
			getCustomer(params.id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params]);

	const getCustomer = async (id: string) => {
		try {
			const response = await GetCustomerById(id);
			if (response.data) {
				setCustomer(response.data.result);
			}
		} catch (error: any) {
			setCustomer("");
		}
		setIsLoading(false);
	};

	return (
		<div className='mt-14 lg:mt-20 md:mt-20 sm:mt-20 xs:mt-24'>
			{isLoading ? (
				<div className='w-full text-center content-center'>
					<svg
						role='status'
						className='inline mr-3 w-10 h-10 text-black-500 animate-spin'
						viewBox='0 0 100 101'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
							fill='#E5E7EB'
						/>
						<path
							d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
							fill='currentColor'
						/>
					</svg>
				</div>
			) : (
				<>
					{customer !== "" && customer.deleted === null ? (
						<>
							<div className='grid lg:grid-cols-2 md:grid-cols-2 s:grid-cols-1 gap-2'>
								<div className='flex items-center w-full'>
									<div className='bg-red-200 p-[12px] flex justify-center items-center rounded-[23px]'>
										<User size={24} />
									</div>
									<div className='ml-[13px]'>
										<h1 className='text-3xl font-semibold'>{customer.name}</h1>
									</div>
								</div>
							</div>
							<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<table className='w-full'>
										<thead></thead>
										<tbody>
											<tr>
												<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
													Name
												</td>
												<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
													{customer.name}
												</td>
											</tr>
											<tr>
												<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
													Email
												</td>
												<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
													{customer.email}
												</td>
											</tr>
											<tr>
												<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
													Phone
												</td>
												<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
													+62{customer.phone}
												</td>
											</tr>
											<tr>
												<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
													Fax
												</td>
												<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
													{customer.fax}
												</td>
											</tr>
											<tr>
												<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
													PPN
												</td>
												<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
													{customer.ppn}%
												</td>
											</tr>
											<tr>
												<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
													PPH
												</td>
												<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
													{customer.pph}%
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</Section>
							<h1 className='font-bold text-xl mt-2'>Address</h1>
							<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<table className='w-full'>
										<thead>
											<th className='border border-black text-sm p-1'>
												Address Workshop
											</th>
											<th className='border border-black text-sm p-1'>
												Address Recipient
											</th>
											<th className='border border-black text-sm p-1'>
												Address
											</th>
										</thead>
										<tbody>
											{customer.address.map((res: any, i: number) => (
												<tr key={i}>
													<td className='border border-black text-sm p-1'>
														{res.address_workshop}
													</td>
													<td className='border border-black text-sm p-1'>
														{res.recipient_address}
													</td>
													<td className='border border-black text-sm p-1'>
														{res.provinces}, {res.cities}, {res.districts},{" "}
														{res.sub_districts}, {res.ec_postalcode}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</Section>
							<h1 className='font-bold text-xl mt-2'>Contact Person</h1>
							<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<table className='w-full'>
										<thead>
											<th className='border border-black text-sm p-1'>
												Contact Person
											</th>
											<th className='border border-black text-sm p-1'>Phone</th>
											<th className='border border-black text-sm p-1'>Email</th>
										</thead>
										<tbody>
											{customer.contact.map((res: any, i: number) => (
												<tr key={i}>
													<td className='border border-black text-sm p-1'>
														{res.contact_person}
													</td>
													<td className='border border-black text-sm p-1'>
														+62{res.phone}
													</td>
													<td className='border border-black text-sm p-1'>
														{res.email_person}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</Section>
							<div className='mt-4'>
								<button
									type='button'
									className='inline-flex justify-center rounded-full border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
									disabled={isLoading}
									onClick={() => {
										router.push("/marketing/customer");
									}}
								>
									<ArrowLeft size={20} className='mr-1' /> Back
								</button>
							</div>
						</>
					) : (
						<div className='w-full text-center'>
							<p className='my-auto'>Customer Not Found</p>
						</div>
					)}
				</>
			)}
		</div>
	);
};
