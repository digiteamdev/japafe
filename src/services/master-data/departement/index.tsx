import { Axios } from '../../../configs/axios/';

export const GetDepartement = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/depart?page=${page}&limit=${perpage}`);
export const GetAllDepartement = () => Axios.get(process.env.BASE_URL+`/depart`);
export const SearchDepartement = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/depart?page=${page}&limit=${perpage}&search=${search}`);
export const AddDepartement = (data: {name: string}) => Axios.post(process.env.BASE_URL+'/depart', data);
export const EditDepartement = (data: any) => Axios.put(process.env.BASE_URL+`/depart`, data);
export const DeleteDepartement = (id: string) => Axios.delete(process.env.BASE_URL+`/depart/${id}`);

//sub depart
export const DeleteSubDepartement = (id: string) => Axios.delete(process.env.BASE_URL+`/subdepart/${id}`);