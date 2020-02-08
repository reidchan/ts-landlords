import { Service } from 'egg';
import { cloneDeep, isEmpty } from 'lodash';
import { RoomState, UserState, ArrayUtils } from 'landlord-core';

import CacheKeyBuilder from '../entity/builder/CacheKeyBuilder';


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
    const nsp = this.getNsp(roomId);

    const roomUsers: string[] = await this.getRoomUsers(roomId, userId);
    const roomInfo: RoomInfo = await this.getRoomInfo(roomId);

    const userInfo: UserInfo = await this.getUserInfo(roomId, userId);
    const otherUserInfos: {[index: string]: UserInfo} = await this.getOtherUserInfos(roomUsers, roomId, userId);

    const result: OnUpdateRoomInfoCallbackParams = {
      roomInfo,
      userInfo,
      otherUserInfos,
    };
    nsp.to(params.socketId).emit('onInitRoom', result);
  }

  /**
   * 将玩家的状态改为准备中
   */
  public async readyUser(params: ReadyUserParams): Promise<void> {
    const userInfo: UserInfo = await this.getUserInfo(params.roomId, params.userId);
    if (userInfo) {
      userInfo.state = UserState.READY;
      await this.updateUserInfo(params.roomId, userInfo);
      let nsp = this.getNsp(params.roomId);
      const result: OnUpdateUserInfoCallbackParams = {
        userInfo,
      };
      nsp.to(params.socketId).emit('onUpdateUserInfo', result);
      nsp = this.getNsp(params.roomId, true);
      nsp.emit('onPlayerReady', userInfo.id);
    }
  }

  /**
   * 获取房间信息
   */
  private async getRoomInfo(roomId: string): Promise<RoomInfo> {
    let roomInfo: RoomInfo = await global.CACHE.hgetall(CacheKeyBuilder.roomInfo(roomId));
    if (!isEmpty(roomInfo)) {
      roomInfo.state = Number(roomInfo.state);
    } else {
      roomInfo = {
        id: roomId,
        landlordId: '',
        state: RoomState.WAIT,
        landloadCards: [],
      };
      await this.updateRoomInfo(roomId, roomInfo);
    }
    return roomInfo;
  }

  /**
   * 获取用户信息
   */
  private async getUserInfo(roomId: string, userId: string): Promise<UserInfo> {
    let userInfo: UserInfo = await global.CACHE.hgetall(CacheKeyBuilder.userInfo(roomId, userId));
    if (!isEmpty(userInfo)) {
      userInfo.state = Number(userInfo.state);
    } else {
      userInfo = {
        id: userId,
        name: userId,
        state: UserState.NOT_READY,
        isLandlord: false,
        cards: [],
      };
      await this.updateUserInfo(roomId, userInfo);
    }
    return userInfo;
  }

  /**
   * 获取房间内其他用户信息
   */
  private async getOtherUserInfos(roomUsers: string[], roomId: string, curUserId: string): Promise<{[index: string]: UserInfo}> {
    const cloneRoomUsers = cloneDeep(roomUsers);
    ArrayUtils.remove(cloneRoomUsers, curUserId);

    const otherUserInfos: {[index: string]: UserInfo} = {};
    for (const userId of cloneRoomUsers) {
      const userInfo: UserInfo = await this.getUserInfo(roomId, userId);
      otherUserInfos[userId] = userInfo;
    }
    return otherUserInfos;
  }

  /**
   * 获取socket
   */
  private getNsp(roomId: string, isBroadcast = false): any {
    const { app, ctx } = this as any;
    ctx.socket.leave(roomId);
    if (isBroadcast) {
      return ctx.socket.broadcast.to(roomId);
    }
    ctx.socket.join(roomId);
    return app.io.of('/');
  }

  /**
   * 检查玩家是否在线
   */
  public async checkRoomUserState() {
    console.log('奥利给');
  }

  /**
   * 创建玩家池
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
    const roomInfoMap: Map<string, any> = roomInfo as any;
    await global.CACHE.hmset(CacheKeyBuilder.roomInfo(roomId), roomInfoMap);
  }

  /**
   * 更新玩家信息
   * @param roomId
   * @param userInfo
   */
  private async updateUserInfo(roomId: string, userInfo: UserInfo): Promise<void> {
    const userInfoMap: Map<string, any> = userInfo as any;
    await global.CACHE.hmset(CacheKeyBuilder.userInfo(roomId, userInfo.id), userInfoMap);
  }

  // const roomCards: string[] = await global.CACHE.del(CacheKeyBuilder.roomCards(roomId));
  // const roomRecords: string[] = await global.CACHE.del(CacheKeyBuilder.roomRecords(roomId));
  // global.CACHE.set(CacheKeyBuilder.roomCards(roomId), '[]');
  // global.CACHE.set(CacheKeyBuilder.roomRecords(roomId), '[]');

}
