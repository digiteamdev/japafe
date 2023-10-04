import { Axios } from '../../../configs/axios/';

export const GetMRForApproval = () => Axios.get(process.env.BASE_URL+'/mrDetail');
export const GetApprovalMr = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/MRapprove?page=${page}&limit=${perpage}`);
export const GetMrValid = () => Axios.get(process.env.BASE_URL+`/MRapprove`);
export const ApprovalMr = (data: any) => Axios.put(process.env.BASE_URL+`/MRapprove`, data);
export const ApprovalEditMr = (data: any) => Axios.put(process.env.BASE_URL+`/MRdetailUpdate`, data);
export const SearchApprovalMr = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/MRapprove?page=${page}&limit=${perpage}&search=${search}`);