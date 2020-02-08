import PokerCard from './PokerCard';
import { PokerMethod } from './enum/PokerMethod';

/**
 * 扑克记录
 * @author Reid
 */
export default class PokerRecord {

  // 打法
  public method: PokerMethod | undefined;
  // 对应的牌
  public cards: PokerCard[] = [];
  // 最大的牌
  public bigCard!: PokerCard;

}
