module.exports = () => {
  return async function (ctx, next) {
    ctx.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT",
      "Access-Control-Allow-Headers":
        "Content-Type,If-Modified-Since,Cache-Control",
    });
    if (ctx.method === "OPTIONS") {
      ctx.status = 200;
      return;
    }
    await next();
  };
};
