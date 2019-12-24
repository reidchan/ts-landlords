import { Controller } from 'egg'

export default class HelloController extends Controller {

  public async sayHi() {
    const app: any = this.app
    const nsp = app.io.of('/');
    nsp.emit('open')
  }

}

