import { Axios } from '../../../configs/axios/';

export const GetPurchase = () => Axios.get(process.env.BASE_URL+`/poandsoAll`);
export const AddPurchaseReceive = (data: any) => Axios.put(process.env.BASE_URL+'/poandsoReceive', data);
export const GetAllReceive = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/poandsoReceive?page=${page}&limit=${perpage}`);
export const GetReceive = () => Axios.get(process.env.BASE_URL+`/poandsoReceive`);
export const SearchReceive = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/poandsoReceive?page=${page}&limit=${perpage}&search=${search}`);