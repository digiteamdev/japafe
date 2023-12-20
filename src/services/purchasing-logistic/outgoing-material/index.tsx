import { Axios } from '../../../configs/axios/';

export const AddOutgoingMaterial = (data: any) => Axios.post(process.env.BASE_URL+'/outgoingMaterial', data);
// export const EditPrMr = (data: any) => Axios.put(process.env.BASE_URL+'/mrPrdetail', data);
export const GetOutgoingMaterial = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/outgoingMaterialAll?page=${page}&limit=${perpage}`);
export const GetOutgoingMaterialAll = () => Axios.get(process.env.BASE_URL+`/outgoingMaterial`);
// export const ApprovalPrMr = (id: any, data: any) => Axios.put(process.env.BASE_URL+`/prStatusMgr/${id}`, data);
// export const DeleteOutgoingMaterial = (id: string) => Axios.delete(process.env.BASE_URL+`/mrPR/${id}`);
export const SearchOutgoingMaterial = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/outgoingMaterialAll?page=${page}&limit=${perpage}&search=${search}`);