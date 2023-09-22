import { Axios } from '../../../configs/axios/';

export const GetUser = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/user?page=${page}&limit=${perpage}`);
// export const GetAllDepartement = () => Axios.get(process.env.BASE_URL+`/depart`);
export const SearchUser = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/user?page=${page}&limit=${perpage}&search=${search}`);
export const EditUser = (id: string, data: any) => Axios.put(process.env.BASE_URL+`/user/${id}`, data);
export const AddUser = (data: any) => Axios.post(process.env.BASE_URL+`/signup`, data);
export const DeleteUser = (id: string) => Axios.delete(process.env.BASE_URL+`/user/${id}`);