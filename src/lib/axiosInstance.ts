import axios from "axios";
import toast from "react-hot-toast";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 40000,
    withCredentials: true
});

axiosInstance.interceptors.request.use(function(config) {
  return config
}, function(error) {
    console.log(error, 'error');
});

axiosInstance.interceptors.response.use(function (res) {
  return res
}, function(error) {
    if(error.status == 400) {
    console.log(error?.response,'error.status')
    

        toast.error(error?.response?.data?.error ?? error?.message);
    }
    
})