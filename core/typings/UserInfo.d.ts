declare interface UserInfo {
  id: string
  name: string
  state: number
  isLandlord: boolean
  cards: any[],
  showCards: any[],
  previousUserId: string,
  nextUserId: string
}
