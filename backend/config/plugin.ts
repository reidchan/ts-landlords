import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,

  cors: {
    enable: true,
    package: 'egg-cors',
  },
  io: {
    enable: true,
    package: 'egg-socket.io',
  },
  alinode: {
    enable: false,
    package: 'egg-alinode',
  },
};

export default plugin;
