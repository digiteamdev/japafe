import { Axios } from '../../../configs/axios/';

export const AddPrSr = (data: any) => Axios.put(process.env.BASE_URL+'/srPR', data);
export const EditPrSr = (data: any) => Axios.put(process.env.BASE_URL+'/srPsR', data);
export const GetPurchaseSR = (page: number, perpage: number, type: string) => Axios.get(process.env.BASE_URL+`/srPR?page=${page}&limit=${perpage}&type=${type}`);
export const GetAllSRPo = (type: string) => Axios.get(process.env.BASE_URL+`/srPR?type=${type}`);
export const ApprovalPrSr = (id: any, data: any) => Axios.put(process.env.BASE_URL+`/psrStatusMgr/${id}`, data);
export const DeletePurchaseSR = (id: string) => Axios.delete(process.env.BASE_URL+`/srPR/${id}`);
export const SearchPurchaseSR = (page: number, perpage: number, search: string, type: string) => Axios.get(process.env.BASE_URL+`/srPR?page=${page}&limit=${perpage}&search=${search}&type=${type}`);