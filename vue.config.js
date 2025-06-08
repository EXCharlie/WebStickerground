const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === "production" ? "/WebStickerground/" : "/",
  transpileDependencies: true,
  chainWebpack: config =>{
    config.plugin('html')
      .tap(args => {
        args[0].title = "MessagesBox";
        return args;
      })
  }
  // lintOnSave: false,
})
