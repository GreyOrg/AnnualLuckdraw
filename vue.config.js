const IS_DEV = process.env.NODE_ENV === "development" ? true : false;
// 定义压缩文件类型
module.exports = {
  productionSourceMap: false,
  transpileDependencies: ["core-js", "vue", "vuex", "lodash"],
  chainWebpack: (config) => {
    config.entry("main").add("@babel/polyfill");
    config.entry.app = ["@babel/polyfill", "./src/main.js"];
  },
  configureWebpack: (config) => {
    // 对资源文件进行压缩
    if (process.env.NODE_ENV === "production") {
      // 生产环境
      //   config.plugins.push(
      //     new CompressionWebpackPlugin({
      //       filename: "[path].gz[query]", // 提示 compression-webpack-plugin@3.0.0的话asset改为filename
      //       algorithm: "gzip",
      //       test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
      //       threshold: 10240,
      //       minRatio: 0.8,
      //     })
      //   );
      // 公共代码抽离
      config.optimization = {
        splitChunks: {
          // 分割代码块
          cacheGroups: {
            vendor: {
              //第三方库抽离
              chunks: "all",
              test: /node_modules/,
              name: "vendor",
              minChunks: 1, //在分割之前，这个代码块最小应该被引用的次数
              maxInitialRequests: 5,
              minSize: 0, //大于0个字节
              priority: 100, //权重
            },
            common: {
              //公用模块抽离
              chunks: "all",
              test: /[\\/]src[\\/]js[\\/]/,
              name: "common",
              minChunks: 2, // 在分割之前，这个代码块最小应该被引用的次数
              maxInitialRequests: 5,
              minSize: 0, //大于0个字节
              priority: 60,
            },
            styles: {
              //样式抽离
              name: "styles",
              test: /\.(le|sa|sc|c)ss$/,
              chunks: "all",
              enforce: true,
            },
            runtimeChunk: {
              name: "manifest",
            },
          },
        },
      };
    }
    // 取消webpack警告的性能提示
    config.performance = {
      hints: "warning",
      //入口起点的最大体积
      maxEntrypointSize: 1000 * 1000,
      //生成文件的最大体积
      maxAssetSize: 1000 * 1000,
      //只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith(".js");
      },
    };
  },
  lintOnSave: false,
  publicPath: IS_DEV ? "/" : "/grey/annualluckdraw",
};
