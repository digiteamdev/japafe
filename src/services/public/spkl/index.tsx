import { Axios } from '../../../configs/axios/';

export const GetSpkl = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/spkl?page=${page}&limit=${perpage}${search !== '' ? `&search=${search}` : ''}`);
export const AddSpkl = (data: any) => Axios.post(process.env.BASE_URL+'/createSpkl', data);
export const DeleteSpkl = (id: string) => Axios.delete(process.env.BASE_URL+`/timesheetSpkl/${id}`);