import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputSelectSearch,
	InputDate,
	InputArea,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { sumarySchema } from "../../../schema/engineering/sumary-report/SumarySchema";
import { workerCenterSchema } from "../../../schema/master-data/worker-center/workerCenterSchema";
import {
	GetAllSummary,
	GetAllDepartement,
	GetAllWorkerCenter,
	GetAllEmployeDepart,
	AddDispatch,
	GetSummaryDispatch,
	AddWorkerCenter,
} from "../../../services";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "react-feather";
import moment from "moment";

interface props {
	content: string;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	summaryId: string;
	id_dispatch: string;
	dispacth_date: any;
	remark: string;
	job_no: string;
	subject: string;
	startDate: any;
	finishDate: any;
	equipment: string;
	model: string;
	qty: number;
	dispatchDetail: any;
}

interface dataWorkerCenter {
	name: string;
}

export const FormCreateDispatch = ({ content, showModal }: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isShowDetail, setIsShowDetail] = useState<boolean>(false);
	const [isFormCreateWorkerCenter, setIsFormCreateWorkerCenter] =
		useState<boolean>(false);
	const [listSchedule, setListSchedule] = useState<any>([]);
	const [listDepart, setListDepart] = useState<any>([]);
	const [listWorkerCenter, setListWorkerCenter] = useState<any>([]);
	const [listActivity, setListActivity] = useState<any>([]);
	const [listEmploye, setListEmploye] = useState<any>([]);
	const [jobNo, setJobNo] = useState<string>("");
	const [dateWor, setDateWor] = useState<string>("");
	const [dateFinish, setDateFinish] = useState<string>("");
	const [subject, setSubject] = useState<string>("");
	const [equipment, setEquipment] = useState<string>("");
	const [part, setPart] = useState<any>([]);
	const [partName, setPartName] = useState<string>("");
	const [status, setStatus] = useState<string>("");
	const [detail, setDetail] = useState<any>([]);
	const [data, setData] = useState<data>({
		summaryId: "",
		id_dispatch: "",
		dispacth_date: new Date(),
		remark: "",
		job_no: "",
		subject: "",
		startDate: new Date(),
		finishDate: new Date(),
		equipment: "",
		model: "",
		qty: 0,
		dispatchDetail: [],
	});
	const [dataWorkerCenter, setDataWorkerCenter] = useState<dataWorkerCenter>({
		name: "",
	});

	useEffect(() => {
		getSchedule();
		getDepart();
		getWorkerCenter();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const generateIdNum = () => {
		var dateObj = new Date();
		var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		var year = dateObj.getUTCFullYear();
		const id =
			"D" +
			year.toString() +
			month.toString() +
			Math.floor(Math.random() * 10000) +
			1;
		return id;
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name === "summaryId") {
			if (event.target.value !== "no data") {
				let data = JSON.parse(event.target.value);
				let equipment: any = [];
				let part: any = [];
				let lastEquipment: string = "";
				data.timeschedule.wor.customerPo.quotations.eqandpart.map(
					(res: any) => {
						if (lastEquipment !== res.equipment.nama) {
							equipment.push(res.equipment.nama);
						}
						lastEquipment = res.equipment.nama;
					}
				);
				data.srimgdetail.map((res: any) => {
					part.push(res);
				});
				setJobNo(data.timeschedule.wor.job_no);
				setSubject(data.timeschedule.wor.subject);
				setDateWor(data.timeschedule.wor.date_wor);
				setDateFinish(data.timeschedule.wor.delivery_date);
				setEquipment(equipment.toString());
				setPart(part);
				setListActivity(data.timeschedule.aktivitas);
			} else {
				setJobNo("");
				setSubject("");
				setDateWor("");
				setEquipment("");
				setPart([]);
			}
		} else if (event.target.name === "part") {
			if (event.target.value !== "no data") {
				let data = JSON.parse(event.target.value);
				let dataDetail = detail;
				setStatus(data.choice.replace(/_|-|\./g, " "));
				setPartName(data.name_part);
				if (dataDetail.length > 0) {
					let arrDetail = dataDetail.filter((detail: any) => {
						return detail.part === data.name_part;
					});
					let arrDetailOther = dataDetail.filter((detail: any) => {
						return detail.part !== data.name_part;
					});
					if (arrDetail.length > 0) {
						arrDetail.map((res: any, i: number) => {
							arrDetailOther.push({
								index: res.index,
								workId: res.workId,
								aktivitasID: res.aktivitasID,
								subdepId: res.subdepId,
								start: res.start,
								startActivity: res.startActivity,
								operatorID: res.operatorID,
								part: res.part,
							});
						});
						dataDetail = arrDetailOther;
					} else {
						dataDetail.push({
							index: 0,
							workId: "",
							aktivitasID: "",
							subdepId: "",
							start: new Date(),
							startActivity: new Date(),
							operatorID: "",
							part: data.name_part,
						});
					}
				} else {
					dataDetail.push({
						index: 0,
						workId: "",
						aktivitasID: "",
						subdepId: "",
						start: new Date(),
						startActivity: new Date(),
						operatorID: "",
						part: data.name_part,
					});
				}
				setDetail(dataDetail);
				setIsShowDetail(true);
			} else {
				setStatus("");
				setPartName("");
				setIsShowDetail(false);
			}
		} else if (event.target.name === "departemen") {
			if (event.target.value !== "no data") {
				let data = JSON.parse(event.target.value);
				let idx = event.target.id.split("_");
				getEmploye(data.name.replace(/&|-|\./g, "%26"), data.departement.name);
				let dataDetail = detail;
				if (dataDetail.length > 0) {
					let arrDetail = dataDetail.filter((detail: any) => {
						return detail.part === partName;
					});
					let arrDetailOther = dataDetail.filter((detail: any) => {
						return detail.part !== partName;
					});
					if (arrDetail.length > 0) {
						arrDetail.map((res: any, i: number) => {
							if (parseInt(idx[1]) === res.index) {
								arrDetailOther.push({
									index: res.index,
									workId: res.workId,
									aktivitasID: res.aktivitasID,
									subdepId: data.id,
									start: res.start,
									startActivity: res.startActivity,
									operatorID: res.operatorID,
									part: res.part,
								});
							} else {
								arrDetailOther.push({
									index: res.index,
									workId: res.workId,
									aktivitasID: res.aktivitasID,
									subdepId: res.subdepId,
									start: res.start,
									startActivity: res.startActivity,
									operatorID: res.operatorID,
									part: res.part,
								});
							}
						});
						dataDetail = arrDetailOther;
					} else {
						dataDetail.push({
							index: arrDetail.length,
							workId: "",
							aktivitasID: "",
							subdepId: data.id,
							start: new Date(),
							startActivity: new Date(),
							operatorID: "",
							part: partName,
						});
					}
				} else {
					dataDetail.push({
						index: 0,
						workId: "",
						aktivitasID: "",
						subdepId: data.id,
						start: new Date(),
						startActivity: new Date(),
						operatorID: "",
						part: partName,
					});
				}
				setDetail(dataDetail);
			} else {
				setListEmploye([]);
				setDetail(detail);
			}
		} else if (event.target.name === "worker") {
			if (event.target.value !== "no data" && event.target.value !== "create") {
				let data = JSON.parse(event.target.value);
				let idx = event.target.id.split("_");
				let dataDetail = detail;
				if (dataDetail.length > 0) {
					let arrDetail = dataDetail.filter((detail: any) => {
						return detail.part === partName;
					});
					let arrDetailOther = dataDetail.filter((detail: any) => {
						return detail.part !== partName;
					});
					if (arrDetail.length > 0) {
						arrDetail.map((res: any, i: number) => {
							if (parseInt(idx[1]) === res.index) {
								arrDetailOther.push({
									index: res.index,
									workId: data.id,
									aktivitasID: res.aktivitasID,
									subdepId: res.subdepId,
									start: res.start,
									startActivity: res.startActivity,
									operatorID: res.operatorID,
									part: res.part,
								});
							} else {
								arrDetailOther.push({
									index: res.index,
									workId: res.workId,
									aktivitasID: res.aktivitasID,
									subdepId: res.subdepId,
									start: res.start,
									startActivity: res.startActivity,
									operatorID: res.operatorID,
									part: res.part,
								});
							}
						});
						dataDetail = arrDetailOther;
					} else {
						dataDetail.push({
							index: arrDetail.length,
							workId: data.id,
							aktivitasID: "",
							subdepId: "",
							start: new Date(),
							startActivity: new Date(),
							operatorID: "",
							part: partName,
						});
					}
				} else {
					dataDetail.push({
						index: 0,
						workId: data.id,
						aktivitasID: "",
						subdepId: "",
						start: new Date(),
						startActivity: new Date(),
						operatorID: "",
						part: partName,
					});
				}
				setDetail(dataDetail);
			} else {
				setDetail(detail);
			}
		} else if (event.target.name === "operator") {
			if (event.target.value !== "no data") {
				let data = JSON.parse(event.target.value);
				let idx = event.target.id.split("_");
				let dataDetail = detail;
				if (dataDetail.length > 0) {
					let arrDetail = dataDetail.filter((detail: any) => {
						return detail.part === partName;
					});
					let arrDetailOther = dataDetail.filter((detail: any) => {
						return detail.part !== partName;
					});
					if (arrDetail.length > 0) {
						arrDetail.map((res: any, i: number) => {
							if (parseInt(idx[1]) === res.index) {
								arrDetailOther.push({
									index: res.index,
									workId: res.workId,
									aktivitasID: res.aktivitasID,
									subdepId: res.subdepId,
									start: res.start,
									startActivity: res.startActivity,
									operatorID: data.id,
									part: res.part,
								});
							} else {
								arrDetailOther.push({
									index: res.index,
									workId: res.workId,
									aktivitasID: res.aktivitasID,
									subdepId: res.subdepId,
									start: res.start,
									startActivity: res.startActivity,
									operatorID: res.operatorID,
									part: res.part,
								});
							}
						});
						dataDetail = arrDetailOther;
					} else {
						dataDetail.push({
							index: arrDetail.length,
							workId: "",
							aktivitasID: "",
							subdepId: "",
							start: new Date(),
							startActivity: new Date(),
							operatorID: data.id,
							part: partName,
						});
					}
				} else {
					dataDetail.push({
						index: 0,
						workId: "",
						aktivitasID: "",
						subdepId: "",
						start: new Date(),
						startActivity: new Date(),
						operatorID: data.id,
						part: partName,
					});
				}
				setDetail(dataDetail);
			} else {
				setDetail(detail);
			}
		} else if (event.target.name === "aktivitasID") {
			if (event.target.value !== "no data") {
				let data = JSON.parse(event.target.value);
				let idx = event.target.id.split("_");
				let dataDetail = detail;
				if (dataDetail.length > 0) {
					let arrDetail = dataDetail.filter((detail: any) => {
						return detail.part === partName;
					});
					let arrDetailOther = dataDetail.filter((detail: any) => {
						return detail.part !== partName;
					});
					if (arrDetail.length > 0) {
						arrDetail.map((res: any, i: number) => {
							if (parseInt(idx[1]) === res.index) {
								arrDetailOther.push({
									index: res.index,
									workId: res.workId,
									aktivitasID: data.id,
									subdepId: res.subdepId,
									start: res.start,
									startActivity: new Date(data.startday),
									operatorID: res.operatorID,
									part: res.part,
								});
							} else {
								arrDetailOther.push({
									index: res.index,
									workId: res.workId,
									subdepId: res.subdepId,
									start: res.start,
									aktivitasID: res.aktivitasID,
									startActivity: res.startActivity,
									operatorID: res.operatorID,
									part: res.part,
								});
							}
						});
						dataDetail = arrDetailOther;
					} else {
						dataDetail.push({
							index: arrDetail.length,
							workId: "",
							aktivitasID: data.id,
							subdepId: "",
							start: new Date(),
							startActivity: new Date(),
							operatorID: "",
							part: partName,
						});
					}
				} else {
					dataDetail.push({
						index: 0,
						workId: "",
						aktivitasID: data.id,
						subdepId: "",
						start: new Date(),
						startActivity: new Date(),
						operatorID: "",
						part: partName,
					});
				}
				setDetail(dataDetail);
			} else {
				setListEmploye([]);
				setDetail(detail);
			}
		}
	};

	const handleChangeStartDate = (data: any, id: any) => {
		let dataDetail = detail;
		let idx = id.split("_");
		if (dataDetail.length > 0) {
			let arrDetail = dataDetail.filter((detail: any) => {
				return detail.part === partName;
			});
			let arrDetailOther = dataDetail.filter((detail: any) => {
				return detail.part !== partName;
			});
			if (arrDetail.length > 0) {
				arrDetail.map((res: any, i: number) => {
					if (parseInt(idx[1]) === res.index) {
						arrDetailOther.push({
							index: res.index,
							workId: res.workId,
							aktivitasID: res.aktivitasID,
							subdepId: res.subdepId,
							start: new Date(data),
							startActivity: res.startActivity,
							operatorID: res.operatorID,
							part: res.part,
						});
					} else {
						arrDetailOther.push({
							index: res.index,
							workId: res.workId,
							aktivitasID: res.aktivitasID,
							subdepId: res.subdepId,
							start: new Date(res.start),
							startActivity: res.startActivity,
							operatorID: res.operatorID,
							part: res.part,
						});
					}
				});
				dataDetail = arrDetailOther;
			} else {
				dataDetail.push({
					workId: "",
					subdepId: "",
					aktivitasID: "",
					start: new Date(data),
					startActivity: new Date(),
					operatorID: "",
					part: partName,
				});
			}
		} else {
			dataDetail.push({
				index: 0,
				workId: "",
				aktivitasID: "",
				subdepId: "",
				start: new Date(data),
				startActivity: new Date(),
				operatorID: "",
				part: partName,
			});
		}
		setDetail(dataDetail);
	};

	const addDetail = () => {
		let dataDetail = detail;
		let arrDetail = dataDetail.filter((detail: any) => {
			return detail.part === partName;
		});
		if (dataDetail.length > 0) {
			let arrDetailOther = dataDetail.filter((detail: any) => {
				return detail.part !== partName;
			});
			if (arrDetail.length > 0) {
				arrDetail.map((res: any, i: number) => {
					arrDetailOther.push({
						index: res.index,
						workId: res.workId,
						aktivitasID: res.aktivitasID,
						startActivity: res.startActivity,
						subdepId: res.subdepId,
						start: res.start,
						operatorID: res.operatorID,
						part: res.part,
					});
				});
				dataDetail = arrDetailOther;
			} else {
				dataDetail.push({
					index: arrDetail.length,
					workId: "",
					aktivitasID: "",
					startActivity: new Date(),
					subdepId: "",
					start: new Date(),
					operatorID: "",
					part: partName,
				});
			}
		}
		dataDetail.push({
			index: arrDetail.length,
			workId: "",
			subdepId: "",
			aktivitasID: "",
			startActivity: new Date(),
			start: new Date(),
			operatorID: "",
			part: partName,
		});
		setDetail(dataDetail);
	};

	const removeDetail = (i: number) => {
		let dataDetail = detail;
		let newDataDetail: any = [];
		let removeDetail = dataDetail.filter((detail: any) => {
			return detail.index !== i && detail.part === partName;
		});
		let otherDetail = dataDetail.filter((detail: any) => {
			return detail.part !== partName;
		});
		newDataDetail = otherDetail;
		removeDetail.map((res: any, i: number) => {
			newDataDetail.push({
				index: i,
				workId: res.workId,
				aktivitasID: res.aktivitasID,
				startActivity: res.startActivity,
				subdepId: res.subdepId,
				start: res.start,
				operatorID: res.operatorID,
				part: res.part,
			});
		});
		setDetail(newDataDetail);
	};

	const getSchedule = async () => {
		let datasSchedulle: any = [];
		try {
			const response = await GetSummaryDispatch();
			if (response.data) {
				response.data.result.map((res: any) => {
					datasSchedulle.push({
						value: res,
						label: `${res.id_summary} - ${res.timeschedule.wor.job_no}`,
					});
				});
				setListSchedule(datasSchedulle);
			}
		} catch (error) {
			setListSchedule(datasSchedulle);
		}
	};

	const getDepart = async () => {
		let depart: any = [];
		try {
			const response = await GetAllDepartement();
			if (response.data) {
				response.data.result.map((res: any) => {
					depart.push({
						label: res.name,
						value: res.id,
					});
				});
			}
			setListDepart(depart);
		} catch (error) {
			setListDepart(depart);
		}
	};

	const getWorkerCenter = async () => {
		try {
			const response = await GetAllWorkerCenter();
			if (response.data) {
				setListWorkerCenter(response.data.result);
			}
		} catch (error) {
			setListWorkerCenter([]);
		}
	};

	const getEmploye = async (sub: string, dep: string) => {
		try {
			const response = await GetAllEmployeDepart(sub, dep);
			if (response.data) {
				setListEmploye(response.data.result);
			}
		} catch (error) {
			setListEmploye([]);
		}
	};

	const addDispatch = async (payload: any) => {
		setIsLoading(true);
		let dataDetail: any = [];
		payload.dispatchDetail.map((res: any) => {
			dataDetail.push({
				date_dispatch: res.date_dispatch,
				timeschId: res.timeschId,
				aktivitasID: res.aktivitasID,
				subdepId: res.subdepId,
			});
		});
		try {
			const response = await AddDispatch({dispatchDetail:dataDetail});
			if (response.data) {
				toast.success("Add Dispatch Success", {
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
			toast.error("Add Dispatch Failed", {
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

	const addWorkerCenter = async (data: any) => {
		setIsLoading(true);
		try {
			const response = await AddWorkerCenter(data);
			if (response) {
				toast.success("Add Worker Center Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				getWorkerCenter();
				setIsFormCreateWorkerCenter(false);
			}
		} catch (error) {
			toast.error("Add Worker Center Failed", {
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
		setIsLoading(false);
	};

	const showFormWorkerCenter = (data: any) => {
		setData(data);
		setIsFormCreateWorkerCenter(true);
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			{isFormCreateWorkerCenter ? (
				<Formik
					initialValues={dataWorkerCenter}
					validationSchema={workerCenterSchema}
					onSubmit={(values) => {
						addWorkerCenter(values);
					}}
					enableReinitialize
				>
					{({ handleChange, handleSubmit, errors, touched, values }) => (
						<Form>
							<Section className='grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
								<Input
									id='name'
									name='name'
									placeholder='Worker Center Name'
									label='Worker Center Name'
									type='text'
									required={true}
									disabled={isLoading}
									withLabel={true}
									value={values.name}
									onChange={handleChange}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
								{errors.name && touched.name ? (
									<span className='text-red-500 text-xs'>{errors.name}</span>
								) : null}
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
											"Edit"
										)}
									</button>
									<button
										type='button'
										className='inline-flex justify-center rounded-full border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
										disabled={isLoading}
										onClick={() => {
											setIsFormCreateWorkerCenter(false);
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
											"Cancel"
										)}
									</button>
								</div>
							</div>
						</Form>
					)}
				</Formik>
			) : (
				<Formik
					initialValues={{ ...data }}
					// validationSchema={sumarySchema}
					onSubmit={(values) => {
						addDispatch(values);
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
							<h1 className='text-xl font-bold mt-3'>Dispatch</h1>
							<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2 mt-2'>
								<div className='w-full'>
									<InputDate
										id='dispacth_date'
										label='Date Prepare'
										value={new Date()}
										onChange={(value: any) =>
											setFieldValue("dispacth_date", value)
										}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
										classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
									/>
								</div>
								<div className='w-full'>
									<InputSelectSearch
										datas={listSchedule}
										id='summaryId'
										name='summaryId'
										placeholder='Shedulle'
										label='Id Schedulle'
										onChange={(e: any) => {
											let detail: any = [];
											setFieldValue("job_no", e.value.timeschedule.wor.job_no);
											setFieldValue(
												"subject",
												e.value.timeschedule.wor.customerPo.quotations.subject
											);
											setFieldValue(
												"startDate",
												e.value.timeschedule.wor.date_of_order
											);
											setFieldValue(
												"finishDate",
												e.value.timeschedule.wor.delivery_date
											);
											setFieldValue("equipment", e.value.equipment);
											setFieldValue("model", e.value.model);
											setFieldValue("qty", e.value.qty);
											e.value.timeschedule.aktivitas.map((res: any) => {
												detail.push({
													date_dispatch: new Date(),
													timeschId: e.value.timeschedule.id,
													aktivitasID: res.id,
													aktivitas: res.work_scope_item.item,
													start: moment(res.startday).format("DD-MMMM-YYYY"),
													end: moment(res.endday).format("DD-MMMM-YYYY"),
													subdepId: "",
												});
											});
											setFieldValue("dispatchDetail", detail);
											// let equipment: any = [];
											// let part: any = [];
											// let lastEquipment: string = "";
											// e.value.timeschedule.wor.customerPo.quotations.eqandpart.map(
											// 	(res: any) => {
											// 		if (lastEquipment !== res.equipment.nama) {
											// 			equipment.push(res.equipment.nama);
											// 		}
											// 		lastEquipment = res.equipment.nama;
											// 	}
											// );
											// e.value.srimgdetail.map((res: any) => {
											// 	part.push(res);
											// });
											// setJobNo(e.value.timeschedule.wor.job_no);
											// setSubject(e.value.timeschedule.wor.subject);
											// setDateWor(e.value.timeschedule.wor.date_wor);
											// setDateFinish(e.value.timeschedule.wor.delivery_date);
											// setEquipment(equipment.toString());
											// setPart(part);
											// setListActivity(e.value.timeschedule.aktivitas);
											// setFieldValue("summaryId", e.value.id);
											// if (event.target.value !== "no data") {
											// 	let data = JSON.parse(event.target.value);
											// }
										}}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
									/>
									{/* <option value='no data' selected>
											Choose Schedulle
										</option>
										{listSchedule.length === 0 ? (
											<option value='no data'>No Data Schedulle</option>
										) : (
											listSchedule.map((res: any, i: number) => {
												return (
													<option value={JSON.stringify(res)} key={i} selected={ res.id === values.summaryId }>
														{res.id_summary} - {res.timeschedule.wor.job_no}
													</option>
												);
											})
										)}
									</InputSelectSearch> */}
								</div>
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
							</Section>
							<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2'>
								<div className='w-full'>
									<InputArea
										id='subject'
										name='subject'
										placeholder='Subject'
										label='Subject'
										required={true}
										disabled={true}
										value={values.subject}
										row={2}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
								<div className='w-full'>
									<InputDate
										id='date_of_summary'
										label='Start Date'
										value={values.startDate}
										withLabel={true}
										disabled={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
										classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
									/>
								</div>
								<div className='w-full'>
									<InputDate
										id='date_of_summary'
										label='Finish Date'
										value={values.finishDate}
										withLabel={true}
										disabled={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
										classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
									/>
								</div>
							</Section>
							<Section className='grid md:grid-cols-3 sm:grid-cols-1 xs:grid-cols-1 gap-2'>
								<div className='w-full'>
									<Input
										id='date_wor'
										name='date_wor'
										placeholder='Equipment'
										label='Equipment'
										type='text'
										value={values.equipment}
										disabled={true}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
								<div className='w-full'>
									<Input
										id='date_wor'
										name='date_wor'
										placeholder='Model'
										label='Model'
										type='text'
										value={values.model}
										disabled={true}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
								<div className='w-full'>
									<Input
										id='date_wor'
										name='date_wor'
										placeholder='Qty'
										label='Quantity'
										type='number'
										value={values.qty.toString()}
										disabled={true}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
								{/* <div className='w-full'>
									<InputSelect
										id='part'
										name='part'
										placeholder='Part'
										label='Part'
										onChange={(event: any) => {
											if (event.target.value !== "no data") {
												let data = JSON.parse(event.target.value);
												setFieldValue("worId", data.id);
											}
										}}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									>
										<option value='no data' selected>
											Choose Part
										</option>
										{part.length === 0 ? (
											<option value='no data'>No Data Part</option>
										) : (
											part.map((res: any, i: number) => {
												return (
													<option value={JSON.stringify(res)} key={i}>
														{res.name_part}
													</option>
												);
											})
										)}
									</InputSelect>
								</div>
								<div className='w-full'>
									<Input
										id='status'
										name='status'
										placeholder='Status'
										label='Status'
										type='text'
										value={status}
										disabled={true}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div> */}
							</Section>
							<FieldArray
								name='dispatchDetail'
								render={(arrayDetail) => (
									<>
										{values.dispatchDetail.map((res: any, i: number) => (
											<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2' key={i}>
												<div className='w-full'>
													<InputArea
														id='aktivitas'
														name='aktivitas'
														placeholder='Aktivitas'
														label='Aktivitas'
														required={true}
														disabled={true}
														value={res.aktivitas}
														row={2}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<Input
														id='startDate'
														name='startDate'
														placeholder='Start Date'
														label='Start Date'
														type='text'
														value={res.start}
														disabled={true}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<Input
														id='endDate'
														name='endDate'
														placeholder='End Date'
														label='End Date'
														type='text'
														value={res.end}
														disabled={true}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													/>
												</div>
												<div className='w-full'>
													<InputSelectSearch
														datas={listDepart}
														id={`dispatchDetail.${i}.subdepId`}
														name={`dispatchDetail.${i}.subdepId`}
														placeholder='Departemen'
														label='Departemen'
														onChange={(e: any) => {
															setFieldValue(
																`dispatchDetail.${i}.subdepId`,
																e.value
															);
														}}
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
													/>
												</div>
											</Section>
										))}
									</>
								)}
							/>
							<div className={`w-full mt-4 ${isShowDetail ? "" : "hidden"}`}>
								<h4 className='text-lg font-bold mt-3'>Part : {partName}</h4>
								{detail
									.filter((tab: any) => {
										return tab.part === partName;
									})
									.map((dataDetail: any, idx: number, data: any) => (
										<div key={idx}>
											<Section className='grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 mt-2'>
												<div className='w-full'>
													<InputSelect
														id={`worker_${idx}`}
														name='worker'
														placeholder='Worker Center'
														label='Worker Center'
														required={true}
														onChange={(input: any) => {
															if (input.target.value === "create") {
																showFormWorkerCenter(values);
															}
														}}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													>
														<option value='no data' selected>
															Choose Worker Center
														</option>
														{listWorkerCenter.length === 0 ? (
															<option value='no data'>
																No Data Worker Center
															</option>
														) : (
															listWorkerCenter.map((res: any, i: number) => {
																return (
																	<option
																		value={JSON.stringify(res)}
																		key={i}
																		selected={res.id === dataDetail.workId}
																	>
																		{res.name}
																	</option>
																);
															})
														)}
														<option value='create'>Add Worker Center</option>
													</InputSelect>
												</div>
												<div className='w-full'>
													<InputSelect
														id={`aktivitasID_${idx}`}
														name='aktivitasID'
														placeholder='Activity'
														label='Activity'
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													>
														<option value='no data' selected>
															Choose Activity
														</option>
														{listActivity.length === 0 ? (
															<option value='no data'>No Data Activity</option>
														) : (
															listActivity.map((res: any, i: number) => {
																return (
																	<option
																		value={JSON.stringify(res)}
																		key={i}
																		selected={res.id === dataDetail.aktivitasID}
																	>
																		{res.masterAktivitas.name}
																	</option>
																);
															})
														)}
													</InputSelect>
												</div>
												<div className='w-full'>
													<InputDate
														id={`start_${idx}`}
														label='Start Date'
														value={new Date(dataDetail.start)}
														onChange={(e: any) => {
															handleChangeStartDate(e, `start_${idx}`);
														}}
														minDate={dataDetail.startActivity}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
														classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
													/>
												</div>
												<div className='w-full'>
													<InputSelect
														id={`departemen_${idx}`}
														name='departemen'
														placeholder='Departemen'
														label='Departemen'
														required={true}
														withLabel={true}
														className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													>
														<option value='no data' selected>
															Choose Departement
														</option>
														{listDepart.length === 0 ? (
															<option value='no data'>No Data Part</option>
														) : (
															listDepart.map((res: any, i: number) => {
																return (
																	<option
																		value={JSON.stringify(res)}
																		key={i}
																		selected={res.id === dataDetail.subdepId}
																	>
																		{res.name}
																	</option>
																);
															})
														)}
													</InputSelect>
												</div>
												{/* <div className='w-full'>
														<InputSelect
															id={`operator_${idx}`}
															name='operator'
															placeholder='Operator'
															label='Operator'
															required={true}
															withLabel={true}
															className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
														>
															<option value='no data' selected>
																Choose Operator
															</option>
															{listEmploye.length === 0 ? (
																<option value='no data'>No Operator</option>
															) : (
																listEmploye.map((res: any, i: number) => {
																	return (
																		<option
																			value={JSON.stringify(res)}
																			key={i}
																			selected={res.id === dataDetail.operatorID}
																		>
																			{res.employee_name}
																		</option>
																	);
																})
															)}
														</InputSelect>
													</div> */}
											</Section>
											{idx === data.length - 1 ? (
												<a
													className='inline-flex text-green-500 mr-6 cursor-pointer'
													onClick={() => {
														addDetail();
													}}
												>
													<Plus size={18} className='mr-1 mt-1' /> Add Detail
												</a>
											) : null}
											{data.length !== 1 ? (
												<a
													className='inline-flex text-red-500 cursor-pointer mt-1'
													onClick={() => {
														removeDetail(idx);
													}}
												>
													<Trash2 size={18} className='mr-1 mt-1' /> Remove
													Detail
												</a>
											) : null}
										</div>
									))}
							</div>
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
											"Edit"
										)}
									</button>
								</div>
							</div>
						</Form>
					)}
				</Formik>
			)}
		</div>
	);
};
