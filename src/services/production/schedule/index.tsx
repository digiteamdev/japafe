import { Axios } from '../../../configs/axios/';

export const AddSchedule = (data: any) => Axios.post(process.env.BASE_URL+'/timeschedule', data);
export const GetSchedule = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/timeschedule?page=${page}&limit=${perpage}`);
export const GetAllSchedule = () => Axios.get(process.env.BASE_URL+`/timeschedule`);
export const DeleteSchedule = (id: string) => Axios.delete(process.env.BASE_URL+`/timeschedule/${id}`);
export const DeleteScheduleActivity = (id: string) => Axios.delete(process.env.BASE_URL+`/timescheduleActivity/${id}`);
export const EditSchedule = (id: string,data: any) => Axios.put(process.env.BASE_URL+`/timeschedule/${id}`, data);
export const EditScheduleAktivity = (data: any) => Axios.put(process.env.BASE_URL+`/timeschedule`, data);
export const SearchSchedule = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/timeschedule?page=${page}&limit=${perpage}&search=${search}`);