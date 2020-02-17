export default () => {
  return async (_ctx, next) => {
    console.log('connection...');
    await next();
  };
};
