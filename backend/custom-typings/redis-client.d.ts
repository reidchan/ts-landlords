declare class ReidsClient {

  public set(key: string, value: any): void;

  public get(key: string): Promise<any>;

  public del(key: string): void;

  public llen(key: string): Promise<number>;

  public lpush(key: string, value: any): Promise<number>;

  public rpush(key: string, value: any): Promise<number>;

  public lpop(key: string): Promise<any>;

  public rpop(key: string): Promise<any>;

  public lrange(key: string, start: number, end: number): Promise<any[]>;

  public sadd(key: string, value: any): number;

  public spop(key: string): Promise<any>;

  public smembers(key: string): Promise<string[]>;

  public hset(key: string, field: string, value: string): Promise<number>;

  public hmset(key: string, keyValues: {[index: string]: any}): Promise<string>;

  public hget(key: string, field: string): Promise<any>;

  public hgetall(key: string): Promise<any>;

  public hdel(key: string, field: string): Promise<number>;

  public hlen(key: string): Promise<number>;

  public hexists(key: string, field: string): Promise<boolean>;

  public hkeys(key: string): Promise<Set<string>>;

  public hvals(key: string): Promise<string[]>;

}
