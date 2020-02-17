import { Service, Application } from 'egg';
const nanoid = require('nanoid');

/**
 * 用户相关
 * @author super2god
 */
export default class UserService extends Service {

  public async getUser(): Promise<UserController.GetUserResult> {
    const app: Application = this.app;
    const userId: string = nanoid(6);
    const user = {
      id: userId,
      name: userId,
    };
    const token: string = app.jwt.sign(user, app.config.jwt.secret);
    const result: UserController.GetUserResult = {
      ...user,
      token,
    };
    return result;
  }

}
