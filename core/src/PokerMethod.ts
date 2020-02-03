/**
 * 扑克打法
 * @author Reid
 */
export enum PokerMethod {
  // 没打牌
  EMPTY,
  // 单张
  SINGLE,
  // 对子
  DOUBLE,
  // 三张牌
  THREE,
  // 三带一
  THREE_SINGLE,
  // 三带二
  THREE_DOUBLE,
  // 单顺
  SINGLE_ROW,
  // 双顺
  DOUBLE_ROW,
  // 三顺
  THREE_ROW,
  // 三带一飞机
  THREE_ROW_SINGLE,
  // 三带二飞机
  THREE_ROW_DOUBLE,
  // 四带二
  FOUR_DOUBLE_ROW,
  // 炸弹/王炸
  BOOM
}
