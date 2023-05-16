import { Axios } from '../../../configs/axios/';

export const GetUser = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/user?page=${page}&limit=${perpage}`);
// export const GetAllDepartement = () => Axios.get(process.env.BASE_URL+`/depart`);
// export const SearchDepartement = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/depart?page=${page}&limit=${perpage}&search=${search}`);
// export const AddDepartement = (data: {name: string}) => Axios.post(process.env.BASE_URL+'/depart', data);
export const AddUser = (data: any) => Axios.post(process.env.BASE_URL+`/signup`, data);
// export const DeleteDepartement = (id: string) => Axios.delete(process.env.BASE_URL+`/depart/${id}`);