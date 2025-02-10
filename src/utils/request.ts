import axios from 'axios';
import type {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import NProgress from 'nprogress';

/* 服务器返回数据的的类型，根据接口文档确定 */
export interface Result<T = unknown> {
  code: number;
  message: string;
  data: T;
}

const service: AxiosInstance = axios.create({
  // baseURL: process.env.NODE_ENV === 'production' ? 'https://api.book.bbdaxia.com/' : '/api',
  baseURL:
    process.env.NODE_ENV === 'production' ? 'https://api-df.zhuba.site' : 'http://localhost:3102',
  timeout: 0,
});

/* 请求拦截器 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig<unknown>) => {
    NProgress.start();
    return config;
  },
  (error: AxiosError) => {
    NProgress.done();
    console.error(error.message);
    return Promise.reject(error);
  }
);

/* 响应拦截器 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    NProgress.done();
    const { code, message, data } = response.data;

    // 根据自定义错误码判断请求是否成功
    if (code === 0 || code === 1 || code === 200) {
      // 将组件用的数据返回
      return data;
    } else {
      // 处理业务错误。
      console.error(message);
      return Promise.reject(new Error(message));
    }
  },
  (error: AxiosError) => {
    NProgress.done();
    // 处理 HTTP 网络错误
    let message = '';
    // HTTP 状态码
    const status = error.response?.status;
    switch (status) {
      case 401:
        message = 'token 失效，请重新登录';
        // 这里可以触发退出的 action
        break;
      case 403:
        message = '拒绝访问';
        break;
      case 404:
        message = '请求地址错误';
        break;
      case 500:
        message = '服务器故障';
        break;
      default:
        message = '网络连接故障';
    }

    console.error(message);
    return Promise.reject(error);
  }
);

/* 导出封装的请求方法 */
export const http = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config);
  },

  post<T = unknown>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config);
  },

  put<T = unknown>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config);
  },

  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config);
  },
};

/* 导出 axios 实例 */
export default service;
