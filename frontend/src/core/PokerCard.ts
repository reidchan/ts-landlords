import { PokerType } from './PokerType';

/**
 * 扑克牌
 * @author Reid
 */
export default class PokerCard {

  // 类型
  public type: PokerType;
  // 点数
  public points: number;
  // 渲染样式
  public style: any;

  constructor(type: PokerType, points: number) {
    this.type = type;
    this.points = points;
  }

}
