import PokerCard from './PokerCard';
import { PockerMethod } from './PockerMethod';

/**
 * 扑克记录
 * @author Reid
 */
export default class Player {

  // 打法
  public method: PockerMethod | undefined;
  // 对应的牌
  public cards: PokerCard[] = [];
  // 最大的牌
  public bigCard!: PokerCard;

}
