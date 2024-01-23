import { Axios } from '../../../configs/axios/';

export const GetCashAdvances = () => Axios.get(process.env.BASE_URL+`/cashAdv`);
export const GetSpjCahsAdvance = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/SPJ?page=${page}&limit=${perpage}`);
export const AddSpjCashAdvance = (id: string, data: any) => Axios.put(process.env.BASE_URL+`/SPJ/${id}`, data);