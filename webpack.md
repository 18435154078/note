<center><h1>webpack</h1></center>

## 1. 什么是webpack

本质上，**webpack** 是一个用于现代 JavaScript 应用程序的 *静态模块打包工具*。当 webpack 处理应用程序时，它会在内部从一个或多个入口点构建一个 [依赖图(dependency graph)](https://webpack.docschina.org/concepts/dependency-graph/)，然后将你项目中所需的每一个模块组合成一个或多个 *bundles*，它们均为静态资源，用于展示你的内容。

## 2. 前端模块化发展

- 早期使用grunt和gulp将所有的项目文件拼接，利用立即执行函数（IIFE），解决作用域和冲突的问题

  ```js
  ;(function() {
      var world = 'world'
  })()
  
  var world = (function() {
      var hello = 'hello'
      return hello
  })()
  console.log(world)
  ```

- commonjs

  - node环境

    index.js

    ```js
    module.exports = {
        hello: () => {
            console.log('hello')
        },
        world: () => {
            console.log('world')
        }
    }
    ```

    index2.js

    ```js
    const msg = require('./index')
    msg.world()
    ```

    终端运行 `node ./index2.js`，输出`world`

    

  - 浏览器环境

    index.html

    ```html
    <script src="https://cdn.bootcdn.net/ajax/libs/require.js/2.3.6/require.js" data-main="./main.js"></script>
    ```

    main.js

    ```js
    require(['./index.js'], function(data) {
        console.log(data) // data就是index.js中return出去的对象
    })
    ```

    index.js

    ```js
    const hello = () => {
        console.log('hello')
    }
    const world = () => {
        console.log('world')
    }
    
    define([], function() {
        return {
            hello,
            world
        }
    })
    ```

    **注**：`require` 的第一个参数是要引入的模块，第二个回调函数的参数是引入模块的内容，有几个模块就有几个参数，

    `define` 的第一个参数是要引入的模块，第二个回调函数返回值是要输出的值

- ECMAscript

  index.html

  ```html
  <script type="module">
      import { hello as aaa, world } from './index.js'
      import bbb from './index2.js'
      console.log(aaa, world)
  </script>
  ```

  index.js

  ```js
  export const hello =  () => {
      alert('hello')
  }
  export const world =  () => {
      alert('world')
  }
  ```

  index2.js

  ```js
  export default () => {
      alert('hello')
  }
  ```

## 3. webpack

### 3.1 安装

```shell
npm i webpack webpack-cli -g
npm i webpack webpack-cli -d
```

### 3.2 运行

目录结构

- src

  - index.js

    ```js
    import helloworld from './helloworld'
    helloworld()
    ```

  - helloworld.js

    ```js
    export default () => {
        console.log('hello')
    }
    ```

用全局webpack运行

```shell
webpack
```

应开发环境下webpack运行

```shell
npx webpack
```

此时目录结构

- src

  - index.js

    ```js
    import helloworld from './helloworld'
    helloworld()
    ```

  - helloworld.js

    ```js
    export default () => {
        console.log('hello')
    }
    ```

- dist

  - main.js

    ```js
    (()=>{"use strict";console.log("hello")})();
    ```

执行 `webpack` 会默认打包，默认入口文件是`src/index.js`，然后回根据`index.js`中的依赖对文件进行打包，包括第三方包，会在同级目录输出`dist` 文件

- 执行`webpack`，默认打包是全局webpage的作用
- 如果需要用到项目中的webpack，可执行命令`npx webpack`

## 4. webpack配置文件

### 4.1 输入和输出

```js
const path = require('path')
module.exports = {
  entry: './src/index1.js',
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, './dest'),
    clean: true,
    assetModuleFilename: 'image/[name][ext]'
  },
  mode: 'development'
}
```

- `entry`：入口文件

- `output`：出口属性
  
  - `filename`：输出的文件名称
  
  - `path`：输出的文件目录，这里必须是绝对路径
  
  - `clean`：打包时替换之前打包的文件
  
  - `assetModuleFilename`：指定静态资源的路径
  
    `assetModuleFilename: 'image/[name][ext]'`：name表示按照源文件名称
  
    `assetModuleFilename: 'image/[contenthash:8][ext]'`：根据文件名称自动生成hash，可指定hash长度

### 4.2 插件（plugins）

#### 4.2.1 html-webpack-plugin

打包html文件，并在我文件中引入打包好的js文件

github：https://github.com/jantimon/html-webpack-plugin#options

```js
// HtmlWebpackPlugin默认会生成一个html文件，并将大包好的js文件引入
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      filename: './public/index.html',
      template: 'index1.htm',
      title: 'hello webpack',
      inject: 'body',
      templateContent: `
        <html>
          <head>
            <title>自定义模板</title>
          </head>
          <body></body>
        </html>
      `
    })
  ]
}
```

常用属性

- filename：输出的html文件目录及名字

- template：选择一个html模板文件，可以是任意后缀

- title：页面名称，需要符合`html-webpack-plugin`模板引擎匹配规则才能解析

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body></body>
  </html>
  ```

- inject：指定打包好的js文件插入的位置，默认为`head`中

- templateContent：可以自定义html模板，此时，`template` 模板文件将无效，不管顺序如何

- 。。。太多了，看文档吧

### 4.2.2 mini-css-extract-plugin

css抽离

```shell
npm i mini-css-extract-plugin -D
```

配置文件

```js
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
module.exports = {
    rules: [
        new MiniCssExtractPlugin({
          	filename: 'styles/[contenthash].css'
        })
    ],
    modules: {
        rules: [
            {
                test: /\.(css|less)$/,
        		use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
            }
        ]
    }
}
```

#### 4.5.3 css-minimizer-webpack-plugin

css文件压缩

```shell
npm i css-minimizer-webpack-plugin -D
```

配置文件

```js
const CssMinimiaerWebpackPlugin = require('css-minimizer-webpack-plugin')
module.exports = {
    plugin: [
        new CssMinimiaerWebpackPlugin()
    ]
}
```







### 4.3 webpack-dev-server

安装

```shell
npm i webpack-dev-server -D
```

运行

```shell
npx webpack-dev-derver
npx webpack server
```



### 4.4 静态资源模块



属性：

- test：检测后缀名

- type

  - `asset/resource`：生成资源的url地址

    ```js
    module: {
        rules: [
            {
                test: /\.(png|jpg|jfif)$/,
                type: 'asset/resource'
            }
        ]
    }
    ```

  - `asset/inline`：生成资源的data Url（base64）

    ```js
    module: {
        rules: [
            {
                test: /\.(png|jpg|jfif)$/,
                type: 'asset/inline'
            }
        ]
    }
    ```

  - `asset/source`：生成资源源代码

  - `asset`：生成资源的url地址/生成资源的data Url，根据资源大小自动选择

    ```js
    module: {
        rules: [
            {
                test: /\.(png|jpg|jfif)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024 * 1024
                    }
                }
            }
        ]
    }
    ```

    可以通过 `parser` 设置转成 `base64` 的图片最大值，默认8k
  
- parser：指定转为base64最小文件

  ```js
  module: {
      rules: [
        {
          test: /\.(png|jpg|jfif)$/,
          type: 'asset/resource',
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024 * 1024
            }
          }
        }
      ]
    }
  ```
  
  
  
- generator：指定今天文件目录

  ```js
  module: {
      rules: [
          {
              test: /\.(png|jpg|jfif)$/,
              type: 'asset/resource',
              generator: {
                  filename: 'image/[name][ext]'
              }
          }
      ]
  }
  ```

  **这里的 `generator` 路径会覆盖在enter中 `assetModuleFilename` 定义的路径**

### 4.5 loader

解析webpack无法打包的文件资源



#### 4.5.1 babel-loader

```shell
npm i babel-loader @babel/core @babel/preset-env @babel/runtime @babel/plugin-transform-runtime -D
```

- `babel-loader`：在webpack中解析ES6
- `@babel-core`：babel核心模块
- `@babel/preset-env`：babel预设，一组babel插件的集合
- `@babel/runtime`：包含`regeneratorRuntime`运行时需要的内容
- `@babel/plugin-transform-runtime`：自动导入需要的 `regeneratorRuntime` 包

`regeneratorRuntime` 是 `webpack` 打包生成的全局辅助函数，由 `babel` 生成，用于兼容 `async/await` 的语法。



#### 4.5.2 css-loader

```shell
npm i style-loader css-loader -D
```



```js
module.exports = {
    modules: {
        rules: [
           	{
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            }
        ]
    }
}
```







### source map(devtool)

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/index1.js',
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, './dest'),
    clean: true
  },
// source map配置
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      filename: './public/index3.html',
      title: 'hello webpack',
      inject: 'body'
    })
  ],
  mode: 'production'
}
```



## 5. 命令行

### 5.1 输入和输出

指定打包入口文件，输出目录，编译模式

```shell
npx webpack --entry ./src/index.js --output-path ./dest --mode production
```

### 5.2 自动编译

```shell
npx webpack watch
```





## 6. 多入口

### 6.1 基本结构

```js
entry: {
    index: './src/index1.js',
    index1: './src/index2.js'
},
output: {
    filename: 'src/[contenthash].js',
    // filename: 'src/[name].js',
    path: path.resolve(__dirname, './dest'),
    clean: true,
    assetModuleFilename: 'image/[contenthash:8]][ext]'
},
```

### 6.2 抽离公共部分

```js
entry: {
    index: {
        import: './src/index1.js',
        dependOn: 'jquery'
    },
    index1: {
        import: './src/index2.js',
        dependOn: 'jquery'
    },
    jquery: ''
},
output: {
    filename: 'src/[contenthash].js',
    path: path.resolve(__dirname, './dest'),
    clean: true,
    assetModuleFilename: 'image/[contenthash:8]][ext]'
},
```

