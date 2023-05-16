import { Axios } from '../../configs/axios/';

export const Login = (data: any) => Axios.post(process.env.BASE_URL+`/signin`, data);
export const Logout = () => Axios.delete(process.env.BASE_URL+`/signout`);