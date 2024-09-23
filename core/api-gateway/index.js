const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api/core', createProxyMiddleware({ target: 'http://engine:3000', changeOrigin: true }));
app.use('/api/analytics', createProxyMiddleware({ target: 'http://service-analytics:3001', changeOrigin: true }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});