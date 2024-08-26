import { Axios } from '../../../configs/axios/';

export const AddAbsensi = (data: any) => Axios.post(process.env.BASE_URL+'/absen', data);
export const GetAbsensi = () => Axios.get(process.env.BASE_URL+'/absen');