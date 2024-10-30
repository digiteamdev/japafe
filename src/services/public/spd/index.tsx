import { Axios } from '../../../configs/axios/';

export const GetSpd = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/spd?${ page > 0 ? `page=${page}` : '' }${perpage > 0 ? `&limit=${perpage}` : ''}${search !== '' ? `&search=${search}` : ''}`);
export const AddSpd = (data: any) => Axios.post(process.env.BASE_URL+'/spd', data);
export const DeleteSpd = (id: string) => Axios.delete(process.env.BASE_URL+`/spd/${id}`);
export const EditSpd = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/spd/${id}`, data);