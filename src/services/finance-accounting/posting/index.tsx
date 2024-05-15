import { Axios } from '../../../configs/axios/';

export const GetAllPosting = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/posting?page=${page}&limit=${perpage}`);
export const SearchPosting = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/posting?page=${page}&limit=${perpage}&search=${search}`);
export const Posting = (data: any) => Axios.put(process.env.BASE_URL+`/postingJournal`, data);