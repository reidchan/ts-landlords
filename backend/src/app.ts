import 'reflect-metadata';
import { EggApplication } from 'midway';

import { RedisProvider } from './framework/database/redis/RedisProvider';
import { MysqlProvider } from './framework/database/mysql/MysqlProvider';


class Application {

  private app!: EggApplication;

  constructor(app: EggApplication) {
    this.app = app;
    this.init();
  }

  public async init() {
    global.CACHE = await new RedisProvider(this.app, this.app.config.cache).connect();
    global.DATABASE = await new MysqlProvider(this.app, this.app.config.database).connect();
  }

}

export default Application;
