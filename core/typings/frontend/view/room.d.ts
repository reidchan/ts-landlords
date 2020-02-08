/// <reference path="../../RoomInfo.d.ts" />
/// <reference path="../../UserInfo.d.ts" />

interface OnInitRoomCallbackParams {
  userInfo: UserInfo
  otherUserInfos: {[index: string]: UserInfo}
  roomInfo: RoomInfo
}

interface OnUpdateRoomInfoCallbackParams {
  userInfo: UserInfo
  otherUserInfos: {[index: string]: UserInfo}
  roomInfo: RoomInfo
}

interface OnUpdateUserInfoCallbackParams {
  userInfo: UserInfo
}