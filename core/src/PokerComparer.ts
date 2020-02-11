import { PokerMethod } from './enum/PokerMethod';

import PokerCard from './PokerCard';
import PokerRecord from './PokerRecord';
import PokerMethodDecider from './PokerMethodDecider';

/**
 * 比较器
 */
export default class PokerComparer {

  public static compare(curPlayerId: string, activeCards: PokerCard[], lastRecord: PokerRecord | null) {
    const curMethod: PokerMethod = PokerMethodDecider.getMethod(activeCards);
    const curMaxPoint: number = activeCards[activeCards.length - 1].points;
    console.log('current =>', curMethod, curMaxPoint);

    // 第一次出牌/是同一个的出牌
    if (!lastRecord || curPlayerId === lastRecord.userId) {
      return;
    }

    const lastMethod: PokerMethod = lastRecord.method;
    const lastMaxPoint: number = lastRecord.maxPoint;
    const lastCards: PokerCard[] = lastRecord.cards;
    console.log('last =>', lastMethod, lastMaxPoint);
    // 王炸
    if (curMaxPoint === PokerMethod.BOOM && lastCards.length === 2) {
      return;
    }
    // 炸弹
    if (curMethod === PokerMethod.BOOM && lastMethod !== PokerMethod.BOOM) {
      return;
    }
    if (curMethod === lastMethod) {
      if (curMaxPoint <= lastMaxPoint) {
        throw new Error('你的点数不够大噢');
      }
    } else {
      throw new Error('你的出牌不符合规则');
    }
  }

}