import { Axios } from '../../../configs/axios/';

export const GetSpjPurchase = (page: any, perpage: any, search: string) => Axios.get(process.env.BASE_URL+`/spjpurchase?${page ? `page=${page}&limit=${perpage}&` : ''}search=${search}`);
export const AddSpjPurchase = (data: any) => Axios.put(process.env.BASE_URL+'/spjpurchaseDmr', data);
export const ApprovalSpj = (id: string) => Axios.put(process.env.BASE_URL+`/spjpurchaseApprove/${id}`);