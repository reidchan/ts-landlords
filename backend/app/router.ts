import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router, io } = app as any;

  router.get('/home', controller.home.index);
  const nsp = io.of('/');
  nsp.route('joinRoom', io.controller.room.joinRoom);
};
