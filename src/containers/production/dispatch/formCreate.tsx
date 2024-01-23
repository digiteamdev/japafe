import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelect,
	InputSelectSearch,
	InputDate,
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
	dispatchDetail: [
		{
			workId: string;
			subdepId: string;
			aktivitasID: string;
			start: any;
			startActivity: any;
			operatorID: string;
			part: string;
		}
	];
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
		dispatchDetail: [
			{
				workId: "",
				aktivitasID: "",
				subdepId: "",
				start: null,
				startActivity: null,
				operatorID: "",
				part: "",
			},
		],
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
						label: `${res.id_summary} - ${
							res.timeschedule.wor.job_no
						}`,
					});
				});
				setListSchedule(datasSchedulle);
			}
		} catch (error) {
			setListSchedule(datasSchedulle);
		}
	};

	const getDepart = async () => {
		try {
			const response = await GetAllDepartement();
			if (response.data) {
				setListDepart(response.data.result);
			}
		} catch (error) {
			setListDepart([]);
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
		detail.map((res: any) => {
			dataDetail.push({
				workId: res.workId,
				subdepId: res.subdepId,
				aktivitasID: res.aktivitasID,
				start: res.start,
				// operatorID: res.operatorID,
				part: res.part,
			});
		});
		let dataBody = {
			srId: payload.summaryId,
			id_dispatch: generateIdNum(),
			dispacth_date: payload.dispacth_date,
			remark: payload.remark,
			dispatchDetail: dataDetail,
		};
		try {
			const response = await AddDispatch(dataBody);
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
		<div className='px-5 pb-2 mt-4 overflow-auto'>
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
											let equipment: any = [];
											let part: any = [];
											let lastEquipment: string = "";
											e.value.timeschedule.wor.customerPo.quotations.eqandpart.map(
												(res: any) => {
													if (lastEquipment !== res.equipment.nama) {
														equipment.push(res.equipment.nama);
													}
													lastEquipment = res.equipment.nama;
												}
											);
											e.value.srimgdetail.map((res: any) => {
												part.push(res);
											});
											setJobNo(e.value.timeschedule.wor.job_no);
											setSubject(e.value.timeschedule.wor.subject);
											setDateWor(e.value.timeschedule.wor.date_wor);
											setDateFinish(e.value.timeschedule.wor.delivery_date);
											setEquipment(equipment.toString());
											setPart(part);
											setListActivity(e.value.timeschedule.aktivitas);
											setFieldValue("summaryId", e.value.id);
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
										value={jobNo}
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
								<div className='w-full'>
									<InputDate
										id='date_of_summary'
										label='Start Date'
										value={dateWor === "" ? new Date() : dateWor}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
										classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
									/>
								</div>
								<div className='w-full'>
									<InputDate
										id='date_of_summary'
										label='Finish Date'
										value={dateFinish === "" ? new Date() : dateFinish}
										onChange={(value: any) =>
											setFieldValue("date_of_summary", value)
										}
										withLabel={true}
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
										value={equipment}
										disabled={true}
										required={true}
										withLabel={true}
										className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
									/>
								</div>
								<div className='w-full'>
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
								</div>
							</Section>
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
