import { Axios } from '../../../configs/axios/';

export const GetWor = (page: number, perpage: number, divisi: string) => Axios.get(process.env.BASE_URL+`/wor?page=${page}&limit=${perpage}&divisi=${divisi}`);
export const GetAllWor = () => Axios.get(process.env.BASE_URL+`/wor`);
export const GetAllWorValid = () => Axios.get(process.env.BASE_URL+`/wor?status=valid`);
export const SearchWor = (page: number, perpage: number, search: string, divisi: string) => Axios.get(process.env.BASE_URL+`/wor?page=${page}&limit=${perpage}&search=${search}&divisi=${divisi}`);
export const AddWor = (data: any) => Axios.post(process.env.BASE_URL+'/wor', data);
export const EditWor = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/wor/${id}`, data);
export const DeleteWor = (id: string) => Axios.delete(process.env.BASE_URL+`/wor/${id}`);
export const ValidateWor = (id: string) => Axios.put(process.env.BASE_URL+`/worStatus/${id}`);
export const GetAllWorSchedule = () => Axios.get(process.env.BASE_URL+`/worTime`);
export const GetWorJobStatus = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/jobStatus?page=${page}&limit=${perpage}`);
export const SearchJobStatus = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/jobStatus?page=${page}&limit=${perpage}&search=${search}`);