import { Axios } from '../../../configs/axios/';

export const GetPurchaseReceive = () => Axios.get(process.env.BASE_URL+`/poandsoReceive`);