declare interface RoomInfo {
  id: string
  haveFirstBlood: boolean,
  curUserId: string
  landlordId: string
  callLandlordId: string
  lootLandlordIds: string[]
  state: number,
  landloadCards: any[],
}
