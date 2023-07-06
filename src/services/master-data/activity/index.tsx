import { Axios } from '../../../configs/axios/';

export const AddActivity = (data: any) => Axios.post(process.env.BASE_URL+'/masterAktivitas', data);
export const GetActivity = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/masterAktivitas?page=${page}&limit=${perpage}`);
export const GetAllActivity = () => Axios.get(process.env.BASE_URL+`/masterAktivitas`);
export const EditActivity = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/masterAktivitas/${id}`, data);
export const DeleteActivity = (id: string) => Axios.delete(process.env.BASE_URL+`/masterAktivitas/${id}`);
export const SearchActivity = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/masterAktivitas?page=${page}&limit=${perpage}&search=${search}`);