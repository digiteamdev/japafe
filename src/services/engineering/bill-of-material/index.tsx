import { Axios } from '../../../configs/axios/';

export const AddBillOfMaterial = (data: any) => Axios.post(process.env.BASE_URL+'/bom', data);
export const GetBillOfMaterial = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/bom?page=${page}&limit=${perpage}`);
// export const GetSchedulleDrawing = () => Axios.get(process.env.BASE_URL+`/tmsdrawing`);
// export const DeleteSummary = (id: string) => Axios.delete(process.env.BASE_URL+`/summary/${id}`);
// export const EditSummary = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/summary/${id}`, data);
// export const EditSummaryDetail = (data: any) => Axios.put(process.env.BASE_URL+`/summaryDetail`, data);

// export const GetSummaryDrawing = () => Axios.get(process.env.BASE_URL+`/SummaryBom`);