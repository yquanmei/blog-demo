module.exports = (app) => {
  // app.use(app.middleware.cors); // bug：无效
  app.config.coreMiddleware.unshift("cors");
};
