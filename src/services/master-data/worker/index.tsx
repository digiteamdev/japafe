import { Axios } from '../../../configs/axios/';

export const AddWorkerCenter = (data: any) => Axios.post(process.env.BASE_URL+'/workcenter', data);
export const GetWorkerCenter = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/workcenter?page=${page}&limit=${perpage}`);
export const GetAllWorkerCenter = () => Axios.get(process.env.BASE_URL+`/workcenter`);
export const EditWorkerCenter = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/workcenter/${id}`, data);
export const DeleteWorkerCenter = (id: string) => Axios.delete(process.env.BASE_URL+`/workcenter/${id}`);
export const SearchWorkerCenter = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/workcenter?page=${page}&limit=${perpage}&search=${search}`);