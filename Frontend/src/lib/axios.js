import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.mode==="development"?"https://digital-dockets-sih-2.onrender.com/api":"localhost:3000/api",
    withCredentials: true, //send cookies to the server
})

export default axiosInstance