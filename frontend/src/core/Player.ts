import { PokerCard, UserState, RoomState } from 'landlord-core';

import PlayerStateMapping from '@/core/PlayerStateMapping';

/**
 * 玩家
 * @author Reid
 */
export default class Player {

  // 卡牌
  public cards: PokerCard[] = [];
  // 当前展示的手牌
  public showCards: PokerCard[] = [];
  // 是否是地主
  public isLandlord: boolean = false;
  // 姓名
  public name: string;
  // id
  public id!: string;
  // 状态
  public state: number = UserState.NOT_READY;
  // 房间状态
  public roomState: number = RoomState.WAIT;
  // 是否是地主
  private isSelf: boolean;

  constructor(name: string, isSelf: boolean)  {
    this.name = name;
    this.isSelf = isSelf;
  }

  public get stateText(): string {
    if (this.state === UserState.NOT_READY) {
      return '';
    }
    if ((this.roomState === RoomState.CALL_LANDLORD || this.roomState === RoomState.LOOT_LANDLORD)
      && this.state === UserState.READY) {
      return '';
    }
    return PlayerStateMapping.get(this.state) as string;
  }

  /**
   * 将卡牌按大到小排序
   */
  public sortCard() {
    this.cards = this.cards.sort((a: PokerCard, b: PokerCard) => {
      return b.points - a.points;
    });
  }

}
