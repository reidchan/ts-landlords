import PokerCard from './PokerCard';

/**
 * 玩家
 * @author Reid
 */
export default class Player {

  // 卡牌
  public cards: PokerCard[] = [];
  // 是否是地主
  public isLandlord: boolean = false;
  // 姓名
  private name: string;
  // 是否是地主
  private isSelf: boolean;

  constructor(name: string, isSelf: boolean)  {
    this.name = name;
    this.isSelf = isSelf;
  }

}
