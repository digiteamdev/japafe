import { Axios } from '../../../configs/axios/';

export const AddMaterialStocks = (data: any) => Axios.post(process.env.BASE_URL+'/stockMaterial', data);
export const AddMaterialStockOne = (data: any) => Axios.post(process.env.BASE_URL+'/stock', data);
export const GetMaterialStock = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/stockMaterial?page=${page}&limit=${perpage}`);
export const SearchMaterialStock = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/stockMaterial?page=${page}&limit=${perpage}&search=${search}`);