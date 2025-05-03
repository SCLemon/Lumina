const { defineConfig } = require('@vue/cli-service');
const WebpackObfuscator = require('webpack-obfuscator');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: './',
  devServer: {
    https: false,
    proxy: {
      '/stock': {
        target: 'http://127.0.0.1:3007',
      },
    }
  },
  productionSourceMap: false,
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 添加加密和混淆插件
      config.plugins.push(
        new WebpackObfuscator({
          rotateUnicodeArray: true,
        })
      );

      // 使用 TerserPlugin 進行壓縮
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            extractComments: false,
          },
        })
      );

      // Tree shaking
      config.optimization.usedExports = true;
      
      // 拆分代碼
      config.optimization.splitChunks = {
        chunks: 'all', // 可選：'async' | 'all' | 'initial'
        minSize: 20000, // 最小尺寸
        maxSize: 0, // 0 表示不限制
        minChunks: 1, // 最少使用次數
        maxAsyncRequests: 30, // 最大的異步請求數
        maxInitialRequests: 30, // 最大的初始請求數
        automaticNameDelimiter: '~',
      }
    }
  }
});
