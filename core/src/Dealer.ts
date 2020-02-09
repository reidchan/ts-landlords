import PokerCard from './PokerCard';
import { PokerType } from './enum/PokerType';

/**
 * 发牌器
 * @author Reid
 */
export default class Dealer {

  // 卡牌
  public cards: PokerCard[] = [];

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
  public initCards(): void {
    this.cards.push(new PokerCard(PokerType.Jocker, 16, 'joker-16'));
    this.cards.push(new PokerCard(PokerType.Jocker, 17, 'joker-17'));
    for (let i = 1; i <= 13; i++) {
      this.cards.push(new PokerCard(PokerType.Hearts, i + 2, `hearts-${i + 2}`));
      this.cards.push(new PokerCard(PokerType.Spades, i + 2, `spades-${i + 2}`));
      this.cards.push(new PokerCard(PokerType.Clubs, i + 2, `clubs-${i + 2}`));
      this.cards.push(new PokerCard(PokerType.Diamonds, i + 2, `diamonds-${i + 2}`));
    }
  }

}
