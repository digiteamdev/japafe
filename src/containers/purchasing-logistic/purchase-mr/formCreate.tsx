import { useState, useEffect } from "react";
import { Section, Input, InputSelect } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { GetAllSupplier, GetAllPurchaseMR, GetAllCoa } from "../../../services";
import { toast } from "react-toastify";
import moment from "moment";
import { getIdUser } from "../../../configs/session";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	id: string;
	idSrAppr: string;
	dateOfAppr: any;
	approveById: string;
	detailSr: [
		{
			id: string;
			srappr: string;
			part: string;
			service: string;
			qty: string;
			note: string;
			supId: string;
			qtyAppr: number;
		}
	];
}

export const FormCreatePurchaseMr = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listSupplier, setListSupplier] = useState<any>([]);
	const [listMr, setListMr] = useState<any>([]);
	const [listCoa, setListCoa] = useState<any>([]);
	const [dataMR, setDataMR] = useState<any>([
		{ name: "MP0001" },
		{ name: "MP0002" }
	]);
	const [activeTabs, setActiveTabs] = useState<any>("MP0001");
	const [isDetail, setIsDetail] = useState<boolean>(true);
	const [user, setUser] = useState<string>("");
	const [userId, setUserId] = useState<string>("");
	const [idPR, setIdPR] = useState<string>("");
	const [data, setData] = useState<data>({
		id: "",
		idSrAppr: "",
		dateOfAppr: new Date(),
		approveById: "",
		detailSr: [
			{
				id: "",
				srappr: "",
				part: "",
				service: "",
				qty: "",
				note: "",
				supId: "",
				qtyAppr: 0,
			},
		],
	});

	useEffect(() => {
		let idUser = getIdUser();
		if (idUser !== undefined) {
			setUserId(idUser);
		}
		setIdPR(generateIdNum());
		getSupplier();
		getSr();
		getCoa();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getSr = async () => {
		try {
			const response = await GetSrValid();
			if (response) {
				setListMr(response.data.result);
			}
		} catch (error) {
			setListMr([]);
		}
	};

	const getCoa = async () => {
		try {
			const response = await GetAllCoa();
			if (response) {
				setListCoa(response.data.result);
			}
		} catch (error) {
			setListCoa([]);
		}
	};

	const getSupplier = async () => {
		try {
			const response = await GetAllSupplier();
			if (response) {
				setListSupplier(response.data.result);
			}
		} catch (error) {}
	};

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		var year = dateObj.getUTCFullYear();
		const id =
			"PR" +
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 1000);
		return id;
	};

	const handleOnChanges = (event: any) => {
		// if (event.target.name === "no_sr") {
		// 	if (event.target.value !== "no data") {
		// 		let data = JSON.parse(event.target.value);
		// 		let detail: any = [];
		// 		data.SrDetail.map((res: any) => {
		// 			detail.push({
		// 				id: res.id,
		// 				srappr: "",
		// 				part: res.part,
		// 				service: res.workCenter.name,
		// 				qty: res.qty,
		// 				note: res.note,
		// 				supId: "",
		// 				qtyAppr: 0,
		// 			});
		// 		});
		// 		setData({
		// 			id: data.id,
		// 			idSrAppr: generateIdNum(),
		// 			dateOfAppr: new Date(),
		// 			approveById: userId,
		// 			detailSr: detail,
		// 		});
		// 		setUser(data.user.employee.employee_name);
		// 		setJobNo(
		// 			data.wor.job_operational ? data.wor.job_no_mr : data.wor.job_no
		// 		);
		// 		setIsDetail(true);
		// 	} else {
		// 		setUser("");
		// 		setJobNo("");
		// 		setIsDetail(false);
		// 	}
		// }
	};

	// const approveSr = async (payload: data) => {
	// 	setIsLoading(true);
	// 	let listDetail: any = [];
	// 	payload.detailSr.map((res: any) => {
	// 		listDetail.push({
	// 			id: res.id,
	// 			srappr: res.srappr,
	// 			supId: res.supId,
	// 			qtyAppr: parseInt(res.qtyAppr),
	// 		});
	// 	});
	// 	let data = {
	// 		id: payload.id,
	// 		idSrAppr: payload.idSrAppr,
	// 		dateOfAppr: payload.dateOfAppr,
	// 		approveById: payload.approveById,
	// 		srDetail: listDetail,
	// 	};
	// 	try {
	// 		const response = await ApprovalSr(data);
	// 		if (response.data) {
	// 			toast.success("Approval Service Request Success", {
	// 				position: "top-center",
	// 				autoClose: 5000,
	// 				hideProgressBar: true,
	// 				closeOnClick: true,
	// 				pauseOnHover: true,
	// 				draggable: true,
	// 				progress: undefined,
	// 				theme: "colored",
	// 			});
	// 			showModal(false, content, true);
	// 		}
	// 	} catch (error) {
	// 		toast.error("Approval Service Request Failed", {
	// 			position: "top-center",
	// 			autoClose: 5000,
	// 			hideProgressBar: true,
	// 			closeOnClick: true,
	// 			pauseOnHover: true,
	// 			draggable: true,
	// 			progress: undefined,
	// 			theme: "colored",
	// 		});
	// 	}
	// 	setIsLoading(false);
	// };

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto'>
			<Formik
				initialValues={{ ...data }}
				// validationSchema={departemenSchema}
				onSubmit={(values) => {
					console.log(values);
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
						<Section className='grid md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
							<div className='w-full'>
								<Input
									id='idPurchase'
									name='idPurchase'
									placeholder='ID Purchase'
									label='ID Purchase'
									type='text'
									value={idPR}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
							<div className='w-full'>
								<Input
									id='datePR'
									name='datePR'
									placeholder='Date Of Purchase'
									label='Date Of Purchase'
									type='text'
									value={moment(new Date()).format("DD-MMMM-YYYY")}
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
									id='no_mr'
									name='no_mr'
									placeholder='No MR'
									label='No MR'
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option value='no data' selected>
										Choose No MR
									</option>
									{listMr.length === 0 ? (
										<option value='no data'>No Data</option>
									) : (
										listMr.map((res: any, i: number) => {
											return (
												<option value={JSON.stringify(res)} key={i}>
													{res.no_sr}
												</option>
											);
										})
									)}
								</InputSelect>
							</div>
							<div>
								<button
									type='button'
									className='inline-flex justify-center rounded-lg border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 md:mt-8 sm:mt-1'
									disabled={isLoading}
									onClick={() => {
										handleSubmit();
									}}
								>
									Add
								</button>
							</div>
						</Section>
						{dataMR.map((res: any, i: number) => (
							<button
								key={i}
								className={`text-base font-semibold my-2 mr-4 ${
									res.name === activeTabs
										? "text-[#66B6FF] border-b-4 border-[#66B6FF]"
										: "text-[#9A9A9A]"
								}`}
								onClick={() => setActiveTabs(res.name)}
							>
								{res.name}
							</button>
						))}
					</Form>
				)}
			</Formik>
		</div>
	);
};
