import { Component, Vue } from 'vue-property-decorator';
import { PockerMethod } from '@/core/PockerMethod';
import io from 'socket.io-client';
import { isEmpty } from 'lodash';

import Dealer from '@/core/Dealer';
import Player from '@/core/Player';
import PokerCard from '@/core/PokerCard';
import PockerMethodDecider from '@/core/PockerMethodDecider';
import Card from '@/components/Card/index.vue';
import { RoomState } from './RoomState';
import ArrayUtils from '@/util/ArrayUtils';

@Component({
  components: {
    Card
  },
})
export default class Room extends Vue {
  public playerMe: Player = new Player('Me', false);
  public player1: Player = new Player('[等待玩家进入]', false);
  public player2: Player = new Player('[等待玩家进入]', false);
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
  // 房间状态
  public roomState: RoomState = RoomState.WAIT;

  public get data() {
    return {
      playerMe: undefined
    };
  }

  public get isRoomWait(): boolean {
    return this.roomState === RoomState.WAIT;
  }

  public get isRoomGameStart(): boolean {
    return this.roomState !== RoomState.WAIT;
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
    let { roomId, userId } = this.$route.query;
    const socket = io('http://127.0.0.1:7001');

    userId = userId as string;
    roomId = roomId as string;
    if (userId) {
      this.playerMe.id = userId;
      this.playerMe.name = userId;
    }

    socket.on('updateRoomInfo', (param: UpdateRoomInfoCallbackParams) => {
      const roomUserIds: string[] = param.roomUsers;
      const roomInfo: RoomInfo = param.roomInfo;
      ArrayUtils.remove(roomUserIds, userId);
      if (roomUserIds[0] && isEmpty(this.player1.id)) {
        this.player1.id = roomUserIds[0];
        this.player1.name = roomUserIds[0];
      }
      if (roomUserIds[1] && isEmpty(this.player2.id)) {
        this.player2.id = roomUserIds[1];
        this.player2.name = roomUserIds[1];
      }
      this.roomState = roomInfo.state;
    });

    socket.on('connect', () => {
      console.log('connect...');
      socket.emit('joinRoom', {
        roomId,
        userId
      });
    });

    socket.on('disconnect', () => {
      socket.close();
    });

    window.onbeforeunload = () => {
      socket.close();
    };

    // const dealer = new Dealer();
    // dealer.shuffle();

    // const players: Player[] = [];
    // players.push(this.player1);
    // players.push(this.player2);
    // players.push(this.playerMe);

    // for (let i = 0; i < 51; i++) {
    //   const card = dealer.cards.shift();
    //   if (card) {
    //     players[i % 3].cards.push(card);
    //   }
    // }

    // players.forEach((p: Player) => {
    //   p.sortCard();
    // });

    // let confirmLandlord = false;
    // while (!confirmLandlord) {
    // }
    // this.player1 = players[0];
    // this.player2 = players[1];
    // this.playerMe = players[2];

    // this.playerMe.cards = this.playerMe.cards.map((card: PokerCard, index: number) =>  {
    //   card.style  = {
    //     left: `-${60 * index}px`
    //   };
    //   return card;
    // });

    // this.player2.cards.map((card: PokerCard, index: number) =>  {
    //   card.style  = {
    //     right: `-${20 * index}px`
    //   };
    //   return card;
    // });
  }

}
