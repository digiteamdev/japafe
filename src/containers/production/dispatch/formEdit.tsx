import { useState, useEffect } from "react";
import {
	Section,
	Input,
	InputSelectSearch,
	InputDate,
	InputArea,
} from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { sumarySchema } from "../../../schema/engineering/sumary-report/SumarySchema";
import {
	GetAllDepartement,
	GetAllWorkerCenter,
	GetAllEmployee,
	GetSummaryDispatch,
	DispatchDetailStart,
	DispatchDetailFinish,
	DispatchOperatorStart,
} from "../../../services";
import { toast } from "react-toastify";
import moment from "moment";

interface props {
	content: string;
	dataDispatch: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	summaryId: string;
	id_dispatch: string;
	customer: string;
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

export const FormEditDispatch = ({
	content,
	dataDispatch,
	showModal,
}: props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isShowDetail, setIsShowDetail] = useState<boolean>(true);
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
	const [tabsPart, setTabsPart] = useState<any>([]);
	const [detail, setDetail] = useState<any>([]);
	const [data, setData] = useState<data>({
		summaryId: "",
		id_dispatch: "",
		customer: "",
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

	useEffect(() => {
		settingData();
		getSchedule();
		getDepart();
		getWorkerCenter();
		getEmploye();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settingData = () => {
		let detail: any = [];
		dataDispatch.dispatchDetail.map((res: any) => {
			detail.push({
				idDispatch: res.id,
				date_dispatch: res.date_dispatch,
				timeschId: res.timeschId,
				aktivitasID: res.aktivitasId,
				aktivitas: res.aktivitas.work_scope_item.item,
				start: moment(res.aktivitas.startday).format("DD-MMMM-YYYY"),
				end: moment(res.aktivitas.endday).format("DD-MMMM-YYYY"),
				subdepId: res.subdepId,
				employeeId:
					res.operator.length === 0
						? ""
						: res.operator[res.operator.length - 1].employeeId,
				operatorSelected:
					res.operator.length === 0
						? []
						: {
								label:
									res.operator[res.operator.length - 1].Employee.employee_name,
								value: res.operator[res.operator.length - 1].Employee,
						  },
				operator: res.operator,
				depart: [
					{
						label: res.sub_depart.name,
						value: res.sub_depart,
					},
				],
			});
		});
		setData({
			summaryId: "",
			id_dispatch: "",
			customer:
				dataDispatch.srimg.timeschedule.wor.customerPo.quotations.Customer.name,
			dispacth_date: new Date(),
			remark: "",
			job_no: dataDispatch.srimg.timeschedule.wor.job_no,
			subject:
				dataDispatch.srimg.timeschedule.wor.customerPo.quotations.subject,
			startDate: dataDispatch.srimg.timeschedule.wor.date_of_order,
			finishDate: dataDispatch.srimg.timeschedule.wor.delivery_date,
			equipment: dataDispatch.srimg.equipment,
			model: dataDispatch.srimg.model,
			qty: 0,
			dispatchDetail: detail,
		});
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name === "srId") {
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
				setEquipment(equipment.toString());
				setListActivity(dataDispatch.srimg.timeschedule.aktivitas);
				setPart(part);
			} else {
				setJobNo("");
				setSubject("");
				setDateWor("");
				setEquipment("");
				setPart([]);
				setListActivity([]);
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
								id: res.id,
								dispacthID: dataDispatch.id,
								index: res.index,
								aktivitasID: res.aktivitasID,
								actual: res.actual,
								approvebyID: res.approvebyID,
								workId: res.workId,
								subdepId: res.subdepId,
								start: res.start,
								operatorID: res.operatorID,
								part: res.part,
							});
						});
						dataDetail = arrDetailOther;
					} else {
						dataDetail.push({
							id: "",
							dispacthID: dataDispatch.id,
							index: 0,
							actual: "",
							approvebyID: "",
							aktivitasID: "",
							workId: "",
							subdepId: "",
							start: new Date(),
							operatorID: "",
							part: data.name_part,
						});
					}
				} else {
					dataDetail.push({
						id: "",
						dispacthID: dataDispatch.id,
						index: 0,
						aktivitasID: "",
						actual: "",
						approvebyID: "",
						workId: "",
						subdepId: "",
						start: new Date(),
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
									id: res.id,
									dispacthID: dataDispatch.id,
									index: res.index,
									aktivitasID: res.aktivitasID,
									actual: res.actual,
									approvebyID: res.approvebyID,
									workId: res.workId,
									subdepId: data.id,
									start: res.start,
									operatorID: res.operatorID,
									part: res.part,
								});
							} else {
								arrDetailOther.push({
									id: res.id,
									dispacthID: dataDispatch.id,
									index: res.index,
									aktivitasID: res.aktivitasID,
									actual: res.actual,
									approvebyID: res.approvebyID,
									workId: res.workId,
									subdepId: res.subdepId,
									start: res.start,
									operatorID: res.operatorID,
									part: res.part,
								});
							}
						});
						dataDetail = arrDetailOther;
					} else {
						dataDetail.push({
							id: "",
							dispacthID: dataDispatch.id,
							index: arrDetail.length,
							aktivitasID: "",
							actual: "",
							approvebyID: "",
							workId: "",
							subdepId: data.id,
							start: new Date(),
							operatorID: "",
							part: partName,
						});
					}
				} else {
					dataDetail.push({
						id: "",
						dispacthID: dataDispatch.id,
						index: 0,
						aktivitasID: "",
						actual: "",
						approvebyID: "",
						workId: "",
						subdepId: data.id,
						start: new Date(),
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
									id: res.id,
									dispacthID: dataDispatch.id,
									index: res.index,
									aktivitasID: res.aktivitasID,
									actual: res.actual,
									approvebyID: res.approvebyID,
									workId: data.id,
									subdepId: res.subdepId,
									start: res.start,
									operatorID: res.operatorID,
									part: res.part,
								});
							} else {
								arrDetailOther.push({
									id: res.id,
									dispacthID: dataDispatch.id,
									index: res.index,
									aktivitasID: res.aktivitasID,
									actual: res.actual,
									approvebyID: res.approvebyID,
									workId: res.workId,
									subdepId: res.subdepId,
									start: res.start,
									operatorID: res.operatorID,
									part: res.part,
								});
							}
						});
						dataDetail = arrDetailOther;
					} else {
						dataDetail.push({
							id: "",
							dispacthID: dataDispatch.id,
							index: arrDetail.length,
							aktivitasID: "",
							actual: "",
							approvebyID: "",
							workId: data.id,
							subdepId: "",
							start: new Date(),
							operatorID: "",
							part: partName,
						});
					}
				} else {
					dataDetail.push({
						id: "",
						dispacthID: dataDispatch.id,
						index: 0,
						aktivitasID: "",
						actual: "",
						approvebyID: "",
						workId: data.id,
						subdepId: "",
						start: new Date(),
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
									id: res.id,
									dispacthID: dataDispatch.id,
									index: res.index,
									aktivitasID: res.aktivitasID,
									approvebyID: res.approvebyID,
									actual: res.actual,
									workId: res.workId,
									subdepId: res.subdepId,
									start: res.start,
									operatorID: data.id,
									part: res.part,
								});
							} else {
								arrDetailOther.push({
									id: res.id,
									dispacthID: dataDispatch.id,
									index: res.index,
									aktivitasID: res.aktivitasID,
									approvebyID: res.approvebyID,
									actual: res.actual,
									workId: res.workId,
									subdepId: res.subdepId,
									start: res.start,
									operatorID: res.operatorID,
									part: res.part,
								});
							}
						});
						dataDetail = arrDetailOther;
					} else {
						dataDetail.push({
							id: "",
							dispacthID: dataDispatch.id,
							index: arrDetail.length,
							actual: null,
							aktivitasID: "",
							approvebyID: null,
							workId: "",
							subdepId: "",
							start: new Date(),
							operatorID: data.id,
							part: partName,
						});
					}
				} else {
					dataDetail.push({
						id: "",
						dispacthID: dataDispatch.id,
						index: 0,
						actual: null,
						approvebyID: null,
						aktivitasID: "",
						workId: "",
						subdepId: "",
						start: new Date(),
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
									id: res.id,
									index: res.index,
									workId: res.workId,
									aktivitasID: data.id,
									actual: res.actual,
									approvebyID: res.approvebyID,
									subdepId: res.subdepId,
									start: res.start,
									startActivity: new Date(data.startday),
									operatorID: res.operatorID,
									part: res.part,
								});
							} else {
								arrDetailOther.push({
									id: res.id,
									index: res.index,
									workId: res.workId,
									subdepId: res.subdepId,
									start: res.start,
									aktivitasID: res.aktivitasID,
									actual: res.actual,
									approvebyID: res.approvebyID,
									startActivity: res.startActivity,
									operatorID: res.operatorID,
									part: res.part,
								});
							}
						});
						dataDetail = arrDetailOther;
					} else {
						dataDetail.push({
							id: "",
							index: arrDetail.length,
							workId: "",
							aktivitasID: data.id,
							actual: "",
							approvebyID: "",
							subdepId: "",
							start: new Date(),
							startActivity: new Date(),
							operatorID: "",
							part: partName,
						});
					}
				} else {
					dataDetail.push({
						id: "",
						index: 0,
						workId: "",
						aktivitasID: data.id,
						actual: "",
						approvebyID: "",
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

	const getSchedule = async () => {
		try {
			const response = await GetSummaryDispatch();
			if (response.data) {
				let summary = response.data.result;
				summary.push(dataDispatch.srimg);
				setListSchedule(response.data.result);
			}
		} catch (error) {
			setListSchedule([]);
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

	const getEmploye = async () => {
		try {
			const response = await GetAllEmployee();
			if (response.data) {
				setListEmploye(response.data.result);
			}
		} catch (error) {
			setListEmploye([]);
		}
	};

	const listEmployes = (id: string) => {
		let dataEmploye: any = [];
		listEmploye.map((res: any) => {
			if (res.subdepartId === id) {
				dataEmploye.push({
					label: res.employee_name,
					value: res,
				});
			}
		});
		return dataEmploye;
	};

	const startAktivitas = async (data: any, so: boolean) => {
		let body: any = {
			actual_start: new Date(),
			so: so,
		};
		if (so) {
			try {
				const response = await DispatchDetailStart(data.aktivitasID, body);
				if (response.data) {
					toast.success("SO Activity Success", {
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
			} catch (error) {
				toast.error("SO Activity Failed", {
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
		} else {
			try {
				const response = await DispatchDetailStart(data.idDispatch, body);
				if (response.data) {
					let bodyStart: any = {
						dispatchDetailId: data.idDispatch,
						employeeId: data.employeeId,
						start: new Date(),
					};
					const start = await DispatchOperatorStart(bodyStart);
					if (start.data) {
						toast.success("Start Activity Success", {
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
			} catch (error) {
				toast.error("Start Activity Failed", {
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
		}
	};

	const changeShift = async (data: any) => {
		let body: any = {
			dispatchDetailId: data.idDispatch,
			employeeId: data.employeeId,
			start: new Date(),
		};
		try {
			const start = await DispatchOperatorStart(body);
			if (start.data) {
				toast.success("Change Shift Activity Success", {
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
		} catch (error) {
			toast.error("Change Shift Activity Failed", {
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
	};

	const finishActivity = async (data: any) => {
		let body: any = {
			// finish: new Date(),
			actual_finish: new Date(),
			// approvebyID: getId(),
			// operatorId: null
		};
		try {
			const response = await DispatchDetailFinish(data.aktivitasID, body);
			if (response.data) {
				toast.success("Finish Activity Success", {
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
		} catch (error) {
			toast.error("Finish Activity Failed", {
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
	};

	return (
		<div className='px-5 pb-2 mt-4 overflow-auto h-[calc(100vh-100px)]'>
			<Formik
				initialValues={{ ...data }}
				// validationSchema={sumarySchema}
				onSubmit={(values) => {
					console.log(values)
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
									id='customer'
									name='customer'
									placeholder='Job No'
									label='Job No'
									type='text'
									value={values.customer}
									disabled={true}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								/>
							</div>
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
						<FieldArray
							name='dispatchDetail'
							render={(arrayDetail) => (
								<>
									{values.dispatchDetail.map((res: any, i: number) => (
										<Section className='grid md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2' key={i}>
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
												<InputSelectSearch
													datas={listDepart}
													id={`dispatchDetail.${i}.subdepId`}
													name={`dispatchDetail.${i}.subdepId`}
													placeholder='Departemen'
													label='Departemen'
													value={res.depart}
													onChange={(e: any) => {
														setFieldValue(
															`dispatchDetail.${i}.subdepId`,
															e.value
														);
														setFieldValue(`dispatchDetail.${i}.depart`, e);
													}}
													required={true}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
												/>
											</div>
											<div className='w-full'>
												<InputSelectSearch
													datas={listEmployes(res.subdepId)}
													id={`dispatchDetail.${i}.employeeId`}
													name={`dispatchDetail.${i}.employeeId`}
													placeholder='Operator'
													label='Operator'
													value={res.operatorSelected}
													onChange={(e: any) => {
														setFieldValue(
															`dispatchDetail.${i}.employeeId`,
															e.value.id
														);
														setFieldValue(
															`dispatchDetail.${i}.operatorSelected`,
															e
														);
													}}
													withLabel={true}
													className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full outline-primary-600'
												/>
											</div>
											<div className='w-full pt-7'>
												{res.operator.length === 0 ? (
													<div className='flex'>
														<button
															type='button'
															className='bg-green-500 hover:bg-green-300 text-white py-1 px-1 mr-1 rounded-md'
															onClick={() => startAktivitas(res, false)}
														>
															Start
														</button>
														<button
															type='button'
															className='bg-blue-500 hover:bg-blue-300 text-white py-1 px-1 rounded-md'
															onClick={() => startAktivitas(res, true)}
														>
															SO
														</button>
													</div>
												) : res.aktivitas.actual_finish === null ? (
													<>
														<button
															type='button'
															className='bg-orange-500 hover:bg-orange-300 text-white py-1 px-1 rounded-md mx-1 my-1'
															onClick={() => changeShift(res)}
														>
															Change Shift
														</button>
														<button
															type='button'
															className='bg-red-500 hover:bg-red-300 text-white py-1 px-1 rounded-md'
															onClick={() => finishActivity(res)}
														>
															Finish
														</button>
													</>
												) : ""}
											</div>
										</Section>
									))}
								</>
							)}
						/>
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
		</div>
	);
};
