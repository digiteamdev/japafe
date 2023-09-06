import { useState, useEffect } from "react";
import { Section, Input, InputSelect, InputDate } from "../../../components";
import { Formik, Form, FieldArray } from "formik";
import { sumarySchema } from "../../../schema/engineering/sumary-report/SumarySchema";
import {
	GetAllSchedule,
	GetAllDepartement,
	GetAllWorkerCenter,
	GetAllEmployee,
	GetSummaryDispatch,
	EditDispatch,
	EditDispatchDetail,
	DeleteDispatchDetail,
	DispatchDetailStart,
	DispatchDetailFinish,
} from "../../../services";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "react-feather";
import { getId } from "../../../configs/session";

interface props {
	content: string;
	dataDispatch: any;
	showModal: (val: boolean, content: string, reload: boolean) => void;
}

interface data {
	srId: string;
	id_dispatch: string;
	dispacth_date: any;
	remark: string;
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
		srId: "",
		id_dispatch: "",
		dispacth_date: new Date(),
		remark: "",
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
		let equipment: any = [];
		let part: any = [];
		let lastEquipment: string = "";
		let arrPart: any = [];
		let arrDetail: any = [];
		setData({
			srId: dataDispatch.srId,
			id_dispatch: dataDispatch.id_dispatch,
			dispacth_date: dataDispatch.dispacth_date,
			remark: dataDispatch.remark,
		});
		dataDispatch.srimg.timeschedule.wor.customerPo.quotations.eqandpart.map(
			(res: any) => {
				if (lastEquipment !== res.equipment.nama) {
					equipment.push(res.equipment.nama);
				}
				lastEquipment = res.equipment.nama;
			}
		);
		dataDispatch.srimg.srimgdetail.map(
			(res: any, i: number) => {
				if (i === 0) {
					setStatus(res.choice);
				}
				part.push(res);
			}
		);
		dataDispatch.dispatchDetail.map((res: any) => {
			if (arrPart.length === 0) {
				setPartName(res.part);
				arrPart.push(res.part);
			} else if (!arrPart.includes(res.part)) {
				arrPart.push(res.part);
			}
		});
		arrPart.map((res: any) => {
			dataDispatch.dispatchDetail
				.filter((part: any) => {
					return part.part === res;
				})
				.map((res: any, i: number) => {
					arrDetail.push({
						id: res.id,
						dispacthID: dataDispatch.id,
						index: i,
						aktivitasID: res.aktivitas.id,
						actual: res.actual,
						approvebyID: res.approvebyID,
						workId: res.workCenter.id,
						subdepId: res.sub_depart.id,
						start: res.start,
						operatorID: res.operatorID,
						part: res.part,
					});
				});
		});
		setTabsPart(arrPart);
		setDetail(arrDetail);
		setEquipment(equipment.toString());
		setPart(part);
		setDateFinish(dataDispatch.srimg.timeschedule.wor.delivery_date);
		setJobNo(dataDispatch.srimg.timeschedule.wor.job_no);
		setSubject(dataDispatch.srimg.timeschedule.wor.subject);
		setDateWor(dataDispatch.srimg.timeschedule.wor.date_wor);
		setListActivity(dataDispatch.srimg.timeschedule.aktivitas);
	};

	const handleOnChanges = (event: any) => {
		if (event.target.name === "srId") {
			if (event.target.value !== "no data") {
				let data = JSON.parse(event.target.value);
				let equipment: any = [];
				let part: any = [];
				let lastEquipment: string = "";
				data.timeschedule.wor.customerPo.quotations.eqandpart.map((res: any) => {
					if (lastEquipment !== res.equipment.nama) {
						equipment.push(res.equipment.nama);
					}
					lastEquipment = res.equipment.nama;
				});
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
							id: res.id,
							dispacthID: dataDispatch.id,
							index: res.index,
							aktivitasID: res.aktivitasID,
							actual: res.actual,
							approvebyID: res.approvebyID,
							workId: res.workId,
							subdepId: res.subdepId,
							start: new Date(data),
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
							start: new Date(res.start),
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
					index: 0,
					aktivitasID: "",
					actual: "",
					approvebyID: "",
					workId: "",
					subdepId: "",
					start: new Date(data),
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
				subdepId: "",
				start: new Date(data),
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
						id: res.id,
						dispacthID: dataDispatch.id,
						index: res.index,
						workId: res.workId,
						aktivitasID: res.aktivitasID,
						actual: res.actual,
						approvebyID: res.approvebyID,
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
					index: arrDetail.length,
					aktivitasID: "",
					actual: "",
					approvebyID: "",
					workId: "",
					subdepId: "",
					start: new Date(),
					operatorID: "",
					part: partName,
				});
			}
		}
		dataDetail.push({
			id: "",
			dispacthID: dataDispatch.id,
			index: arrDetail.length,
			aktivitasID: "",
			actual: "",
			approvebyID: "",
			workId: "",
			subdepId: "",
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
		let removeDetailTable = dataDetail.filter((detail: any) => {
			return detail.index === i && detail.part === partName;
		});
		let otherDetail = dataDetail.filter((detail: any) => {
			return detail.part !== partName;
		});
		newDataDetail = otherDetail;
		removeDetail.map((res: any, i: number) => {
			newDataDetail.push({
				id: res.id,
				dispacthID: dataDispatch.id,
				index: i,
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
		if (removeDetailTable[0].id !== "") {
			deleteDispacthDetail(removeDetailTable[0].id);
		}
		setDetail(newDataDetail);
	};

	const deleteDispacthDetail = async (id: string) => {
		try {
			const response = await DeleteDispatchDetail(id);
			if (response.status === 201) {
				showModal(true, content, true);
				toast.success("Delete Dispatch Detail Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
			} else {
				toast.error("Delete Dispatch Detail Failed", {
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
			toast.error("Delete Dispatch Detail Failed", {
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

	const editDispatch = async (payload: any) => {
		setIsLoading(true);
		let dataDetail: any = [];
		detail.map((res: any) => {
			dataDetail.push({
				id: res.id,
				dispacthID: dataDispatch.id,
				workId: res.workId,
				subdepId: res.subdepId,
				start: res.start,
				aktivitasID: res.aktivitasID,
				approvebyID: res.approvebyID,
				operatorID: res.operatorID,
				part: res.part,
			});
		});
		try {
			const response = await EditDispatch(dataDispatch.id, payload);
			if (response.data) {
				const res = await EditDispatchDetail(dataDetail);
				if (res.data) {
					toast.success("Edit Dispatch Success", {
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
			}
		} catch (error) {
			toast.error("Edit Dispatch Failed", {
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

	const startDetail = async (id: string, so: boolean) => {
		let dataDetail = detail;
		let dataBody = {
			actual: new Date(),
			so: so
		};
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
						id: res.id,
						dispacthID: dataDispatch.id,
						index: res.index,
						aktivitasID: res.aktivitasID,
						actual: new Date(),
						approvebyID: res.approvebyID,
						workId: res.workId,
						subdepId: res.subdepId,
						start: res.start,
						operatorID: res.operatorID,
						part: res.part,
					});
				});
				dataDetail = arrDetailOther;
			}
		}
		try {
			const response = await DispatchDetailStart(id, dataBody);
			if (response.status === 201) {
				setDetail(dataDetail);
				toast.success("Start Dispatch Detail Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
			} else {
				toast.error("Start Dispatch Detail Failed", {
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
			toast.error("Start Dispatch Detail Failed", {
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

	const finishDetail = async (id: string) => {
		let dataBody = {
			finish: new Date(),
			approvebyID: getId(),
		};
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
			}
		}
		try {
			const response = await DispatchDetailFinish(id, dataBody);
			if (response.status === 201) {
				setDetail(dataDetail);
				showModal(false, content, true);
				toast.success("Finish Dispatch Detail Success", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
			} else {
				toast.error("Finish Dispatch Detail Failed", {
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
			toast.error("Finish Dispatch Detail Failed", {
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
			<Formik
				initialValues={{ ...data }}
				// validationSchema={sumarySchema}
				onSubmit={(values) => {
					editDispatch(values);
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
									value={
										values.dispacth_date === null
											? new Date()
											: values.dispacth_date
									}
									onChange={(value: any) =>
										setFieldValue("dispacth_date", value)
									}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								<InputSelect
									id='srId'
									name='srId'
									placeholder='Summary'
									label='Summary Report'
									onChange={(event: any) => {
										if (event.target.value !== "no data") {
											let data = JSON.parse(event.target.value);
											setFieldValue("srId", data.id);
										}
									}}
									required={true}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
								>
									<option value='no data' selected>
										Choose Summary Report
									</option>
									{listSchedule.length === 0 ? (
										<option value='no data'>No Data Summary Report</option>
									) : (
										listSchedule.map((res: any, i: number) => {
											return (
												<option
													value={JSON.stringify(res)}
													key={i}
													selected={res.id === dataDispatch.srId}
												>
													{res.id_summary} - {res.timeschedule.wor.job_no}
												</option>
											);
										})
									)}
								</InputSelect>
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
									value={dateWor === "" ? new Date() : new Date(dateWor)}
									withLabel={true}
									className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pl-11 outline-primary-600'
									classNameIcon='absolute inset-y-0 left-0 flex items-center pl-3 z-20'
								/>
							</div>
							<div className='w-full'>
								<InputDate
									id='date_of_summary'
									label='Finish Date'
									value={dateFinish === "" ? new Date() : new Date(dateFinish)}
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
												<option
													value={JSON.stringify(res)}
													key={i}
													selected={res.name_part === partName}
												>
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
										<Section className='grid md:grid-cols-6 sm:grid-cols-3 xs:grid-cols-1 gap-2 mt-2'>
											<div className='w-full'>
												<InputSelect
													id={`worker_${idx}`}
													name='worker'
													placeholder='Worker Center'
													label='Worker Center'
													required={true}
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
													minDate={dateWor}
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
											<div className='w-full'>
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
														listEmploye
															.filter((employe: any) => {
																return (
																	employe.sub_depart.id === dataDetail.subdepId
																);
															})
															.map((res: any, i: number) => {
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
											</div>
											<div className='w-full p-5'>
												{dataDetail.approvebyID === null ||
												dataDetail.approvebyID === "" ? (
													<div className="flex">
														<button
															type='button'
															className={`p-2 w-full my-1.5 text-center rounded-md border border-transparent ${
																dataDetail.actual === null ||
																dataDetail.actual === ""
																	? "bg-green-500 hover:bg-green-400"
																	: "bg-red-500 hover:bg-red-400"
															} text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
															onClick={() =>
																dataDetail.actual === null ||
																dataDetail.actual === ""
																	? startDetail(dataDetail.id, false)
																	: finishDetail(dataDetail.id)
															}
														>
															{dataDetail.actual === null ||
															dataDetail.actual === ""
																? "Start"
																: "Finish"}
														</button>
														{ dataDetail.actual === null || dataDetail.actual === "" ? (
															<button
															type='button'
															className={`p-2 w-full my-1.5 text-center rounded-md border border-transparent bg-blue-500 hover:bg-blue-400 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer mr-3`}
															onClick={() =>
																dataDetail.actual === null ||
																dataDetail.actual === ""
																	? startDetail(dataDetail.id, true)
																	: finishDetail(dataDetail.id)
															}
														>
															SO
														</button>
														) : null}
													</div>
												) : (
													""
													// <Input
													// 	id='approve'
													// 	name='approve'
													// 	placeholder='Approve'
													// 	label='Approve By'
													// 	type='text'
													// 	value={dataDetail.approve.employee_name}
													// 	disabled={true}
													// 	required={true}
													// 	withLabel={true}
													// 	className='bg-white border border-primary-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 outline-primary-600'
													// />
												)}
											</div>
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
												<Trash2 size={18} className='mr-1 mt-1' /> Remove Detail
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
		</div>
	);
};
