import { EggAppInfo } from 'midway';

import { DefaultConfig } from './config.modal';


export default (appInfo: EggAppInfo) => {
  const config = <DefaultConfig> {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1572360961774_6144';

  // add your config here
  config.middleware = [];

  config.welcomeMsg = 'Hello midwayjs!';

  config.io = {
    init: {},
    namespace: {
      '/': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
      '/example': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
    },
  };

  config.cache = {
    host: '127.0.0.1',
    port: 5379,
    db: 3,
    reconnectTime: 3,
  };

  config.database = {
    host: '127.0.0.1',
    port: 2306,
    username: 'root',
    database: 'landlords',
    synchronize: true,
    logging: false,
    entities: ['src/app/entity/model/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
  };

  return config;
};
