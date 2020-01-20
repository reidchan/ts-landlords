import { EggApplication } from 'midway';
import { createConnection, ConnectionOptions, Connection } from 'typeorm';

export class MysqlProvider {
  private app!: EggApplication;
  private config: MysqlConfig;

  constructor (app: EggApplication, config: MysqlConfig) {
    this.app = app;
    this.config = config;
  }

  async connect (): Promise<Connection | undefined> {
    this.config.type = 'mysql';
    const config: ConnectionOptions = this.config as ConnectionOptions;
    let connection: Connection | undefined = undefined;
    try {
      this.app.logger.info('数据库连接成功');
      connection = await createConnection(config)
    } catch (error) {
      this.app.logger.error('数据库连接出错', error);
    }
    return connection;
  }
}
