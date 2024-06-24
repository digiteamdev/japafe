import { Axios } from '../../../configs/axios/';

export const GetApprovalMr = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/directorApprovalMR?page=${page}&limit=${perpage}`);
export const GetAllApprovalMr = () => Axios.get(process.env.BASE_URL+`/directorApprovalMR`);
export const SearchApprovalMr = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/directorApprovalMR?page=${page}&limit=${perpage}&search=${search}`);
export const ApprovalDirectorMr = (id: string, data:any) => Axios.put(process.env.BASE_URL+`/mrApprove/${id}`, data);