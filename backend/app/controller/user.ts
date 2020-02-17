import { Controller } from 'egg';

export default class HomeController extends Controller {

  public async getUser() {
    const result = await this.service.user.getUser();
    this.ctx.success(result);
  }

}
