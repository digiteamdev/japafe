import { Axios } from '../../../configs/axios/';

export const GetPermitEmployee = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/permit?${ page > 0 ? `page=${page}` : '' }${perpage > 0 ? `&limit=${perpage}` : ''}${search !== '' ? `&search=${search}` : ''}`);
export const AddPermitEmployee = (data: any) => Axios.post(process.env.BASE_URL+'/permit', data);
export const DeletePermitEmployee = (id: string) => Axios.delete(process.env.BASE_URL+`/permit/${id}`);
export const EditPermitEmployee = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/permit/${id}`, data);