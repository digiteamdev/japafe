import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Section } from "../../../components";
import { GetQuotationById } from "../../../services";
import { formatRupiah } from "../../../utils";
import { ArrowLeft, BookOpen, FileText } from "react-feather";
import { useRouter } from "next/router";
import moment from "moment";

export const ViewQuotation = () => {
	const router = useRouter();
	const params = useParams<{ id: string }>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [quotation, setQuotation] = useState<any>("");

	useEffect(() => {
		if (params) {
			getQuotation(params.id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params]);

	const getQuotation = async (id: string) => {
		try {
			const response = await GetQuotationById(id);
			if (response.data) {
				console.log(response.data.result)
				setQuotation(response.data.result);
			}
		} catch (error: any) {
			setQuotation("");
		}
		setIsLoading(false);
	};

	const listScopeWork = (data: string) => {
		const listScopeWork: any = data.split("\r\n");
		let list1: any = [];
		let list2: any = [];
		if (listScopeWork.length > 10) {
			let no: number = (listScopeWork.length - 1) / 2;
			listScopeWork.map((res: any, i: number) => {
				if (i < no) {
					list1.push(res);
				} else {
					list2.push(res);
				}
			});
			return (
				<Section className='grid grid-cols-2 gap-2 mt-2'>
					<div className='w-full'>
						{list1.map((res: any, i: number) => {
							return (
								<p className='whitespace-pre' key={i}>
									{res}
								</p>
							);
						})}
					</div>
					<div className='w-full'>
						{list2.map((res: any, i: number) => {
							return (
								<p className='whitespace-pre' key={i}>
									{res}
								</p>
							);
						})}
					</div>
				</Section>
			);
		} else {
			return (
				<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
					<div className='w-full'>
						<p className='whitespace-pre'>{data}</p>
					</div>
				</Section>
			);
		}
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
			) : quotation !== "" && quotation.deleted === null ? (
				<>
					<div className='grid lg:grid-cols-2 md:grid-cols-2 s:grid-cols-1 gap-2'>
						<div className='flex items-center w-full'>
							<div className='bg-red-200 p-[12px] flex justify-center items-center rounded-[23px]'>
								<BookOpen size={24} />
							</div>
							<div className='ml-[13px]'>
								<h1 className='text-3xl font-semibold'>Quotation</h1>
							</div>
						</div>
						<div className='flex justify-end py-2'>
							<button
								type='button'
								className='inline-flex justify-center rounded-full border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
								disabled={isLoading}
								onClick={() => {
									router.push("/marketing/quotation");
								}}
							>
								<FileText size={20} className='mr-1' /> Export to PDF
							</button>
						</div>
					</div>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead></thead>
								<tbody>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Quotation Number
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{quotation.quo_num}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Quotation Date
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{moment(quotation.createdAt).format("DD-MMMM-YYYY")}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Customer Name
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{quotation.Customer.name}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Customer Phone
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{`(+62${quotation.CustomerContact.phone})`}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Customer Email
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{quotation.CustomerContact.email_person}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Subject
										</td>
										<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
											{quotation.subject}
										</td>
									</tr>
									<tr>
										<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
											Quotation File
										</td>
										<td className='sm:w-[50%] md:w-[75%] px-2 py-2 border border-gray-200'>
											{quotation.quo_img === null ? (
												"no files"
											) : (
												<a
													href={quotation.quo_img}
													target='_blank'
													className='justify-center rounded-full border border-transparent bg-green-500 px-4 py-1 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer'
												>
													show file
												</a>
											)}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl mt-2'>Scope Of work</h1>
					{listScopeWork(quotation.Quotations_Detail)}
					<h1 className='font-bold text-xl mt-2'>Price And Term Of Payment</h1>
					<Section className='grid grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<thead>
									<tr>
										<th className=' pl-2 border border-black text-center font-semibold'>
											Description
										</th>
										<th className=' pl-2 border border-black text-center font-semibold'>
											Quantity
										</th>
										<th className=' pl-2 border border-black text-center font-semibold'>
											Unit
										</th>
										<th className=' pl-2 border border-black text-center font-semibold'>
											Unit Price
										</th>
										<th className=' pl-2 border border-black text-center font-semibold'>
											Total Price
										</th>
									</tr>
								</thead>
								<tbody>
									{quotation.price_quotation.map((res: any, i: number) => {
										return (
											<tr key={i}>
												<td className='pl-2 border border-black text-center whitespace-pre'>
													{res.description}
												</td>
												<td className='pl-2 border border-black text-center'>
													{res.qty}
												</td>
												<td className='pl-2 border border-black text-center'>
													{res.unit}
												</td>
												<td className='pl-2 border border-black text-center'>
													{formatRupiah(res.unit_price.toString())}
												</td>
												<td className='pl-2 border border-black text-center'>
													{formatRupiah(res.total_price.toString())}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</Section>
					{quotation.job_operational === "SWASTA" ? (
						<Section className='grid grid-cols-1 mt-2'>
							<p>
								Note : <span className='whitespace-pre'>{quotation.note}</span>
							</p>
						</Section>
					) : (
						<Section className='grid grid-cols-1 mt-2'>
							<p>
								Note Payment :{" "}
								<span className='whitespace-pre'>{quotation.note_payment}</span>
							</p>
							<p>
								Term Payment :{" "}
								<span className='whitespace-pre'>{quotation.term_payment}</span>
							</p>
						</Section>
					)}
					<div className='mt-4'>
						<button
							type='button'
							className='inline-flex justify-center rounded-full border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
							disabled={isLoading}
							onClick={() => {
								router.push("/marketing/quotation");
							}}
						>
							<ArrowLeft size={20} className='mr-1' /> Back
						</button>
					</div>
				</>
			) : (
				<div className='w-full text-center'>
					<p className='my-auto'>Quotation Not Found</p>
				</div>
			)}
		</div>
	);
};
