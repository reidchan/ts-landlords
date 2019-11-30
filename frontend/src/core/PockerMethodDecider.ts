import PokerCard from '@/core/PokerCard';
import { PockerMethod } from '@/core/PockerMethod';

/**
 * 打法决定者
 * @author Reid
 */
export default class PockerMethodDecider {

  /**
   * 获取打法
   *
   * @param cards 当前选中的卡牌
   */
  public static getMethod(cards: PokerCard[]) {
    if (cards.length === 0) {
      return PockerMethod.EMPTY;
    }
    if (cards.length === 1) {
      return PockerMethod.SINGLE;
    }
    throw new Error('你的出牌不符合规则');
  }

}
