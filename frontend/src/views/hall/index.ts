import { Component, Vue } from 'vue-property-decorator';
import UserStore from '@/store/user';

@Component
export default class Hall extends Vue {

  public async created() {
    if (!UserStore.info) {
      await this.getUserInfo();
    }
  }

  public async getUserInfo(): Promise<void> {
    const result: UserController.GetUserResult = await this.$http.get('/user');
    const userInfo: UserStore.UserInfo = {
      id: result.id,
      name: result.name,
    };
    UserStore.setToken(result.token);
    UserStore.setUserInfo(userInfo);
  }

}
