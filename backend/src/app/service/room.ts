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

    const roomUsers: string[] = await this.getRoomUsers(roomId, userId);
    const roomInfo: RoomInfo = await this.getRoomInfo(roomId);

    nsp.to(roomId).emit('updateRoomInfo', {
      roomInfo,
      roomUsers,
    });
  }

  /**
   * 检查玩家是否在线
   */
  public async checkRoomUserState() {
    console.log('奥利给');
  }

  /**
   * 创建房间信息
   * @param roomId
   */
  private async getRoomInfo(roomId: string): Promise<RoomInfo> {
    let roomInfo: RoomInfo = await global.CACHE.hgetall(CacheKeyBuilder.roomInfo(roomId));
    if (isEmpty(roomInfo)) {
      roomInfo = {
        id: roomId,
        landlordId: '',
        state: RoomState.WAIT,
      };
      await this.updateRoomInfo(roomId, roomInfo);
    }
    return roomInfo;
  }

  /**
   * 创建玩家池
   * @param roomId
   * @param userId
   */
  private async getRoomUsers(roomId: string, userId: string): Promise<string[]> {
    let roomUsers: string[] = await global.CACHE.smembers(CacheKeyBuilder.roomUsers(roomId));
    if (!roomUsers.includes(userId) && roomUsers.length < 3) {
      roomUsers = roomUsers.concat(userId);
      if (roomUsers.length === 3) {
        const roomInfo: RoomInfo = await this.getRoomInfo(roomId);
        roomInfo.state = RoomState.READY;
        await this.updateRoomInfo(roomId, roomInfo);
      }
      await global.CACHE.sadd(CacheKeyBuilder.roomUsers(roomId), userId);
    }
    return roomUsers;
  }

  /**
   * 更新房间信息
   * @param roomId
   * @param roomInfo
   */
  private async updateRoomInfo(roomId: string, roomInfo: RoomInfo): Promise<void> {
    const roomInfoMap: Map<string, any> = <any> roomInfo;
    await global.CACHE.hmset(CacheKeyBuilder.roomInfo(roomId), roomInfoMap);
  }

  // const roomCards: string[] = await global.CACHE.del(CacheKeyBuilder.roomCards(roomId));
  // const roomRecords: string[] = await global.CACHE.del(CacheKeyBuilder.roomRecords(roomId));
  // global.CACHE.set(CacheKeyBuilder.roomCards(roomId), '[]');
  // global.CACHE.set(CacheKeyBuilder.roomRecords(roomId), '[]');

}
