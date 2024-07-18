import { Axios } from '../../../configs/axios/';

export const GetApprovalPo = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/directorApprovalPurchase`);
export const ApprovalPo = (id: string, data: any) => Axios.put(process.env.BASE_URL+`/directorApprovalPO/${id}`, data);
// export const GetAllApprovalSr = () => Axios.get(process.env.BASE_URL+`/directorApprovalSR`);
// export const ApprovalDirectorSr = (id: string, data:any) => Axios.put(process.env.BASE_URL+`/srApprove/${id}`, data);