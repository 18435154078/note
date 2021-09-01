<center><h1>vue实现头条移动端</h1></center>

## 常见移动端ui组件库

framework7、vux、vant、Mand Mobile、nutui



课程笔记：https://www.yuque.com/lipengzhou/toutiao-mobile-vue

接口文档：https://www.yuque.com/lipengzhou/toutiao-mobile-vue/rig3gm

课程资料：https://www.yuque.com/lipengzhou/toutiao-mobile-vue/catt08#1547353c

## 一、 vant

### 1. 按需导入vant组件

#### 1）安装插件

```shell
npm i babel-plugin-import -D
```

#### 2）配置`.babelrc`

创建`.babelrc`文件并配置

```json
{
  "plugins": [
    ["import", {
      "libraryName": "vant",
      "libraryDirectory": "es",
      "style": true
    }]
  ]
}
```

#### 3）按需引入组件

```js
import { Button, Calendar, DatetimePicker, NumberKeyboard, Field } from 'vant'
Vue.use(Button).use(Calendar).use(DatetimePicker).use(NumberKeyboard).use(Field)
```

### 2. 移动端REM适配

#### 1） 使用`lib-flexble` 用于设置rem基准值（HTML标签字体大小）

```shell
npm i amfe-flexible
```

`main.js` 中引入

```js
import 'amfe-flexible'
```

#### 2）使用 `postcss-pxtorem` 将px转成rem

```shell
npm i postcss-pxtorem@5.1.1 -D
```

配置 `postcss.config.js` 

 ```js
 module.exports = {
   plugins: {
     'postcss-pxtorem': {
       rootValue: 37.5,
       propList: ['*']
     }
   }
 }
 ```

**`PostCSS` 是什么**：

`PostCSS` 是一个允许使用js插件来转换样式的工具主要功能有：

`PostCSS` 是基于nodejs环境运行的，可以通过 `postcss.config.js` 配置文件来配置 `PostCSS` 属性

- 使用更新的css语法：`PostCSS Preset Env`

- 自动补齐各大浏览器的兼容前缀：`Autoprefixer`

  `vue-cli`自动配置 `Autoprefixer`

  - `Autoprefixer`可以在 `.browserslistrc` 配置文件中配置，也可以在`package.json` 中`browserslist`字段来配置

    ```json
    {
      "browserslist": [
        "> 1%",
        "last 2 versions",
        "not dead",
        "Android >= 4.0",
    	"iOS >= 8"
      ]
    }
    ```

    ```
    > 1%
    last 2 versions
    not dead
    Android >= 4.0
    iOS >= 8
    ```

    

- 自动把 `px` 转化为 `rem` ： `postcss-pxtorem`

  - 在 `postcss.config.js` 中配置

  - ```js
    'postcss-pxtorem': {
        rootValue: 37.5,
        propList: ['*']
    }
    ```

  - `rootValue` : 转换的根元素的基准值，vant基础像素是375，所以我们这里就是37.5

  - `propList` : 需要转换的css属性，`*`表示所有

- css代码压缩

### 3. 登录注册（表单）

