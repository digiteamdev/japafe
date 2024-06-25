import { Axios } from '../../../configs/axios/';

// export const GetBom = () => Axios.get(process.env.BASE_URL+`/mrBom`);
export const AddSr = (data: any) => Axios.post(process.env.BASE_URL+'/SR', data);
export const GetSr = (page: number, perpage: number, statusSr: string) => Axios.get(process.env.BASE_URL+`/SR?page=${page}&limit=${perpage}${statusSr !== 'all' ? `&statusSr=${statusSr}` : ''}`);
export const GetSrId = (id: string) => Axios.get(process.env.BASE_URL+`/SR/${id}`);
export const SearchSr = (page: number, perpage: number, search: string, statusSr: string) => Axios.get(process.env.BASE_URL+`/SR?page=${page}&limit=${perpage}&search=${search}${statusSr !== 'all' ? `&statusSr=${statusSr}` : ''}`);
export const DeleteSr = (id: string) => Axios.delete(process.env.BASE_URL+`/SR/${id}`);
export const EditSR = (data: any) => Axios.put(process.env.BASE_URL+`/SR`, data);
export const DeleteSRDetail = (id: string) => Axios.delete(process.env.BASE_URL+`/SRdetail/${id}`);
export const ApproveSrSpv = (id: string) => Axios.put(process.env.BASE_URL+`/SRstatusSpv/${id}`);
export const ApproveSrManager = (id: string) => Axios.put(process.env.BASE_URL+`/SRstatusManager/${id}`);