const path = require('path');
const px2rem = require('postcss-plugin-px2rem')

function resolve (dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          px2rem({
            rootValue: 16,
            exclude: /node_modules/,
            selectorBlackList: ['no-rem']
          })
        ]
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
  }
}