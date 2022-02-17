<center><h1>vue深入讲解</h1></center>

## 一、组价之间的传值

### 1. 隔代传值

父组件

```js
export default {
  provide () {
    return {
        foo: 'hello'
    }
  }
}
```

后代组件

```js
export default {
  inject: {
    foo: {
       type: String,
       default: ''
    }
  }
}
```



## 二、封装一个element表单组件

### 1. 实现父子组件数据的双向绑定

- 子组件通过`绑定属性`和`@input`实现数据的双向绑定
- 父组件通过v-model实现数据的双向绑定
- 子组件通过`v-bind="$attrs"`接收父组件传入的除value之外的属性，`inheritAttrs: false` 避免顶层容器继承属性

父组件

```vue
<template>
  <div>
    <!--v-model语法糖-->
    <Children v-model="value" type="submit" name="hello" />
      
    <Children :value="value" @input="onInput" />
    {{ value }}
  </div>
</template>

<script>
import Children from '@/components/Kinput'
export default {
  data() {
    return {
      value: ''
    }
  },
  components: { Children },
  methods: {
    onInput (e) {
      this.value = e
    }
  }
};
</script>

```

子组件

```vue
<template>
  <div id="children">
    <input
      v-bind="$attrs"
      :value="value"
      @input="$emit('input', $event.target.value)">
  </div>
</template>
<script>
export default {
  // 避免顶层容器继承属性
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: ''
    }
  }
}
</script>
```

### 2. 表单验证

验证规则：`async-validator`

<a href="https://www.cnblogs.com/wozho/p/10955525.html">async-validator</a>

- 使用：`index.vue`

  ```vue
  <template>
    <div>
      <Kform :model="model" :rules="rules" ref="Form">
        <KinputItem label="用户名" prop="username">
          <Kinput v-model="model.username" />
        </KinputItem>
        <KinputItem label="密码" prop="password">
          <Kinput v-model="model.password" type="password" />
        </KinputItem>
        <KinputItem>
          <Kinput type="submit" @click.native="handleSubmit" />
        </KinputItem>
      </Kform>
    </div>
  </template>
  
  <script>
  import Kinput from '@/components/input1/Kinput'
  import KinputItem from '@/components/input1/KinputItem'
  import Kform from '@/components/input1/Kform'
  export default {
    data() {
      return {
        model: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            {required: true, message: '请填写用户名', trigger: 'blur'},
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
          ],
          password: [
            {required: true, message: '请填写密码'}
          ]
        }
      }
    },
    components: {
      Kinput, KinputItem, Kform
    },
    methods: {
      handleSubmit () {
        this.$refs.Form.validata((isVal) => {
          console.log(isVal)
        })
      }
    }
  }
  </script>
  ```

- form组件：`Kform.vue`

  ```vue
  <template>
    <div>
      <slot></slot>
    </div>
  </template>
  
  <script>
  export default {
    provide() {
      return {
        form: this
      }
    },
    props: {
      model: {
        type: Object,
        required: true
      },
      rules: {
        type: Object
      }
    },
    methods: {
      validata (callback) {
        const tasks = this.$children.filter(item => item.prop).map(item => item.validata())
        Promise.all(tasks).then(res => {
          callback(true)
        })
        .catch(() => {
          callback(false)
        })
      }
    }
  }
  </script>
  ```

- formItem组件：`KformItem.vue`

  ```vue
  <template>
    <div>
      <label v-if="label">{{ label }}</label>
      <slot></slot>
      <span class="err" v-if="errMessage">{{ errMessage }}</span>
    </div>
  </template>
  
  <script>
  import Schema from 'async-validator'
  export default {
    inject: ['form'],
    data() {
      return {
        errMessage: ''
      }
    },
    props: {
      label: {
        type: String
      },
      prop: {
        type: String
      }
    },
    mounted() {
      this.$on('validata', () => {
        this.validata()
      })
    },
    methods: {
      validata() {
        const value = this.form.model[this.prop]
        const rule = this.form.rules[this.prop]
        const desc = {
          [this.prop]: rule
        }
        const schema = new Schema(desc)
        return schema.validate({[this.prop]: value}, (err) => {
          if(err) {
            this.errMessage = err[0].message
          } else {
            this.errMessage = ''
          }
        })
      }
    }
  }
  </script>
  
  <style lang="less" scoped>
  .err {
    font-size: 12px;
    color: red;
  }
  </style>
  ```

- input组件：`Kinput.vue`

  ```vue
  <template>
    <div>
      <input :value="value" @input="onInput" v-bind="$attrs">
    </div>
  </template>
  
  <script>
  export default {
    inheritAttrs: false,
    props: {
      value: {
        type: String
      }
    },
    methods: {
      onInput (e) {
        this.$emit('input', e.target.value)
        this.$parent.$emit('validata')
      }
    }
  }
  </script>
  ```

## 三、弹窗类组件

### 1. 代码段

`create.js`

```js
import Vue from 'vue'
// create函数接收两个参数，第一个是组件，第二个是属性
export default function create(component, props) {
  // 创建实例化组件
  const vm = new Vue({
    // 这里用render函数去渲染
    render: h => h(component, {props})
  }).$mount()

  // 获取弹窗组件
  const comp = vm.$children[0]

  // 将弹窗组件的dom挂载到body上
  document.body.appendChild(vm.$el)

  // 给弹窗组件注册remove方法，用来注销组件，避免内存泄漏
  comp.remove = () => {
    document.body.removeChild(vm.$el)
    vm.$destroy()
  }

  // 将得到的弹窗组件返回
  return comp
}
```

弹窗组件：`Notice.vue`

```vue
<template>
  <div class="notice">
    <h3>{{ title }}</h3>
    <q>{{ message }}</q>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false
    }
  },
  // props接受render函数传来的属性
  props: {
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 2000
    }
  },
  methods: {
    // show方法用来显示弹窗组件
    show() {
      this.isShow = true
      // 通过延时器确定通过多少秒自动关闭
      setTimeout(() => {
        this.hide()
      }, this.duration)
    },
    hide() {
      // 隐藏弹窗组件，并将组件进行销毁，防止内存泄漏
      this.isShow = false
      this.remove()
    }
  }
}
</script>

<style lang="less" scoped>
  .notice {
    // position: absolute;
    top: 10px;
    width: 200px;
    left: 300px;
    background: pink
  }
</style>

```

调用

```js
handleSubmit () {
    this.$refs.Form.validata((isVal) => {
        let notice
        if(isVal) {
            notice = create(Notice, {
                title: '标题',
                message: '登录成功',
                duration: 3000
            })
        } else {
            notice = create(Notice, {
                title: '标题',
                message: '登录失败',
                duration: 3000
            })
        }
        notice.show()
    })
}
```

### 2. 细写render函数

`vue.js` 和 `vue.runtime.xxx.js` 的区别

- `vue.js` 是完整版的vue，包含vue核心功能和模板解析器
- `vue.runtime.xxx.js` 是运行时的vue，只包含核心功能，没有模板解析器

`vue.runtime.xxx.js` 不包含模板解析器，所以不能使用 `template` 配置项，需要使用 `render` 函数来接收 `createElement` 函数去指定具体内容

- `createElement` 参数可以是组件实例

  ```js
  render: h => h(App)
  ```

- `createElement` 参数可以是虚拟`DOM结构`

  ```js
  render: h => h('h1', '你好呀')
  ```

Vue 推荐在绝大多数情况下使用模板来创建你的 HTML。然而在一些场景中，你真的需要 JavaScript 的完全编程的能力。这时你可以用**渲染函数**，它比模板更接近编译器。

render函数接收三个参数：

- 标签名
- 属性
- 子元素

h函数每次执行只返回一个dom节点，如果有多层需要逐层嵌套

举个栗子

```js
// <div class="div1" id="box"><span>aaa</span></div>
Vue.component('comp', {
  render: h => {
    // return h('div', {attrs: {id: 'box'}, class: ['div', 'box2']}, [h('span', 'aaa')])
    return h('div', {attrs: {id: 'box'}, class: {div: true, box34: true}}, [h('span', 'aaa')])
  }
})
```



## 四、tree类组件（递归组件）

### 1. 递归组件的条件

- 组件必须有name属性
- 必须有结束条件

`tree.vue`

```vue
<template>
  <ul>
    <li v-for="item in treeList" :key="item.id">
      <div @click="isShow = !isShow">
        <span>{{ item.title }}</span>
        <span v-if="item.children">{{ isShow ? '+' : '-' }}</span>
      </div>
      <div v-show="isShow" v-if="item.children">
        <tree :treeList="item.children" />
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  // 递归组件需要name属性
  name: 'tree',
  props: {
    treeList: Array
  },
  data() {
    return {
      isTree: true,
      isShow: false
    }
  }
}
</script>
```

调用

```vue
<template>
  <div>
    <Tree :treeList="treeList" />
  </div>
</template>

<script>
import Tree from '@/components/tree/Tree'
export default {
  name: 'about',
  data() {
    return {
      treeList: [
        {
          title: 'hello',
          id: 1,
          children: [
            {
              title: 'hello1',
              id: 2,
              children: [
                {
                  title: 'hello',
                  id: 6,
                }
              ]
            },
            {
              title: 'chiildren',
              id: 3,
            }
          ]
        },
        {
          title: 'world',
          id: 4,
          children: [
            {
              title: '弄号',
              id: 10,
              children: [
                {
                  title: '你好',
                  id: 5,
                }
              ]
            }
          ]
        }
      ]
    }
  },
  components: {
    Tree
  }
}
</script>
```

## 五、vue-router组件及原理

```js
import Vue from 'vue'

class VueRouter {
  constructor(options) {
    this.$options = options

    // 创建一个路由path和route的映射
    this.routeMap = {}

    // 路径current需要响应式，此时需要创建一个vue，通过vue去实现响应式
    this.app = new Vue({
      data() {
        return {
          current: '/'
        }
      }
    })
  }

  init() {
    // 绑定浏览器的事件
    this.bindEvent()

    // 解析路由配置
    this.createRouteMap(this.$options)

    // 创建router-link和router-view全局组件
    this.initComponent()

  }

  bindEvent() {
    // 这里需要用bind修正this指向bind(this)
    window.addEventListener('hashchange', this.onHashChange.bind(this))
    window.addEventListener('load', this.onHashChange.bind(this))
  }

  onHashChange() {
    // localhost:8000/#/home
    this.app.current = window.location.pathname || '/'
  }

  createRouteMap(options) {
    options.routes.forEach(item => {
      this.routeMap[item.path] = item
    })
  }

  initComponent() {
    // 申明两个全局组件
    Vue.component('router-link', {
      props: {
        to: {
          type: String,
          required: true
        }
      },
      render(h) {
        // 目标是<a href="this.to"></a>
        // this.$slots.default可以访问匿名插槽
        return h('a', { attrs:{ href: '#' + this.to } }, this.$slots.default)
        // return <a href="{this.to}">{this.$slots.defalut}</a>
      }
    })

    Vue.component('router-view', {
      render: (h) => {
        const comp = this.routeMap[this.app.current].component
        return h(comp)
      }
    })
  }
}

// v把ue-router变成插件使用 VueRouter.install
VueRouter.install = function(_Vue) {
  const Vue = _Vue // 将vue实例保存

  // 混入任务
  Vue.mixin({
    created() {
      // 将来在初始化的时候回调用，这样就实现了vue的扩展
      if(this.$options.router) {
        Vue.prototype.$router = this.$options.router
        this.$options.router.init()
      }
    }
  })
}

export default VueRouter
```

## 六、 vuex源码及实现原理

```js
let Vue

class Store {
  constructor(options = {}) {
    
// 1. 维护状态state
// 5. 实现state响应式
    this.state = new Vue({
      data() {
        return options.state
      }
    })

    // 初始化mutations
    this.mutations = options.mutations || {}
    this.actions = options.actions || {}

    options.getters && this.handleGetters(options.getters)
  }

// 2. 修改状态commit

  commit = (type, arg) => {
    const fn = this.mutations[type]
    fn(this.state, arg)
  }

// 3. 业务逻辑的状态dispatch

  dispatch(type, arg) {
    const fn = this.actions[type]
    return fn({commit: this.commit, state: this.state}, arg)
  }

// 4. 状态派发
  handleGetters(getters) {
    this.getters = {}
    Object.keys(getters).forEach(item => {
      Object.defineProperty(this.getters, item, {
        get: () => {
          return getters[item](this.state)
        }
      })
    })
  }
}

// 6. 插件
function install(_Vue) {
  Vue = _Vue
  
  // 7. 混入
  Vue.mixin({
    beforeCreate() {
      if(this.$options.store) {
        // 把store混入到vue原型上
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default {Store, install}
```

## 七、 vue源码及实现原理

### 1. `Object.defineProperty`

```js
const obj = {}
Object.defineProperty(obj, 'name', {
    get: () => {
        console.log('有人想获取')
    },
    set: (aa) => {
        console.log(aa)
    }
})
obj.name // 有人想获取
obj.name = 'hello' // console.log(hello)
```

### 2. 简版vue







## 八、Vnode（虚拟DOM）



## 九、数据劫持以及数据代理

### `Object.defineProperty`

```js
var obj = {
    name: 'bob',
    age: 12,
}
var hobby = '吃'
Object.defineProperty(obj, 'hobby', {
    // value: '吃',
    configurable: true,  //配置是否允许被删除 true(默认值) 可以被删除，false 不能被删除
    enumerable: true,    //配置是否允许被枚举 true(默认值) 可以被枚举，false 不能被枚举
    get() {
        console.log('有人取值了')
        return hobby
    },
    set(value) {
        console.log('有人改值了', value)
        hobby = value
    }
})
```

- 追加的对象
- 追加的属性
- 属性配置

属性配置项：

- `value`：属性值

- `configurable`：配置是否允许被删除 true(默认值) 可以被删除，false 不能被删除
- `enumerable`：配置是否允许被枚举 true(默认值) 可以被枚举，false 不能被枚举
- `get`：getter配置
- `set`：setter配置

### `Object.defineProperties`

```js
var obj = {
    name: 'bob',
    age: 12,
}
var hobby = '吃'
Object.defineProperties(obj, {
    hobby: {
        get() {
            return hobby
        },
        set(value) {
            hobby = value
        }
    },
    num: {
        configurable: true,
        get() {
            return num
        },
        set(value) {
            num = value
        }
    }
})
```

- 追加的对象
- 追加的属性

属性配置项：

- `value`：属性值

- `configurable`：配置是否允许被删除 true(默认值) 可以被删除，false 不能被删除
- `enumerable`：配置是否允许被枚举 true(默认值) 可以被枚举，false 不能被枚举
- `get`：getter配置
- `set`：setter配置



## 十、key的作用和原理（面试题）

react和vue中的key有什么作用？

虚拟DOM中的作用：

- key是虚拟DOM对象的标识，当数据发生变化是，vue会根据新数据生成`新的虚拟DOM`，随后vue进行新旧虚拟DOM的差异比较（diff算法），比较规则如下：
  - 对比规则：
    - 旧虚拟DOM找到与新虚拟DOM相同的key：
      - 若虚拟DOM内容没有变化，直接使用之前的真实DOM
      - 若虚拟DOM内容发生变化，则生成新的真实DOM，最后替换旧的真实DOM
    - 旧虚拟DOM中没有找到相同的key
      - 创建真实DOM，随后渲染到页面

用index作为key可能会引发的问题

- 若对数据进行排序，头部删除或添加等破坏顺序的操作会导致效率问题
- 若结构中包含输入类的DOM，可能会引发严重的界面问题

开发过程中如何选择key

- 最好使用每条数据的唯一标识为key，如id，手机号，学号，身份证号等
- 若不对数据进行排序，头部删除或添加等破坏顺序的操作，只做展示，用index是没问题的



## 十一、vue是怎样监测数据改变的

vue的观察者模式

### 数组

Vue 将被侦听的数组的变更方法进行了包裹，所以它们也将会触发视图更新。这些被包裹过的方法包：

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`



### 对象

```js
const obj = {
    name: 'jerry',
    age: 10
}
const vm = {}
function Observer(data) {
    const keys = Object.keys(data)
    keys.forEach(item => {
        this.enumerate(data,item)
    })
}
Observer.prototype.enumerate = function(data, item) {
    Object.defineProperty(this, item, {
        enumerable: true,
        get() {
            return data[item]
        },
        set(newVal) {
            data[item] = newVal
        }
    })
}
const obs = new Observer(obj)

vm._data = obs
Object.keys(vm._data).forEach(item => {
    Object.defineProperty(vm, item, {
        get() {
            return obj[item]
        },
        set(newVal) {
            obj[item] = newVal
        }
    })
})
```

#### vue给一个对象添加属性

`Vue.set(目标对象, key, value)`

`vm.$set(目标对象, key, value)`











## Vue配置文件`vue.config.js`

```js
module.exports = {
    // 项目部署的基础路径
    // 我们默认假设你的应用将会部署在域名的根部，
    // 比如 https://www.my-app.com/
    // 如果你的应用时部署在一个子路径下，那么你需要在这里
    // 指定子路径。比如，如果你的应用部署在
    // https://www.foobar.com/my-app/
    // 那么将这个值改为 `/my-app/`
    publicPath: '/Reader/dist/',　　/*这个是我存放在github在线预览的Reader项目*/

    // 将构建好的文件输出到哪里（或者说将编译的文件）
    outputDir: 'dist',

    // 放置静态资源的地方 (js/css/img/font/...)
    assetsDir: '',
    
    // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
    indexPath: '',

    // 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。然而，这也要求 index 的 HTML 是被 Vue CLI 自动生成的。如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希。
    filenameHashing: false,
    
    // 用于多页配置，默认是 undefined
    pages: {
        index: {
            // 入口文件
            entry: 'src/main.js',　　/*这个是根入口文件*/
            // 模板文件
            template: 'public/index.html',
            // 输出文件
            filename: 'index.html',
            // 页面title
            title: 'Index Page'
        },
        // 简写格式
        // 模板文件默认是 `public/subpage.html`
        // 如果不存在，就是 `public/index.html`.
        // 输出文件默认是 `subpage.html`.
        subpage: 'src/main.js'　　　　/*注意这个是*/
    },

    // 是否在保存的时候使用 `eslint-loader` 进行检查。
    // 有效的值：`ture` | `false` | `"error"`
    // 当设置为 `"error"` 时，检查出的错误会触发编译失败。
    lintOnSave: true,

    // 使用带有浏览器内编译器的完整构建版本
    // 查阅 https://cn.vuejs.org/v2/guide/installation.html#运行时-编译器-vs-只包含运行时
    runtimeCompiler: false,

    // babel-loader 默认会跳过 node_modules 依赖。
    // 通过这个选项可以显式转译一个依赖。
    transpileDependencies: [/* string or regex */],

    // 是否为生产环境构建生成 source map？
    productionSourceMap: true,

    // 调整内部的 webpack 配置。
    // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/webpack.md
    chainWebpack: () => {},
    configureWebpack: () => {},

    // CSS 相关选项
    css: {
        // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
        // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
        extract: true,

        // 是否开启 CSS source map？
        sourceMap: false,

        // 为预处理器的 loader 传递自定义选项。比如传递给
        // sass-loader 时，使用 `{ sass: { ... } }`。
        loaderOptions: {},

        // 为所有的 CSS 及其预处理文件开启 CSS Modules。
        // 这个选项不会影响 `*.vue` 文件。
        modules: false
    },

    // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`
    // 在多核机器下会默认开启。
    parallel: require('os').cpus().length > 1,

    // PWA 插件的选项。
    // 查阅 https://github.com/vuejs/vue-cli/tree/dev/packages/@vue/cli-plugin-pwa
    pwa: {},

    // 配置 webpack-dev-server 行为。
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/cli-service.md#配置代理
        proxy: {
            '/api': {
                target: 'http://localhost:8880',
                changeOrigin: true,
                secure: false,
                // ws: true,
                pathRewrite: {
                    '^/api': '/static/mock'   // 请求数据路径别名,这里是注意将static/mock放入public文件夹
                }
            }
        },
        before: app => {}
    },

    // 三方插件的选项
    pluginOptions: {
        // ...
    }
}
```







暴露webpack配置命令

```shell
vue inspect > output.js
```





## 任务、微任务、队列和计划

<a href="https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/">https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/</a>

```js
console.log('script start');

setTimeout(function () {
  console.log('setTimeout');
}, 0);

Promise.resolve()
  .then(function () {
    console.log('promise1');
  })
  .then(function () {
    console.log('promise2');
  });

console.log('script end');
```

- Tasks：宏任务

- Microtasks：微任务

- JS stack：js执行栈

- Log：输出



实现流程：

- script脚本加入Tasks（宏任务）中，执行JS stack 

- 输出`script start`

- 将setTimeout加入Tasks（宏任务）中

- 将Promise回调放到Microtasks（微任务）中
- 输出`script end`
- script脚本**退出**JS stack 

- Promise1 then执行JS stack
- 输出`promise1`
- promise返回underfind，将下一个promise任务加入Microtasks（微任务）队列
- promise1**退出**JS stack
- Promise2 then**执行**JS stack
- 输出`promise2`
- Promise2 then**退出**JS stack
- 浏览器刷新
- 执行setTimeout
- setTimeout**执行**JS stack
- 输出`setTimeout`
- setTimeout退出JS stack
