import { Axios } from '../../../configs/axios/';

// export const AddActivity = (data: any) => Axios.post(process.env.BASE_URL+'/masterAktivitas', data);
export const GetPurchaseMR = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/mrPR?page=${page}&limit=${perpage}`);
export const GetAllPurchaseMR = () => Axios.get(process.env.BASE_URL+`/mrPR`);
// export const GetSrValid = () => Axios.get(process.env.BASE_URL+`/SRapprove`);
// export const ApprovalSr = (data: any) => Axios.put(process.env.BASE_URL+`/SRapprove`, data);
export const DeletePurchaseMR = (id: string) => Axios.delete(process.env.BASE_URL+`/mrPR/${id}`);
export const SearchPurchaseMR = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/mrPR?page=${page}&limit=${perpage}&search=${search}`);