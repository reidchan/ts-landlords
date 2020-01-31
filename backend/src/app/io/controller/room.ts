import { Controller } from 'egg';


export default class RoomController extends Controller {

  public async joinRoom(ctx: any) {
    const params = ctx.req.args[0];
    await this.service.room.joinRoom(params);
  }

}

