import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.mode==="development"?"http://localhost:3000/api":"https://digital-dockets-sih-2.onrender.com/api",
    withCredentials: true, //send cookies to the server
})

export default axiosInstance