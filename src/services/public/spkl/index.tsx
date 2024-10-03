import { Axios } from '../../../configs/axios/';

export const GetSpkl = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/spkl?${ page > 0 ? `page=${page}` : '' }${perpage > 0 ? `&limit=${perpage}` : ''}${search !== '' ? `&search=${search}` : ''}`);
export const AddSpkl = (data: any) => Axios.post(process.env.BASE_URL+'/createSpkl', data);
export const DeleteSpkl = (id: string) => Axios.delete(process.env.BASE_URL+`/timesheetSpkl/${id}`);
export const EditSpkl = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/timesheetSpkl/${id}`, data);