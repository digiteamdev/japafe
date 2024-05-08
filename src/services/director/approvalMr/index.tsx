import { Axios } from '../../../configs/axios/';

export const GetApprovalMr = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/directorApprovalMR?page=${page}&limit=${perpage}`);
export const ApprovalDirectorMr = (id: string, data:any) => Axios.put(process.env.BASE_URL+`/mrApprove/${id}`, data);