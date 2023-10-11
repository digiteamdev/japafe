import { useEffect, useState } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputArea,
	InputDate,
} from "../../../components";
import { Formik, Form } from "formik";
import { GetAllPo, GetAllEmployeDepart, EditWor } from "../../../services";
// import { worSchema } from "../../../schema/marketing/work-order-release/worSchema";
import { toast } from "react-toastify";

interface props {
	content: string;
	dataWor: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	job_no: string;
	date_wor: any;
	cuspoId: string;
	subject: string;
	job_desk: string;
	contract_no_spk: string;
	employeeId: string;
	value_contract: string;
	priority_status: string;
	qty: string;
	unit: string;
	date_of_order: any;
	delivery_date: any;
	shipping_address: string;
	estimated_man_our: string;
	eq_model: string;
	eq_mfg: string;
	eq_rotation: string;
	eq_power: string;
	scope_of_work: string;
	file_list: any;
	noted: string;
	status: string;
	refivision: any;
	refevision_desc: any;
}

export const FormEditWor = ({ content, dataWor, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listPo, setListPo] = useState<any>([]);
	const [listEmploye, setListEmploye] = useState<any>([]);
	const [customerId, setCustomerId] = useState<string>("");
	const [customer, setCustomer] = useState<string>("");
	const [customerContact, setCustomerContact] = useState<string>("");
	const [customerAddress, setCustomerAddress] = useState<string>("");
	const [equipment, setEquipment] = useState<string>("");
	const [file, setFile] = useState<string>("");
	const [data, setData] = useState<data>({
		job_no: "",
		date_wor: new Date(),
		cuspoId: "",
		subject: "",
		job_desk: "",
		contract_no_spk: "",
		employeeId: "",
		value_contract: "",
		priority_status: "",
		qty: "",
		unit: "",
		date_of_order: new Date(),
		delivery_date: new Date(),
		shipping_address: "",
		estimated_man_our: "",
		eq_model: "",
		eq_mfg: "",
		eq_rotation: "",
		eq_power: "",
		scope_of_work: "",
		file_list: "",
		noted: "",
		status: "",
		refivision: "",
		refevision_desc: "",
	});

	useEffect(() => {
		settingData();
		getPo();
		getEmploye();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		setData({
			job_no: dataWor.job_no,
			date_wor: dataWor.date_wor,
			cuspoId: dataWor.cuspoId,
			subject: dataWor.subject,
			job_desk: dataWor.job_desk,
			contract_no_spk: dataWor.contract_no_spk,
			employeeId: dataWor.employeeId,
			value_contract: dataWor.value_contract,
			priority_status: dataWor.priority_status,
			qty: dataWor.qty,
			unit: dataWor.unit,
			date_of_order: dataWor.date_of_order,
			delivery_date: dataWor.delivery_date,
			shipping_address: dataWor.shipping_address,
			estimated_man_our: dataWor.estimated_man_our,
			eq_model: dataWor.eq_model,
			eq_mfg: dataWor.eq_mfg,
			eq_rotation: dataWor.eq_rotation,
			eq_power: dataWor.eq_power,
			scope_of_work: dataWor.scope_of_work,
			file_list: dataWor.file_list,
			noted: dataWor.noted,
			status: dataWor.status,
			refivision: dataWor.refivision,
			refevision_desc: dataWor.refevision_desc,
		});
		setCustomer(dataWor.customerPo.quotations.Customer.name);
		setCustomerAddress(
			dataWor.customerPo.quotations.Customer.address[0].address_workshop
		);
		setCustomerContact(
			`+62${dataWor.customerPo.quotations.CustomerContact.phone}`
		);
		setEquipment(dataWor.customerPo.quotations.eqandpart[0].equipment.nama);
		setCustomerId(dataWor.cuspoId);
	};

	const showUpload = (id: any) => {
		const inputan = document.getElementById(id);
		inputan?.click();
	};

	const getPo = async () => {
		try {
			const response = await GetAllPo();
			if (response.data) {
				setListPo(response.data.result);
			}
		} catch (error) {
			setListPo([]);
		}
	};

	const getEmploye = async () => {
		try {
			const response = await GetAllEmployeDepart('SALES %26 MKT','Sales Marketing');
			if (response.data) {
				setListEmploye(response.data.result);
			}
		} catch (error) {
			setListEmploye([]);
		}
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name === "cuspoId") {
			if (event.target.value !== "Choose Customer PO") {
				const data = JSON.parse(event.target.value);
				setCustomerId(data.id);
				setCustomer(data.quotations.Customer.name);
				setCustomerContact(`+62${data.quotations.CustomerContact.phone}`);
				setCustomerAddress(
					data.quotations.Customer.address[0].address_workshop
				);
				setEquipment(data.quotations.eqandpart[0].equipment.nama);
			} else {
				setCustomerId("");
				setCustomer("");
				setCustomerContact("");
				setCustomerAddress("");
				setEquipment("");
			}
		} else if (event.target.name === "file_list") {
			setFile(event.target.files[0]);
		}
	};

	const editWor = async (payload: any) => {
		setIsLoading(true);
		const dataBody = new FormData();
		dataBody.append("refivision", payload.refivision);
		dataBody.append("refevision_desc", payload.refevision_desc);
		dataBody.append("job_no", payload.job_no);
		dataBody.append("date_wor", payload.date_wor);
		dataBody.append("cuspoId", customerId);
		dataBody.append("subject", payload.subject);
		dataBody.append("job_desk", payload.job_desk);
		dataBody.append("contract_no_spk", payload.contract_no_spk);
		dataBody.append("employeeId", payload.employeeId);
		dataBody.append("value_contract", payload.value_contract);
		dataBody.append("priority_status", payload.priority_status);
		dataBody.append("qty", payload.qty);
		dataBody.append("unit", payload.unit);
		dataBody.append("date_of_order", payload.date_of_order);
		dataBody.append("delivery_date", payload.delivery_date);
		dataBody.append("shipping_address", payload.shipping_address);
		dataBody.append("estimated_man_our", payload.estimated_man_our);
		dataBody.append("eq_model", payload.eq_model);
		dataBody.append("eq_mfg", payload.eq_mfg);
		dataBody.append("eq_rotation", payload.eq_rotation);
		dataBody.append("eq_power", payload.eq_power);
		dataBody.append("scope_of_work", payload.scope_of_work);
		dataBody.append("noted", payload.noted);
		if (file === "") {
			dataBody.append("file_list", payload.file_list);
		} else {
			dataBody.append("file_list", file);
		}
		try {
			const response = await EditWor(dataBody, dataWor.id);
			if (response) {
				toast.success("Edit Work Order Release Success", {
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
			toast.error("Edit Work Order Release Failed", {
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

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<Formik
				initialValues={data}
				// validationSchema={worSchema}
				onSubmit={(values) => {
					editWor(values);
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
					<Form onChange={handleOnChanges}>
						{
							values.job_no !== "" || values.job_no !== null ? (
								<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
									<div className='w-full'>
										<Input
											id='job_no'
											name='job_no'
											placeholder='Job No'
											label='Job No'
											type='text'
											value={values.job_no}
											disabled={true}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<Input
											id='refivision'
											name='refivision'
											placeholder='Rev'
											label='Rev'
											type='text'
											value={values.refivision}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
									<div className='w-full'>
										<Input
											id='refevision_desc'
											name='refevision_desc'
											placeholder='Rev Description'
											label='Rev Description'
											type='text'
											value={values.refevision_desc}
											onChange={handleChange}
											required={true}
											withLabel={true}
											className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
										/>
									</div>
								</Section>
							) : null
						}
						<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputDate
									id='date'
									label='Date'
									value={
										values.date_wor === null ? new Date() : values.date_wor
									}
									onChange={(value: any) => setFieldValue("date_wor", value)}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								<InputSelect
									id='cuspoId'
									name='cuspoId'
									placeholder='Customer PO'
									label='Customer PO'
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option defaultValue='' selected>
										Choose Customer PO
									</option>
									{listPo.length === 0 ? (
										<option value=''>No Data Customer PO</option>
									) : (
										listPo.map((res: any, i: number) => {
											return (
												<option
													value={JSON.stringify(res)}
													key={i}
													selected={res.id === values.cuspoId ? true : false}
												>
													{res.po_num_auto} - {res.quotations.Customer.name}
												</option>
											);
										})
									)}
								</InputSelect>
							</div>
							<div className='w-full'>
								<Input
									id='customer'
									name='customer'
									placeholder='Customer'
									label='Customer'
									type='text'
									value={customer}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2'>
							<div className='w-full'>
								<Input
									id='address'
									name='address'
									placeholder='Address'
									label='Address'
									type='text'
									value={customerAddress}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='contact'
									name='contact'
									placeholder='Contact Customer'
									label='Contact Customer'
									type='text'
									value={customerContact}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='subject'
									name='subject'
									placeholder='Subject'
									label='Subject'
									type='text'
									value={values.subject}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputArea
									id='job_desk'
									name='job_desk'
									placeholder='Job Descripstion'
									label='Job Descripstion'
									type='text'
									value={values.job_desk}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='contract_no_spk'
									name='contract_no_spk'
									placeholder='Contract No (SPK)'
									label='Contract No (SPK)'
									type='text'
									value={values.contract_no_spk}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputSelect
									id='employeeId'
									name='employeeId'
									placeholder='Sales'
									label='Sales'
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option defaultValue='' selected>
										Choose Sales
									</option>
									{listEmploye.length === 0 ? (
										<option value=''>No Data Sales</option>
									) : (
										listEmploye.map((res: any, i: number) => {
											return (
												<option
													value={res.id}
													key={i}
													selected={res.id === values.employeeId}
												>
													{res.employee_name}
												</option>
											);
										})
									)}
								</InputSelect>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='value_contract'
									name='value_contract'
									placeholder='Value Kontrak'
									label='Value Kontrak'
									type='number'
									value={values.value_contract}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputSelect
									id='priority_status'
									name='priority_status'
									placeholder='Priotity Status'
									label='Priotity Status'
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option defaultValue='' selected>
										Choose Priority Status
									</option>
									<option
										value='ST'
										selected={values.priority_status === "ST" ? true : false}
									>
										ST
									</option>
									<option
										value='XT'
										selected={values.priority_status === "XT" ? true : false}
									>
										XT
									</option>
									<option
										value='XXT'
										selected={values.priority_status === "XXT" ? true : false}
									>
										XXT
									</option>
									<option
										value='XTASREQ'
										selected={
											values.priority_status === "XTASREQ" ? true : false
										}
									>
										XT As Req
									</option>
									<option
										value='XXTASREQ'
										selected={
											values.priority_status === "XXTASREQ" ? true : false
										}
									>
										XXT As Req
									</option>
								</InputSelect>
							</div>
							<div className='w-full'>
								<Input
									id='qty'
									name='qty'
									placeholder='Quantity'
									label='Quantity'
									type='number'
									value={values.qty}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='unit'
									name='unit'
									placeholder='Unit'
									label='Unit'
									type='text'
									value={values.unit}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<InputDate
									id='date_of_order'
									label='Date Of Order'
									value={
										values.date_of_order === null
											? new Date()
											: values.date_of_order
									}
									onChange={(value: any) =>
										setFieldValue("date_of_order", value)
									}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								<InputDate
									id='delivery_date'
									label='Delivery Date'
									value={
										values.delivery_date === null
											? new Date()
											: values.delivery_date
									}
									onChange={(value: any) =>
										setFieldValue("delivery_date", value)
									}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputArea
									id='shipping_address'
									name='shipping_address'
									placeholder='Shipping Address'
									label='Shipping Address'
									type='text'
									value={values.shipping_address}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='estimated_man_our'
									name='estimated_man_our'
									placeholder='Estimate Man Hour'
									label='Estimate Man Hour'
									type='number'
									value={values.estimated_man_our}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='subject'
									name='subject'
									placeholder='Equipment'
									label='Equipment'
									type='text'
									value={equipment}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='eq_mfg'
									name='eq_mfg'
									placeholder='mfg'
									label='Equipment Info'
									type='text'
									value={values.eq_mfg}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='eq_rotation'
									name='eq_rotation'
									placeholder='rotasi'
									type='text'
									value={values.eq_rotation}
									onChange={handleChange}
									required={true}
									withLabel={false}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600 mt-7'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='eq_model'
									name='eq_model'
									placeholder='model'
									type='text'
									value={values.eq_model}
									onChange={handleChange}
									required={true}
									withLabel={false}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600 mt-7'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='eq_power'
									name='eq_power'
									placeholder='power'
									type='text'
									value={values.eq_power}
									onChange={handleChange}
									required={true}
									withLabel={false}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600 mt-7'
								/>
							</div>
						</Section>
						<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<InputArea
									id='scope_of_work'
									name='scope_of_work'
									placeholder='Scope of Work'
									label='Scope of Work'
									type='text'
									value={values.scope_of_work}
									onChange={handleChange}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
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
							<div className='w-full'>
								{values.file_list !== null &&
								values.file_list.includes("https://res.cloudinary.com/") ? (
									<div>
										<label className='block mb-2 text-sm font-medium text-gray-900'>
											File
										</label>
										<div className='flex'>
											<a
												href={values.file_list}
												target='_blank'
												className='justify-center rounded-full border border-transparent bg-green-500 px-4 py-1 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mt-2 mr-2'
											>
												Show File
											</a>
											<p
												className='justify-center rounded-full border border-transparent bg-orange-500 px-4 py-1 text-sm font-medium text-white hover:bg-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mt-2 cursor-pointer'
												onClick={() => showUpload("file_list")}
											>
												Change File
											</p>
											<input
												id='file_list'
												name='file_list'
												placeholder='file_list'
												type='file'
												className='hidden'
												onChange={() => setFieldValue("file_list", `upload`)}
											/>
										</div>
									</div>
								) : (
									<Input
										id='file_list'
										name='file_list'
										placeholder='File List'
										label='File List'
										type='file'
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								)}
							</div>
						</Section>
						{dataWor.job_no === "" || dataWor.status === 'unvalid' ? (
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
											"Edit Work Order Release"
										)}
									</button>
								</div>
							</div>
						) : null}
					</Form>
				)}
			</Formik>
		</div>
	);
};
