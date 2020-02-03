import { Application } from 'midway';


export default (app: Application) => {
  const { io } = app;
  const nsp = io.of('/');
  nsp.route('joinRoom', io.controller.room.joinRoom);
};
