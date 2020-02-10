/// <reference path="../../RoomInfo.d.ts" />
/// <reference path="../../UserInfo.d.ts" />

interface OnInitRoomCallbackParams {
  userInfo: UserInfo
  otherUserInfos: {[index: string]: UserInfo}
  roomInfo: RoomInfo,
  lastCardRecord: any
}

interface OnPlayerJoinCallbackParams {
  userInfo: UserInfo
}

interface OnUpdateRoomInfoCallbackParams {
  roomInfo: RoomInfo
}

interface OnUpdateUserInfoCallbackParams {
  userInfo: UserInfo
}