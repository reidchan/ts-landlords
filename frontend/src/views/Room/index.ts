import { Component, Vue } from 'vue-property-decorator';
import { PockerMethod } from '@/core/PockerMethod';

import Dealer from '@/core/Dealer';
import Player from '@/core/Player';
import PokerCard from '@/core/PokerCard';
import PockerMethodDecider from '@/core/PockerMethodDecider';
import Card from '@/components/Card/index.vue';

@Component({
  components: {
    Card
  },
})
export default class Room extends Vue {
  public playerMe: Player | undefined;
  public player1: Player | undefined;
  public player2: Player | undefined;
  // 出牌操作
  public showPlayCard: boolean = false;
  // 叫地主操作
  public showCallLandlord: boolean = false;
  // 我的出牌
  public showMeCards: boolean = false;
  // P1的出牌
  public showP1Cards: boolean = false;
  // P2的出牌
  public showP2Cards: boolean = false;
  // 我的出牌状态
  public showMeState: boolean = false;
  // P1的出牌状态
  public showP1State: boolean = false;
  // P2的出牌状态
  public showP2State: boolean = false;

  public data() {
    return {
      playerMe: undefined,
      player1:  undefined,
      player2:  undefined,
      showPlayCard: false,
      showCallLandlord: false,
      showMeCards: false,
      showP1Cards: false,
      showP2Cards: false,
      showMeState: false,
      showP1State: false,
      showP2State: false
    };
  }

  /**
   * 卡牌被点击
   * @param index 索引
   */
  public onCardClick(index: number): void {
    const playerMe = this.playerMe as Player;
    const card: PokerCard = playerMe.cards[index];
    card.active = !card.active;
    playerMe.cards.splice(index, 1, card);
  }

  /**
   * 打出牌
   */
  public knockout() {
    const playerMe = this.playerMe as Player;
    // 被选中的卡牌
    const activeCards = playerMe.cards.filter((card: PokerCard) => {
      if (card.active) {
        return card;
      }
    });
    const method: PockerMethod = PockerMethodDecider.getMethod(activeCards);
  }

  public created() {
    const dealer = new Dealer();
    dealer.shuffle();

    const players: Player[] = [];
    players.push(new Player('Robot-1', false));
    players.push(new Player('Robot-2', false));
    players.push(new Player('Me', false));

    for (let i = 0; i < 51; i++) {
      const card = dealer.cards.shift();
      if (card) {
        players[i % 3].cards.push(card);
      }
    }

    players.forEach((p: Player) => {
      p.sortCard();
    });

    // let confirmLandlord = false;
    // while (!confirmLandlord) {
    // }
    this.player1 = players[0];
    this.player2 = players[1];
    this.playerMe = players[2];

    this.playerMe.cards = this.playerMe.cards.map((card: PokerCard, index: number) =>  {
      card.style  = {
        left: `-${60 * index}px`
      };
      return card;
    });

    this.player2.cards.map((card: PokerCard, index: number) =>  {
      card.style  = {
        right: `-${20 * index}px`
      };
      return card;
    });
  }

}
