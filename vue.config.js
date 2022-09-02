const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭 eslint 检查
  lintOnSave: false,

  // 代理跨域
  devServer: {
    proxy: {
      // 路径中遇到api时候自动向代理服务器发送请求。
      'api/': {
        target: 'http://gmall-h5-api.atguigu.cn',
      }
    }
  }

})
