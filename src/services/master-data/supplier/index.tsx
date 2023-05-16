import { Axios } from '../../../configs/axios/';

export const GetSupplier = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/supplier?page=${page}&limit=${perpage}`);
// export const GetAllDepartement = () => Axios.get(process.env.BASE_URL+`/depart`);
export const SearchSupplier = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/supplier?page=${page}&limit=${perpage}&search=${search}`);
export const AddSupplier = (data: any) => Axios.post(process.env.BASE_URL+'/supplier', data);
export const EditSupplier = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/supplier/${id}`, data);
export const DeleteSupplier = (id: string) => Axios.delete(process.env.BASE_URL+`/supplier/${id}`);

export const EditSupplierBank = (data: any) => Axios.put(process.env.BASE_URL+`/supplierbank`, data);
export const EditSupplierContact = (data: any) => Axios.put(process.env.BASE_URL+`/suppliercontact`, data);