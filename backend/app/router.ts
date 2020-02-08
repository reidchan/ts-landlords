import { Application } from 'egg';
import { BackendEvent } from 'landlord-core';

export default (app: Application) => {
  const { controller, router, io } = app as any;

  router.get('/home', controller.home.index);
  const nsp = io.of('/');
  nsp.route(BackendEvent.joinRoom, io.controller.room.joinRoom);
  nsp.route(BackendEvent.readyUser, io.controller.room.readyUser);
};
