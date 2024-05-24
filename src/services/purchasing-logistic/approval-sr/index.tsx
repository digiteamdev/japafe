import { Axios } from '../../../configs/axios/';

// export const AddActivity = (data: any) => Axios.post(process.env.BASE_URL+'/masterAktivitas', data);
export const GetApprovalSr = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/SRapprove?page=${page}&limit=${perpage}`);
export const GetSrValid = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/SRapprove?page=${page}&limit=${perpage}`);
export const GetDetailSr = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/detailSR?page=${page}&limit=${perpage}`);
export const ApprovalSr = (data: any) => Axios.put(process.env.BASE_URL+`/SRapprove`, data);
export const ApprovalEditSr = (data: any) => Axios.put(process.env.BASE_URL+`/detailSR`, data);
// export const DeleteActivity = (id: string) => Axios.delete(process.env.BASE_URL+`/masterAktivitas/${id}`);
export const SearchApprovalSr = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/SRapprove?page=${page}&limit=${perpage}&search=${search}`);