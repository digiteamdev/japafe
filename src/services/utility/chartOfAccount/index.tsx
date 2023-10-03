import { Axios } from '../../../configs/axios/';

export const AddCoa = (data: any) => Axios.post(process.env.BASE_URL+'/coa', data);
export const GetCoa = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/coa?page=${page}&limit=${perpage}`);
export const GetAllCoa = () => Axios.get(process.env.BASE_URL+`/coa`);
export const EditCoa = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/coa/${id}`, data);
export const DeleteCoa = (id: string) => Axios.delete(process.env.BASE_URL+`/coa/${id}`);
export const SearchCoa = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/coa?page=${page}&limit=${perpage}&search=${search}`);