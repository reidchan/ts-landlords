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

axios.interceptors.response.use(
  async (response) => {
    const body = response.data;
    const { success, data, message } = body;
    if (!success) {
      Toast(message);
    }
    return data;
  },
  getResponseInterceptor()
);

export default getInterface(axios);
