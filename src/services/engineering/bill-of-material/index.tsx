import { Axios } from '../../../configs/axios/';

export const AddBillOfMaterial = (data: any) => Axios.post(process.env.BASE_URL+'/bom', data);
export const GetBillOfMaterial = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/bom?page=${page}&limit=${perpage}`);
export const SearchBillOfMaterial = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/bom?page=${page}&limit=${perpage}&search=${search}`);
export const EditBillOfMaterial = (data: any) => Axios.put(process.env.BASE_URL+`/bom`, data);
export const DeleteDetailBillOfMaterial = (id: string) => Axios.delete(process.env.BASE_URL+`/bomDetail/${id}`);
export const DeleteBillOfMaterial = (id: string) => Axios.delete(process.env.BASE_URL+`/bom/${id}`);
// export const GetSchedulleDrawing = () => Axios.get(process.env.BASE_URL+`/tmsdrawing`);
// export const EditSummaryDetail = (data: any) => Axios.put(process.env.BASE_URL+`/summaryDetail`, data);

// export const GetSummaryDrawing = () => Axios.get(process.env.BASE_URL+`/SummaryBom`);