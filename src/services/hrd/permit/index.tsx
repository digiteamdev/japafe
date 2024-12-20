import { Axios } from '../../../configs/axios/';

export const GetPermit = (page: any, perpage: any, search: string) => Axios.get(process.env.BASE_URL+`/masterpermit?${page ? `page=${page}` : ''} ${ perpage ? `&limit=${perpage}` : null }&search=${search}`);
export const AddPermit = (data: any) => Axios.post(process.env.BASE_URL+'/masterpermit', data);
export const EditPermit = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/masterpermit/${id}`, data);
export const DeletePermit = (id: string) => Axios.delete(process.env.BASE_URL+`/masterpermit/${id}`);
export const GetPermitHrd = (page: any, perpage: any, search: string) => Axios.get(process.env.BASE_URL+`/permitHrd?${page ? `page=${page}` : ''} ${ perpage ? `&limit=${perpage}` : null }&search=${search}`);