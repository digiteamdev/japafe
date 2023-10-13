import { Axios } from '../../../configs/axios/';

export const GetMRForApproval = () => Axios.get(process.env.BASE_URL+'/mrDetail');
export const GetApprovalRequest = (page: number, perpage: number, type: string) => Axios.get(process.env.BASE_URL+`/approvalRequest?page=${page}&limit=${perpage}&type=${type}`);
export const GetMrValid = () => Axios.get(process.env.BASE_URL+`/MRapprove`);
export const ApprovalMr = (data: any) => Axios.put(process.env.BASE_URL+`/MRapprove`, data);
export const ApprovalEditMr = (data: any) => Axios.put(process.env.BASE_URL+`/MRdetailUpdate`, data);
export const SearchApprovalRequest = (page: number, perpage: number, search: string, type: string) => Axios.get(process.env.BASE_URL+`/approvalRequest?page=${page}&limit=${perpage}&type=${type}&search=${search}`);