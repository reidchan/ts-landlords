import 'reflect-metadata';
import { RedisProvider } from './framework/database/redis/RedisProvider';
import { MysqlProvider } from './framework/database/mysql/MysqlProvider';
import { EggApplication } from 'midway';

class Application {

  private app!: EggApplication;

  constructor(app: EggApplication) {
    this.app = app;
    this.init();
  }

  async init () {
    global.CACHE = await new RedisProvider(this.app, this.app.config.cache).connect();
    global.DATABASE = await new MysqlProvider(this.app, this.app.config.database).connect();
  }
}

export default Application;