module.exports = (app) => {
  // app.use(app.middleware.cors);
  app.config.coreMiddleware.unshift("cors");
};
