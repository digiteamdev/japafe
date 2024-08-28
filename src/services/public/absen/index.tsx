import { Axios } from '../../../configs/axios/';

export const AddAbsensi = (data: any) => Axios.post(process.env.BASE_URL+'/absen', data);
export const GetAbsensi = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/absen?page=${page}&limit=${perpage}`);