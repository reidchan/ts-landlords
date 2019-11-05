/**
 * 玩家
 * @author Reid
 */
import PokerCard from './PokerCard';

export default class Player {

  // 姓名
  public name: string = '';
  // 卡牌
  public cards: PokerCard[] = [];

  constructor(name: string)  {
    this.name = name;
  }

}
