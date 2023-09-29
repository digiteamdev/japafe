import { Axios } from '../../../configs/axios/';

// export const AddActivity = (data: any) => Axios.post(process.env.BASE_URL+'/masterAktivitas', data);
export const GetApprovalMr = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/MRapprove?page=${page}&limit=${perpage}`);
export const GetMrValid = () => Axios.get(process.env.BASE_URL+`/MRapprove`);
export const ApprovalMr = (data: any) => Axios.put(process.env.BASE_URL+`/MRapprove`, data);
// export const DeleteActivity = (id: string) => Axios.delete(process.env.BASE_URL+`/masterAktivitas/${id}`);
export const SearchApprovalMr = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/MRapprove?page=${page}&limit=${perpage}&search=${search}`);