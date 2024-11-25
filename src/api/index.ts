import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import NProgress from 'nprogress';

/* 服务器返回数据的的类型，根据接口文档确定 */
export interface Result<T = unknown> {
  code: number;
  message: string;
  data: T;
}

const instance: AxiosInstance = axios.create({
  timeout: 1000 * 60,
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 400,
  baseURL:
    process.env.NODE_ENV === 'production' ? 'https://df-api.vercel.app/' : 'http://localhost:3100/',
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig<unknown>) => {
    NProgress.start();
    // 在发送请求之前做些什么，例如添加全局的 token 验证
    return config;
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    NProgress.done();
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
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

// 封装请求方法
const request = <T = unknown>(config: AxiosRequestConfig): Promise<T> => {
  return new Promise((resolve, reject) => {
    instance(config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        reject(error);
      });
  });
};

// 为每个 HTTP 方法创建对应的函数
const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    request<T>({ method: 'GET', url, ...config }),
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    request<T>({ method: 'POST', url, data, ...config }),
  // 可以继续添加其他 HTTP 方法的封装
};

export default api;
