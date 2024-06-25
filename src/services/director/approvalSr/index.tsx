import { Axios } from '../../../configs/axios/';

export const GetApprovalSrDirector = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/directorApprovalSR?page=${page}&limit=${perpage}`);
export const GetAllApprovalSr = () => Axios.get(process.env.BASE_URL+`/directorApprovalSR`);
export const ApprovalDirectorSr = (id: string, data:any) => Axios.put(process.env.BASE_URL+`/srApprove/${id}`, data);