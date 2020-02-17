import { VuexModule, Module, Mutation } from 'vuex-class-modules';

const USER_TOKEN = 'user:token';
const USER_INFO = 'user:info';

@Module
class UserModule extends VuexModule {

  public get token(): string | null {
    return localStorage.getItem(USER_TOKEN);
  }

  public get info(): UserStore.UserInfo | null {
    return JSON.parse(localStorage.getItem(USER_INFO) as string);
  }

  @Mutation
  public setUserInfo(userInfo: UserStore.UserInfo) {
    localStorage.setItem(USER_INFO, JSON.stringify(userInfo));
  }

  @Mutation
  public setToken(token: string) {
    localStorage.setItem(USER_TOKEN, token);
  }

}

import store from './index';
export default new UserModule({ store, name: 'user' });
