import { Service } from 'egg';
import { cloneDeep, isEmpty } from 'lodash';
import {
  RoomState, UserState,
  Dealer, PokerCard,
  ArrayUtils,
  FrontendEvent, $UserInfo, $RoomInfo } from 'landlord-core';

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
    const { roomId, userId, socketId } = params;
    let nsp = this.getNsp(roomId);

    const roomUsers: string[] = await this.getRoomUsers(roomId, userId);
    const roomInfo: RoomInfo = await this.getRoomInfo(roomId);

    const userInfo: UserInfo = await this.getUserInfo(roomId, userId);
    const otherUserInfos: {[index: string]: UserInfo} = await this.getOtherUserInfos(roomUsers, roomId, userId);

    const result: OnInitRoomCallbackParams = {
      roomInfo,
      userInfo,
      otherUserInfos,
    };
    nsp.to(socketId).emit(FrontendEvent.onInitRoom, result);

    nsp = this.getNsp(roomId, true);
    const result2: OnPlayerJoinCallbackParams = {
      userInfo,
    };
    nsp.emit(FrontendEvent.onPlayerJoin, result2);
  }

  /**
   * 将玩家的状态改为准备中
   */
  public async readyUser(params: ReadyUserParams): Promise<void> {
    const { roomId, userId, socketId } = params;
    const userInfo: UserInfo = await this.getUserInfo(roomId, userId);
    if (userInfo) {
      // 将当前用户的状态改为已准备
      userInfo.state = UserState.READY;
      await this.updateUserInfo(roomId, userInfo);
      let nsp = this.getNsp(roomId);
      const result: OnUpdateUserInfoCallbackParams = {
        userInfo,
      };
      nsp.to(socketId).emit(FrontendEvent.onUpdateUserInfo, result);
      nsp = this.getNsp(roomId, true);
      nsp.emit(FrontendEvent.onPlayerReady, userInfo.id);

      // 广播通知所有人
      const userIds: string[] = await this.getRoomUsers(roomId, userId);
      ArrayUtils.remove(userIds, userId);
      let readyCount = 0;
      for (const otherUserId of userIds) {
        const state = await this.getPartUserInfo(roomId, otherUserId, $UserInfo.state);
        if (Number(state) === UserState.READY) {
          readyCount++;
        }
      }
      if (readyCount === 2) {
        // 因为前面删掉了当前用户的id，为了发牌要放回进去
        userIds.push(userId);
        await this.startCallLandlord(roomId, userIds);
      }
    }
  }

  /**
   * 开始叫地主
   */
  private async startCallLandlord(roomId: string, userIds: string[]): Promise<void> {
    const dealer: Dealer = new Dealer();
    // 初始化卡牌
    dealer.initCards();
    // 洗牌
    dealer.shuffle();
    const userCards: PokerCard[][] = [];
    userCards.push([]);
    userCards.push([]);
    userCards.push([]);
    for (let i = 0; i < 51; i++) {
      const card: PokerCard = dealer.cards.shift() as PokerCard;
      userCards[i % 3].push(card);
    }
    const userInfos: UserInfo[] = [];
    for (let i = 0; i < 3; i++) {
      const userId: string = userIds[i];
      const cards: PokerCard[] = userCards[i];
      await this.updatePartUserInfo(roomId, userId, $UserInfo.cards, JSON.stringify(cards));
      const userInfo = await this.getUserInfo(roomId, userId);
      userInfos.push(userInfo);
    }
    // 更新房间信息
    const roomInfo = await this.getRoomInfo(roomId);
    roomInfo.state = RoomState.CALL_LANDLORD;
    // 剩余的三张牌就是地主牌
    roomInfo.landloadCards = dealer.cards;
    await this.updateRoomInfo(roomId, roomInfo);

    // 通知房间信息更新
    const nsp = this.getNsp(roomId);
    const result: OnUpdateRoomInfoCallbackParams = { roomInfo };
    nsp.emit(FrontendEvent.onUpdateRoomInfo, result);

    // 通知用户信息变更
    for (const userInfo of userInfos) {
      const result: OnUpdateUserInfoCallbackParams = { userInfo };
      nsp.emit(FrontendEvent.onUpdateUserInfo, result);
    }
  }

  /**
   * 获取房间信息
   */
  private async getRoomInfo(roomId: string): Promise<RoomInfo> {
    let roomInfo: RoomInfo = await global.CACHE.hgetall(CacheKeyBuilder.roomInfo(roomId));
    const content: any = roomInfo as any;
    if (!isEmpty(roomInfo)) {
      roomInfo.state = Number(content.state);
      roomInfo.landloadCards = JSON.parse(content[$RoomInfo.landloadCards]);
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
   * 获取房间的部分信息
   */
  // private async getPartRoomInfo(roomId: string, key: string): Promise<string> {
  //   return await global.CACHE.hget(CacheKeyBuilder.roomInfo(roomId), key);
  // }

  /**
   * 获取用户信息
   */
  private async getUserInfo(roomId: string, userId: string): Promise<UserInfo> {
    let userInfo: UserInfo = await global.CACHE.hgetall(CacheKeyBuilder.userInfo(roomId, userId));
    const content: any = userInfo as any;
    if (!isEmpty(userInfo)) {
      userInfo.state = Number(content[$UserInfo.state]);
      userInfo.cards = JSON.parse(content[$UserInfo.cards]);
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
   * 获取用户的部分信息
   */
  private async getPartUserInfo(roomId: string, userId: string, key: string): Promise<string> {
    return await global.CACHE.hget(CacheKeyBuilder.userInfo(roomId, userId), key);
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
        const nsp = this.getNsp(roomId, true);
        const result: OnUpdateRoomInfoCallbackParams = {
          roomInfo,
        };
        nsp.emit(FrontendEvent.onUpdateRoomInfo, result);
      }
      await global.CACHE.sadd(CacheKeyBuilder.roomUsers(roomId), userId);
    }
    return roomUsers;
  }

  /**
   * 更新房间信息
   */
  private async updateRoomInfo(roomId: string, roomInfo: RoomInfo): Promise<void> {
    const roomInfoMap: {[index: string]: any} = roomInfo as any;
    roomInfoMap[$RoomInfo.landloadCards] = JSON.stringify(roomInfo[$RoomInfo.landloadCards]);
    await global.CACHE.hmset(CacheKeyBuilder.roomInfo(roomId), roomInfoMap);
  }

  /**
   * 更新房间部分信息
   */
  // private async updateRoomUserInfo(roomId: string, key: string, value: string): Promise<number> {
  //   return await global.CACHE.hset(CacheKeyBuilder.roomInfo(roomId), key, value);
  // }

  /**
   * 更新玩家信息
   * @param roomId
   * @param userInfo
   */
  private async updateUserInfo(roomId: string, userInfo: UserInfo): Promise<void> {
    const userInfoMap: {[index: string]: any} = userInfo as any;
    userInfoMap[$UserInfo.cards] = JSON.stringify(userInfo[$UserInfo.cards]);
    await global.CACHE.hmset(CacheKeyBuilder.userInfo(roomId, userInfo.id), userInfoMap);
  }

  /**
   * 更新用户部分信息
   */
  private async updatePartUserInfo(roomId: string, userId: string, key: string, value: string): Promise<number> {
    return await global.CACHE.hset(CacheKeyBuilder.userInfo(roomId, userId), key, value);
  }

  // const roomCards: string[] = await global.CACHE.del(CacheKeyBuilder.roomCards(roomId));
  // const roomRecords: string[] = await global.CACHE.del(CacheKeyBuilder.roomRecords(roomId));
  // global.CACHE.set(CacheKeyBuilder.roomCards(roomId), '[]');
  // global.CACHE.set(CacheKeyBuilder.roomRecords(roomId), '[]');

}
