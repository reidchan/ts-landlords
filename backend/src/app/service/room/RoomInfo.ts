import { RoomState } from './RoomState';


export default interface RoomInfo {
  id: string
  landlordId: string
  state: RoomState
}
