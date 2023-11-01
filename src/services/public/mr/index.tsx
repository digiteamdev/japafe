import { Axios } from '../../../configs/axios/';

export const GetBom = () => Axios.get(process.env.BASE_URL+`/mrBom`);
export const AddMr = (data: any) => Axios.post(process.env.BASE_URL+'/MR', data);
export const GetMr = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/MR?page=${page}&limit=${perpage}`);
export const SearchMr = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/MR?page=${page}&limit=${perpage}&search=${search}`);
export const DeleteMR = (id: string) => Axios.delete(process.env.BASE_URL+`/MR/${id}`);
export const EditMR = (data: any) => Axios.put(process.env.BASE_URL+`/MR`, data);
export const DeleteMRDetail = (id: string) => Axios.delete(process.env.BASE_URL+`/MRdetail/${id}`);
export const ApproveMrSpv = (id: string) => Axios.put(process.env.BASE_URL+`/MRStatusSpv/${id}`);
export const ApproveMrManager = (id: string) => Axios.put(process.env.BASE_URL+`/MRStatusManger/${id}`);