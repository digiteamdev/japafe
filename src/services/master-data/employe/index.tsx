import { Axios } from '../../../configs/axios/';

export const GetEmploye = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/employe?page=${page}&limit=${perpage}`);
export const GetAllEmploye = () => Axios.get(process.env.BASE_URL+`/employe`);
export const GetAllEmployeSales = () => Axios.get(process.env.BASE_URL+`/employeSales`);
export const SearchEmploye = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/employe?page=${page}&limit=${perpage}&search=${search}`);
export const AddEmploye = (data: any) => Axios.post(process.env.BASE_URL+'/employe', data);
export const DeleteEmploye = (id: string) => Axios.delete(process.env.BASE_URL+`/employe/${id}`);
export const EditEmploye = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/employe/${id}`, data);

//Employee Child
export const EditEmployeChild = (data: any) => Axios.put(process.env.BASE_URL+`/employechild`, data);
export const DeleteEmployeChild = (id: string) => Axios.delete(process.env.BASE_URL+`/employechild/${id}`);

//Employee Certificate
export const AddEmployeCertificate = (data: any) => Axios.post(process.env.BASE_URL+'/employeCertificate', data);
export const EditEmployeCertificate = (data: any) => Axios.put(process.env.BASE_URL+`/employeCer`, data);
export const DeleteEmployeCertificate = (id: string) => Axios.delete(process.env.BASE_URL+`/employeCer/${id}`);

//Employee Education
export const AddEmployeEdu = (data: any) => Axios.post(process.env.BASE_URL+'/employeeedu', data);
export const EditEmployeEdu = (data: any) => Axios.put(process.env.BASE_URL+`/employeEdu`, data);
export const DeleteEmployeEdu = (id: string) => Axios.delete(process.env.BASE_URL+`/employeEdu/${id}`);