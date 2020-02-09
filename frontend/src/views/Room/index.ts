import io from 'socket.io-client';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { isEmpty } from 'lodash';

import Player from '@/core/Player';
import {
  PokerMethod, RoomState, UserState,
  FrontendEvent, BackendEvent,
  PokerCard, PokerMethodDecider } from 'landlord-core';
import Card from '@/components/Card/index.vue';

@Component({
  components: {
    Card
  },
})
export default class Room extends Vue {
  public playerMe: Player = new Player('Me', true);
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
  // 房间id
  public roomId!: string;
  // 房间状态
  public roomState: RoomState = RoomState.WAIT;
  // socket
  private socket!: SocketIOClient.Socket;

  public data = () => {
    return {
      playerMe: undefined
    };
  }

  @Watch('roomState')
  public onChangeRoomState(newVal: number) {
    this.fillPlayerRoomState(newVal);
  }

  public get isRoomWait(): boolean {
    return this.roomState === RoomState.WAIT;
  }

  public get isRoomReady(): boolean {
    return this.roomState === RoomState.READY && this.playerMe.state === UserState.NOT_READY;
  }

  public get isShowCards(): boolean {
    return this.roomState >= RoomState.CALL_LANDLORD;
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
   * 准备按钮点击
   */
  public onClickReady(): void {
    const params: ReadyUserParams = {
      socketId: this.socket.id,
      roomId: this.roomId,
      userId: this.playerMe.id,
    };
    this.socket.emit(BackendEvent.readyUser, params);
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
    const method: PokerMethod = PokerMethodDecider.getMethod(activeCards);
  }

  public created() {
    const { roomId, userId } = this.$route.query as unknown as RoomViewQuery;
    this.socket = io('http://192.168.1.101:7001');

    if (userId) {
      this.playerMe.id = userId;
      this.playerMe.name = userId;
    }
    this.roomId = roomId;

    this.socket.on(FrontendEvent.onInitRoom, (params: OnInitRoomCallbackParams) => {
      console.log('onInitRoom...', params);
      const roomInfo: RoomInfo = params.roomInfo;
      const userInfo: UserInfo = params.userInfo;
      const otherUserInfos: {[index: string]: UserInfo} = params.otherUserInfos;
      if (userInfo.previousUserId) {
        this.fillPlayer(this.player1, otherUserInfos[userInfo.previousUserId]);
      }
      if (userInfo.nextUserId) {
        this.fillPlayer(this.player2, otherUserInfos[userInfo.nextUserId]);
      }
      if (this.playerMe.id === userInfo.id) {
        this.fillPlayer(this.playerMe, userInfo);
      }
      this.roomState = roomInfo.state;
    });

    this.socket.on(FrontendEvent.onPlayerJoin, (params: OnPlayerJoinCallbackParams) => {
      console.log('onPlayerJoin...', params);
      const userInfo: UserInfo = params.userInfo;
      if (this.playerMe.id === userInfo.previousUserId) {
        this.fillPlayer(this.player2, userInfo);
      } else {
        this.fillPlayer(this.player1, userInfo);
      }
    });

    this.socket.on(FrontendEvent.onUpdateRoomInfo, (params: OnUpdateRoomInfoCallbackParams) => {
      console.log('onUpdateRoomInfo...', params);
      this.roomState = params.roomInfo.state;
    });

    this.socket.on(FrontendEvent.onUpdateUserInfo, (params: OnUpdateUserInfoCallbackParams) => {
      console.log('onUpdateUserInfo...', params);
      const userInfo: UserInfo = params.userInfo;
      let target = null;
      if (userInfo.id === userId) {
        target = 'playerMe';
      } else if (this.player1.id && this.player1.id === userInfo.id) {
        target = 'player1';
      } else if (this.player2.id && this.player2.id === userInfo.id) {
        target = 'player2';
      }
      if (target) {
        const that = this as any;
        const targetPlayer: Player = that[target] as Player;
        this.fillPlayer(targetPlayer, userInfo);
      }
    });

    this.socket.on(FrontendEvent.onPlayerReady, (playId: string) => {
      console.log('onPlayerReady...', playId);
      if (this.player1.id === playId) {
        this.player1.state = UserState.READY;
      } else {
        this.player2.state = UserState.READY;
      }
    });

    this.socket.on('connect', () => {
      console.log('connect...');
      const params: JoinRoomParams = {
        socketId: this.socket.id,
        roomId,
        userId
      };
      this.socket.emit(BackendEvent.joinRoom, params);
    });

    this.socket.on('disconnect', () => {
      console.log('disconnect...');
      this.socket.disconnect();
    });

    window.onbeforeunload = () => {
      this.socket.disconnect();
    };
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

  private fillPlayerRoomState(state: RoomState): void {
    this.playerMe.roomState = state;
    this.player1.roomState = state;
    this.player2.roomState = state;
  }

  private fillPlayer(player: Player, userInfo: UserInfo): void {
    player.id = userInfo.id;
    player.name = userInfo.name;
    player.state = userInfo.state;
    player.cards = userInfo.cards;
    if (!isEmpty(player.cards) && player.cards.length > 0) {
      player.cards.sort((a: PokerCard, b: PokerCard) => {
        return b.points - a.points;
      });
    }
  }

}
