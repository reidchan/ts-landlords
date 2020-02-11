import ax from 'axios';
import { Toast } from 'vant';
import { interceptRequest, getResponseInterceptor, getInterface } from './common';

const axios = ax.create({
  baseURL: process.env.VUE_APP_API_ROOT,
  headers: {
    'Content-Type': 'application/json'
  }
});

interceptRequest(axios);

// v1接口返回的body结构：
//
// response = {
//   data: {
//     data: {},
//     code: 200,
//     message: 'succeed'
//   }
// }
axios.interceptors.response.use(
  async (response) => {
    const body = response.data;
    const { data, message } = body;
    if (message && message !== 'succeed') {
      Toast(message);
    }
    return data;
  },
  getResponseInterceptor()
);

export default getInterface(axios);
