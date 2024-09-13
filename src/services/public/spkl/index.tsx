import { Axios } from '../../../configs/axios/';

export const GetSpkl = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/spkl`);
export const AddSpkl = (data: any) => Axios.post(process.env.BASE_URL+'/createSpkl', data);