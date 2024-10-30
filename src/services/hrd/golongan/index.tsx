import { Axios } from '../../../configs/axios/';

export const GetGolongan = (page: any, perpage: any, search: string) => Axios.get(process.env.BASE_URL+`/gapok?${page ? `page=${page}` : ''} ${ perpage ? `&limit=${perpage}` : null }&search=${search}`);
export const AddGolongan = (data: any) => Axios.post(process.env.BASE_URL+'/gapok', data);
export const EditGolongan = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/gapok/${id}`, data);
export const DeleteGolongan = (id: string) => Axios.delete(process.env.BASE_URL+`/gapok/${id}`);