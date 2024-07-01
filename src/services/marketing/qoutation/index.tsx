import { Axios } from '../../../configs/axios/';

export const GetQuotation = (page: number, perpage: number, divisi: string) => Axios.get(process.env.BASE_URL+`/quotation?page=${page}&limit=${perpage}&divisi=${divisi}`);
export const GetAllQuotation = (divisi: string) => Axios.get(process.env.BASE_URL+`/quotation?divisi=${divisi}`);
export const GetAllQuotationEdit = (id: string) => Axios.get(process.env.BASE_URL+`/quotation/${id}`);
export const SearchQuotation = (page: number, perpage: number, search: string, divisi: string) => Axios.get(process.env.BASE_URL+`/quotation?page=${page}&limit=${perpage}&search=${search}&divisi=${divisi}`);
export const AddQuotation = (data: any) => Axios.post(process.env.BASE_URL+'/quotation', data);
export const EditQuotation = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/quotation/${id}`, data);
export const DeleteQuotation = (id: string) => Axios.delete(process.env.BASE_URL+`/quotation/${id}`);
export const GetQuotationById = (id: string) => Axios.get(process.env.BASE_URL+`/quotationByid/${id}`);

//Detail
export const EditQuotationDetail = (data: any) => Axios.put(process.env.BASE_URL+`/quotationDetail`, data);
export const DeleteQuotationDetail = (id: string) => Axios.delete(process.env.BASE_URL+`/quotationDetail/${id}`);

//Item
export const EditQuotationItem = (data: any) => Axios.put(process.env.BASE_URL+`/quotationEqPart`, data);
export const DeleteQuotationItem = (id: string) => Axios.delete(process.env.BASE_URL+`/quotationEqPart/${id}`);