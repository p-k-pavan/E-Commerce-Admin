import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://namma-mart-v1ko.onrender.com";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;