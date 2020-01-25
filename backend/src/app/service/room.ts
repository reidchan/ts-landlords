import { Service } from 'midway';

import CacheKeyBuilder from '../entity/builder/CacheKeyBuilder';


export default class RoomService extends Service {

  /**
   * 加入房间
   */
  public async joinRoom(params: { roomId: string, userId: string }): Promise<void> {
    const { roomId, userId } = params;
    const { app, ctx } = this as any;
    ctx.socket.join(roomId);
    const nsp = app.io.of('/');
    nsp.to(roomId).emit('open');
    await this.createRoom(roomId, userId);
  }

  private async createRoom(roomId: string, userId: string) {
    const roomUsers: string[] = await global.CACHE.smembers(CacheKeyBuilder.roomUsers(roomId));
    // const roomCards: string[] = await global.CACHE.del(CacheKeyBuilder.roomCards(roomId));
    // const roomRecords: string[] = await global.CACHE.del(CacheKeyBuilder.roomRecords(roomId));
    if (roomUsers.length < 3) {
      global.CACHE.sadd(CacheKeyBuilder.roomUsers(roomId), userId);
    }
    // global.CACHE.set(CacheKeyBuilder.roomCards(roomId), '[]');
    // global.CACHE.set(CacheKeyBuilder.roomRecords(roomId), '[]');
  }

}
