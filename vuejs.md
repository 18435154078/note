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

### 1. 普通插槽

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

### 2. 命名插槽

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

## 四、 过滤器

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

### 5. 路由权限控制





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





## 自定义指令







## VUE 权限管理









## vue3.0对于2.0有什么优点

#### 1. 速度快

`diff`算法，静态编译，速度提高1.5-2倍

#### 2. 体积小

内置tree-shaking的webpack插件

#### 3. 维护方便

新增composition API

#### 4. 原生

vue2.0：通过`Object.defineProrerty`拦截各个属性，需要深层的遍历多个对象，

vue3.0：通过Proxy直接代理对象，直接监听对象，因此当对象添加属性时，视图也会直接更新，不再需要通过`this.$set`去添加属性来更新视图





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
