import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 요청 보내기 전에 로딩 상태를 보여주는 로직
    // 예: showLoadingSpinner();
    console.log("요청이 전송되었습니다.");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    // 응답 받은 후 로딩 상태를 숨기는 로직
    // 예: hideLoadingSpinner();
    console.log("응답을 받았습니다.");
    return response;
  },
  (error) => {
    // 에러 처리
    // 예: alert('데이터 로딩에 실패했습니다.');
    return Promise.reject(error);
  }
);

export default api;
