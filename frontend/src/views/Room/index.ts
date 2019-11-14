import { Component, Vue } from 'vue-property-decorator';
import Dealer from '@/core/Dealer';
import Player from '@/core/Player';
import PokerCard from '@/core/PokerCard';
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

  private created() {
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

    this.playerMe.cards.map((card: PokerCard, index: number) =>  {
      card.style  = {
        left: `-${(70 * index)}%`
      };
      return card;
    });
  }

}
