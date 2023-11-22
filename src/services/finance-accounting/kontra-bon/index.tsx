import { Axios } from '../../../configs/axios/';

export const GetPurchaseReceive = () => Axios.get(process.env.BASE_URL+`/poandsoAll`);
export const AddKontraBon = (data: any) => Axios.post(process.env.BASE_URL+'/kontrabon', data);
export const GetKontraBon = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/kontrabonAll?page=${page}&limit=${perpage}`);
export const SearchKontraBon = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/kontrabonAll?page=${page}&limit=${perpage}&search=${search}`);
export const ApprovalKontraBon = (id: any) => Axios.put(process.env.BASE_URL+`/kontrabonValid/${id}`);
export const DeleteKontraBon = (id: string) => Axios.delete(process.env.BASE_URL+`/kontrabon/${id}`);
export const EditKontraBon = (id: string, data: any) => Axios.put(process.env.BASE_URL+`/kontrabon/${id}`, data);