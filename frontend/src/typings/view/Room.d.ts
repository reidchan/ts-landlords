declare interface UpdateRoomInfoCallbackParams {
  roomUsers: string[]
  roomInfo: RoomInfo
}

declare interface RoomInfo {
  id: string
  landlordId: string
  state: number
}