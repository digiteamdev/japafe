import { Axios } from '../../../configs/axios/';

export const UploadImageSummary = (data: any) => Axios.post(process.env.BASE_URL+'/summaryImg', data);
export const AddSummary = (data: any) => Axios.post(process.env.BASE_URL+'/summary', data);
export const GetSummary = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/summary?page=${page}&limit=${perpage}`);
export const GetAllSummary = () => Axios.get(process.env.BASE_URL+`/summary`);
export const DeleteSummary = (id: string) => Axios.delete(process.env.BASE_URL+`/summary/${id}`);
export const EditSummary = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/summary/${id}`, data);
export const EditSummaryDetail = (data: any) => Axios.put(process.env.BASE_URL+`/summaryDetail`, data);

export const GetSummaryBillOfMaterial = () => Axios.get(process.env.BASE_URL+`/srBom`);