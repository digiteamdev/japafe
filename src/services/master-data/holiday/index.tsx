import { Axios } from '../../../configs/axios/';

export const AddHoliday = (data: any) => Axios.post(process.env.BASE_URL+'/masterHoliday', data);
export const GetHoliday = (page: number, perpage: number) => Axios.get(process.env.BASE_URL+`/masterHoliday?page=${page}&limit=${perpage}`);
export const GetAllHoliday = () => Axios.get(process.env.BASE_URL+`/masterHoliday`);
export const EditHoliday = (data: any, id: string) => Axios.put(process.env.BASE_URL+`/masterHoliday/${id}`, data);
export const DeleteHoliday = (id: string) => Axios.delete(process.env.BASE_URL+`/masterHoliday/${id}`);
export const SearchHoliday = (page: number, perpage: number, search: string) => Axios.get(process.env.BASE_URL+`/masterHoliday?page=${page}&limit=${perpage}&search=${search}`);