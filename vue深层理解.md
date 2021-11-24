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
