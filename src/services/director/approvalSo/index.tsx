import { Axios } from '../../../configs/axios/';

export const GetApprovalSo = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/directorApprovalSO`);
export const ApprovalSo = (id: string, data: any) => Axios.put(process.env.BASE_URL+`/directorApprovalSO/${id}`, data);
// export const GetAllApprovalSr = () => Axios.get(process.env.BASE_URL+`/directorApprovalSR`);
// export const ApprovalDirectorSr = (id: string, data:any) => Axios.put(process.env.BASE_URL+`/srApprove/${id}`, data);