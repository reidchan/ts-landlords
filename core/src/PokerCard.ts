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
  // 点数
  public imgUrl: string;
  // 是否被选中
  public active: boolean = false;
  // 渲染样式
  public style: any;

  constructor(type: PokerType, points: number, imgUrl: string) {
    this.type = type;
    this.points = points;
    this.imgUrl = imgUrl;
  }

}
