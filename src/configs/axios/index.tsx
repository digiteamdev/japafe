import axios from "axios";
import { getToken } from '../session'

export const Axios = axios.create({
    baseURL: process.env.base_url,
    headers: {
        "accepts":"application/json" 
    }
});

Axios.interceptors.request.use(
    config => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)