import { Axios } from '../../../configs/axios/';

export const GetEquipment = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/equipment?page=${page}&limit=${perpage}`);
export const GetAllEquipment = () => Axios.get(process.env.BASE_URL+`/equipment`);
export const SearchEquipment = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/equipment?page=${page}&limit=${perpage}&search=${search}`);
export const AddEquipment = (data: any) => Axios.post(process.env.BASE_URL+'/equipment', data);
export const EditEquipment = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/equipment/${id}`, data);
export const DeleteEquipment = (id: string) => Axios.delete(process.env.BASE_URL+`/equipment/${id}`);

//Equipment Part
export const AddEquipmentPart = (data: any) => Axios.post(process.env.BASE_URL+'/part', data);
export const EditEquipmentPart = (data: any) => Axios.put(process.env.BASE_URL+'/part', data);
export const DeleteEquipmentPart = (id: string) => Axios.delete(process.env.BASE_URL+`/part/${id}`);