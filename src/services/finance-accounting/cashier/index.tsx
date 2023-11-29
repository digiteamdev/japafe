import { Axios } from '../../../configs/axios/';

export const GetCashier = () => Axios.get(process.env.BASE_URL+`/cashier`);