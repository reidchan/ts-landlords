import { Application } from 'midway';


export default (app: Application) => {
  const { io } = app;
  io.of('/').route('joinRoom', io.controller.room.joinRoom);
};
