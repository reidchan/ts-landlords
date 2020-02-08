export default class CacheKeyBuilder {

  public static roomInfo(roomId: string): string {
    return `room:info:${roomId}`;
  }

  public static userInfo(roomId: string, userId: string): string {
    return `room:${roomId}:user:info:${userId}`;
  }

  public static roomUsers(roomId: string): string {
    return `room:users:${roomId}`;
  }

  public static roomCards(roomId: string): string {
    return `room:cards:${roomId}`;
  }

  public static roomRecords(roomId: string): string {
    return `room:records:${roomId}`;
  }

}
