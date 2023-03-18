import axios from "axios";
import qs from "qs";

// axios.defaults.baseURL = "http://10.0.2.2:8080";
axios.defaults.baseURL = "http://127.0.0.1:8080";

//post请求头
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";
//跨域请求
axios.defaults.withCredentials = true;
//设置超时
axios.defaults.timeout = 10000;

axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    console.log(`异常请求：${JSON.stringify(error.message)}`);
  }
);
export default {
  post(url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url,
        data: qs.stringify(data),
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  get(url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url,
        params: data,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
