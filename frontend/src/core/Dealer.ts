/**
 * 发牌器
 * @author Reid
 */

import PokerCard from './PokerCard';
import { PokerType } from './PokerType';

export default class Dealer {

  // 卡牌
  public cards: PokerCard[] = [];

  constructor() {
    this.initCards();
  }

  /**
   * 洗牌
   */
  public shuffle(): void {
    let cardCount = this.cards.length;
    while (cardCount) {
      const beforeIndex = Math.floor(Math.random() * cardCount--);
      const curCard = this.cards[cardCount];
      this.cards[cardCount] = this.cards[beforeIndex];
      this.cards[beforeIndex] = curCard;
    }
  }

  /**
   * 初始化卡牌
   */
  private initCards(): void {
    this.cards.push(new PokerCard(PokerType.Jocker, 1));
    this.cards.push(new PokerCard(PokerType.Jocker, 2));
    for (let i = 1; i <= 13; i++) {
      this.cards.push(new PokerCard(PokerType.Hearts, i));
      this.cards.push(new PokerCard(PokerType.Spades, i));
      this.cards.push(new PokerCard(PokerType.Clubs, i));
      this.cards.push(new PokerCard(PokerType.Diamonds, i));
    }
  }

}
