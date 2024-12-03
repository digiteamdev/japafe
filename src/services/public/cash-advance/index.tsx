import { Axios } from '../../../configs/axios/';

export const GetEmployeCash = () => Axios.get(process.env.BASE_URL+`/cashAdvEmployee`);
export const GetWorCash = () => Axios.get(process.env.BASE_URL+`/cashAdvWor`);
export const GetListCashAdvance = () => Axios.get(process.env.BASE_URL+`/cdvPurchase`);
export const AddCashAdvance = (data: any) => Axios.post(process.env.BASE_URL+'/cashAdv', data);
export const EditCashAdvance = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/cashAdv/${id}`, data);
export const GetCashAdvance = (page: any, perpage: any) => Axios.get(process.env.BASE_URL+`/cashAdv?${page ? `page=${page}&limit=${perpage}` : ''}`);
export const SearchCashAdvance = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/cashAdv?page=${page}&limit=${perpage}&search=${search}`);
export const ApproveCashSpv = (id: string) => Axios.put(process.env.BASE_URL+`/cashAdvStatusSpv/${id}`);
export const ApproveCashManager = (id: string) => Axios.put(process.env.BASE_URL+`/cashAdvStatusMgr/${id}`);
export const DeleteCashAdvance = (id: string) => Axios.delete(process.env.BASE_URL+`/cashAdv/${id}`);