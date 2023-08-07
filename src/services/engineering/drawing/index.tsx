import { Axios } from '../../../configs/axios/';

export const AddDrawing = (data: any) => Axios.post(process.env.BASE_URL+'/drawing', data);
export const GetDrawing = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/drawing?page=${page}&limit=${perpage}`);
export const GetSchedulleDrawing = () => Axios.get(process.env.BASE_URL+`/tmsdrawing`);
// export const DeleteSummary = (id: string) => Axios.delete(process.env.BASE_URL+`/summary/${id}`);
// export const EditSummary = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/summary/${id}`, data);
// export const EditSummaryDetail = (data: any) => Axios.put(process.env.BASE_URL+`/summaryDetail`, data);