import { EggAppInfo } from 'midway'

import { DefaultConfig } from './config.modal'


export default (appInfo: EggAppInfo) => {
  const config = <DefaultConfig> {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1572360961774_6144';

  // add your config here
  config.middleware = []

  config.welcomeMsg = 'Hello midwayjs!'

  return config
}
