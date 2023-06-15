import { Axios } from '../../../configs/axios/';

export const UploadImageSummary = (data: any) => Axios.post(process.env.BASE_URL+'/summaryImg', data);
export const AddSummary = (data: any) => Axios.post(process.env.BASE_URL+'/summary', data);
export const GetSummary = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/summary?page=${page}&limit=${perpage}`);
export const DeleteSummary = (id: string) => Axios.delete(process.env.BASE_URL+`/summary/${id}`);