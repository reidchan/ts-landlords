import { VuexModule, Module, Mutation } from 'vuex-class-modules';

const REQ_COUNT = 'global:reqCount';

@Module
class UserModule extends VuexModule {

  public reqCount: number = JSON.parse(localStorage.getItem(REQ_COUNT) as string) || 0;

  @Mutation
  public addReqCount() {
    const content = localStorage.getItem(REQ_COUNT) as string;
    localStorage.setItem(REQ_COUNT, JSON.stringify(JSON.parse(content) + 1));
    this.reqCount = JSON.parse(localStorage.getItem(REQ_COUNT) as string);
  }

  @Mutation
  public removeReqCount() {
    const content = localStorage.getItem(REQ_COUNT) as string;
    localStorage.setItem(REQ_COUNT, JSON.stringify(JSON.parse(content) - 1));
    this.reqCount = JSON.parse(localStorage.getItem(REQ_COUNT) as string);
  }

}

import store from './index';
export default new UserModule({ store, name: 'global' });
