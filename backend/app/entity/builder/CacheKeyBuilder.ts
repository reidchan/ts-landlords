export default class CacheKeyBuilder {

  public static roomInfo(roomId: string): string {
    return `room:info:${roomId}`;
  }

  public static userInfo(roomId: string, userId: string): string {
    return `room:${roomId}:user:info:${userId}`;
  }

  public static userPreviousUser(roomId: string, userId: string): string {
    return `room:${roomId}:previous:user:${userId}`;
  }

  public static userNextUser(roomId: string, userId: string): string {
    return `room:${roomId}:next:user:${userId}`;
  }

  public static roomUsers(roomId: string): string {
    return `room:users:${roomId}`;
  }

  public static roomCards(roomId: string): string {
    return `room:cards:${roomId}`;
  }

  public static roomCardRecords(roomId: string): string {
    return `room:card:records:${roomId}`;
  }

}
