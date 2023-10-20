import { Axios } from '../../../configs/axios/';

export const AddPoMr = (data: any) => Axios.post(process.env.BASE_URL+'/poandso', data);
// export const EditPrMr = (data: any) => Axios.put(process.env.BASE_URL+'/mrPrdetail', data);
export const GetPoMr = (page: number, perpage: number, type: string) => Axios.get(process.env.BASE_URL+`/poandsoAll?page=${page}&limit=${perpage}&type=${type}`);
export const GetAllPoMr = (type: string) => Axios.get(process.env.BASE_URL+`/poandso?type=${type}`);
export const ApprovalPoMr = (id: any) => Axios.put(process.env.BASE_URL+`/poandsoStatus/${id}`);
// export const DeletePurchaseMR = (id: string) => Axios.delete(process.env.BASE_URL+`/mrPR/${id}`);
export const SearchPoMR = (page: number, perpage: number, search: string, type: string) => Axios.get(process.env.BASE_URL+`/poandsoAll?page=${page}&limit=${perpage}&search=${search}&type=${type}`);