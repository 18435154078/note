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



## 4. 组件传值

### 4.1 父传子( `defineProps` )

父级

- ```htm
  <List :msg="msg" />
  ```

子级

- ```js
  defineProps({
      msg: {
          type: String
      }
  })
  ```

### 4.2 子传父( `defineEmits` )

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

### 4.3 父子相互传递

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

### 4.4 兄弟组件之间传值

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

