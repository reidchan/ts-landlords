import RouteWhiteList from './route-white-list';
import { Dialog, Toast } from 'vant';
import UserStore from '@/store/user';
import GlobalStore from '@/store/global';

/**
 * 拦截请求
 */
function interceptRequest(axiosInstance: any) {
  axiosInstance.interceptors.request.use(
    (config: any) => {
      GlobalStore.addReqCount();
      if (UserStore.token) {
        config.headers.common.Authorization = `Bearer ${UserStore.token}`;
      } else { // 没有token
        if (RouteWhiteList.every((path) => config.url.indexOf(path) === -1)) { // 而且不是免token接口
          Dialog.alert({
            message: '请先登录噢'
          });
        }
      }
      return config;
    }, (error: any) => {
      Toast('请求失败，请检查网络');
      return Promise.reject(error);
    }
  );
}

/**
 * 响应-错误处理
 */
function getResponseInterceptor() {
  return async (error: any) => {
    GlobalStore.removeReqCount();
    const { data: body, status } = error.response;
    const { message } = body;
    // 判断状态码
    switch (status) {
      case 401:
        await Dialog.alert({ message: '请先登录噢～' });
        break;
      case 500:
        Toast(message || `请求失败（${status}）`);
        break;
      default:
        Toast(`未知错误（${status}）`);
        break;
    }
    return Promise.reject(new Error(message));
  };
}

/**
 * 输出统一接口
 */
function getInterface(axiosInstance: any) {
  return {
    get(url: string, query: any) {
      return axiosInstance.get(url, {
        params: query
      });
    },
    post: axiosInstance.post.bind(axiosInstance),
    put: axiosInstance.put.bind(axiosInstance),
    patch: axiosInstance.patch.bind(axiosInstance),
    delete: axiosInstance.delete.bind(axiosInstance),
  };
}

export {
  interceptRequest,
  getResponseInterceptor,
  getInterface
};
