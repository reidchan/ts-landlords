import { EggApplication } from 'egg';

const Redis = require('ioredis');


export class RedisProvider {

  private app!: EggApplication;

  private config: ReidsConfig;

  private connectCount: number;

  constructor(app: EggApplication, config: ReidsConfig) {
    this.app = app;
    this.config = config;
  }

  public async connect(): Promise<ReidsClient> {
    const config = this.config;
    const client = new Redis(config.port, config.host, {
      password: config.password,
      db: config.db,
      reconnectOnError: (error: Error) => {
        this.app.logger.error('缓存服务重连出错 => ' + error);
        if (this.connectCount < config.reconnectTime) {
          this.connectCount++;
          return true;
        }
        return false;
      },
    });
    client.on('connect', () => {
      this.app.logger.info('缓存连接成功');
    });
    client.on('disconnect', () => {
      this.app.logger.info('缓存服务断开');
    });
    client.on('error', (error: Error) => {
      this.app.logger.error('缓存服务出错', error);
      throw error;
    });
    return client;
  }

}
