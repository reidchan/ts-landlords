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
    cards = cards.sort((a: PokerCard, b: PokerCard) => {
      return a.points - b.points;
    });

    const cardPointCountMap: Map<number, number> = new Map();
    cards.forEach((card: PokerCard) => {
      const key: number = card.points;
      if (cardPointCountMap.has(key)) {
        let count: number = cardPointCountMap.get(key) as number;
        cardPointCountMap.set(key, ++count);
      } else {
        cardPointCountMap.set(key, 1);
      }
    });

    if (cards.length === 0) {
      return PockerMethod.EMPTY;
    }

    if (cards.length === 1) {
      return PockerMethod.SINGLE;
    }

    if (cards.length === 2 && cardPointCountMap.size === 1) {
      return PockerMethod.DOUBLE;
    }

    if (cards.length === 3 && cardPointCountMap.size === 1) {
      return PockerMethod.THREE;
    }

    if (cards.length === 4 && cardPointCountMap.size === 2) {
      for (const count of cardPointCountMap.values()) {
        if (count === 3 || count === 1) {
          return PockerMethod.THREE_ROW;
        }
      }
    }

    if (cards.length === 5 && cardPointCountMap.size === 2) {
      for (const count of cardPointCountMap.values()) {
        if (count === 3 || count === 2) {
          return PockerMethod.THREE_DOUBLE;
        }
      }
    }

    if (cards.length >= 5 && cardPointCountMap.size === cards.length) {
      const cardPoints: number[] = [];
      for (const card of cards) {
        cardPoints.push(card.points);
      }
      if (this.checkContinuous(cardPoints)) {
        return PockerMethod.THREE_DOUBLE;
      }
    }

    if (cards.length % 2 === 0 && cards.length / 2 >= 3) {
      let flag: boolean = true;
      for (const value of cardPointCountMap.values()) {
        if (value !== 2) {
          flag = false;
          break;
        }
      }

      if (flag) {
        const cardPoints: number[] = [];
        for (const key of cardPointCountMap.keys()) {
          cardPoints.push(key);
        }
        if (this.checkContinuous(cardPoints)) {
          return PockerMethod.DOUBLE_ROW;
        }
      }
    }

    if (cards.length % 3 === 0 && cards.length / 3 >= 2) {
      let flag: boolean = true;
      for (const value of cardPointCountMap.values()) {
        if (value !== 3) {
          flag = false;
          break;
        }
      }

      if (flag) {
        const cardPoints: number[] = [];
        for (const key of cardPointCountMap.keys()) {
          cardPoints.push(key);
        }
        if (this.checkContinuous(cardPoints)) {
          return PockerMethod.THREE_ROW;
        }
      }
    }

    throw new Error('你的出牌不符合规则');
  }


  /**
   * 检查点数的连续性
   */
  private static checkContinuous(cardPoints: number[]): boolean {
    if (cardPoints.length === 2 && cardPoints[0] + 1 !== cardPoints[1]) {
      return false;
    }

    for (let i = 0; i < cardPoints.length; i++) {
      if (i > 0 && i !== cardPoints.length - 1) {
        const curPoint: number = cardPoints[i];
        if (cardPoints[i - 1] !== curPoint - 1  || cardPoints[i + 1] !== curPoint + 1) {
          return false;
        }
      }
    }
    return true;
  }

}
