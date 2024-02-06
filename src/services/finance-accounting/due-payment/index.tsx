import { Axios } from '../../../configs/axios/';

export const GetAllKontra = () => Axios.get(process.env.BASE_URL+`/duedate`);
export const ReSchedulleKontrabon = (id: string, data: any) => Axios.put(process.env.BASE_URL+`/duedate/${id}`, data);
export const AddDueDate = (data: any) => Axios.put(process.env.BASE_URL+'/duedatevalid', data);
export const GetDuePayment = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/duedate?page=${page}&limit=${perpage}`);
// export const SearchCashier = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/cashier?page=${page}&limit=${perpage}&search=${search}`);
// export const DeleteCashier = (id: string) => Axios.delete(process.env.BASE_URL+`/cashier/${id}`);
// export const ApprovalCashier = (id: any) => Axios.put(process.env.BASE_URL+`/cashierValid/${id}`);