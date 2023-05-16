import { Axios } from '../../../configs/axios/';

export const GetRole = () => Axios.get(process.env.BASE_URL+`/role`);