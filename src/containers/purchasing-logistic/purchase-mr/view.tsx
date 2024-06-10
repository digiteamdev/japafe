import { useEffect, useState } from "react";
import {
	Input,
	InputSelect,
	InputSelectSearch,
	Section,
} from "../../../components";
import moment from "moment";
import { FieldArray, Form, Formik } from "formik";
import { AddPrMr, GetAllSupplier } from "../../../services";
import { formatRupiah } from "../../../utils";
import { toast } from "react-toastify";

interface props {
	dataSelected: any;
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	dateOfPurchase: any;
	idPurchase: string;
	taxPsrDmr: string;
	currency: string;
	detailMr: any;
}

export const ViewPurchaseMR = ({ dataSelected, content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isModal, setIsModal] = useState<boolean>(false);
	const [listSupplier, setListSupplier] = useState<any>([]);
	const [data, setData] = useState<data>({
		dateOfPurchase: new Date(),
		idPurchase: "",
		taxPsrDmr: "ppn",
		currency: "IDR",
		detailMr: [],
	});

	useEffect(() => {
		let detail: any = [];
		dataSelected.detailMr.map((res: any) => {
			detail.push(res);
		});
		setData({
			dateOfPurchase: new Date(),
			idPurchase: generateIdNum(),
			taxPsrDmr: "non_tax",
			currency: "IDR",
			detailMr: detail,
		});
		getSupplier();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getSupplier = async () => {
		let listSup: any = [];
		try {
			const response = await GetAllSupplier();
			if (response) {
				response.data.result.map((res: any) => {
					listSup.push({
						label: res.supplier_name,
						value: res,
					});
				});
			}
		} catch (error) {}
		setListSupplier(listSup);
	};

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		var year = dateObj.getUTCFullYear();
		const id =
			"PR" +
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 10000);
		return id;
	};

	const purchaseMr = async (payload: data) => {
		setIsLoading(true);
		let listDetail: any = [];
		let isWarning: boolean = false;
		payload.detailMr.map((res: any) => {
			if(res.supId === null){
				toast.warning("Supplier has not been filled in yet", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				isWarning = true;
			}else if(res.price === 0){
				toast.warning("Price cannot be 0", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				isWarning = true;
			}else{
				listDetail.push({
					id: res.id,
					name_material: res.name_material,
					supId: res.supId,
					taxpr: res.taxpr,
					currency: res.currency,
					qtyAppr: parseInt(res.qtyAppr),
					price: parseInt(res.price),
					disc: parseInt(res.disc),
					total: parseInt(res.total),
				});
				isWarning = false
			}
		});
		let data = {
			dateOfPurchase: payload.dateOfPurchase,
			idPurchase: payload.idPurchase,
			taxPsrDmr: payload.taxPsrDmr,
			currency: payload.currency,
			detailMr: listDetail,
		};
		if(!isWarning){
			try {
				const response = await AddPrMr(data);
				if (response.data) {
					toast.success("Purchase Material Request Success", {
						position: "top-center",
						autoClose: 5000,
						hideProgressBar: true,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: "colored",
					});
					showModal(false, content, true);
				}
			} catch (error) {
				toast.error("Purchase Material Request Failed", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
			}
		}
		setIsLoading(false);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			{dataSelected ? (
				<>
					<h1 className='font-bold text-xl'>Material Request</h1>
					<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
						<div className='w-full'>
							<table className='w-full'>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Job No
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.job_no}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										No MR
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.no_mr}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Date MR
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{moment(dataSelected.date_mr).format("DD-MMMM-YYYY")}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Request By
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.user.employee.employee_name}
									</td>
								</tr>
								<tr>
									<td className='sm:w-[50%] md:w-[25%] bg-gray-300 pl-2 border border-gray-200'>
										Departement
									</td>
									<td className='sm:w-[50%] md:w-[75%] pl-2 border border-gray-200'>
										{dataSelected.user.employee.sub_depart.name}
									</td>
								</tr>
							</table>
						</div>
					</Section>
					<h1 className='font-bold text-xl py-2'>Detail Material Request</h1>
					<Formik
						initialValues={{ ...data }}
						// validationSchema={departemenSchema}
						onSubmit={(values) => {
							purchaseMr(values);
						}}
						enableReinitialize
					>
						{({
							handleChange,
							handleSubmit,
							setFieldValue,
							errors,
							touched,
							values,
						}) => (
							<Form>
								<FieldArray
									name='detailMr'
									render={(arrayMr) => (
										<table className='w-full text-xs'>
											<thead>
												<tr>
													<th className='text-center'>Material</th>
													<th className='text-center'>Qty</th>
													<th className='text-center'>Supplier</th>
													<th className='text-center'>Price</th>
													<th className='text-center'>Discount</th>
													<th className='text-center'>Total Price</th>
												</tr>
											</thead>
											<tbody>
												{values.detailMr.map((result: any, i: number) => {
													return (
														<tr key={i}>
															<td className='pr-1 w-[30%]'>
																<Input
																	id={`detailMr.${i}.name_material`}
																	name={`detailMr.${i}.name_material`}
																	placeholder='Material Name'
																	label='Material Name'
																	type='text'
																	value={result.name_material}
																	onChange={(e: any) => {
																		setFieldValue(`detailMr.${i}.name_material`, e.target.value)
																	}}
																	disabled={false}
																	required={true}
																	withLabel={false}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-xs rounded-lg block w-full p-2 outline-primary-600'
																/>
															</td>
															<td className='pr-1 w-[5%]'>
																<Input
																	id={`detailMr.${i}.qtyAppr`}
																	name={`detailMr.${i}.qtyAppr`}
																	placeholder='Stock'
																	label='Stock'
																	type='text'
																	pattern='\d*'
																	onChange={(e: any) => {
																		let qty: number = e.target.value
																			.toString()
																			.replaceAll(".", "");
																		setFieldValue(`detailMr.${i}.qtyAppr`, qty);
																		setFieldValue(
																			`detailMr.${i}.total`,
																			(result.price * qty) - result.disc
																		);
																	}}
																	disabled={false}
																	value={result.qtyAppr}
																	required={true}
																	withLabel={false}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-xs rounded-lg w-full block p-2 outline-primary-600 text-center'
																/>
															</td>
															<td className='pr-1 w-[20%]'>
																<InputSelectSearch
																	datas={listSupplier}
																	id={`detailMr.${i}.price`}
																	name={`detailMr.${i}.price`}
																	placeholder='Supplier'
																	label='Supplier'
																	value={result.supplier}
																	onChange={(e: any) => {
																		setFieldValue(
																			`detailMr.${i}.supId`,
																			e.value.id
																		);
																	}}
																	required={true}
																	withLabel={false}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
																/>
															</td>
															<td className='pr-1 w-[15%]'>
																<Input
																	id={`detailMr.${i}.price`}
																	name={`detailMr.${i}.price`}
																	placeholder='Price'
																	label='Price'
																	type='text'
																	pattern='\d*'
																	onChange={(e: any) => {
																		let price: number = e.target.value
																			.toString()
																			.replaceAll(".", "");
																		setFieldValue(`detailMr.${i}.price`, price);
																		setFieldValue(
																			`detailMr.${i}.total`,
																			(price * result.qtyAppr) - result.disc
																		);
																	}}
																	disabled={false}
																	value={formatRupiah(result.price.toString())}
																	required={true}
																	withLabel={false}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-xs rounded-lg w-full block p-2 outline-primary-600 text-center'
																/>
															</td>
															<td className='pr-1 w-[15%]'>
																<Input
																	id={`detailMr.${i}.disc`}
																	name={`detailMr.${i}.disc`}
																	placeholder='Discount'
																	label='Discount'
																	type='text'
																	pattern='\d*'
																	onChange={(e: any) => {
																		let disc: number = e.target.value
																			.toString()
																			.replaceAll(".", "");
																		setFieldValue(`detailMr.${i}.disc`, disc);
																		setFieldValue(
																			`detailMr.${i}.total`,
																			(result.price * result.qtyAppr) - disc
																		);
																	}}
																	disabled={false}
																	value={formatRupiah(result.disc.toString())}
																	required={true}
																	withLabel={false}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-xs rounded-lg w-full block p-2 outline-primary-600 text-center'
																/>
															</td>
															<td className='w-[15%]'>
																<Input
																	id={`detailMr.${i}.qtyAppr`}
																	name={`detailMr.${i}.qtyAppr`}
																	placeholder='Total Price'
																	type='text'
																	pattern='\d*'
																	disabled={true}
																	value={formatRupiah(result.total.toString())}
																	required={true}
																	withLabel={false}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-xs rounded-lg w-full block p-2 outline-primary-600 text-center'
																/>
															</td>
														</tr>
													);
												})}
											</tbody>
										</table>
									)}
								/>
								{values.detailMr.length > 0 ? (
									<div className='mt-8 flex justify-end'>
										<div className='flex gap-2 items-center'>
											<button
												type='button'
												className='inline-flex justify-center rounded-full border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
												disabled={isLoading}
												onClick={() => {
													handleSubmit();
												}}
											>
												{isLoading ? (
													<>
														<svg
															role='status'
															className='inline mr-3 w-4 h-4 text-white animate-spin'
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
														Loading
													</>
												) : (
													"Approval"
												)}
											</button>
										</div>
									</div>
								) : null}
							</Form>
						)}
					</Formik>
				</>
			) : null}
		</div>
	);
};
