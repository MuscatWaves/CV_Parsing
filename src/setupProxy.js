const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api/login.php", {
      target: "https://cv.omanjobs.om",
      changeOrigin: true,
    })
  );
};
