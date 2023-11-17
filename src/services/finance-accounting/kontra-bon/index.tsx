import { Axios } from '../../../configs/axios/';

export const GetPurchaseReceive = () => Axios.get(process.env.BASE_URL+`/poandsoAll`);
export const AddKontraBon = (data: any) => Axios.post(process.env.BASE_URL+'/kontrabon', data);
export const GetKontraBon = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/kontrabonAll?page=${page}&limit=${perpage}`);