declare interface JoinRoomParams {
  socketId: string
  roomId: string
  userId: string
}

declare interface ReadyUserParams {
  socketId: string
  roomId: string
  userId: string
}

declare interface CallLandlordParams {
  socketId: string
  roomId: string
  userId: string
}

declare interface LootLandlordParams {
  socketId: string
  roomId: string
  userId: string
}