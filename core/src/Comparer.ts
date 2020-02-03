import PokerRecord from './PokerRecord';

/**
 * 比较器
 * @author Reid
 */
export default class Comparer {

  /**
   * 比较a与b的大小
   * @returns 小于或等于0不能打、大于0能打
   */
  public static compare(a: PokerRecord, b: PokerRecord): number {
    if (a.method === b.method) {
      return -1;
    }
    return a.bigCard.points - b.bigCard.points;
  }

}
