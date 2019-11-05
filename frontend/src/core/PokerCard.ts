import { PokerType } from './PokerType';

/**
 * 扑克牌
 * @author Reid
 */
export default class PokerCard {

  // 类型
  private type: PokerType;
  // 点数
  private points: number;

  constructor(type: PokerType, points: number) {
    this.type = type;
    this.points = points;
  }

}
