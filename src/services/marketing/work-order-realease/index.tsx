import { Axios } from '../../../configs/axios/';

export const GetWor = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/wor?page=${page}&limit=${perpage}`);
export const GetAllWor = () => Axios.get(process.env.BASE_URL+`/wor`);
export const SearchWor = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/wor?page=${page}&limit=${perpage}&search=${search}`);
export const AddWor = (data: any) => Axios.post(process.env.BASE_URL+'/wor', data);
export const EditWor = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/wor/${id}`, data);
export const DeleteWor = (id: string) => Axios.delete(process.env.BASE_URL+`/wor/${id}`);
export const ValidateWor = (id: string) => Axios.put(process.env.BASE_URL+`/worStatus/${id}`);