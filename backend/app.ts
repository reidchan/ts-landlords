import { RedisProvider } from './app/framework/database/redis/RedisProvider';
import { MysqlProvider } from './app/framework/database/mysql/MysqlProvider';
import { Application } from 'egg';

class App {

  private app!: Application;

  constructor(app: Application) {
    this.app = app;
    this.init();
  }

  public async init() {
    global.CACHE = await new RedisProvider(this.app, this.app.config.cache).connect();
    global.DATABASE = await new MysqlProvider(this.app, this.app.config.database).connect();
    console.log('process.versions =>', process.versions);
    console.log('process.env =>', process.env);
  }

}

export default App;
