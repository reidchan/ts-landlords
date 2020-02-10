import PokerCard from './PokerCard';
import { PokerMethod } from './enum/PokerMethod';

/**
 * 扑克记录
 * @author Reid
 */
export default class PokerRecord {

  // 用户id
  public userId!: string;
  // 打法
  public method!: PokerMethod;
  // 对应的牌
  public cards: PokerCard[] = [];
  // 最大的点数
  public maxPoint!: number;

}
