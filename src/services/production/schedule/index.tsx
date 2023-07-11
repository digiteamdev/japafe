import { Axios } from '../../../configs/axios/';

export const AddSchedule = (data: any) => Axios.post(process.env.BASE_URL+'/timeschedule', data);
export const GetSchedule = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/timeschedule?page=${page}&limit=${perpage}`);