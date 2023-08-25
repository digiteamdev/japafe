import { Axios } from '../../../configs/axios/';

export const AddMaterialStocks = (data: any) => Axios.post(process.env.BASE_URL+'/typemr', data);
export const GetMaterialStock = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/typemr?page=${page}&limit=${perpage}`);