import { Service } from 'midway';
import { isEmpty } from 'lodash';

import CacheKeyBuilder from '../entity/builder/CacheKeyBuilder';

import RoomInfo from './room/RoomInfo';
import { RoomState } from './room/RoomState';

/**
 * 房间逻辑相关
 * @author super2god
 */
export default class RoomService extends Service {

  /**
   * 加入房间
   */
  public async joinRoom(params: JoinRoomParams): Promise<void> {
    const { roomId, userId } = params;
    const { app, ctx } = this as any;
    ctx.socket.join(roomId);
    const nsp = app.io.of('/');
    nsp.to(roomId).emit('open');

    await this.createRoomInfo(roomId);
    await this.createRoomUsers(roomId, userId);
  }

  /**
   * 创建房间信息
   * @param roomId
   */
  private async createRoomInfo(roomId: string): Promise<void> {
    let roomInfo: RoomInfo = await global.CACHE.hgetall(CacheKeyBuilder.roomInfo(roomId));
    if (isEmpty(roomInfo)) {
      roomInfo = {
        id: roomId,
        landlordId: '',
        state: RoomState.READY,
      };
      const roomInfoMap: Map<string, any> = <any> roomInfo;
      global.CACHE.hmset(CacheKeyBuilder.roomInfo(roomId), roomInfoMap);
    } else {
      console.log('roomInfo =>', roomInfo);
    }
  }

  /**
   * 创建玩家池
   * @param roomId
   * @param userId
   */
  private async createRoomUsers(roomId: string, userId: string): Promise<void> {
    const roomUsers: string[] = await global.CACHE.smembers(CacheKeyBuilder.roomUsers(roomId));
    if (roomUsers.length < 3) {
      global.CACHE.sadd(CacheKeyBuilder.roomUsers(roomId), userId);
    } else {
      console.log('roomUsers =>', roomUsers);
    }
  }

  // const roomCards: string[] = await global.CACHE.del(CacheKeyBuilder.roomCards(roomId));
  // const roomRecords: string[] = await global.CACHE.del(CacheKeyBuilder.roomRecords(roomId));
  // global.CACHE.set(CacheKeyBuilder.roomCards(roomId), '[]');
  // global.CACHE.set(CacheKeyBuilder.roomRecords(roomId), '[]');

}
