import { Controller } from 'egg';

export default class RoomController extends Controller {

  public async joinRoom(ctx: any) {
    const params = ctx.req.args[0];
    await this.service.room.joinRoom(params);
  }

  public async readyUser(ctx: any) {
    const params = ctx.req.args[0];
    await this.service.room.readyUser(params);
  }

  public async callLandlord(ctx: any) {
    const params = ctx.req.args[0];
    await this.service.room.callLandlord(params);
  }

  public async notCallLandlord(ctx: any) {
    const params = ctx.req.args[0];
    await this.service.room.notCallLandlord(params);
  }

  public async lootLandlord(ctx: any) {
    const params = ctx.req.args[0];
    await this.service.room.lootLandlord(params);
  }

  public async notLootLandlord(ctx: any) {
    const params = ctx.req.args[0];
    await this.service.room.notLootLandlord(params);
  }

  public async passBout(ctx: any) {
    const params = ctx.req.args[0];
    await this.service.room.passBout(params);
  }

  public async knockOut(ctx: any) {
    const params = ctx.req.args[0];
    await this.service.room.knockOut(params);
  }

}
