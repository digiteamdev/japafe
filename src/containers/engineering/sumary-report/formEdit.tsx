import { useEffect, useState } from "react";
import { Section, Input, InputSelect, InputDate } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { poSchema } from "../../../schema/marketing/po/PoSchema";
import {
	GetAllQuotationEdit,
	EditPo,
	EditPoDetail,
	DeletePoDetail,
    EditPoPayment,
} from "../../../services";
import { toast } from "react-toastify";

interface props {
	content: string;
	dataPo: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface dataPo {
	id: string;
	id_po: string;
	po_num_auto: string;
	quo_id: string;
	tax: string;
	noted: string;
	date_of_po: any;
}

interface dataDetail {
	Deskription_CusPo: [
		{
			id: string;
			cuspoId: string;
			description: string;
			qty: string;
			unit: string;
			price: string;
			discount: string;
			total: string;
		}
	];
}

interface dataTerm {
	term_of_pay: [
		{
            id: string;
            cuspoId: string;
			limitpay: string;
			percent: string;
			price: string;
			date_limit: any;
		}
	];
}

export const FormEditSummaryReport = ({ content, dataPo, showModal }: props) => {
	const dataTabs = ["Customer PO", "Details PO", "Term Of Payment"];
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [activeTabs, setActiveTabs] = useState<any>(dataTabs[0]);
	const [listQuotation, setListQuotation] = useState<any>([]);
	const [tax, setTax] = useState<number>(0);
	const [taxPPN, setTaxPPN] = useState<number>(0);
	const [taxPPH, setTaxPPH] = useState<number>(0);
	const [total, setTotal] = useState<number>(0);
	const [vat, setVat] = useState<number>(0);
	const [grandTotal, setGrandTotal] = useState<number>(0);
	const [customer, setCustomer] = useState<string>("");
	const [subject, setSubject] = useState<string>("");
	const [equipment, setEquipment] = useState<string>("");
	const [countPart, setCountPart] = useState<string>("");
	const [quoId, setQuoId] = useState<string>("");
	const [data, setData] = useState<dataPo>({
		id: "",
		id_po: "",
		po_num_auto: "",
		quo_id: "",
		tax: "",
		noted: "",
		date_of_po: new Date(),
	});
	const [dataDetail, setDataDetail] = useState<dataDetail>({
		Deskription_CusPo: [
			{
				id: "",
				cuspoId: "",
				description: "",
				qty: "",
				unit: "",
				price: "",
				discount: "",
				total: "",
			},
		],
	});
    const [dataTerm, setDataTerm] = useState<dataTerm>({
		term_of_pay: [
            {
                id: "",
				cuspoId: "",
                limitpay: "",
                percent: "",
                price: "",
                date_limit: ""
            }
        ]
	});

	useEffect(() => {
		settingData();
		getQuatation();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		console.log(dataPo)
		let dataDetail: any = [];
        let dataTerm: any = [];
		setData({
			id: dataPo.id,
			id_po: dataPo.id_po,
			po_num_auto: dataPo.po_num_auto,
			quo_id: dataPo.quo_id,
			tax: dataPo.tax,
			noted: dataPo.noted,
			date_of_po: new Date(dataPo.date_of_po),
		});

		if (dataPo.Deskription_CusPo.length > 0) {
			dataPo.Deskription_CusPo.map((res: any) => {
				dataDetail.push({
					id: res.id,
					cuspoId: res.cuspoId,
					description: res.description,
					qty: res.qty,
					unit: res.unit,
					price: res.price,
					discount: res.discount,
					total: res.total,
				});
			});
		} else {
			dataDetail.push({
				id: "",
				cuspoId: "",
				description: "",
				qty: "",
				unit: "",
				price: "",
				discount: "",
				total: "",
			});
		}

		if (dataPo.tax === "ppn") {
			setTax(dataPo.quotations.Customer.ppn);
		} else if (dataPo.tax === "pph") {
			setTax(dataPo.quotations.Customer.pph);
		} else if (dataPo.tax === "ppn_and_pph") {
			setTax(dataPo.quotations.Customer.ppn + dataPo.quotations.Customer.pph);
		} else {
			setTax(0);
		}

        if (dataPo.term_of_pay.length > 0){
            dataPo.term_of_pay.map( (res: any) => {
                dataTerm.push({
                    id: res.id,
                    cuspoId: res.cuspoId,
                    limitpay: res.limitpay,
                    percent: res.percent,
                    price: res.price,
                    date_limit: new Date(res.date_limit)
                })
            })
        }else{
            dataTerm.puhs({
                id: "",
                cuspoId: dataPo.id,
                limitpay: "",
                percent: "",
                price: "",
                date_limit: new Date()
            })
        }

		setDataDetail({
			Deskription_CusPo: dataDetail,
		});
        setDataTerm({
            term_of_pay: dataTerm
        })
		setEquipment(dataPo.quotations.eqandpart[0].equipment.nama);
		setSubject(dataPo.quotations.deskription);
		setCustomer(dataPo.quotations.Customer.name);
		setCountPart(dataPo.quotations.eqandpart.length);
		setQuoId(dataPo.quotations.id);
		setTaxPPH(dataPo.quotations.Customer.pph);
		setTaxPPN(dataPo.quotations.Customer.ppn);
		setTotal(dataPo.total);
		setGrandTotal(dataPo.grand_tot);
		setVat(dataPo.vat);
	};

	const totalPrice = (data: any) => {
		let totals: number = 0;
		data.map((res: any, i: number) => {
			const htmlTotal = document.getElementById(
				`Deskription_CusPo.${i}.total`
			) as HTMLInputElement;
			if (htmlTotal !== null) {
				const totalPrice: any = htmlTotal.value === "" ? 0 : htmlTotal.value;
				totals = totals + parseInt(totalPrice);
			}
		});
		if(totals === 0){
			return total.toString();
		}else{
			return totals.toString();
		}
		// return formatRupiah(total.toString())
	};

	const vatPrice = () => {
		const htmlTotal = document.getElementById("total") as HTMLInputElement;
		if (htmlTotal !== null) {
			const jumlahTax = (parseInt(htmlTotal.value) * tax) / 100;
			return jumlahTax.toString();
			// return formatRupiah(jumlahTax.toString())
		}
	};

	const grandTotalPrice = () => {
		const htmlTotal = document.getElementById("total") as HTMLInputElement;
		const htmlVat = document.getElementById("vat") as HTMLInputElement;
		if (htmlTotal !== null && htmlVat !== null) {
			const Total: number = parseInt(htmlTotal.value) + parseInt(htmlVat.value);
			if(isNaN(Total)){
				return grandTotal.toString();
			}else{
				return Total.toString();
			}
			// return formatRupiah(Total.toString())
		}
	};

	const getQuatation = async () => {
		try {
			const response = await GetAllQuotationEdit(dataPo.quo_id);
			if (response.data) {
				setListQuotation(response.data.result);
			}
		} catch (error) {
			setListQuotation([]);
		}
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name === "quotation") {
			if (event.target.value !== "Choose Quotation") {
				let data = JSON.parse(event.target.value);
				setCustomer(data.Customer.name);
				setSubject(data.deskription);
				setEquipment(data.eqandpart[0].equipment.nama);
				setCountPart(data.eqandpart.length);
				setQuoId(data.id);
			} else {
				setCustomer("");
				setSubject("");
				setEquipment("");
				setCountPart("");
				setQuoId("");
			}
		} else if (event.target.name.includes("qty")) {
			const nameSplit = event.target.name.split("."),
				index = nameSplit[1],
				quantity = event.target.value,
				htmlPrice = document.getElementById(
					`Deskription_CusPo.${index}.price`
				) as HTMLInputElement,
				htmlDiscount = document.getElementById(
					`Deskription_CusPo.${index}.discount`
				) as HTMLInputElement,
				htmlTotal = document.getElementById(
					`Deskription_CusPo.${index}.total`
				) as HTMLInputElement,
				price: any = htmlPrice.value === "" ? 0 : htmlPrice.value,
				discount: any = htmlDiscount.value === "" ? 0 : htmlDiscount.value,
				total: any = quantity * price - discount;
			htmlTotal.value = total;
		} else if (event.target.name.includes("price")) {
			const nameSplit = event.target.name.split("."),
				index = nameSplit[1],
				price = event.target.value,
				htmlQuantity = document.getElementById(
					`Deskription_CusPo.${index}.qty`
				) as HTMLInputElement,
				htmlDiscount = document.getElementById(
					`Deskription_CusPo.${index}.discount`
				) as HTMLInputElement,
				htmlTotal = document.getElementById(
					`Deskription_CusPo.${index}.total`
				) as HTMLInputElement,
				quantity: any = htmlQuantity.value === "" ? 0 : htmlQuantity.value,
				discount: any = htmlDiscount.value === "" ? 0 : htmlDiscount.value,
				total: any = quantity * price - discount;
			htmlTotal.value = total;
		} else if (event.target.name.includes("discount")) {
			const nameSplit = event.target.name.split("."),
				index = nameSplit[1],
				discount = event.target.value,
				htmlQuantity = document.getElementById(
					`Deskription_CusPo.${index}.qty`
				) as HTMLInputElement,
				htmlPrice = document.getElementById(
					`Deskription_CusPo.${index}.price`
				) as HTMLInputElement,
				htmlTotal = document.getElementById(
					`Deskription_CusPo.${index}.total`
				) as HTMLInputElement,
				quantity: any = htmlQuantity.value === "" ? 0 : htmlQuantity.value,
				price: any = htmlPrice.value === "" ? 0 : htmlPrice.value,
				total: any = quantity * price - discount;
			htmlTotal.value = total;
		} else if (event.target.name.includes("percent")) {
			const nameSplit = event.target.name.split("."),
				index = nameSplit[1],
				percent = event.target.value,
				htmlTotal = document.getElementById("Grand_total") as HTMLInputElement,
				htmlTotalTerm = document.getElementById(
					`term_of_pay.${index}.price`
				) as HTMLInputElement,
				total: any = htmlTotal.value === "" ? 0 : htmlTotal.value,
				totalTerm: any = (parseInt(total) * percent) / 100;
			htmlTotalTerm.value = totalTerm.toString();
		} else if (event.target.name === "tax") {
			if (event.target.value === "ppn") {
				setTax(taxPPN);
			} else if (event.target.value === "pph") {
				setTax(taxPPH);
			} else if (event.target.value === "ppn_and_pph") {
				setTax(taxPPN + taxPPH);
			} else {
				setTax(0);
			}
		}
	};

	const editPo = async (payload: any) => {
		setIsLoading(true);
		const dataBody = {
			id_po: payload.id_po,
			po_num_auto: payload.po_num_auto,
			quo_id: quoId,
			tax: payload.tax,
			noted: payload.noted,
			date_of_po: payload.date_of_po,
		};

		try {
			const response = await EditPo(dataBody, dataPo.id);
			if (response.data) {
				toast.success("Edit Customer PO Success", {
					position: "top-center",
					autoClose: 1000,
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
			toast.error("Edit Customer PO Failed", {
				position: "top-center",
				autoClose: 1000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		}
		setIsLoading(false);
	};

	const editPoDetail = async (payload: any) => {
		setIsLoading(true);
		const desc: any = [];
		payload.Deskription_CusPo.map((res: any, i: number) => {
			const htmlTotal = document.getElementById(
				`Deskription_CusPo.${i}.total`
			) as HTMLInputElement;
			desc.push({
				id: res.id,
				cuspoId: res.cuspoId,
				description: res.description,
				qty: res.qty,
				unit: res.unit,
				price: res.price.toString(),
				discount: res.discount.toString(),
				total: htmlTotal.value,
			});
		});

		try {
			const response = await EditPoDetail(desc);
			if (response.data) {
				toast.success("Edit Customer PO Success", {
					position: "top-center",
					autoClose: 1000,
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
			toast.error("Edit Customer PO Failed", {
				position: "top-center",
				autoClose: 1000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		}
		setIsLoading(false);
	};

    const editPoTerm = async (payload: any) => {
		setIsLoading(true);
		const term: any = [];
		payload.term_of_pay.map((res: any, i: number) => {
			const htmlTotal = document.getElementById(
				`term_of_pay.${i}.price`
			) as HTMLInputElement;
			term.push({
                id: res.id,
				cuspoId: res.cuspoId,
				limitpay: res.limitpay,
				percent: res.percent,
				price: htmlTotal.value,
				date_limit: res.date_limit,
			});
		});

		try {
			const response = await EditPoPayment(term);
			if (response.data) {
				toast.success("Edit Customer PO Success", {
					position: "top-center",
					autoClose: 1000,
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
			toast.error("Edit Customer PO Failed", {
				position: "top-center",
				autoClose: 1000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		}
		setIsLoading(false);
	};

	const deletePoDetail = async (id: string) => {
		try {
			const response = await DeletePoDetail(id);
			if (response.data) {
				toast.success("Delete Detail PO Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				showModal(true, content, true);
			}
		} catch (error) {
			toast.error("Delete Detail Po Failed", {
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
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<div className='flex items-center gap-4'>
				{dataTabs.map((res: any, i: number) => (
					<button
						key={i}
						className={`text-base font-semibold ${
							res === activeTabs
								? "text-[#66B6FF] border-b-4 border-[#66B6FF]"
								: "text-[#9A9A9A]"
						}`}
						onClick={() => setActiveTabs(res)}
					>
						{res}
					</button>
				))}
			</div>
			{activeTabs === "Customer PO" ? (
				<div>
					<Formik
						initialValues={data}
						validationSchema={poSchema}
						onSubmit={(values) => {
							editPo(values);
						}}
						enableReinitialize
						key={0}
					>
						{({
							handleChange,
							handleSubmit,
							setFieldValue,
							errors,
							touched,
							values,
						}) => (
							<Form onChange={handleOnChanges}>
								<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<table className='w-full'>
											<tr>
												<td>
													<Input
														id='quo_num'
														name='quo_num'
														placeholder='Po Number'
														label='PO Number'
														type='text'
														value={values.id_po}
														onChange={handleChange}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</td>
												<td>
													<Input
														id='quo_auto'
														name='quo_auto'
														type='text'
														value={values.po_num_auto}
														required={true}
														withLabel={false}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600 mt-6'
													/>
												</td>
											</tr>
										</table>
									</div>
								</Section>
								<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<InputSelect
											id='quotation'
											name='quotation'
											placeholder='Quotation'
											label='Quotation'
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										>
											<option defaultValue='' selected>
												Choose Quotation
											</option>
											{listQuotation.length === 0 ? (
												<option value=''>No Data Quotation</option>
											) : (
												listQuotation.map((res: any, i: number) => {
													return (
														<option
															value={JSON.stringify(res)}
															key={i}
															selected={res.id === values.quo_id ? true : false}
														>
															{res.quo_auto} - {res.Customer.name}
														</option>
													);
												})
											)}
										</InputSelect>
										{errors.quo_id && touched.quo_id ? (
											<span className='text-red-500 text-xs'>
												{errors.quo_id}
											</span>
										) : null}
									</div>
									<div className='w-full'>
										<Input
											id='customer'
											name='customer'
											placeholder='Customer'
											label='Customer Name'
											type='text'
											value={customer}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
								</Section>
								<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<InputSelect
											id='tax'
											name='tax'
											placeholder='tax'
											label='Tax'
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										>
											<option defaultValue='' selected>
												Choose tax
											</option>
											<option
												value=''
												selected={
													values.tax === "" || values.tax === null
														? true
														: false
												}
											>
												None
											</option>
											<option
												value='ppn'
												selected={values.tax === "ppn" ? true : false}
											>
												PPN
											</option>
											<option
												value='pph'
												selected={values.tax === "pph" ? true : false}
											>
												PPH
											</option>
											<option
												value='ppn_and_pph'
												selected={values.tax === "ppn_and_pph" ? true : false}
											>
												PPN And PPH
											</option>
										</InputSelect>
										{errors.tax && touched.tax ? (
											<span className='text-red-500 text-xs'>{errors.tax}</span>
										) : null}
									</div>
									<div className='w-full'>
										<Input
											id='noted'
											name='noted'
											placeholder='Noted'
											label='Noted'
											type='text'
											value={values.noted}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
								</Section>
								<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<Input
											id='subject'
											name='subject'
											placeholder='Subject'
											label='Subject'
											type='text'
											value={subject}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='flex w-full'>
										<table className='w-full'>
											<tr>
												<td className='w-[70%]'>
													<Input
														id='equipment'
														name='equipment'
														placeholder='Equipment'
														label='Equipment'
														type='text'
														value={equipment}
														disabled={true}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block p-2.5 outline-primary-600 w-full mr-1'
													/>
												</td>
												<td className='w-[30%]'>
													<Input
														id='part'
														name='part'
														placeholder='part'
														type='text'
														value={countPart}
														disabled={true}
														required={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block p-2.5 outline-primary-600 w-full mt-6'
													/>
												</td>
											</tr>
										</table>
									</div>
								</Section>
								<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<InputDate
											id='date'
											label='Date'
											value={
												values.date_of_po === null
													? new Date()
													: new Date(values.date_of_po)
											}
											onChange={(value: any) =>
												setFieldValue("date_of_po", value)
											}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
											classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
										/>
									</div>
								</Section>
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
											) : content === "add" ? (
												"Save"
											) : (
												"Edit Customer Po"
											)}
										</button>
									</div>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			) : activeTabs === "Details PO" ? (
				<div>
					<Formik
						initialValues={dataDetail}
						onSubmit={(values) => {
							editPoDetail(values);
						}}
						enableReinitialize
						key={1}
					>
						{({ handleChange, handleSubmit, errors, touched, values }) => (
							<Form onChange={handleOnChanges}>
								<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<FieldArray
										name='Deskription_CusPo'
										render={(arrayDeskription) => (
											<>
												{values.Deskription_CusPo.map((res, i) => (
													<Section
														className={`grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2`}
														key={i}
													>
														<div className='w-full'>
															<table className='w-full'>
																<tr>
																	<td className='w-[20%]'>
																		<Input
																			id={`Deskription_CusPo.${i}.description`}
																			name={`Deskription_CusPo.${i}.description`}
																			placeholder='Description'
																			label='Description'
																			onChange={handleChange}
																			value={res.description}
																			required={true}
																			withLabel={i > 0 ? false : true}
																			className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																		/>
																	</td>
																	<td className='w-[10%]'>
																		<Input
																			id={`Deskription_CusPo.${i}.qty`}
																			name={`Deskription_CusPo.${i}.qty`}
																			placeholder='Quantity'
																			label='Quantity'
																			type='number'
																			onChange={handleChange}
																			value={res.qty}
																			required={true}
																			withLabel={i > 0 ? false : true}
																			className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																		/>
																	</td>
																	<td className='w-[10%]'>
																		<Input
																			id={`Deskription_CusPo.${i}.unit`}
																			name={`Deskription_CusPo.${i}.unit`}
																			placeholder='Unit'
																			label='Unit'
																			type='text'
																			value={res.unit}
																			onChange={handleChange}
																			required={true}
																			withLabel={i > 0 ? false : true}
																			className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																		/>
																	</td>
																	<td className='w-[10%]'>
																		<Input
																			id={`Deskription_CusPo.${i}.price`}
																			name={`Deskription_CusPo.${i}.price`}
																			placeholder='Price'
																			label='Price'
																			type='number'
																			value={res.price}
																			onChange={handleChange}
																			required={true}
																			withLabel={i > 0 ? false : true}
																			className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																		/>
																	</td>
																	<td className='w-[10%]'>
																		<Input
																			id={`Deskription_CusPo.${i}.discount`}
																			name={`Deskription_CusPo.${i}.discount`}
																			placeholder='Discount'
																			label='Discount'
																			type='number'
																			onChange={handleChange}
																			value={res.discount}
																			required={true}
																			withLabel={i > 0 ? false : true}
																			className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																		/>
																	</td>
																	<td className='w-[25%]'>
																		<Input
																			id={`Deskription_CusPo.${i}.total`}
																			name={`Deskription_CusPo.${i}.total`}
																			placeholder={res.total}
																			label='total'
																			type='total'
																			disabled={true}
																			// value={res.total !== "" ? res.total : }
																			onChange={handleChange}
																			required={true}
																			withLabel={i > 0 ? false : true}
																			className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																		/>
																	</td>
																	<td className='w-[15%]'>
																		<div className='flex w-full'>
																			{i ===
																			values.Deskription_CusPo.length - 1 ? (
																				<div className='h-[80%]'>
																					<button
																						type='button'
																						className={`inline-flex justify-center rounded-lg border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mr-2 ${
																							i > 0 ? "" : "mt-6"
																						}`}
																						onClick={() => {
																							arrayDeskription.push({
																								id: "",
																								cuspoId: dataPo.id,
																								description: "",
																								qty: "",
																								unit: "",
																								price: "",
																								discount: "",
																								total: "",
																							});
																						}}
																					>
																						Add
																					</button>
																				</div>
																			) : null}
																			{values.Deskription_CusPo.length !== 1 ? (
																				<div className='h-[80%]'>
																					<button
																						type='button'
																						className={`inline-flex justify-center rounded-lg border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 ${
																							i > 0 ? "" : "mt-6"
																						}`}
																						onClick={() => {
																							res.id !== ""
																								? deletePoDetail(res.id)
																								: null;
																							arrayDeskription.remove(i);
																						}}
																					>
																						Remove
																					</button>
																				</div>
																			) : null}
																		</div>
																	</td>
																</tr>
															</table>
														</div>
													</Section>
												))}
												<div className='w-full'>
													<table className='w-full'>
														<tr>
															<td className='w-[50%]'></td>
															<td className='w-[10%]'>Total</td>
															<td className='w-[25%]'>
																<Input
																	id='total'
																	name='total'
																	placeholder='Total'
																	label='total'
																	type='text'
																	value={totalPrice(values.Deskription_CusPo)}
																	required={true}
																	disabled={true}
																	withLabel={false}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</td>
															<td className='w-[15%]'></td>
														</tr>
														<tr>
															<td className='w-[50%]'></td>
															<td className='w-[10%]'>Vat</td>
															<td className='w-[25%]'>
																<Input
																	id='vat'
																	name='vat'
																	placeholder='Vat'
																	label='Vat'
																	type='text'
																	value={vatPrice()}
																	required={true}
																	disabled={true}
																	withLabel={false}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</td>
															<td className='w-[15%]'></td>
														</tr>
														<tr>
															<td className='w-[50%]'></td>
															<td className='w-[10%]'>Grand Total</td>
															<td className='w-[25%]'>
																<Input
																	id='Grand_total'
																	name='Grand_total'
																	placeholder='Grand Total'
																	label='Grand Total'
																	type='text'
																	value={grandTotalPrice()}
																	required={true}
																	disabled={true}
																	withLabel={false}
																	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																/>
															</td>
															<td className='w-[15%]'></td>
														</tr>
													</table>
												</div>
											</>
										)}
									/>
								</Section>
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
											) : content === "add" ? (
												"Save"
											) : (
												"Edit Detail Customer Po"
											)}
										</button>
									</div>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			) : (
				<div>
					<Formik
						initialValues={dataTerm}
						// validationSchema={poSchema}
						onSubmit={(values) => {
							editPoTerm(values);
						}}
						enableReinitialize
                        key={2}
					>
						{({
							handleChange,
							handleSubmit,
							setFieldValue,
							errors,
							touched,
							values,
						}) => (
							<Form onChange={handleOnChanges}>
								<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<FieldArray
										name='term_of_pay'
										render={(arrayTerm) => (
											<>
												{values.term_of_pay.map((res, i) => (
													<Section
														className={`grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 ${
															i === 0 ? "mt-[-10px]" : "mt-[-40px]"
														}`}
														key={i}
													>
														<div className='w-full'>
															<table className='w-full'>
																<tr>
																	<td className='w-[20%]'>
																		<InputSelect
																			id={`term_of_pay.${i}.limitpay`}
																			name={`term_of_pay.${i}.limitpay`}
																			placeholder='Limit Pay'
																			label='Limit Pay'
																			onChange={handleChange}
                                                                            value={res.limitpay}
																			required={true}
																			withLabel={false}
																			className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																		>
																			<option defaultValue='' selected>
																				Choose Limit Pay
																			</option>
																			<option value='Normal'>Normal</option>
																			<option value='Down_Payment'>
																				Down Payment
																			</option>
																			<option value='Termin_I'>Termin I</option>
																			<option value='Termin_II'>
																				Termin II
																			</option>
																			<option value='Termin_III'>
																				Termin III
																			</option>
																			<option value='Termin_IV'>
																				Termin IV
																			</option>
																			<option value='Termin_V'>Termin V</option>
																			<option value='Repayment'>
																				Repayment
																			</option>
																		</InputSelect>
																	</td>
																	<td className='w-[10%]'>
																		<Input
																			id={`term_of_pay.${i}.percent`}
																			name={`term_of_pay.${i}.percent`}
																			placeholder='%'
																			type='number'
																			onChange={handleChange}
                                                                            value={res.percent}
																			required={true}
																			withLabel={false}
																			className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																		/>
																	</td>
																	<td className='w-[30%]'>
																		<Input
																			id={`term_of_pay.${i}.price`}
																			name={`term_of_pay.${i}.price`}
																			placeholder='10000'
																			label='Noted'
																			type='text'
                                                                            value={res.price}
																			disabled={true}
																			required={true}
																			withLabel={false}
																			className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
																		/>
																	</td>
																	<td className='w-[20%]'>
																		<InputDate
																			id={`term_of_pay.${i}.date_limit`}
																			label='date_limit'
																			value={res.date_limit}
																			onChange={(value: any) =>
																				setFieldValue(`term_of_pay.${i}.date_limit`, value)
																			}
																			withLabel={false}
																			className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600 mt-6'
																			classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 mt-6 z-20'
																		/>
																	</td>
																	<td className='w-[20%]'>
																		<div className='flex w-full'>
																			{i === values.term_of_pay.length - 1 ? (
																				<div className='h-[80%]'>
																					<button
																						type='button'
																						className='inline-flex justify-center rounded-lg border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mr-2'
																						onClick={() => {
																							arrayTerm.push({
																								limitpay: "",
																								percent: "",
																								price: "",
																								date_limit: "",
																							});
																						}}
																					>
																						Add
																					</button>
																				</div>
																			) : null}
																			{values.term_of_pay.length !== 1 ? (
																				<div className='h-[80%]'>
																					<button
																						type='button'
																						className='inline-flex justify-center rounded-lg border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
																						onClick={() => {
																							arrayTerm.remove(i);
																						}}
																					>
																						Remove
																					</button>
																				</div>
																			) : null}
																		</div>
																	</td>
																</tr>
															</table>
														</div>
													</Section>
												))}
											</>
										)}
									/>
								</Section>
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
											) : content === "add" ? (
												"Save"
											) : (
												"Edit Term Of Payment PO"
											)}
										</button>
									</div>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			)}
		</div>
	);
};
