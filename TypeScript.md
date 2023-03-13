<center><h1>TypeScript</h1></center>

## 1. 安装

```shell
vue add @vue/typescript
```

注：对项目有破坏

## 2. typescript基础语法

### 2.1 声明注解和编译时的类型检查

内置常用类型：

- string：字符型
- number：数字
- boolean：布尔值
- void：空
- any：任意

#### 2.1.1 类型注解

```ts
// 类型注解
let foo = 'xxx';  // 类型推论
let bar: string;   //类型注解
bar = 'hello'
```

#### 2.1.2 数组类型

```js
// 数组类型
let names: string[]
names = ['hello', 'world']
```

#### 2.1.3 任意类型

```js
// 任意类型
let hello: any
hello = 1
hello = 'hello world'

let arr: any[]
arr = ['hello', 12]
```

#### 2.1.4 函数中的类型

```js
// 可以设置返回值和参数的类型
function getter(num: number): any {
    return num + ''
}

// 没有返回值
function warn(): void {
    alert('hello')
}

// 必填参数
function sayHello(name: string, age: number) {
    console.log(name, age)
}
sayHelo('tom', 12)

// 可选参数
function sayHello(name: string, age?: number) {
    console.log(name, age)
}
sayHelo('tom')

// 函数重载，以参数的数量或类型来区分多个重名函数
// 先声明
function info(a: string): any
function info(a: any): string

// 后实现
function info(a: any): any {
    if (typeof a === 'string') {
        return { name: a }
    } else {
        return JSON.stringify(a)
    }
}
console.log(info({ name: 'hwllo' }))


// 变量或常量的函数
const fn1: (a: number, b: number) => number = function(a, b) {
    return a + b
}
const fn1 = function(a: number, b: number): number {
    return a + b
}
fn1(1,2)


// 变量或常量的函数   箭头函数
const fn2: (a: number, b: number) => number = (a, b) => {
    return a + b
}
const fn2 = (a: number, b: number): number => {
    return a + b
}
fn1(1,2)

```

#### 2.1.5 对象中的类型

```js
let obj: {a: string}
obj = { a: 'hello' }
```

#### 2.1.6 类的类型



### 2.2 vue中的用法

#### 2.2.1 基本模板

```vue
<template>
    <div>
        <div>
            <input type="text" @keydown.enter="addFeader">
        </div>
        <div v-for="feat in feats" :key="feat">{{ feat }}</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
console.log(Component)
@Component({
    watch: {
        hello() {
            console.log('改变了')
        }
    },
    created() {
        console.log(this)
    }
})
export default class extends Vue {
    feats: string[]
    hello = 'world'
    constructor() {
        super()
        this.feats = ['hello', 'world']
        console.log(this.feats)
    }
}
</script>
```

注：这里的引入的`Componen`是一个方法，这个方法中可以设置vue中的各种配置，包括

- components
- methods
- computed
- watch
- 钩子函数
- props

data数据不能往`Componen`中去声明

#### 2.2.2 class类特性

##### 2.2.2.1 变量/方法 修饰符

- **private**：私有属性只能在基类中访问，不能在实例、派生类中访问

  ```js
  class MyComp {
      private foo: string
      constructor() {
          this.foo = 'foo'
      }
  }
  const myComp = new MyComp()
  console.log(myComp.foo) // Property 'foo' is private and only accessible within class 'MyComp'
  ```

- **public**：可继承，实例化

  ```js
  class MyComp {
      public foo: string
      constructor() {
          this.foo = 'foo'
      }
  }
  const myComp = new MyComp()
  console.log(myComp.foo) // foo
  ```

- **protected**：保护属性，还可以在继承类中访问

- **readonly**：只读属性，必须在声明时或构造函数中初始化，不能修改

##### 2.2.2.2 constructor里面添加变量修饰符

```js
class MyComp {
    public foo: string
    // 这里可以将变量提升
    constructor(public foo = 'foo') {
        this.foo = 'foo'
    }
}
const myComp = new MyComp()
console.log(myComp.foo) // foo
```

##### 2.2.2.3 存取器

用途。可以做为计算属性

```vue
<template>
    <div>
        <h2>总共有{{ count }}条</h2>
    </div>
</template>
<script lang="ts">
	
export default class extends Vue {
    feats: string[]
    hello = 'world'
    constructor() {
        super()
        this.feats = ['hello', 'world']
    }
    get count() {
        return this.feats.length
    }
}
</script>
```

##### 2.2.2.4 接口

暂时放下

```js
```



