import { Axios } from '../../../configs/axios/';

export const AddPoMr = (data: any) => Axios.post(process.env.BASE_URL+'/poandso', data);
export const EditPoMr = (data: any) => Axios.put(process.env.BASE_URL+'/poandsoTermOfPay', data);
export const GetPoMr = (page: number, perpage: number, type: string) => Axios.get(process.env.BASE_URL+`/poandsoAll?page=${page}&limit=${perpage}&type=${type}`);
export const GetAllPoMr = (page: any, perpage: any, type: string) => Axios.get(process.env.BASE_URL+`/poandso?${page ? `page=${page}&limit=${perpage}&` : ''}type=${type}`);
export const ApprovalPoMr = (id: any) => Axios.put(process.env.BASE_URL+`/poandsoStatus/${id}`);
export const DeletePoMr = (data: any) => Axios.post(process.env.BASE_URL+`/poandsoTermOfPay`, data);
export const SearchPoMR = (page: number, perpage: number, search: string, type: string) => Axios.get(process.env.BASE_URL+`/poandsoAll?page=${page}&limit=${perpage}&search=${search}&type=${type}`);
export const PdfPo = (id: any) => Axios.post(process.env.BASE_URL+`/pdfPo/${id}`);

export const GetDirrectPurchase = (page: number, perpage: number, type: string) => Axios.get(process.env.BASE_URL+`/listdirect?page=${page}&limit=${perpage}&type=${type}`);
export const SearchDirrectPurchase = (page: number, perpage: number, search: string, type: string) => Axios.get(process.env.BASE_URL+`/listdirect?page=${page}&limit=${perpage}&type=${type}&search=${search}`);