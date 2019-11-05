import { Component, Vue } from 'vue-property-decorator';
import Dealer from '@/core/Dealer';
import Player from '@/core/Player';
import PokerCard from '@/core/PokerCard';

@Component
export default class Room extends Vue {

  private created() {
    const dealer = new Dealer();
    dealer.shuffle();

    const players: Player[] = [];
    players.push(new Player('Robot-1'));
    players.push(new Player('Robot-2'));
    players.push(new Player('Me'));

    for (let i = 0; i < 51; i++) {
      const card = dealer.cards.shift();
      if (card) {
        players[i % 3].cards.push(card);
      }
    }
  }

}
