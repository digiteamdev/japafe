import { Axios } from '../../../configs/axios/';

export const GetPermit = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/masterpermit?page=${page}&limit=${perpage}&search=${search}`);
export const AddPermit = (data: any) => Axios.post(process.env.BASE_URL+'/masterpermit', data);
export const EditPermit = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/masterpermit/${id}`, data);
export const DeletePermit = (id: string) => Axios.delete(process.env.BASE_URL+`/masterpermit/${id}`);