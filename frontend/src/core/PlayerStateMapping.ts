import { UserState } from 'landlord-core';

const playerStateMap = new Map();
playerStateMap.set(UserState.NOT_READY, '未准备');
playerStateMap.set(UserState.READY, '准备');
playerStateMap.set(UserState.CALL_LANDLORD, '叫地主');
playerStateMap.set(UserState.LOOT_LANDLORD, '抢地主');
playerStateMap.set(UserState.NOT_LOOT_LANDLORD, '不抢');
playerStateMap.set(UserState.PLAY_CARDS, '');
playerStateMap.set(UserState.GAME_OVER, '');

export default playerStateMap;
