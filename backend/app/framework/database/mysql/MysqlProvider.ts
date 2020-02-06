import { Application } from 'egg';
import { createConnection, ConnectionOptions, Connection } from 'typeorm';


export class MysqlProvider {

  private app!: Application;

  private config: MysqlConfig;

  constructor(app: Application, config: MysqlConfig) {
    this.app = app;
    this.config = config;
  }

  public async connect(): Promise<Connection | null> {
    this.config.type = 'mysql';
    const config: ConnectionOptions = this.config as ConnectionOptions;
    let connection: Connection | null = null;
    try {
      this.app.logger.info('数据库连接成功');
      connection = await createConnection(config);
    } catch (error) {
      this.app.logger.error('数据库连接出错', error);
    }
    return connection;
  }

}
