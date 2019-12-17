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
  // 状态
  public state: string | undefined;
  // 姓名
  private name: string;
  // 是否是地主
  private isSelf: boolean;

  constructor(name: string, isSelf: boolean)  {
    this.name = name;
    this.isSelf = isSelf;
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
