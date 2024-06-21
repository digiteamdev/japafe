import { Axios } from '../../../configs/axios/';

// export const GetBom = () => Axios.get(process.env.BASE_URL+`/mrBom`);
export const AddTimeSheet = (data: any) => Axios.post(process.env.BASE_URL+'/timesheet', data);
export const GetTimeSheet = (page: number, perpage: number, type: string) => Axios.get(process.env.BASE_URL+`/timesheet?page=${page}&limit=${perpage}`+`${type === "" ? '' : `&type=${type}`}`);
export const GetTimeSheetHrd = (page: number, perpage: number, type: string, userId: string, dateStar: string, dateEnd: string) => Axios.get(process.env.BASE_URL+`/timesheetHrd?page=${page}&limit=${perpage}${userId === "" ? "" : `&userId=${userId}`}${type === "" ? "" : `&type=${type}`}${dateStar === "" ? "" : `&dateStar=${dateStar}`}${dateEnd === "" ? "" : `&dateEnd=${dateEnd}`}`);
export const SearchTimeSheet = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/timesheet?page=${page}&limit=${perpage}&search=${search}`);
export const DeleteTimeSheet = (id: string) => Axios.delete(process.env.BASE_URL+`/timesheet/${id}`);
export const EditTimeSheet = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/timesheet/${id}`, data);
export const GetTimeSheetCsv = (type: string, userId: string, dateStar: string, dateEnd: string) => Axios.get(process.env.BASE_URL+`/timesheetCsv?${userId === "" ? "" : `&userId=${userId}`}${type === "" ? "" : `&type=${type}`}${dateStar === "" ? "" : `&dateStar=${dateStar}`}${dateEnd === "" ? "" : `&dateEnd=${dateEnd}`}`);