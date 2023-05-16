import { Axios } from '../../../configs/axios/';

export const GetCustomer = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/customer?page=${page}&limit=${perpage}`);
export const GetAllCustomer = () => Axios.get(process.env.BASE_URL+`/customer`);
export const SearchCustomer = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/customer?page=${page}&limit=${perpage}&search=${search}`);
export const AddCustomer = (data: any) => Axios.post(process.env.BASE_URL+'/customer', data);
export const EditCustomer = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/customer/${id}`, data);
export const DeleteCustomer = (id: string) => Axios.delete(process.env.BASE_URL+`/customer/${id}`);

export const EditCustomerContact = (data: any) => Axios.put(process.env.BASE_URL+`/customercontact`, data);
export const EditCustomerAddress = (data: any) => Axios.put(process.env.BASE_URL+`/customeraddress`, data);