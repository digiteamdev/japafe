import { Axios } from '../../../configs/axios/';

export const GetPo = (page: number, perpage: number, divisi: string) => Axios.get(process.env.BASE_URL+`/customerPo?page=${page}&limit=${perpage}&divisi=${divisi}`);
export const GetAllPo = (divisi: string) => Axios.get(process.env.BASE_URL+`/customerPo?divisi=${divisi}`);
export const SearchPo = (page: number, perpage: number, search: string, divisi: string) => Axios.get(process.env.BASE_URL+`/customerPo?page=${page}&limit=${perpage}&search=${search}&divisi=${divisi}`);
export const AddPo = (data: any) => Axios.post(process.env.BASE_URL+'/customerPo', data);
export const EditPo = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/customerPo/${id}`, data);
export const DeletePo = (id: string) => Axios.delete(process.env.BASE_URL+`/po/${id}`);

//detail PO
export const EditPoDetail = (data: any) => Axios.put(process.env.BASE_URL+`/customerPoDetail`, data);
export const DeletePoDetail = (id: string) => Axios.delete(process.env.BASE_URL+`/customerPoDetail/${id}`);

//term of payment PO
export const EditPoPayment = (data: any) => Axios.put(process.env.BASE_URL+`/customerPoTermOfPay`, data);
export const DeletePoPayment = (id: string) => Axios.delete(process.env.BASE_URL+`/customerPoTermOfPay/${id}`);