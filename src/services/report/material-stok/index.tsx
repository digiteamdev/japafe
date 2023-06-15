import { Axios } from '../../../configs/axios/';

export const AddMaterial = (data: any) => Axios.post(process.env.BASE_URL+'/typemr', data);
export const GetMaterial = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/typemr?page=${page}&limit=${perpage}`);