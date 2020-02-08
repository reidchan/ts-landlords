export enum RoomState {
  // 等待开始
  WAIT,
  // 准备中
  READY,
  // 叫地主中
  CALL_LANDLORD,
  // 抢地主中
  LOOT_LANDLORD,
  // 游戏开始
  GAME_START,
  // 打牌中
  PLAY_CARDS,
  // 游戏结束
  GAME_OVER
}