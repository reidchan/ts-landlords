import PokerCard from './PokerCard';
import { PokerMethod } from './PokerMethod';
import { PokerType } from './PokerType';

/**
 * 打法决定者
 * @author Reid
 */
export default class PokerMethodDecider {

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
      return PokerMethod.EMPTY;
    }

    // 单张
    if (cards.length === 1) {
      return PokerMethod.SINGLE;
    }

    // 王炸
    if (cards.length === 2 && cardPointCountMap.size === 2
      && cards[0].type === PokerType.Jocker && cards[1].type === PokerType.Jocker) {
      return PokerMethod.BOOM;
    }

    // 对子
    if (cards.length === 2 && cardPointCountMap.size === 1) {
      return PokerMethod.DOUBLE;
    }

    // 三张牌
    if (cards.length === 3 && cardPointCountMap.size === 1) {
      return PokerMethod.THREE;
    }

    // 炸弹
    if (cards.length === 4 && cardPointCountMap.size === 1) {
      return PokerMethod.BOOM;
    }

    // 三带一
    if (cards.length === 4 && cardPointCountMap.size === 2) {
      for (const count of cardPointCountMap.values()) {
        if (count === 3 || count === 1) {
          return PokerMethod.THREE_ROW;
        }
      }
    }

    // 三带二
    if (cards.length === 5 && cardPointCountMap.size === 2) {
      for (const count of cardPointCountMap.values()) {
        if (count === 3 || count === 2) {
          return PokerMethod.THREE_DOUBLE;
        }
      }
    }

    // 单顺
    if (cards.length >= 5 && cardPointCountMap.size === cards.length) {
      const cardPoints: number[] = [];
      for (const card of cards) {
        cardPoints.push(card.points);
      }
      if (this.checkContinuous(cardPoints)) {
        return PokerMethod.THREE_DOUBLE;
      }
    }

    // 双顺
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
          return PokerMethod.DOUBLE_ROW;
        }
      }
    }

    // 三顺
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
          return PokerMethod.THREE_ROW;
        }
      }
    }

    // 三带一飞机
    if (cards.length >= 8 && cardPointCountMap.size >= 4) {
      let threeCount: number = 0;
      let singleCount: number = 0;
      const threePoints = [];

      for (const point of cardPointCountMap.keys()) {
        const count: number = cardPointCountMap.get(point) as number;
        if (count === 3) {
          threeCount++;
          threePoints.push(point);
        }
        if (count === 1) {
          singleCount++;
        }
      }
      if (threeCount === singleCount && threeCount * 3 + singleCount === cards.length) {
        if (this.checkContinuous(threePoints)) {
          return PokerMethod.THREE_ROW_SINGLE;
        }
      }
    }

    // 三带二飞机
    if (cards.length >= 10 && cardPointCountMap.size >= 4) {
      let threeCount: number = 0;
      let doubleCount: number = 0;
      const threePoints = [];

      for (const point of cardPointCountMap.keys()) {
        const count: number = cardPointCountMap.get(point) as number;
        if (count === 3) {
          threeCount++;
          threePoints.push(point);
        }
        if (count === 2) {
          doubleCount++;
        }
      }
      if (threeCount === doubleCount && threeCount * 3 + doubleCount * 2 === cards.length) {
        if (this.checkContinuous(threePoints)) {
          return PokerMethod.THREE_ROW_DOUBLE;
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
