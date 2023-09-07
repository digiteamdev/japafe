import { Axios } from '../../../configs/axios/';

// export const GetBom = () => Axios.get(process.env.BASE_URL+`/mrBom`);
export const AddSr = (data: any) => Axios.post(process.env.BASE_URL+'/SR', data);
export const GetSr = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/SR?page=${page}&limit=${perpage}`);
export const DeleteSr = (id: string) => Axios.delete(process.env.BASE_URL+`/SR/${id}`);
// export const EditMR = (data: any) => Axios.put(process.env.BASE_URL+`/MR`, data);
// export const DeleteMRDetail = (id: string) => Axios.delete(process.env.BASE_URL+`/MRdetail/${id}`);