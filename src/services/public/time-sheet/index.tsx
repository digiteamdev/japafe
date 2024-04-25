import { Axios } from '../../../configs/axios/';

// export const GetBom = () => Axios.get(process.env.BASE_URL+`/mrBom`);
export const AddTimeSheet = (data: any) => Axios.post(process.env.BASE_URL+'/timesheet', data);
export const GetTimeSheet = (page: number, perpage: number, type: string) => Axios.get(process.env.BASE_URL+`/timesheet?page=${page}&limit=${perpage}`+`${type === "" ? '' : `&type=${type}`}`);
export const SearchTimeSheet = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/timesheet?page=${page}&limit=${perpage}&search=${search}`);
export const DeleteTimeSheet = (id: string) => Axios.delete(process.env.BASE_URL+`/timesheet/${id}`);
export const EditTimeSheet = (data: any) => Axios.put(process.env.BASE_URL+`/timesheet`, data);