import { Application } from 'midway'

export default (app: Application) => {
  const { io } = app;
  io.of('/').route('online', io.controller.hello.sayHi); 
};