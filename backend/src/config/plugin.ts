import { EggPlugin } from 'midway'
export default {
  static: true,
  io: {
    enable: true,
    package: 'egg-socket.io'
  },
  redis: {
    enable: true,
    package: 'egg-redis'
  },
  security: {
    enable: false,
    package: 'egg-security',
  },
} as EggPlugin
