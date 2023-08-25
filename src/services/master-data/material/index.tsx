import { Axios } from '../../../configs/axios';

//Material Type
export const AddMaterialType = (data: any) => Axios.post(process.env.BASE_URL+'/groupMaterial', data);
export const GetMaterialType = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/groupMaterial?page=${page}&limit=${perpage}`);
export const GetAllMaterialType = () => Axios.get(process.env.BASE_URL+`/groupMaterial`);
export const EditMaterialType = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/groupMaterial/${id}`, data);
export const DeleteMaterialType = (id: string) => Axios.delete(process.env.BASE_URL+`/groupMaterial/${id}`);
export const SearchMaterialType = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/groupMaterial?page=${page}&limit=${perpage}&search=${search}`);

//Material
export const AddMaterial = (data: any) => Axios.post(process.env.BASE_URL+'/masterMaterial', data);
export const GetMaterial = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/masterMaterial?page=${page}&limit=${perpage}`);
export const GetAllMaterial = () => Axios.get(process.env.BASE_URL+`/masterMaterial`);
export const EditMaterial = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/masterMaterial/${id}`, data);
export const DeleteMaterial = (id: string) => Axios.delete(process.env.BASE_URL+`/masterMaterial/${id}`);
export const SearchMaterial = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/masterMaterial?page=${page}&limit=${perpage}&search=${search}`);

//Material Stock
export const AddMaterialStock = (data: any) => Axios.post(process.env.BASE_URL+'/stockMaterial', data);