const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "https://cv.omanjobs.om",
      changeOrigin: true,
    })
  );
};
