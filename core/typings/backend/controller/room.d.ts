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

declare interface NotCallLandlordParams {
  socketId: string
  roomId: string
  userId: string
}

declare interface LootLandlordParams {
  socketId: string
  roomId: string
  userId: string
}

declare interface NotLootLandlordParams {
  socketId: string
  roomId: string
  userId: string
}