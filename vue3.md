# vue3 + vite + ts + pinia

## 1. vite

### vite安装vue

vite默认安装vue3

```shell
npm create vite@latest myVite
yarn create vite myVite
```

## 2. vue3

### 2.1 setup（组合式api）

setup语法糖插件 (组件中无无需引入 `vue` 和 `router` 的 api)

安装

```shell
npm i unplugin-auto-import -D
```

配置(vue.config.js)

```js
import autoImport from 'unplugin-auto-import/vite'
export default defineConfig({
    plugins: [
        autoImport({
          imports: ['vue', 'vue-router']  // 自动引入vue 和 vue-router api
        })
    ]
})
```

### 2.2 生命周期

- 选项式api
- hook inside(setup)
  - 没有onCreateed和onBeforeCreate，setup已经是初始化的数据



`data`, `beforeCreate`, `created`, `setup`, `beforeMount`, `onBeforeMount` 执行顺序

setup ----> beforeCreate ---> data ---> created ---> onBeforeMount ---> beforeMount

- setup 最早执行
- data在初始化后执行
- setup中的钩子会先于选项式钩子执行



### 2.3 `ref` 相关api

- ref：定义变量（全部变量），取值时需要 `.value`

- reactive：定义变量（对象），取值时不需要 `.value`

- toRefs：解构

  - 可以将一个 `reactive` 包裹的变量解构成几个ref包裹的变量

  - 解构之后的变量和属性时有关联的

  - ```js
    const person = reactive({
      name: '张三',
      age: 12
    })
    const {name, age} = toRefs(person)
    ```

- toRef：解构单个属性

  - 可以将一个 `reactive` 包裹的变量中的某一个属性解构出来

  - 解构之后的变量和属性时有关联的

  - ```js
    const person = reactive({
      name: '张三',
      age: 12
    })
    const name = toRef(person, 'name')
    const age = toRef(person, 'age')
    ```

### 2.5 computed

简单使用

```js
computed(() => {return 1})
```

完整写法

```js
computed({
    get() {
        return ''
    },
    set(value) {
        
    }
})
```

### 2.6 插槽

- 匿名插槽

- 具名插槽

  - 子组件

    ```html
    <div>
        <slot name="header"></slot>
    	我是list2
        <slot></slot>
    	<slot name="footer"></slot>
    </div>
    ```

  - 父组件

    ```html
    <List2>
        content0
        <template v-slot:footer>
            footer
        </template>
        content
        <template #header>
            header
        </template>
        content2
    </List2>
    ```

  - 效果

    ```js
    //  header  我是list2  content0  content  content2  footer
    ```

- 作用域插槽（传值）

  - 子组件

    ```vue
    <template>
        <div>
            <slot :person="person"></slot>
            <slot name="footer"></slot>
        </div>
    </template>
    
    <script setup>
    const person = ref({
        name: '张三',
        age: 16
    })
    </script>
    ```

  - 父组件

    ```html
    <List2>
        <template v-slot="{person}">
            {{ person.name }}
        </template>
        <template v-slot:footer>
            footer
        </template>
    </List2>
    ```

- 动态插槽

### 2.7 Teleport（传送）

- to：转送到哪（支持标签，id，类等选择器）
- disabled：禁止传送

**注意**：传送时注意还节点必须已渲染

### 2.8 Mixin（混入）

vue2.x

`mixin.js`

```js
export default {
  data() {
    return {
      num: 1
    }
  },
  methods: {
    changeName(count) {
      this.num += count
    }
  }
}
```

`vue`

```vue
<template>
  <div>
    {{ num }}
    <button @click="changeName(1)">click</button>
  </div>
</template>

<script>
import test from '../mixins/mixin'
export default {
  mixins: [test]
}
</script>
```



vue3.x

`mixin.js`

```js
export default function test() {
  const num = ref(1)
  function changeName(count) {
    num.value += count
  }
  return {
    num,
    changeName
  }
}
```

`vue`

```vue
<template>
  <div>
    {{ num }}
    <button @click="changeName(1)">click</button>
  </div>
</template>

<script setup>
import test from '../mixins/test'
const { num, changeName } = test()
</script>
```

### 2.9 Provide / Inject

vue2.x

`祖先组件`

```vue
<script>
	export default {
        provide: [person]
    }
</script>
```

`后代组件`

```vue
<script>
	export default {
        inject: [person]
    }
</script>
```



vue3.x

`祖先组件`

```vue
<script setup>
	let num = ref(1)
    provide('num1', num)
</script>
```

`后代组件`

```vue
<script setup>
	const num = inject('num1')
</script>
```





### 2.4 watch

同时监听多个数据

```js
watch([msg, a], (newVal, oldVal) => {  })
```

监听对象中的某个属性

```js
watch(() => obj.msg, (newVal, oldVal) => {  })
```

立即执行

```js
watchEffect(() => {
  console.log(msg.value, person.name)
})
```





## 3. vue-router

`index.js` 中的使用

```js
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/home.vue')
    }
]

export default createRouter({
    history: createWebHashHistory(),
    routes
})
```

`组件/页面` 中的使用

```vue
<script>
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
// route === this.$route     route相当于vue2中的this.$route
// router === this.$router   router相当于vue2中的this.$router
</script>
```



## 4. 组件

### 4.1 组件传值

#### 4.1.1 父传子( `defineProps` )

父级

- ```htm
  <List :msg="msg" />
  ```

子级

- ```js
  const props = defineProps({
      msg: {
          type: String
      }
  })
  // 访问  props.msg
  ```

#### 4.1.2 子传父( `defineEmits` )

子级

- ```js
  const msg = ref('hello world')
  const emit = defineEmits('delete')
  function handleClick() {
    emit('delete', msg.value)
  }
  ```

父级

- ```html
  <List @delete="handleClick" />
  ```

#### 4.1.3 父子相互传递

子级

- ```js
  const props = defineProps({
    msg: {
      type: String,
    }
  })
  const emit = defineEmits('update:msg')
  function handleClick() {
    emit('update:msg', props.msg + 1)
  }
  ```

父级

- ```html
  <List v-model:msg="msg"/>
  ```

#### 4.1.4 兄弟组件之间传值

安装

```shell
yarn add mitt
```

bus.js

```js
import mitt from 'mitt'
export default mitt()
```

list.vue

```js
import bus from '../plugins/bus'
const msg = ref('list1中的msg')
function handleClick() {
  bus.emit('fn', msg.value)
}
```

list2.vue

```js
onMounted(() => {
    bus.on('fn', val => {
        console.log(val)
    })
})
```

### 4.2 动态组件

```VUE
<template>
  <div>
    <span @click="handleClick('a')">A</span>
    <span @click="handleClick('b')">B</span>
    <span @click="handleClick('c')">C</span>
    <KeepAlive>
      <component :is="comp[active]" />
    </KeepAlive>
  </div>
</template>

<script setup>
  import A from '../components/A.vue'
  import B from '../components/B.vue'
  import C from '../components/C.vue'

  const active = ref('a')

  const comp = ref({
    a: A,
    b: B,
    c: C
  })

  function handleClick(val) {
    active.value = val
  }

</script>

<style>
span {
  display: inline-block;
  margin-left: 10px;
  padding: 5px 20px;
  background: #ccc;
  cursor: pointer;
}
</style>
```

**注**：此时有警告 `Vue received a Component which was made a reactive object. This can lead to unnecessary performance overhead, and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`. `

意思是说组件响应式会消耗性能，处理方法：用 `markRaw `将组件包裹

```js
const comp = ref({
    a: markRaw(A),
    b: markRaw(B),
    c: markRaw(C)
})
```

### 4.3 异步组件（`defineAsyncComponent`）

- 异步组件会分包打包
- 

#### 4.3.1 基本用法

```js
const comp = ref({
    a: markRaw(defineAsyncComponent(() => import('../components/A.vue'))),
    b: markRaw(defineAsyncComponent(() => import('../components/B.vue'))),
    c: markRaw(defineAsyncComponent(() => import('../components/C.vue')))
})
```

#### 4.3.2 滚动加载异步组件

**注**：如果是同一个页面加载3个组件，通过滚动事件实现异步加载，就需要：https://vueuse.org/

```shell
yarn add @vueuse/core
```



```shell
<template>
  <div>
    <component :is="comp['a']" />
    <component :is="comp['b']" />
    <div ref="target">
      <component :is="comp['c']" v-if="targetIsVisible" />
    </div>
  </div>
</template>
<script setup>
import { useIntersectionObserver } from '@vueuse/core'

const target = ref(null)
const targetIsVisible = ref(false)

const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
        if(isIntersecting) {
        	targetIsVisible.value = isIntersecting
        }
    },
)

const comp = ref({
    a: markRaw(defineAsyncComponent(() => import('../components/A.vue'))),
    b: markRaw(defineAsyncComponent(() => import('../components/B.vue'))),
    c: markRaw(defineAsyncComponent(() => import('../components/C.vue')))
})

</script>
```

#### 4.3.3 Suspense

用于协调对组件树中嵌套的异步依赖的处理。

- 接受两个插槽：`#default` 和 `#fallback`
- 如果在渲染时遇到异步依赖项 ([异步组件](https://cn.vuejs.org/guide/components/async.html)和具有 [`async setup()`](https://cn.vuejs.org/guide/built-ins/suspense.html#async-setup) 的组件)，它将等到所有异步依赖项解析完成时再显示默认插槽。

```html
<Suspense>
    <template #default>
        <component :is="comp[active]" />
        <!-- <A /> -->
    </template>
    <template #fallback>
        加载中
    </template>
</Suspense>
```

或

```html
<component :is="comp['a']" />
<component :is="comp['b']" />
<div ref="target">
    <Suspense v-if="targetIsVisible">
        <template #default>
            <component :is="comp['c']" />
        </template>
        <template #fallback>
            加载中
        </template>
    </Suspense>
</div>
```

## 5. 状态管理

### 5.1 Vuex

store/index.js

```js
import { createStore } from 'vuex'
import user from './user'
import createPersistedState from 'vuex-persistedstate'  // 持久化存储

export default createStore({
    state: {
        count: 0
    },
    getters: {
        showCount(state) {
            return state.count + ' s'
        }
    },
    mutations: {
        changeCount(state, val) {
            state.count += val
        }
    },
    actions: {
        syncUse(store, val) {
            store.commit('changeCount', val)
        }
    },
    modules: {
        user
    },
    plugins: [
        // 持久化存储
        createPersistedState({
            key: 'table',
            path: ['user']
        })
    ]
})
```



/store/user.js

```js
import { createStore } from "vuex"

export default {
    namespaced: true,
    state: {
        userInfo: {
            username: '张三',
            avatar: 'http://jaojdoiadajosidj',
            id: 12
        }
    },
    getters: {
        showUserInfo(state) {
            return `姓名：${state.userInfo.username}`
        }
    },
    mutations: {
        changeUserInfo(state, val) {
            state.userInfo = val
        }
    },
    actions: {
        syncUse({ commit }, val) {
            commit('changeUserInfo', val)
        }
    },
}
```



vue

- 选项式api

  ```vue
  <template>
    <div>
      {{ userInfo.username }} <br/>
      {{ showUserInfo }} <br/>
      {{ count }} <br/>
      {{ showCount }}
      <button @click="handleClick(1)">click</button>
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
  import store from '../store'
  export default {
    data() {
      return {}
    },
    computed: {
      ...mapState(['count']),
      ...mapState('user', ['userInfo']),
      ...mapGetters(['showCount']),
      ...mapGetters('user', ['showUserInfo'])
    },
    methods: {
      ...mapActions(['syncUse', 'user/syncUse']),
      ...mapMutations(['changeCount', 'user/changeUserInfo']),
      handleClick(val) {
        // store.commit('changeCount', val)
        // store.dispatch('syncUse', val)
  
        store.commit('user/changeUserInfo', {
          username: '李四'
        })
        // store.dispatch('user/syncUse', {
        //   username: '李四'
        // })
      }
    }
  }
  </script>
  ```

- 组合式api

  ```vue
  <template>
    <div>
      {{ userInfo.username }} <br/>
      {{ showUserInfo }} <br/>
      {{ count }} <br/>
      {{ showCount }}
      <button @click="handleClick(1)">click</button>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue-demi'
  import { useStore } from 'vuex'
  const store = useStore()
  const count = computed(() => store.state.count)
  const showCount = computed(() => store.getters.showCount)
  const userInfo = computed(() => store.state.user.userInfo)
  const showUserInfo = computed(() => store.getters['user/showUserInfo'])
  console.log(store)
  
  function handleClick(val) {
    // store.commit('changeCount', val)
    // store.dispatch('syncUse', val)
  
    // store.commit('user/changeUserInfo', {
    //   username: '李四'
    // })
    store.dispatch('user/syncUse', {
      username: '李四'
    })
  }
  </script>
  ```

  

#### 持久化存储

```shell
yarn add vuex-persistedstate
npm i vuex-persistedstate
```



```js
import { createStore } from 'vuex'
import user from './user'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    count: 0
  },
  plugins: [
    createPersistedState({
      key: 'table',  // Storage的key值
      path: ['user']  // 需要存储的模块
    })
  ]
})
```





### 5.2 Pinia
