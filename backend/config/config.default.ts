import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1580960118827_5725';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };


  config.io = {
    init: {},
    namespace: {
      '/': {
        connectionMiddleware: [ 'authentication' ],
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
    entities: [ 'src/app/entity/model/**/*.ts' ],
    migrations: [ 'src/migration/**/*.ts' ],
    subscribers: [ 'src/subscriber/**/*.ts' ],
  };

  config.jwt = {
    secret: '2gzhvbi7qbsc',
  };

  config.alinode = {
    server: 'wss://agentserver.node.aliyun.com:8080',
    appid: '83613',
    secret: '5a684817f48b0615413020d79954940996def0c1',
    logdir: '/Users/super2god/logs/alinode',
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  const wrongProcessor = {
    onerror: {
      all(err: Error, ctx: any) {
        if (err.name === 'UnauthorizedError') {
          ctx.fail('鉴权信息有问题，请重新登录', 401);
        } else {
          ctx.fail(err.message);
        }
      },
    },
  };

  return {
    ...wrongProcessor,
    ...config,
    ...bizConfig,
  };
};
