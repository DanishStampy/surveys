import axios from "axios";
import store from "./store"

const axiosClient = axios.create({
    baseURL: 'https://surveys.dev/api'
});

axiosClient.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${store.state.auth.user.token}`;
    return config;
})

export default axiosClient;
