import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use(
  (config) => {
    console.log("요청이 전송되었습니다.");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("응답을 받았습니다.");
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
