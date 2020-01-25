export default class CacheKeyBuilder {

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
