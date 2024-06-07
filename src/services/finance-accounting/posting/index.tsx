import { Axios } from '../../../configs/axios/';

export const GetAllPosting = (page: number, perpage: number, status: any) => Axios.get(process.env.BASE_URL+`/posting?page=${page}&limit=${perpage}&status=${status}`);
export const SearchPosting = (page: number, perpage: number, search: string, status: any) => Axios.get(process.env.BASE_URL+`/posting?page=${page}&limit=${perpage}&search=${search}&status=${status}`);
export const Posting = (data: any) => Axios.put(process.env.BASE_URL+`/postingJournal`, data);
export const CreateJournal = (data: any) => Axios.post(process.env.BASE_URL+`/createJournal`, data);