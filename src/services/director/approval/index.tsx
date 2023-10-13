import { Axios } from '../../../configs/axios/';

export const GetPurchaseApproval = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/directorApproval?page=${page}&limit=${perpage}`);
export const SearchPurchaseApproval = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/directorApproval?page=${page}&limit=${perpage}&search=${search}`);