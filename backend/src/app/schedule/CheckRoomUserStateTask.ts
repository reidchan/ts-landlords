import { Subscription } from 'egg';

/**
 * 定时检查玩家在线状态
 * @author super2god
 */
export default class CheckRoomUserStateTask extends Subscription {

  public static get schedule() {
    return {
      disable: true,
      interval: '3s',
      type: 'worker',
    };
  }

  public async subscribe(): Promise<any> {
    await this.service.room.checkRoomUserState();
  }

}
