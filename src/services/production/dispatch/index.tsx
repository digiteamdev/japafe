import { Axios } from '../../../configs/axios/';

export const AddDispatch = (data: any) => Axios.post(process.env.BASE_URL+'/dispacth', data);
export const GetDispatch = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/dispacth?page=${page}&limit=${perpage}`);