import { Axios } from '../../../configs/axios/';

export const AddPrMr = (data: any) => Axios.put(process.env.BASE_URL+'/mrPR', data);
export const AddSupplierMr = (data: any) => Axios.put(process.env.BASE_URL+'/drPurchase', data);
// export const AddPrSr = (data: any) => Axios.put(process.env.BASE_URL+'/srPR', data);
export const EditPrMr = (data: any) => Axios.put(process.env.BASE_URL+'/mrPrdetail', data);
export const GetPurchaseMR = (page: number, perpage: number, type: string) => Axios.get(process.env.BASE_URL+`/mrPR?page=${page}&limit=${perpage}&type=${type}`);
export const GetAllMRPo = (page: number, perpage: number, type: string) => Axios.get(process.env.BASE_URL+`/mrPR?page=${page}&limit=${perpage}&type=${type}`);
export const ApprovalPrMr = (id: any, data: any) => Axios.put(process.env.BASE_URL+`/prStatusMgr/${id}`, data);
export const DeletePurchaseMR = (id: string) => Axios.delete(process.env.BASE_URL+`/mrPR/${id}`);
export const SearchPurchaseMR = (page: number, perpage: number, search: string, type: string) => Axios.get(process.env.BASE_URL+`/mrPR?page=${page}&limit=${perpage}&search=${search}&type=${type}`);
export const BackToApprovalMr = (data: any) => Axios.put(process.env.BASE_URL+'/backApprovalMr', data);
export const GetPurchaseSupplier = (id: string, type:string) => Axios.get(process.env.BASE_URL+`/choiceSup?type=${type}&supId=${id}`);
export const GetPurchaseDirrect = (page: any, perpage: any, type: string) => Axios.get(process.env.BASE_URL+`/getAllchoiceSupDr?${page ? `page=${page}&limit=${perpage}&` : ''}type=${type}`);