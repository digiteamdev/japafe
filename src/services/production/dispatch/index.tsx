import { Axios } from '../../../configs/axios/';

export const AddDispatch = (data: any) => Axios.post(process.env.BASE_URL+'/dispacth', data);
export const GetDispatch = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/dispacth?page=${page}&limit=${perpage}`);
export const SearchDispatch = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/dispacth?page=${page}&limit=${perpage}&search=${search}`);
export const GetAllDispatch = () => Axios.get(process.env.BASE_URL+`/dispacth`);
export const DeleteDispatch = (id: string) => Axios.delete(process.env.BASE_URL+`/dispacth/${id}`);
export const EditDispatch = (id: string,data: any) => Axios.put(process.env.BASE_URL+`/dispacth/${id}`, data);
export const EditDispatchDetail = (data: any) => Axios.put(process.env.BASE_URL+`/dispacthDetail`, data);
export const DeleteDispatchDetail = (id: string) => Axios.delete(process.env.BASE_URL+`/dispacthDetail/${id}`);
export const DispatchDetailStart = (id: string,data: any) => Axios.put(process.env.BASE_URL+`/dispacthstart/${id}`, data);
export const DispatchDetailFinish = (id: string,data: any) => Axios.put(process.env.BASE_URL+`/dispacthfinish/${id}`, data);
export const GetSummaryDispatch = () => Axios.get(process.env.BASE_URL+`/sumarryDispacth`);