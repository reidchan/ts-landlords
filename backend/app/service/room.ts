import { Service } from 'egg';
import { cloneDeep, isEmpty } from 'lodash';
import {
  RoomState, UserState,
  Dealer, PokerCard, PokerMethodDecider, PokerRecord,
  ArrayUtils, MathUtils,
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

    const userIds: string[] = await this.getRoomUserIds(roomId, userId);
    const roomInfo: RoomInfo = await this.getRoomInfo(roomId);

    const userInfo: UserInfo = await this.getUserInfo(roomId, userId);
    const otherUserInfos: {[index: string]: UserInfo} = await this.getOtherUserInfos(userIds, roomId, userId);
    const lastCardRecord = await this.getLastCardRecords(roomId);

    const result: OnInitRoomCallbackParams = {
      roomInfo,
      userInfo,
      otherUserInfos,
      lastCardRecord,
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
      const userIds: string[] = await this.getRoomUserIds(roomId, userId);
      ArrayUtils.remove(userIds, userId);
      let readyCount = 0;
      for (const otherUserId of userIds) {
        const state = JSON.parse(await this.getPartUserInfo(roomId, otherUserId, $UserInfo.state));
        if (state === UserState.READY) {
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
   * 叫地主
   */
  public async callLandlord(params: CallLandlordParams) {
    const { roomId, userId } = params;
    await this.updatePartUserInfo(roomId, userId, $UserInfo.state, UserState.CALL_LANDLORD);
    await this.updatePartRoomInfo(roomId, $RoomInfo.state, RoomState.LOOT_LANDLORD);
    await this.updatePartRoomInfo(roomId, $RoomInfo.callLandlordId, userId);
    await this.updateRoomCurUserId(roomId, userId);

    const nsp = this.getNsp(roomId);
    const userInfo = await this.getUserInfo(roomId, userId);
    const roomInfo = await this.getRoomInfo(roomId);
    const result: OnUpdateUserInfoCallbackParams = {
      userInfo,
    };
    const result2: OnUpdateRoomInfoCallbackParams = {
      roomInfo,
    };
    nsp.emit(FrontendEvent.onUpdateUserInfo, result);
    nsp.emit(FrontendEvent.onUpdateRoomInfo, result2);
  }

  /**
   * 不叫地主
   */
  public async notCallLandlord(params: NotCallLandlordParams) {
    const { roomId, userId } = params;
    await this.updatePartUserInfo(roomId, userId, $UserInfo.state, UserState.NOT_CALL_LANDLORD);
    await this.updateRoomCurUserId(roomId, userId);

    const userInfos: UserInfo[] = await this.getAllUserInfos(roomId);
    const isAllUserNotCallLandlord: boolean = await this.judgeAllUserNotCallLandlord(userInfos);

    const nsp = this.getNsp(roomId);
    if (isAllUserNotCallLandlord) {
      const userIds: string[] = await global.CACHE.smembers(CacheKeyBuilder.roomUsers(roomId));
      await this.resetRoomAndUserInfo(roomId, userIds);
      await this.startCallLandlord(roomId, userIds);
      nsp.emit(FrontendEvent.onReloadCallLandload);
    } else {
      const userInfo = await this.getUserInfo(roomId, userId);
      const result: OnUpdateUserInfoCallbackParams = {
        userInfo,
      };
      nsp.emit(FrontendEvent.onUpdateUserInfo, result);
    }
    const roomInfo = await this.getRoomInfo(roomId);
    const result2: OnUpdateRoomInfoCallbackParams = {
      roomInfo,
    };
    nsp.emit(FrontendEvent.onUpdateRoomInfo, result2);
  }

  /**
   * 判断是否所有玩家都没叫地主
   */
  private async judgeAllUserNotCallLandlord(userInfos: UserInfo[]): Promise<boolean> {
    let count = 0;
    for (const userInfo of userInfos) {
      if (userInfo.state === UserState.NOT_CALL_LANDLORD) {
        count++;
      }
    }
    if (count === 3) {
      return true;
    }
    return false;
  }

  /**
   * 抢地主
   */
  public async lootLandlord(params: LootLandlordParams) {
    const { roomId, userId } = params;
    await this.updatePartUserInfo(roomId, userId, $UserInfo.state, UserState.LOOT_LANDLORD);
    const lootLandlordIds: string[] = JSON.parse(await this.getPartRoomInfo(roomId, $RoomInfo.lootLandlordIds));
    lootLandlordIds.push(userId);
    await this.updatePartRoomInfo(roomId, $RoomInfo.lootLandlordIds, JSON.stringify(lootLandlordIds));
    await this.updateRoomCurUserId(roomId, userId);
    await this.lootLandlordNotifacation(roomId, userId);
  }

  /**
   * 不抢地主
   */
  public async notLootLandlord(params: NotLootLandlordParams): Promise<void> {
    const { roomId, userId } = params;
    await this.updatePartUserInfo(roomId, userId, $UserInfo.state, UserState.NOT_LOOT_LANDLORD);
    await this.updateRoomCurUserId(roomId, userId);
    await this.lootLandlordNotifacation(roomId, userId);
  }

  /**
   * 要不起
   */
  public async passBout(params: PassBoutParams): Promise<void> {
    const { roomId, userId } = params;
    await this.updatePartUserInfo(roomId, userId, $UserInfo.state, UserState.PASS);
    await this.updatePartUserInfo(roomId, userId, $UserInfo.showCards, '[]');
    const nextUserId: string = await this.updateRoomCurUserId(roomId, userId);
    await this.updatePartUserInfo(roomId, nextUserId, $UserInfo.state, UserState.PLAY);

    const nsp = this.getNsp(roomId);
    const userInfo = await this.getUserInfo(roomId, userId);
    const result: OnUpdateUserInfoCallbackParams = {
      userInfo,
    };
    nsp.emit(FrontendEvent.onUpdateUserInfo, result);
    nsp.emit(FrontendEvent.onSwitchPlayer, nextUserId, RoomState.GAME_START);
  }

  /**
   * 出牌
   */
  public async knockOut(params: KnockOutParams): Promise<void> {
    const { roomId, userId, activeCards } = params;
    // TODO: 错误时的提示
    // const curLastCard = activeCards[activeCards.length - 1] as PokerCard;
    // const method: PokerMethod = PokerMethodDecider.getMethod(activeCards);
    // const lastCardRecords = await this.getLastCardRecords(roomId);
    // if (lastCardRecords) {
    // if (method !== lastCardRecords.method || curLastCard.points <= lastCardRecords.maxPoint) {
    // }
    // }
    const haveFirstBlood = await JSON.parse(await this.getPartRoomInfo(roomId, $RoomInfo.haveFirstBlood));
    if (!haveFirstBlood) {
      await this.updatePartRoomInfo(roomId, $RoomInfo.haveFirstBlood, true);
    }

    const residueCards: PokerCard[] = await this.filterUsedCards(roomId, userId, activeCards);
    const nsp = this.getNsp(roomId);
    if (residueCards.length === 0) {
      nsp.emit(FrontendEvent.onGameOver, userId);
      return;
    }
    await this.updatePartUserInfo(roomId, userId, $UserInfo.state, UserState.PLAY);
    await this.updatePartUserInfo(roomId, userId, $UserInfo.showCards, JSON.stringify(activeCards));
    await this.addCardRecord(roomId, userId, activeCards);
    const nextUserId: string = await this.updateRoomCurUserId(roomId, userId);
    await this.updatePartUserInfo(roomId, nextUserId, $UserInfo.state, UserState.PLAY);

    // 更新用户信息
    const userInfo = await this.getUserInfo(roomId, userId);
    const result: OnUpdateUserInfoCallbackParams = {
      userInfo,
    };
    nsp.emit(FrontendEvent.onUpdateUserInfo, result);
    // 更新房间信息
    const roomInfo = await this.getRoomInfo(roomId);
    const result2: OnUpdateRoomInfoCallbackParams = {
      roomInfo,
    };
    nsp.emit(FrontendEvent.onUpdateRoomInfo, result2);
  }

  /**
   * 过滤掉已使用的卡牌
   */
  private async filterUsedCards(roomId: string, userId: string, usedCards: PokerCard[]): Promise<PokerCard[]> {
    let cards: PokerCard[] = JSON.parse(await this.getPartUserInfo(roomId, userId, $UserInfo.cards));
    const cardMap: Map<string, PokerCard | null> = new Map();
    for (const card of cards) {
      cardMap.set(`${card.type}-${card.points}`, card);
    }
    for (const card of usedCards) {
      if (cardMap.has(`${card.type}-${card.points}`)) {
        cardMap.set(`${card.type}-${card.points}`, null);
      }
    }

    cards = [];
    for (const card of cardMap.values()) {
      if (card) {
        cards.push(card);
      }
    }
    await this.updatePartUserInfo(roomId, userId, $UserInfo.cards, JSON.stringify(cards));
    return cards;
  }

  /**
   * 抢地主相关共用逻辑
   */
  private async lootLandlordNotifacation(roomId: string, userId: string) {
    let userInfos: UserInfo[] = await this.getAllUserInfos(roomId);
    const canStartGame: boolean = await this.judgeStartGame(userInfos);
    const nsp = this.getNsp(roomId);
    if (canStartGame) {
      await this.decideLandlord(roomId, userInfos);
      // 更新玩家信息
      userInfos = await this.getAllUserInfos(roomId);
      for (const userInfo of userInfos) {
        const result: OnUpdateUserInfoCallbackParams = {
          userInfo,
        };
        nsp.emit(FrontendEvent.onUpdateUserInfo, result);
      }
    } else {
      const userInfo = await this.getUserInfo(roomId, userId);
      const result: OnUpdateUserInfoCallbackParams = {
        userInfo,
      };
      nsp.emit(FrontendEvent.onUpdateUserInfo, result);
    }
    // 更新房间信息
    const roomInfo = await this.getRoomInfo(roomId);
    const result: OnUpdateRoomInfoCallbackParams = {
      roomInfo,
    };
    nsp.emit(FrontendEvent.onUpdateRoomInfo, result);
  }

  /**
   * 重置房间和玩家的信息
   */
  private async resetRoomAndUserInfo(roomId: string, userIds: string[]): Promise<void> {
    await this.updatePartRoomInfo(roomId, $RoomInfo.state, RoomState.WAIT);
    await this.updatePartRoomInfo(roomId, $RoomInfo.curUserId, '');
    for (const userId of userIds) {
      await this.updatePartUserInfo(roomId, userId, $UserInfo.state, UserState.READY);
    }
  }

  /**
   * 判断是否能开始游戏
   */
  private async judgeStartGame(userInfos: UserInfo[]): Promise<boolean> {
    let count = 0;
    for (const userInfo of userInfos) {
      if (userInfo.state !== UserState.READY) {
        count++;
      }
    }
    if (count === 3) {
      return true;
    }
    return false;
  }

  /**
   * 决定地主
   */
  private async decideLandlord(roomId: string, userInfos: UserInfo[]): Promise<void> {
    // 没有抢地主的人数
    let notLootCount = 0;
    // 竞争地主的人
    const contenderIds: string[] = [];

    for (const userInfo of userInfos) {
      if (userInfo.state === UserState.NOT_LOOT_LANDLORD) {
        notLootCount++;
        continue;
      }
      if (userInfo.state === UserState.CALL_LANDLORD || userInfo.state === UserState.LOOT_LANDLORD) {
        contenderIds.push(userInfo.id);
      }
    }
    // 没有人抢地主，叫地主的人就是地主
    let landlordId = '';
    if (notLootCount === 2) {
      landlordId = contenderIds[0];
    } else {
      // 从抢地主的人中抽选一位为地主
      const landlordIndex = MathUtils.random(0, contenderIds.length - 1);
      landlordId = contenderIds[landlordIndex];
    }

    // 更新房间信息
    await this.updatePartRoomInfo(roomId, $RoomInfo.state, RoomState.GAME_START);
    await this.updatePartRoomInfo(roomId, $RoomInfo.landlordId, landlordId);
    await this.updatePartRoomInfo(roomId, $RoomInfo.curUserId, landlordId);

    // 发放地主牌
    const landloadCards: PokerCard[] = JSON.parse(await this.getPartRoomInfo(roomId, $RoomInfo.landloadCards));
    const userCards: PokerCard[] = JSON.parse(await this.getPartUserInfo(roomId, landlordId, $UserInfo.cards));
    await this.updatePartUserInfo(roomId, landlordId, $UserInfo.isLandlord, true);
    await this.updatePartUserInfo(roomId, landlordId, $UserInfo.cards, JSON.stringify(userCards.concat(landloadCards)));

    // 将玩家状态都置为开始
    const userIds: string[] = userInfos.map(ui => ui.id);
    for (const userId of userIds) {
      await this.updatePartUserInfo(roomId, userId, $UserInfo.state, UserState.PLAY);
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
    // 随机找一位玩家开始抢地主操作
    const userIndex: number = MathUtils.random(0, 2);
    roomInfo.curUserId = userIds[userIndex];
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

    // 通知玩家开始抢地主
    // TODO:
    nsp.emit(FrontendEvent.onSwitchPlayer, roomInfo.curUserId, roomInfo.state);
  }

  /**
   * 获取房间信息
   */
  private async getRoomInfo(roomId: string): Promise<RoomInfo> {
    let roomInfo: RoomInfo = await global.CACHE.hgetall(CacheKeyBuilder.roomInfo(roomId));
    const content: any = roomInfo as any;
    if (!isEmpty(roomInfo)) {
      roomInfo.haveFirstBlood = JSON.parse(content[$RoomInfo.haveFirstBlood]);
      roomInfo.state = JSON.parse((content[$RoomInfo.state]));
      roomInfo.landloadCards = JSON.parse(content[$RoomInfo.landloadCards]);
      roomInfo.lootLandlordIds = JSON.parse(content[$RoomInfo.lootLandlordIds]);
    } else {
      roomInfo = {
        id: roomId,
        haveFirstBlood: false,
        landlordId: '',
        callLandlordId: '',
        lootLandlordIds: [],
        curUserId: '',
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
  private async getPartRoomInfo(roomId: string, key: string): Promise<string> {
    return await global.CACHE.hget(CacheKeyBuilder.roomInfo(roomId), key);
  }

  /**
   * 获取最后一条出牌记录
   */
  private async getLastCardRecords(roomId: string): Promise<PokerRecord | null> {
    const recordLenght: number = await global.CACHE.llen(CacheKeyBuilder.roomCardRecords(roomId));
    const records: string[] = await global.CACHE.lrange(CacheKeyBuilder.roomCardRecords(roomId), recordLenght - 1, recordLenght - 1);
    if (records.length > 0) {
      return JSON.parse(records[0]) as PokerRecord;
    }
    return null;
  }

  /**
   * 获取用户信息
   */
  private async getUserInfo(roomId: string, userId: string): Promise<UserInfo> {
    let userInfo: UserInfo = await global.CACHE.hgetall(CacheKeyBuilder.userInfo(roomId, userId));
    const content: any = userInfo as any;
    if (!isEmpty(userInfo)) {
      userInfo.state = JSON.parse((content[$UserInfo.state]));
      userInfo.cards = JSON.parse(content[$UserInfo.cards]);
      userInfo.showCards = JSON.parse(content[$UserInfo.showCards]);
      userInfo.previousUserId = await this.getUserPreviousUser(roomId, userId);
      userInfo.nextUserId = await this.getUserNextUser(roomId, userId);
      userInfo.isLandlord = JSON.parse(content[$UserInfo.isLandlord]);
    } else {
      userInfo = {
        id: userId,
        name: userId,
        state: UserState.NOT_READY,
        isLandlord: false,
        showCards: [],
        cards: [],
        previousUserId: await this.getUserPreviousUser(roomId, userId),
        nextUserId: await this.getUserNextUser(roomId, userId),
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

  private async getAllUserInfos(roomId: string): Promise<UserInfo[]> {
    const userIds: string[] = await global.CACHE.smembers(CacheKeyBuilder.roomUsers(roomId));
    const userInfos: UserInfo[] = [];
    for (const userId of userIds) {
      const userInfo: UserInfo = await this.getUserInfo(roomId, userId);
      userInfos.push(userInfo);
    }
    return userInfos;
  }

  /**
   * 创建玩家池
   */
  private async getRoomUserIds(roomId: string, userId: string): Promise<string[]> {
    let userIds: string[] = await global.CACHE.smembers(CacheKeyBuilder.roomUsers(roomId));
    if (!userIds.includes(userId) && userIds.length < 3) {
      await this.setUsersSequence(roomId, userId, userIds);
      userIds = userIds.concat(userId);
      if (userIds.length === 3) {
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
    return userIds;
  }

  /**
   * 设置用户的顺序
   */
  private async setUsersSequence(roomId: string, targetUserId: string, userIds: string[]): Promise<void> {
    if (userIds.length === 1) {
      const userId: string = userIds[0];
      await this.updateUserPreviousUser(roomId, targetUserId, userId);
      await this.updateUserNextUser(roomId, userId, targetUserId);
    } else if (userIds.length === 2) {
      const userId1: string = userIds[0];
      const userId2: string = userIds[1];
      const user1NextUserId = await this.getUserNextUser(roomId, userId1);
      if (isEmpty(user1NextUserId)) {
        await this.updateUserNextUser(roomId, userId1, targetUserId);
        await this.updateUserPreviousUser(roomId, targetUserId, userId1);
        await this.updateUserNextUser(roomId, targetUserId, userId2);
        await this.updateUserPreviousUser(roomId, userId2, targetUserId);
      } else {
        await this.updateUserNextUser(roomId, userId2, targetUserId);
        await this.updateUserPreviousUser(roomId, targetUserId, userId2);
        await this.updateUserNextUser(roomId, targetUserId, userId1);
        await this.updateUserPreviousUser(roomId, userId1, targetUserId);
      }
    }
  }

  /**
   * 获取玩家的上家
   */
  private async getUserPreviousUser(roomId: string, userId: string): Promise<any> {
    return await global.CACHE.get(CacheKeyBuilder.userPreviousUser(roomId, userId));
  }

  /**
   * 获取玩家的下家
   */
  private async getUserNextUser(roomId: string, userId: string): Promise<string> {
    return await global.CACHE.get(CacheKeyBuilder.userNextUser(roomId, userId));
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
   * 更新房间信息
   */
  private async updateRoomInfo(roomId: string, roomInfo: RoomInfo): Promise<void> {
    const roomInfoMap: {[index: string]: any} = cloneDeep(roomInfo) as any;
    roomInfoMap[$RoomInfo.landloadCards] = JSON.stringify(roomInfo[$RoomInfo.landloadCards]);
    roomInfoMap[$RoomInfo.lootLandlordIds] = JSON.stringify(roomInfo[$RoomInfo.lootLandlordIds]);
    await global.CACHE.hmset(CacheKeyBuilder.roomInfo(roomId), roomInfoMap);
  }

  /**
   * 更新房间当前玩家
   */
  private async updateRoomCurUserId(roomId: string, userId: string): Promise<string> {
    const nextUserId = await this.getUserNextUser(roomId, userId);
    await this.updatePartRoomInfo(roomId, $RoomInfo.curUserId, nextUserId);
    return nextUserId;
  }

  /**
   * 更新房间部分信息
   */
  private async updatePartRoomInfo(roomId: string, key: string, value: any): Promise<number> {
    return await global.CACHE.hset(CacheKeyBuilder.roomInfo(roomId), key, value);
  }

  /**
   * 更新玩家信息
   * @param roomId
   * @param userInfo
   */
  private async updateUserInfo(roomId: string, userInfo: UserInfo): Promise<void> {
    const userInfoMap: {[index: string]: any} = cloneDeep(userInfo) as any;
    userInfoMap[$UserInfo.cards] = JSON.stringify(userInfo.cards);
    userInfoMap[$UserInfo.showCards] = JSON.stringify(userInfo.showCards);
    await global.CACHE.hmset(CacheKeyBuilder.userInfo(roomId, userInfo.id), userInfoMap);
  }

  /**
   * 更新用户部分信息
   */
  private async updatePartUserInfo(roomId: string, userId: string, key: string, value: any): Promise<number> {
    return await global.CACHE.hset(CacheKeyBuilder.userInfo(roomId, userId), key, value);
  }

  /**
   * 更新玩家的上家
   */
  private async updateUserPreviousUser(roomId: string, userId: string, value: string): Promise<void> {
    await global.CACHE.set(CacheKeyBuilder.userPreviousUser(roomId, userId), value);
  }

  /**
   * 更新玩家的下家
   */
  private async updateUserNextUser(roomId: string, userId: string, value: string): Promise<void> {
    await global.CACHE.set(CacheKeyBuilder.userNextUser(roomId, userId), value);
  }

  /**
   * 添加游戏记录
   */
  private async addCardRecord(roomId: string, userId: string, cards: PokerCard[]): Promise<void> {
    const record = new PokerRecord();
    record.userId = userId;
    record.method = PokerMethodDecider.getMethod(cards);
    record.cards = cards;
    record.maxPoint = cards[cards.length - 1].points;
    await global.CACHE.rpush(CacheKeyBuilder.roomCardRecords(roomId), JSON.stringify(record));
    const nsp = this.getNsp(roomId);
    nsp.emit(FrontendEvent.onUpdateLastCardRecord, record);
  }

}
