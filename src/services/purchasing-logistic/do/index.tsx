import { Axios } from '../../../configs/axios/';

export const AddDo = (data: any) => Axios.post(process.env.BASE_URL+'/do', data);
export const GetDo = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/do?page=${page}&limit=${perpage}&search=${search}`);
export const ApproveDo = (id: string) => Axios.put(process.env.BASE_URL+`/approvedo/${id}`);