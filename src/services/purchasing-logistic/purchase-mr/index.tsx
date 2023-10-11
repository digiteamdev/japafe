import { Axios } from '../../../configs/axios/';

export const AddPrMr = (data: any) => Axios.put(process.env.BASE_URL+'/mrPR', data);
export const EditPrMr = (data: any) => Axios.put(process.env.BASE_URL+'/mrPrdetail', data);
export const GetPurchaseMR = (page: number, perpage: number, type: string) => Axios.get(process.env.BASE_URL+`/mrPR?page=${page}&limit=${perpage}&type=${type}`);
export const GetAllMRPo = (type: string) => Axios.get(process.env.BASE_URL+`/mrPR?type=${type}`);
export const ApprovalPrMr = (id: any, data: any) => Axios.put(process.env.BASE_URL+`/prStatusMgr/${id}`, data);
export const DeletePurchaseMR = (id: string) => Axios.delete(process.env.BASE_URL+`/mrPR/${id}`);
export const SearchPurchaseMR = (page: number, perpage: number, search: string, type: string) => Axios.get(process.env.BASE_URL+`/mrPR?page=${page}&limit=${perpage}&search=${search}&type=${type}`);