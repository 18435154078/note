<center><h1>vuejs</h1></center>



单页面应用程序：只更新局部页面，整个网页不会刷新

 

多页面程序：

## 一、 介绍

Vue是一套用于构建用户界面的**渐进式框架**。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层（页面），不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与[现代化的工具链](https://cn.vuejs.org/v2/guide/single-file-components.html)以及各种[支持类库](https://github.com/vuejs/awesome-vue#libraries--plugins)结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。

 ## 二、 组件之间的通信方式

### 1. 父传子

- 父子间通过属性传值
- 子组件通过props接受

```js
// 子组件
let childrenComponent = {
    data(){
        return {}
    },
    props: {
        msg: {
            type: String,
            default: 'hello world!!!'
        }
    },
    template: `
        <div>
            <input type="text" :value="msg" @input="msg = event.target.value"/>
            {{ msg }}
        </div>
    `,
}
// vue实例
new Vue({
    el: '#app',
    data() {
        return {
            msg: 'hello vue!!'
        }
    },
    components: {
        // 声明组件
        childrenComponent
    },
    // 挂载
    template: '<children-component :msg="msg"/>'
})
```

### 2. 子传父

- 子组件通过 `this.$emit` 自定义事件，将值传给父组件
- 父子间通过绑定自定义事件来接受子组件传过来的值

```js
Vue.component('children-component', {
    data() {
        return {
            msg: 'hello vue'
        }
    },
    template: `<div>
    	<button @click="handleclick">click</button>
    </div>`,
    methods: {
        handleclick() {
            // 通过自定义事件来传值
            this.$emit('sendMsg', this.msg)
        }
    }
})
new Vue({
    el: '#app',
    data: {
        parentMsg: 'hello'
    },
    template: `
        <div>
            {{ parentMsg }}
            <children-component @sendMsg="getMsg"/>
        </div>
	`,
    methods: {
        // 通过自定义事件来接收值
        getMsg(value) {
            this.parentMsg = value
        }
    }
})
```

### 3. 中央事件总线

- 通过 `bus.$emit()` 来传值
- 通过 `bus.$on()` 来接收值

```js
let bus = new Vue()
Vue.component('Global', {
    data() {
        return {
            msg: 'hello vue'
        }
    },
    template: `
        <div>
        	<button @click="handleclick">click</button>
        </div>
    `,
    methods: {
        handleclick() {
            bus.$emit('getMsg', this.msg)
        }
    }
})
new Vue({
    el: '#app',
    data: {

    },
    template: '<Global />',
    mounted() {
        bus.$on('getMsg', value=> {
            console.log(value)
        })
    }
})
```

### 4. `$attrs` 和 `$listeners`

当组件嵌套层数过深时，可以用 `$attrs` 和 `$listeners`

#### 1）祖先组件传给后代组件

```js
Vue.component('Child1', {
    template: `<Child2 v-bind="$attrs"/>`,
})
Vue.component('Child2', {
    template: `<Child3  v-bind="$attrs"/>`
})
Vue.component('Child3', {
    template: `<div>
    	{{ child3_msg }}  
    </div>`,
    data(){
        return {
            child3_msg: 'child3_msg'
        }
    },
    mounted(){
        console.log(this.$attrs.msg2)
    }
})
new Vue({
    el: '#app',
    data: {
        msg1: 'hello world',
        msg2: 'hello vue'
    },
    template: `<Child1 :msg1="msg1" :msg2="msg2"/>`
})
```

- 祖先组件通过属性传值
- 中间组件通过 `v-bind="$attrs"` 绑定属性
-  子组件就可以通过 `this.$attrs` 访问到祖先元素传过来的值

#### 2） 后代组件传给祖先组件

```js
Vue.component('Child1', {
    template: `<Child2 v-on="$listeners"/>`,
})
Vue.component('Child2', {
    template: `<Child3 v-on="$listeners"/>`
})
Vue.component('Child3', {
    template: `<div></div>`,
    data(){
        return {
            msg1: 'hello world',
            msg2: 'hello vue'
        }
    },
    mounted(){
        this.$emit('getMsg1', this.msg1)
        this.$emit('getMsg2', this.msg2)
    }
})
new Vue({
    el: '#app',
    data: {},
    template: `<Child1 @getMsg1="getMsg1" @getMsg2="getMsg2"/>`,
    methods: {
        getMsg1(value) {
            console.log(value)
        },
        getMsg2(value){
            console.log(value)
        }
    }
})
```

- 后台组件通过 `this.$emit('事件名称', 传值)` 来传值
- 中间组件通过 `v-on="$listeners"` 来过渡
- 祖先组件通过 `@事件名称` ，通过方法来获取值 

### 5. this.$refs

给组件添加 `ref` 属性 通过 `this.$refs` ，可以获取到整个组件，从而可以获取到组件中的data和methods

```js
Vue.component('Child', {
    template: `<div></div>`,
    data() {
        return {
            childMsg: 'hello world'
        }
    }
})
new Vue({
    el: '#app',
    data:{},
    methods: {},
    template: `<Child ref="child"/>`,
    mounted(){
        console.log(this.$refs.child.childMsg)
    }
})
```

- 父组件通过 `ref` 绑定子组件
- 通过 `this.$refs.child` 取到子组件，从而获取子组件中的数据和方法以及计算属性
- **注：ref只有在虚拟DOM挂载之后才能使用，也就是在mounted之后**

### 6. `$parent` 和 `$children`

通过 `$parent` 和 `$children` 来获取父组件或子组件，从而可以获取到数据和方法

## 三、 插槽

### 1. 默认插槽

```js
Vue.component('Global', {
    data() {
        return {}
    },
    template: `<div>
        <button>
        	<slot></slot>  
        </button>
    </div>`
})
new Vue({
    el: '#app',
    data: {},
    template: `
        <Global>
        	click
        </Global>
    `,
})
```

### 2. 具名插槽

```js
Vue.component('Global', {
    data() {
        return {}
    },
    template: `<div>
        <slot name="all"></slot>
        <slot name="left"></slot>
        <slot name="right"></slot>
    </div>`
    })
new Vue({
    el: '#app',
    data: {},
    template: `
        <Global>
            <div slot="right">
                <div>center</div>
                <div>right</div>
            </div>
            <div slot="left">
                <div>left</div>
                <div>center</div>
            </div>
        </Global>
    `,
})
```

### 3. 作用域插槽

#### 3.1 默认插槽

```html
<!-- 插槽 -->
<slot :msg="msg"></slot>

<!-- 引用 -->
<template scope="data">
    {{ data.msg }}
</template>
```

#### 3.2 具名插槽

```html
<!-- 插槽 -->
<slot name="hello" :msg="msg"></slot>

<!-- 引用 -->
<template #hello="data">
    {{ data.msg }}
</template>
```



应用插槽的方式

- ```html
  <h1 slot="slot1">插槽1</h1>
  ```

- ```html
  <template v-slot:slot2>
  	<h1>插槽2</h1>
  </template>
  ```

- ```html
  <template #slot3>
  	<h1>插槽3</h1>
  </template>
  ```



## 四、 过滤器

过滤器可以串联，及：

- 要处理的值作为第一个过滤器的参数
- 第一个过滤器的返回值作为第二个过滤器的参数
- .....

### 1. 局部过滤器

- 属性 `filters`
- 用法：`{{ 数据 | 过滤器 }}`

```js
new Vue({
    el: '#app',
    data: {
        price: 0
    },
    template: `
        <div>
            <input type="text" v-model="price" />
            <div>价格是 {{ price | hanclePrice }}</div>
        </div>
    `,
    filters: {
        hanclePrice: value => {
            return '￥' + value
        }
    }
})
```

### 2. 全局过滤器

- 全局定义：`Vue.filter('过滤器名称', 回调)`
- 用法：`{{ 数据 | 过滤器 }}`

```js
Vue.filter('hanclePrice', value => {
    return '￥' + value
})
new Vue({
    el: '#app',
    data: {
        price: 0
    },
    template: `
        <div>
            <input type="text" v-model="price" />
            <div>价格是 {{ price | hanclePrice }}</div>
        </div>
    `
})
```

### 3. 过滤器参数

过滤器可以接收多个参数：

第一个参数是要操作的数据，后面的参数是自定义的参数，可以是多个参数

```js
Vue.filter('hanclePrice', (value, symbol, unit) => {
    return symbol + value + unit
})
new Vue({
    el: '#app',
    data: {
        price: 0
    },
    template: `
        <div>
            <input type="text" v-model="price" />
            <div>价格是 {{ price | hanclePrice('￥', '元') }}</div>
        </div>
    `
})
```

## 五、 监听器

- 监听器函数有两个参数，第一个参数是修改之后的值 `newValue` ， 第二个参数是修改之前的值 `oldValue`
- watch只能监听单个属性
- 简单的数据类型用普通监听，复杂的数据类型用深度监听

### 1. 普通监听

```js
new Vue({
    el: '#app',
    data: {
        price: 0
    },
    template: `
        <div>
            <input type="text" v-model="price" />
        </div>
    `,
    watch: {
        price: (newValue, oldValue) => {
            console.log(newValue, oldValue)
        }
    }
})
```

### 2. 深度监听

- person是一个对象
- 深度监听：`deep: true`
- 触发函数：`handler(newValue, oldValue){}`
- `newValue` 和 `oldValue` 都会返回一个对象，就是person本身

```js
new Vue({
    el: '#app',
    data: {
        person: {
            name: 'xiaoming',
            age: 12
        }
    },
    template: `
        <div>
        	<input type="text" v-model="person.name" />
        </div>
    `,
    watch: {
        person: {
            deep: true,
            handler(newValue, oldValue){
                console.log(newValue, oldValue)
            }
        }
    }
})
```

## 六、 计算属性

- 可以监听多个变量
- 计算属性可以理解成是一个变量



一个简单的音乐播放器案例

### 1. 简单的计算属性

```js
// 数据
var musicList = [
    { id: 1, author: '张信哲', sing: '爱如潮水', src: './music/爱如潮水.mp3' },
    { id: 2, author: '周杰伦', sing: '简单爱', src: './music/简单爱.mp3' },
    { id: 3, author: '筷子兄弟', sing: '老男孩', src: './music/老男孩.mp3' },
    { id: 4, author: '陈奕迅', sing: '十年', src: './music/十年.mp3' },
    { id: 5, author: '张宇', sing: '雨一直下', src: './music/雨一直下.mp3' }
]
new Vue({
    el: '#app',
    data: {
        musicList,
        id: 0
    },
    template: `<div>
        <audio controls :src="playCurrentMusic" @ended="musicEnd" autoplay></audio>
        <ul>
            <li v-for="(music, index) in musicList"
                :key="music.id"
                :class="{active:id===index}"
                @click="changeId(index)">
                	歌手：{{ music.author }}  歌曲： {{ music.sing }}
            </li>  
        </ul>
    </div>`,
    methods: {
        changeId(value){
            this.id = value
        },
        musicEnd(){
            if(this.id === this.musicList.length - 1){
                this.id = 0
            }else{
                this.id++
            }
        }
    },
    computed: {
        playCurrentMusic(){
            return this.musicList[this.id].src
        }
    }
})
```

### 2. set和get的计算属性

**注：调用计算属性时触发的是get函数，给计算属性赋值的时候触发的是set函数，赋值的那个值就是set的`newValue`参数**

```js
var musicList = [
    { id: 1, author: '张信哲', sing: '爱如潮水', src: './music/爱如潮水.mp3' },
    { id: 2, author: '周杰伦', sing: '简单爱', src: './music/简单爱.mp3' },
    { id: 3, author: '筷子兄弟', sing: '老男孩', src: './music/老男孩.mp3' },
    { id: 4, author: '陈奕迅', sing: '十年', src: './music/十年.mp3' },
    { id: 5, author: '张宇', sing: '雨一直下', src: './music/雨一直下.mp3' }
]
new Vue({
    el: '#app',
    data: {
        musicList,
        id: 0
    },
    template: `<div>
        <audio controls :src="playCurrentMusic" @ended="musicEnd" autoplay></audio>
        <ul>
            <li
                v-for="(music, index)
                in musicList"
                :key="music.id"
                :class="{active:id===index}"
                @click="changeId(index)"
            >
            	歌手：{{ music.author }}  歌曲： {{ music.sing }}
            </li>  
        </ul>
    </div>`,
    methods: {
        changeId(value){
            this.playCurrentMusic = value
        },
        musicEnd(){
            if(this.id === this.musicList.length - 1){
                this.id = 0
            }else{
                this.id++
            }
        }
    },
    computed: {
        playCurrentMusic: {
            set(newValue){
                this.id = newValue
            },
            get(){
                return this.musicList[this.id].src
            }
        }
    }
})
```

## 七、 生命周期

<a href="./img/vue钩子函数.png">点击弹出图片</a>

<img src="./img/生命周期.png" />

路由组件的生命周期：

- activated：路由激活
- deactivated：路由失活





## 八、 `this.$nextTick`

当DOM被修改时，不会及时更新，此时如果直接获取DOM，拿到的是修改之前的DOM。此时就需要用到`this.$nextTick`

```js
new Vue({
    el: '#app',
    data: {
        isShow: false,
    },
    template: `<div>
    	<input type="text" v-show="isShow" ref="oInput"/> 
    </div>`,
    mounted() {
        this.isShow = true
        this.$nextTick(function(){
            this.$refs.oInput.focus()
        })
    }
})
```

- 修改了DOM
- 通过`this.$nextTick` 回调函数进行操作

## 九、 路由

官网：https://router.vuejs.org/zh/installation.html

### 1. 路由的简单配置

#### 1） 安装

#### 2）配置

```js
   let Login = {
      template: `<div>我是登录组件</div>`
    }
    let Register = {
      template: `<div>我是注册组件</div>`
    }
    new Vue({
      data: {},
      methods:{},
      template: `<div>
       <router-link to="/login">登录</router-link>
       <router-link :to="/register">注册</router-link>
       <router-view />
      </div>`,
      created(){
        this.$mount('#app')
      },
      // 创建VueRouter实例并挂载到vue上
      router: new VueRouter({
        // 创建路由匹配规则
        routes:[
          {
            path: '/login/',
            component: Login
          },
          {
            path: '/register',
            component: Register
          }
        ]
      })
    })
```

- 安装 `vue-router`
- 使用路由 `Vue.use(VueRouter)`

- 路由实例 `new VueRouter()`

- 路由匹配规则 `routes`
- 挂载到 `vue` 上
- `router-link` 链接路由地址，`to` 属性表示路由链接地址，可以传参
- `<router-view />` 路由展示的位置

### 2. 命名路由

```js
routes:[
    {
        path: '/login/',
        component: Login
    },
    {
        path: '/register',
        component: Register
    }
]
```

### 3. 路由参数

#### 1）动态路由传参(`params` )

```js
new Vue({
    template: `<div>
        <router-link :to="{name: 'login', params: {id: 1}}">登录</router-link>
        <router-view />
    </div>`,
    created(){
        this.$mount('#app')
    },
    router: new VueRouter({
        routes:[
            {
                path: '/login/:id',
                name: 'login',
                component: Login
            }
        ]
    })
})
```

#### 2）地址栏传参(`query`)

```js
new Vue({
    template: `<div>
        <router-link :to="{name: 'register', query: {id: 2} }">注册</router-link>
        <router-view />
    </div>`,
    created(){
        this.$mount('#app')
    },
    router: new VueRouter({
        routes:[
            {
                path: '/register',
                name: 'register',
                component: Register
            }
        ]
    })
})
```

**注意**：path和params不能同时使用（很奇怪）

### 4. 嵌套路由

#### 1）不同模板嵌套

- 设置多个子路由
- 点击跳转到子路由

```js
let Home = {
    template: `<div>
        <router-link to="/">推荐</router-link>
        <router-link to="/backend">后端</router-link>
        <router-view />
    </div>`
}
let Recommended = {
    template: `<div>我是Recommended组件</div>`
}
let Backend = {
    template: `<div>我是Backend组件</div>`
}
let Pins = {
    template: `<div>
        <router-link to="/pins/hot">热度</router-link>
        <router-link to="/pins/following">关注</router-link>
        <router-view />
    </div>`
}
let Hot = {
    template: `<div>我是Hotd组件</div>`
}
let Following = {
    template: `<div>我是Following组件</div>`
}
new Vue({
    data:{},
    template: `<div>
        <router-link to="/">首页</router-link>
        <router-link to="/pins/hot">沸点</router-link>
        <router-view />
    </div>`,
    router: new VueRouter({
        routes: [
            {
                path: '/', name: 'home', component: Home, children: [
                    { path: '/', name: 'recommended', component: Recommended },
                    { path: 'backend', name: 'backend', component: Backend }
                ]
            },
            {
                path: '/pins', name: 'pins', component: Pins, children: [
                    { path: 'hot', name: 'hot', component: Hot },
                    { path: 'following', name: 'following', component: Following }
                ]
            }
        ]
    })
}).$mount('#app')
```

#### 2）相同模板嵌套

- 设置动态子路由，点击时通过 `params` 来动态匹配子路由
- 由于是加载同一个组件，当切换子路由是，钩子函数不会触发，此时，可以通过 `watch` 来监听 `$route` 来监听路由对象的切换，发送 `ajax` 来更新数据 
- 首页加载路由参数时需要用到重定向 `redirect` 来加载动态路由

```js
let Global = {
    template: `<div>
    	{{ $route.params.id }}
    </div>`,
    watch: {
        $route: function(from,to){
            console.log(111)
        }
    }
}
let Home = {
    template: `<div>
        <router-link :to="{name: 'homeGlobal', params: { id: 1}}">推荐</router-link>
        <router-link :to="{name: 'homeGlobal', params: { id: 2}}">后端</router-link>
        <br/><br/>
        <router-view />  
    </div>`
}
let Pins = {
    template: `<div>
        <router-link :to="{name: 'pinsGlobal', params: { id: 3}}">热度</router-link>
        <router-link :to="{name: 'pinsGlobal', params: { id: 4}}">关注</router-link>
        <br/><br/>
        <router-view />  
    </div>`
}
new Vue({
    template: `<div style="padding:50px">
        <router-link to="/">首页</router-link>
        <router-link to="/pins/3">沸点</router-link>
        <br/><br/>
        <router-view />
    </div>`,
    router: new VueRouter({
        routes: [
            { path: '/', name: 'home', component: Home, redirect: '/home/1', children: [ { path: 'home/:id', name: 'homeGlobal', component: Global } ] },
            { path: '/pins', name: 'pins', component: Pins, children: [ { path: ':id', name: 'pinsGlobal', component: Global } ] },
        ]
    })
}).$mount('#app')
```

### 5. props

根据数据类型分为三种形式

- 对象类型

  ```js
  {
      path: 'home',
      component: Home,
      props: {
          a: 1,
          b: 2
      }
  }
  ```

- 布尔值：默认为false，若为真，则会将路由参数中的params参数全部传给props

  ```js
  {
      path: 'home',
      component: Home,
      props: true
  }
  ```

- 函数

  ```js
  {
      path: 'home',
      component: Home,
      props($route) {
          return {
              a: $route.query.a,
          	b: $route.params.b
          }
      }
  }
  ```

  

### 6. 路由缓存

```vue
<templete>
    <!-- 基本使用 -->
	<keep-alive>
        <route-view></route-view>
    </keep-alive>
    
    <!-- 包含单个，News指的是组件名，即组件中的name属性 -->
    <keep-alive include="News">
        <route-view></route-view>
    </keep-alive>
    
    <!-- 包含多个 -->
    <keep-alive :include="['News', 'about']">
        <route-view></route-view>
    </keep-alive>
</templete>
```

```html

```

### 7. 路由守卫

#### 7.1 全局守卫

##### 7.1.1 全局前置守卫

```js
beforeEach(to, from, next) {  }
```

##### 7.1.2 全局后置守卫

```js
afterEach(to, from, next) {  }
```

#### 7.2 独享路由守卫

```js
beforeEnter(to, from, next) {  }
```

#### 7.3 组件内路由守卫

##### 组件进入之前

```js
beforeRouteEnter(to, from, next) {  }
```

##### 组件离开之前

```js
afterRouteEnter(to, from, next) {  }
```

### 8. mate

mate对象可以储存

- 登陆权限
- title



### 9. 路由模式



#### 9.1 history

线上部署，需要后端配合

nodejs

`connect-history-api-fallback`

```shell
npm i connect-history-api-fallback
```

```js
const express = require('express')
const app = express()
const history = require('connect-history-api-fallback')
// 必须在开放静态资源之前使用
app.use(history())
app.use(express.static(__dirname + '/public'))
```





#### 9.2 hash

兼容性好，`/#/`后面的内容作为前端资源，不会发送给服务器



### 10. 路由权限控制





## 十、 RESTful规范

一种软件架构的风格，实际风格，而不是一个标准，为客户端和服务端的交互提供一组设计原则和约束条件







## permission.js



```js
// vue-element-admin中，permission主要负责全局路由守卫和登录判断，希望通过以下注释说明，帮助大家理解这个文件的逻辑
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//auth文件主要依赖js-cookie模块，把getToken，setToken，removeToken设置在这里
import { getToken } from '@/utils/auth'

//get-page-title文件主要是网站的标题，get-page-title通过依赖setting.js里的title变量修改网站标题
//如果需要更改网站的标题，可以直接到setting.js修改title属性
import getPageTitle from '@/utils/get-page-title'

//NProgress是封装的进度条，基本不用动
NProgress.configure({ showSpinner: false })

//路由白名单列表，把路由添加到这个数组，不用登陆也可以访问
const whiteList = ['/login']

router.beforeEach(async(to, from, next) => {
    // 请求路由时进度条开始
    NProgress.start()

    // 设置标题
    document.title = getPageTitle(to.meta.title)

    // 这里的getToken()就是在上面导入的auth.js里的getToken()方法
    const hasToken = getToken()

    //如果存在token，即存在已登陆的令牌
    if (hasToken) {
        //如果用户存在令牌的情况请求登录页面，就让用户直接跳转到首页，避免存在重复登录的情况
        if (to.path === '/login') {
            // 直接跳转到首页，当然取决于你的路由重定向到哪里
            next({ path: '/' })
            //一定要关闭进度条
            NProgress.done()
        } else {
        //如果已经有令牌的用户请求的不是登录页，是其他页面
        //就从Vuex里拿到用户的信息，这里也证明用户不是第一次登录了
            const hasGetUserInfo = store.getters.name
            if (hasGetUserInfo) {
                //信息拿到后，用户请求哪就跳转哪
                next()
        	} else {
                try {
                    // 如果有令牌，但是没有用户信息，证明用户是第一次登录，通过Vuex设置用户信息
                    await store.dispatch('user/getInfo')
                    //设置好了之后，依然可以请求哪就跳转哪
                    next()
                    } catch (error) {
                        // 如果出错了，把令牌去掉，并让用户重新去到登录页面
                        await store.dispatch('user/resetToken')
                        Message.error(error || 'Has Error')
                        next(`/login?redirect=${to.path}`)
                        //关闭进度条
                        NProgress.done()
					}
				}
			}
		} else {
        //这里是没有令牌的情况
        //还记得上面的白名单吗，现在起作用了
        //whiteList.indexOf(to.path) !== -1)判断用户请求的路由是否在白名单里
    	if (whiteList.indexOf(to.path) !== -1) {
            // 不是-1就证明存在白名单里，不管你有没有令牌，都直接去到白名单路由对应的页面
            next()
        } else {
            // 如果这个页面不在白名单里，直接跳转到登录页面
            next(`/login?redirect=${to.path}`)
            //关闭进度条
            NProgress.done()
        }
    }
})

router.afterEach(() => {
//每次请求结束后都需要关闭进度条
	NProgress.done()
})
```



## this.$set的用法

在vue创建实例后添加新的属性到实例上时，不会触发视图更新，此时需要用到this.$set来更新数据，从而来更新视图，具体方法：

```js
data () {
  return {
    student: {
      name: '',
      sex: ''
    }
  }
},
mounted () {
  // this.student.age = 24 // 添加不上
  this.$set(this.student,"age", 24)  // 可以添加
}
```



## Vuex

Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。Vuex 也集成到 Vue 的官方调试工具 [devtools extension (opens new window)](https://github.com/vuejs/vue-devtools)，提供了诸如零配置的 time-travel 调试、状态快照导入导出等高级调试功能。

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 1
  }
})

export default store
```

### 1. State

```js
const store = new Vuex.Store({
  state: {
    count: 1
  }
})
```

组件中获取state状态的几种方法

- ```
  computed: {
  	count() {
  		return this.$store.state.count
  	}
  }
  ```

- ```js
  computed: {
  	...mapState(['count'])
  }
  ```

- ```js
  computed: {
  	...mapState({
          count: state => state.count
      })
  }
  ```

- ```js
  computed: mapState({
      count: state => state.count
  })
  ```

- ```js
  computed: mapState(['count'])
  ```

### 2. Getters

getters可以看做是state的计算属性

```js
state: {
    list: [
        { id: 1, name: '赵本山' },
        { id: 2, name: '郭德纲' },
        { id: 3, name: '刘德华' }
    ]
},
getters: {
    // 没有参数的情况
    lifeList: state => state.list,
    // 有参数的情况
    getSingleList: state => id => state.list[id]
}
```

组件中获取getters的方法

- ```js
  computed: {
  	lifeList() {
  		return this.$store.getters.lifeList
  	}
  }
  ```

- ```js
  computed: {
      ...mapGetters(['lifeList'])
  }
  ```

- ```js
  computed: mapGetters(['lifeList'])
  ```

- ```js
  computed: mapGetters({
      lifeList: 'lifeList'
  }),
  ```

- ```js
  computed: {
      ...mapGetters({
          lifeList: 'lifeList'
      })
  }
  ```

### 3. Mutations

**修改state状态的唯一方法是提交mutation**，mutation可以看做是一个事件，后面是一个回调函数。

```js
mutations: {
    ADD_COUNT: (state, payload) => {
        state.count += payload.num
    }
}
```

在组件中的用法：

- ```js
  this.$store.commit({
      type: 'ADD_COUNT',
      num: 1
  })
  ```

- ```js
  this.$store.commit('ADD_COUNT', { num: 1 })
  ```

- ```js
  methods: {
      ...mapMutation(['ADD_COUNT']),
      add() {
          this.ADD_COUNT({ num: 1 })
      }
  }
  ```

commit有两个参数，第一个是state的状态，可以获取到state中的任意值，第二个参数是可选参数，可以是任意值，成为mutation的载荷（payload），一般是一个对象。

**当需要在对象上添加属性时，状态会更新，但是视图不会更新，此时需要**：(两种方式都可以)

- ```js
  addObjProp: (state, payload) => {
      state.obj = { ...state.obj, age: payload.age }
  }
  ```

- ```js
  addObjProp: (state, payload) => {
      Vue.set(state.obj, 'age', payload.age)
  }
  ```

**`mutation`只能提交同步函数，异步操作需要交给`actions`**

### 4. Actions

- action类似于mutation
- action是提交mutation，而不是直接改变状态
- action可以包含异步操作

action函数接收一个与store实例具有相同方法和属性的context对象，通过 `context.state` 和 `context.getters` 来获取 state 和 getters，通过 `context.commit` 提交mutation，但是**context并不是store实例本身**

```js
mutations: {
    addCount: (state, payload) => {
        state.count += payload.num
    }
},
actions: {
    addCountByAsync: ({ commit }, payload) => {
        setTimeout(() => {
            commit('ADD_COUNT', payload)
        }, 1000)
    }
}
```

组件中的用法：

- ```js
  this.$store.dispatch('addCountByAsync', { num: 1 })
  ```

- ```js
  this.$store.dispatch({
      type: 'addCountByAsync',
      num: 1
  })
  ```

### 5. Modules

store/index.js

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const user = {
    namespaced: true,
    state: {
        count: 0
    },
    getters: {
        show(state) {
            return '￥' + state.count
        }
    },
    mutations: {
        UPDATE_COUNT(state, payload) {
            state.count = payload
        }
    },
    actions: {
        
    }
}

export default new Vuex.Store({
	modules: {
        user
    }
})
```

使用

```vue
<template>
	<div>
        
    </div>
</template>
<script>
    import { mapStates, mapGetters, mapMutations, mapActions } from 'vuex'
	export default = {
        name: '',
        methods: {
            
        },
        components: {
            // 命名空间为true的写法
            ...mapStates('user', ['count']),
            ...mapGetters('user', ['show']),
            ...mapMutations('user', ['UPDATE_COUNT']),
            ...mapActions('user', [''])
            // 命名空间为false的写法
            // this.$store.state.user['count']
            // this.$store.getters['user/show']
            // this.$store.commit['user/UPDATE_COUNT']
            // this.$store.getters['user/count']
        }
    }
</script>
```





## vue混入

复用vue实例配置

- 局部混入

  ```js
  import { mixin } from './mixin.js'
  export default = {
      data() {
          return {
              name: 'jerry'
          }
      },
      mixins: []
  }
  ```

- 全局混入

  ```js
  Vue.mixin({
      data() {
          return {
              hello: 'hello'
          }
      }
  })
  ```

  

`mixin.js`

```js
export const mixin = {
    data() {
        return {
            age: 18
        }
    },
    methods: {
        SayHello() {
            console.log('hello')
        }
    }
}
```

`hello.vue`

```vue
<script>
    import { mixin } from './mixin.js'
	export default = {
        data() {
            return {
                name: 'jerry'
            }
        },
        mixins: [mixin]
    }
</script>
```

优先级：

- data、methods以组件为主
- 钩子函数全部执行



## 插件





## 过渡与动画



<img src="https://cn.vuejs.org/images/transition.png" />

```html
<div class="app">
    <button @click="change">click</button>
    <transition name="my" appear>
        <h1 v-show="isShow">我是h1元素</h1>
    </transition>
</div>
```

```js
new Vue({
    data: {
        isShow: true
    },
    methods: {
        change() {
            this.isShow = !this.isShow
        }
    }
}).$mount('.app')
```

```css
/*帧动画*/
.my-enter-active {
    animation: atguigu 1s;
}
.my-leave-active {
    animation: atguigu 1s reverse;
}
@keyframes atguigu {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translate(0);
    }
}
/* 过渡动画 */
/* 动画进入之前和动画离开之后的状态 */
.v-enter, .v-leave-to {
    transform: translateX(-100%);
}
/* 动画进入之后和动画离开之前的动画 */
.v-enter-to, .v-leave {
    transform: translateX(0%);
}
/* 动画的播放过程 */
.v-enter-active, .v-leave-active {
    transition: all 1s linear;
}
```

transition

- name：配置名称，默认为v
- appear：初始化是展示动画
- mode：动画模式
  - 



```css

```

v-move：移动时动画











## VUE 权限管理





## 查看npm插件/包版本

```shell
npm view webpack version
```







## 11. vue3.0

### 11. 1 vue3.0对于2.0有什么优点

#### 11.1.1. 速度快

`diff`算法，静态编译，速度提高1.5-2倍

#### 11.1.2. 体积小

内置tree-shaking的webpack插件

#### 11.1.3. 维护方便

新增composition API

#### 11.1.4. 原生

vue2.0：通过`Object.defineProrerty`拦截各个属性，需要深层的遍历多个对象，

vue3.0：通过Proxy直接代理对象，直接监听对象，因此当对象添加属性时，视图也会直接更新，不再需要通过`this.$set`去添加属性来更新视图

### 11.2. 创建vue3项目

两种方式

`webpack`

```shell
vue ctreate my-vue
```

`vite`

```shell
npm init vite-app my-vue3
cd ./my-vue3
npm i
npm run dev
```

### 11.3 对比

#### 11.3.1 main.js

vue2.0

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
new Vue({
    render: h => h(App)
}).$mount('#app')
```



vue3.0

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
const app = createApp(App)

app.use(store).use(router).mount('#app')
```

#### 11.3.2 组合`api`（`setup`）

组件中用到的数据，方法，生命周期等都需要放到setup中

可以传两个参数

- 父组件传的props

- 上下文对象

  - `attrs`：值为对象，包含外部传递过来的，没有在 `props` 申明接收的属性，相当于 `2.0` 中的 `$attrs`
  - `slots`：收到的插槽内容，相当于 `2.0` 中的 `$slots`

  - `emit`：分发自定义事件函数，相当于 `2.0` 中的 `this.$emit`，需要用 `emits` 接收一下，否自会有警告，不影响代码代码编译



##### 11.3.2.1 数据响应式

```vue
<template>
  <nav>
    <button @click="handleclick">点击</button>
    {{ a }}
    <br/>
    {{ obj.name }} -- {{ obj.age }}
  </nav>
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    let a = ref(1)
    let obj = ref({
      name: 'xiao',
      age: 12
    })
    function handleclick() {
      a.value = 2
      obj.value.age = 10
      console.log(a)
    }
    return {
      a,
      handleclick,
      obj
    }
  }
}
</script>
```



ref：基本数据类型用，也可以用做对象

```vue
<template>
    <button @click="handleclick">点击</button>
    {{ a }}
    <br/>
    {{ obj.name }} -- {{ obj.age }}
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    let a = ref(1)
    let obj = ref({
      name: 'xiao',
      age: 12
    })
    function handleclick() {
      a.value = 2
      obj.value.age = 10
    }
    return {
      a,
      handleclick,
      obj
    }
  }
}
</script>
```



reactive：对象类型用

```vue
<template>
    <button @click="handleclick">点击</button>
    {{ otherObj.name }} -- {{ otherObj.age }}
</template>

<script>
import { reactive } from 'vue'
export default {
  setup() {
    // 响应式对象
    let otherObj = reactive({
      name: 'wang',
      age: 30
    })
    // 响应式数组，可以通过下表直接修改数组（vue2.0不支持）
    let arr = ref([
      '抽烟',
      '喝酒',
      '烫头'
    ])
    function handleclick() {
      otherObj.name = 'hello'
      // 通过下标修改
      arr.value[1] = 'world'
      // 通过数组方法直接修改数组
      arr.pop()
    }
    return {
      handleclick,
      otherObj
    }
  }
}
</script>
```

##### 11.3.2.2 计算属性

- 简写

  ```js
  let fullName = computed(() => firstName.value + lastName.value)
  ```

- 完整写法

  ```js
  let fullName = computed({
      get() {
          return firstName.value + lastName.value
      },
      set() {}
  })
  ```

  

```vue
<template>
  <div>
    姓：<input type="text" v-model="firstName">
    <br/>
    名：<input type="text" v-model="lastName">
    <br/>
    姓名：{{ fullName }}
  </div>
</template>

<script>
import { ref, computed } from 'vue'
export default {
  name: 'DemoCom',
  setup(peops, context) {
    let firstName = ref('zhang')
    let lastName = ref('san')
    // let fullName = computed(() => firstName.value + lastName.value)
    let fullName = computed({
      get() {
        return firstName.value + lastName.value
      },
      set() {}
    })
    return {
      firstName,
      lastName,
      fullName
    }
  }
}
</script>
```

##### 11.3.2.3 watch 监视

watch有三个参数：

- 监听的数据，可以一个或多个，多个用数组
- 回调函数，有两个参数，`newVal`，`oldVal`
- 配置参数，包括`immediate`，`deep`等



watch监听情况分类

- 监视ref的单个数据

  ```js
  watch(firstName, (newVal, oldVal) => {
      console.log('firstName变化了', newVal, oldVal)
  })
  ```

- 监视ref的多个数据

  ```js
  watch([firstName, lastName], (newVal, oldVal) => {
      console.log('firstName或lastName变化了', newVal, oldVal)
  })
  ```

- 监视reactive对象

  ```js
  watch(person, (newVal, oldVal) => {
      console.log('firstName或lastName变化了', newVal, oldVal)
      // 监视对象，newVal和oldVal一样，暂时无法解决
  })
  ```


注意：

- reactive定义的变量无法回去 `oldValue`
- reactive定义的变量强制开启深度监视，目前无法关闭
- reactive定义的变量，如果监视变量的一个属性，这个属性的属性值是一个对象，深度监视可以起作用
- ref定义的变量，基本数据类型不用`.value`，对象用`.value`，或者开启深度监视



`watchEffect`



##### 11.3.2.4 生命周期

vue3.0生命周期

- `beforeCreate`：
- `created`：
- `beforeMount`：
- `mounted`：
- `beforeUpdate`：
- `updated`：
- `beforeUnmount`：
- `unmounted`：

钩子函数塞进setup中替换的名字

- `beforeCreate` --- 无
- `created` --- 无
- `beforeMount` ---`onBeforeMount`
- `mounted`：--- `onMounted`
- `beforeUpdate`：--- `onBeforeMount`
- `updated`：--- `onUpdated`
- `beforeUnmount`：--- `onBeforeUnmount`
- `unmounted`：--- `onUnmounted`

```vue
<template>
  <div>
   
  </div>
</template>

<script>
import { onBeforeMount, onMounted } from 'vue'
export default {
  setup(peops, context) {
    onBeforeMount(() => {
      console.log('---onBeforeMount--')
    })
    onMounted(() => {
      console.log('---onMounted--')
    })
  }
}
</script>
```

注意：组合 `api` 钩子函数要比配置项钩子函数触发时机早



##### 11.3.2.5 hook

作用：将一个功能的左右代码组合到一起

```vue
<template>
  <div>
    坐标是 {{ point.x }}, {{ point.y }}
  </div>
</template>

<script>
import userPoint from '../hooks/userPoint'
export default {
  setup() {
    let point = userPoint()
    return { point }
  }
}
</script>
```

`hooks/userPoint.js`

```js
import { reactive, onMounted, onUnmounted } from 'vue'
export default function() {
  let point = reactive({
    x: 0,
    y: 0
  })
  function clickGetPoint(e) {
    point.x = e.pageX
    point.y = e.pageY
  }
  onMounted(() => {
    window.addEventListener('click', clickGetPoint)
  })
  onUnmounted(() => {
    window.removeEventListener('click', clickGetPoint)
  })
  return point
}
```

##### 11.3.2.6 toRef

可以将丢失了响应式的值再次添加响应式，修改时可以影响整个对象

```vue
<template>
  <div>
    {{name}} ---- {{ age }}
    <br/>
    {{ person }}
    <br/>
    <button @click="name += '~'">修改name</button>
    <button @click="age += 1">修改age</button>
  </div>
</template>

<script>
import { reactive, toRef } from 'vue'
export default {
  setup() {
    let person = reactive({
      name: '张三',
      age: 20
    })
    let name = toRef(person, 'name')
    let age = toRef(person, 'age')
    return {
      person,
      name,
      age
    }
  }
}
</script>
```

`toRefs`

```vue
<template>
  <div>
    {{name}} ---- {{ age }}
    <br/>
    {{ person }}
    <br/>
    <button @click="name += '~'">修改name</button>
    <button @click="age += 1">修改age</button>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
  setup() {
    let person = reactive({
      name: '张三',
      age: 20
    })
    return {
      // point,
      person,
      ...toRefs(person)
    }
  }
}
</script>

```

##### 11.3.2.7 `shallowRef`  和  `shallowReactive`

`shallowRef`：只处理基本数据类型，对象类型无响应式

`shallowReactive`：只处理对象的第一层（浅层响应式）

##### 11.3.2.8 `readonly`  和  `shallowReadonly`

```vue
<template>
  <div>
    {{name}} ---- {{ age }}
    <br/>
    {{ person }}
    <br/>
    <button @click="name += '~'">修改name</button>
    <button @click="age += 1">修改age</button>
  </div>
</template>

<script>
import { reactive, toRefs, readonly } from 'vue'
// import userPoint from '../hooks/userPoint'
export default {
  setup() {
    let person = reactive({
      name: '张三',
      age: 20
    })
    person = readonly(person)
    return {
      person
    }
  }
}
</script>
```

- `readonly`：只读
- `shallowReadonly`：对象的第一层数据只读

适用场景：接收props参数，转为只读

##### 11.3.2.9 `toRaw`  和  `markRow`

toRaw：将reactive生成的响应式对象转为普通对象

markRow：标记一个对象，使其永远不会成为响应式对象

再看下

##### 11.3.2.10 自定义ref（customRef）

```vue
<template>
  <div>
    <input type="text" v-model="keyWord">
    <br/>
    {{ keyWord }}
  </div>
</template>

<script>
import { customRef } from 'vue'
export default {
  setup() {
    function myRef(value) {
      let timer
      return customRef((track, trigger) => {
        return {
          get() {
            track()
            return value
          },
          set(newVal) {
            clearTimeout(timer)
            value = newVal
            timer = setTimeout(() => {
              trigger()
            }, 1000)
          }
        }
      })
    }
    let keyWord = myRef('hello')
    return {
      keyWord
    }
  }
}
</script>
```

- customRef
  - `track`：`getter` 函数 `return` 之前调用
  - `trigger`：数据改变时调用，通知模板更新

##### 11.3.2.11 `provide` 和 `inject`

祖先组件

```vue
<template>
  <router-view/>
</template>

<script>
import { reactive, provide } from 'vue'
export default {
  setup() {
    let otherObj = reactive({
      name: 'wang',
      age: 30
    })
    provide('otherObj', otherObj)
    return {
      otherObj
    }
  },
  components: {
    Demo
  }
}
</script>
```

后代组件

```vue
<template>
  <div>
    {{ person }}
  </div>
</template>

<script>
import { inject } from 'vue'
export default {
  setup() {
    let person = inject('otherObj')
    return {
      person
    }
  }
}
</script>
```

##### 11.3.2.12 动态组件（suspense）和异步引入（defineAsyncComponent）

```vue
<template>
  <div>
    <suspense>
      <!-- 展示组件 -->
      <template #default>
        <Provide />
      </template>
	  <!-- 组件没加载出来时展示，可以是loading，骨架屏等 -->
      <template #fallback>
        loading
      </template>
    </suspense>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
// import Provide from '../components/provide.vue'
const Provide = defineAsyncComponent(() => import('../components/provide.vue'))
export default {
  name: 'DemoCom',
  setup() {
    return {}
  },
  components: {
    Provide
  }
}
</script>
```



控制子组件延迟展示

```vue
<template>
  <div>
    provide
    {{ person }}
    <br/>
    2秒后展示
  </div>
</template>

<script>
import { inject, onMounted, ref } from 'vue'
export default {
  async setup() {
    let person = inject('otherObj')
    let isShow = ref(true)
    const pro = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          person,
          isShow
        })
      }, 2000)
    })
    return await pro
  }
}
</script>
```

##### 11.3.2.13 teleport组件

自定义组件挂载位置

```vue
<template>
  <div>
    <teleport to='body'>
      <div class="cover" v-show="isShow">
        <div class="alert">alert</div>
      </div>
    </teleport>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
export default {
  setup() {
    let isShow = ref(true)
    
    onMounted(() => {
        // 两秒后遮罩层消失
        setTimeout(() => {
            isShow.value = false
            console.log('hello world ')
        }, 2000)
    })
    
    return { isShow }
  }
}
</script>
<style lang="css">
  .cover {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    position: fixed;
    top: 0;
    left: 0;
  }
  .alert {
    width: 200px;
    height: 200px;
    background: #fff;
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    margin: auto;
    text-align: center;
    line-height: 200px;
  }
</style>
```

teleport组件有一个to属性，可以接受css选择器，挂载到指定选择器的节点中





##### 11.3.2.13 其他改变

- vue中的全局属性

  | 2.x 全局API (Vue)        | 3.x 全局API (app)           |
  | ------------------------ | --------------------------- |
  | Vue.config.xxxx          | app.config.xxxx             |
  | Vue.config.productionTip | **移除**                    |
  | vue.component            | app.component               |
  | vue.directive            | app.directive               |
  | vue.mixin                | app.mixin                   |
  | vue.use                  | app.use                     |
  | Vue.prototype            | app.config.globalProperties |

  给app实例添加一个属性：

  ```js
  app.config.globalProperties.myPro = 'hello world!!!'
  ```

  获取原型上的属性：

  ```js
  import { getCurrentInstance } from 'vue'
  export default {
    name: 'MyCustomPlugin',
    setup() {
      const internalInstance = getCurrentInstance()
      let my = internalInstance.appContext.config.globalProperties.myPro
      console.log(my)
      return { my }
    }
  }
  ```

  

- data配置项始终被声明为一个函数

- 过渡

  vue2.x

  ```css
  .v-enter,
  v-leave-to {
      opacity: 0
  }
  .v-leave,
  v-enter-to {
      opacity: 1
  }
  ```

  vue3.x

  ```css
  .v-enter-from,
  v-leave-to {
      opacity: 0
  }
  .v-leave-from,
  v-enter-to {
      opacity: 1
  }
  ```

- 移除 `keyCode` 作为事件修饰符

- 移除 `.native` 作为修饰符

- 移除过滤器

 













### 11.4 Proxy响应式原理

`Object.defineProperty`

```js
let person = {
    name: '张三',
    age: 12
}
let p = {}
for(let k in person) {
    Object.defineProperty(p, k, {
        value: person[k],
        set(val) {
            console.log('有人改数据')
            person[k] = val
        }
    })
}
```





`Proxy`

```js
let person = {
    name: '张三',
    age: 12
}
let p1 = new Proxy(person, {
    // 查
    get(target, propName) {
        console.log(`有人读取${propName}的属性`)
        // return target[propName]
        return Reflect.get(target, propName)
    },
    // 增，改
    set(target, propName, newVal) {
        console.log(`有人修改${propName}上的属性，属性值为${newVal}`)
        // target[propName] = newVal
        Reflect.set(target, propName, newVal)
    },
    // 删
    deleteProperty(target, propName) {
        // return delete target[propName]
        return Reflect.deleteProperty(target, propName)
    }
})
```

- Reflect：反射，有多个对象的属性和方法，用Reflect操作有返回值，成功为 `true`，失败为 `false` ，不会使程序报错奔溃

- Proxy：可以检测到对象的增删改查操作











## 指令

### 内置指令

- v-model：
  - number：数字类型
  - lazy：失去焦点时触发响应式
  - trim：去除前后空格

- v-text
- v-html
- v-cloak
  - 本质上是一个特殊的属性，vue实例创建完毕后会删除该属性
  - 用于网络加载过慢时，避免出现`{{ 插值语法 }}`

- v-once：该标签值渲染一次，初始化后不再修改
- `v-pre`：具有`v-pre` 标签的结构，跳过vue的编译，直接呈现代码

### 自定义指令

#### (1) 普通函数形式

```js
// 封装一个v-text的自定义指令
directives: {
    hello(element, binding) {
        element.innerText = binding.value
    }
}
```

- 指令接收两个参数：
  - 绑定元素的真实DOM
  - 绑定的信息
- 调用时机
  - 页面加载时调用
  - 所在组件数据变化时调用

#### （2）钩子函数形式

```js
directives: {
    hello: {
        bing: (element, binding) {
            // 绑定时调用
        },
        inserted: (element, binding) {
            // 放入页面时调用
        },
        update: (element, binding) {
            // 更新时调用
        }
    }
}
```

**注意**：

- 自定义指令中的this指向window，通过指令将值传入
- 指令可用`-`链接，不可用驼峰命名



## 组件注册方式

### 全局组件

```js
Vue.component('HelloWorld', {
    template: `<div>hello组件</div>`
})
new Vue({
    template: `<Hello-world />`
})
```

### 局部组件

```js
new Vue({
    template: `<Hello />`,
    component: {
        Hello: {
            template: `<div>hello组件</div>`
        }
    }
})
```

```js
const Hello = Vue.extend({
    name: 'myName', // 修改开发者工具中组件的名称
    template: `<div>hello组件</div>`
})
new Vue({
    template: `<Hello />`,
    component: {
        Hello
    }
})
```

```js
const Hello = {
    name: 'myName', // 修改开发者工具中组件的名称
    template: `<div>hello组件</div>`
}
new Vue({
    template: `<Hello />`,
    component: {
        // 传入的是一个对象，这里会自动执行Vue.extend
        Hello
    }
})
```









## 好用的vue组件库

### 1. Vuetify(UI框架)

官网：https://vuetifyjs.com/

Vuetify是一个Vue UI库，附带手工制作的Material组件。这是一个专门根据Material Design规范开发的库，并且每个组件都采用移动优先的方法构建，因此既具有响应性又非常模块化。

通过vue-cli将Vuetify添加到项目中简单到运行`vue add vuetify`即可。

作为一个完整的框架，Vuetify具有以下功能：

- 数百种默认样式和动画
- UI组件，如提示框、横幅、按钮、导航等
- 内置指令处理用户操作，如点击、滚动、调整大小等。

我个人喜欢Vuetify主要基于以下两个原因。

首先，它拥有构建应用程序所需的一切。

其次，Vuetify的文档目前是最好的。借助全面的示例和在线资源指南，使用Vuetify进行开发就不用自己摸索了。

此外，作为最大的Vue框架之一，围绕Vuetify的社区非常棒，论坛上有成千上万的开发人员回答关于开发的所有问题。

Vuetify正在从头开始重建整个框架，以支持Vue 3和Composition API。

### 2. Bootstrap Vue(UI框架)

官网：https://code.z01.com/bootstrap-vue/

Bootstrap是最受欢迎的免费和开源CSS和JS框架之一，可帮助开发人员构建响应式应用程序。

BootStrapVue使用Vue 2.6来提供Bootstrap v4组件和网格系统的实现，将Bootstrap所有惊人的优势带到Vue环境中。

最著名的是Bootstrap（以及 BootstrapVue）为使用基于网格系统的响应式设计提供了一个很好的解决方案。它允许开发人员根据屏幕改变DOM元素的大小。

### 3. Vue Material(UI框架)

欣赏不了

Vue Material是一款轻量级的库，完全按照Material Design规范构建。

功能如下：

- 为应用程序提供免费的内置主题
- 支持Vue路由器
- 数十个基本组件，如菜单、进度条和表单

并且，将Nuxt.js或Webpack等其他工具与Vue Material集成也很容易，从而使得渲染和部署等工作变得更为简单。

### 4. Quasar(UI框架)

欣赏不了

Quasar是一个基于Vue.js的开源框架，允许开发人员为几乎所有平台构建响应式应用程序。Quasar有内置的功能可以在构建模式之间切换。

这意味着你可以制作SPA、PWA和SSR应用，甚至可以制作移动应用、桌面应用和浏览器扩展！

真的很牛了！

Quasar自带你想要从前端框架中获得的一切：

- 可定制的样式，包括明暗模式支持
- 基于网格的布局系统，可用于创建响应式app
- 专为性能和响应而设计的100+个Vue组件
- 内置TreeShaking优化以支持最佳实践

### 5. Buefy(UI框架)

官网：https://buefy.org/

Buefy是一个基于Bulma CSS框架的开源轻量级Vue框架。

Bulma是现代CSS框架，允许开发人员直观地创建响应式组件。使用简单的英文类名，很容易一目了然地知道类名究竟如何影响元素的样式。

Buefy通过为开发人员提供数十个内置组件，例如按钮、下拉菜单、分页等，将Bulma的简单性带入Vue。

我个人喜欢Buefy构建响应式列布局的方便性。你所要做的就是创建带有一类列的容器，然后为每一列创建带有一类列的`div`。

这些列的宽度都相同

```vue
<div class="columns">
    <div class="column">First column</div>
    <div class="column">Second column</div>
    <div class="column">Third column</div>
    <div class="column">Fourth column</div>
</div>
```

只要有这样的代码，每列的宽度都将自动相同，并且还可以响应移动设备！

### 6. vue-easytable（表格组件）

https://happy-coding-clans.github.io/vue-easytable/#/en/demo

表格组件具有许多内置功能，比如说，单元格省略号、固定/灵活的列大小调整、自定义过滤等等，可能你甚至都没有意识到这些需要。

### 7. vue-dataset（表格组件）

demo：https://vue-dataset-demo.netlify.app/

vue-dataset集合了6个Vue组件，用于在Vue中显示具有内置过滤、分页、排序甚至自定义搜索功能的列表。

### 8. vue-simple-spinner（加载器）

demo：https://dzwillia.github.io/vue-simple-spinner/examples/

vue-simple-spinner正如其名，是一个简单且可自定义的微调组件，允许你控制微调器的大小、颜色、速度和文本。

### 9. vue-progress-path（加载器）

官网：https://madewithvuejs.com/vue-progress-path

如果你想创建自定义的、有趣的加载器，那么vue-progress-path是你的完美选择。

它最酷的功能是你可以将你自己的.svg文件传递给它，它再根据这个svg的形状创建加载器。

看看其中的一些可能性吧！

### 10. vue-splash（加载期间的动画）

vue-splash允许你在等待内容加载时显示启动画面。

只需一个快速组件，就可以显示logo、一些文本并更改页面的背景颜色。

启动画面的代码示例如下：

```js
<vue-splash
    :show="true"
    :logo="logo"
    title="Your Magnificent App Name"
    color="#00bfa5"
    :size="300"
    :fixed="true"
/>
```

### 11. Sweet-modal-vue（模态框组件）

官网：https://sweet-modal-vue.adepto.as/
