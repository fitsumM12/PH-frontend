import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh_token = localStorage.getItem("refresh_token");
      if (refresh_token) {
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/api/token/refresh/",
            { refresh: refresh_token }
          );

          const { access } = response.data;

          localStorage.setItem("token", access);
          api.defaults.headers["Authorization"] = "Bearer " + access;
          originalRequest.headers["Authorization"] = "Bearer " + access;

          return api(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token is expired or invalid:", refreshError);
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login"; 
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
