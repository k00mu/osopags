const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api/core', createProxyMiddleware({ target: `http://engine:${process.env.ENGINE_PORT}`, changeOrigin: true }));
app.use('/api/analytics', createProxyMiddleware({ target: `http://service-analytics:${process.env.SERVICE_ANALYTICS_PORT}`, changeOrigin: true }));

const PORT = process.env.API_GATEWAY_PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});