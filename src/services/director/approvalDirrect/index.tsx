import { Axios } from '../../../configs/axios/';

export const GetApprovalDirrect = (page: number, perpage: number, type: string) => Axios.get(process.env.BASE_URL+`/directorApprovalDirect?page=${page}&limit=${perpage}&type=${type}`);
export const ApprovalDirrect = (id: string, data:any) => Axios.put(process.env.BASE_URL+`/directorApprovalDMR/${id}`, data);