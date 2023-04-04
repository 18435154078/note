<center><h1>TypeScript</h1></center>

## 1. 安装

全局安装typescript

```shell
npm i typescript -g
```

编译ts

```shell
tsc 编译文件 -w
```

项目中安装

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

#### 2.1.6 Tuple（元组）

固定长度的数组

```ts
// 元组
let arrs: [number, string]
arrs = [12, 'hello']
```

- 数据类型必须符合
- 数组元素类型顺序必须符合

#### 2.1.7 enum（枚举）

ts

```ts
enum Color {Red, Green, Blue}
console.log(Color)
// { '0': 'Red', '1': 'Green', '2': 'Blue', Red: 0, Green: 1, Blue: 2 }
```

js

```js
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}))
```

#### 2.1.8 type

```ts
type myNumber = 1 | 2 | 3
let z: myNumber = 3
```



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

- **static**：静态

  ```js
  class Person {
      static name: string = 'hello'
  }
  cosnole.log(Person.name)
  ```

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

接口是用来定义一个类的结构，定义一个类中包含哪些属性和方法，同时接口也可以当成类型申明去使用

- 接口可以重复申明，累加效果
- 接口可以在定义类的时候去限制类的结构
- 接口中的所有属性都不能是实际值，包括方法，接口中定义的方法是抽象方法

type申明

```ts
type obj = {
    name: string,
    age: number,
    [hobby: string]: any
}
let a: obj = {
    name: '12',
    age: 12,
    hobby: '12'
}
```

接口申明（接口定义对象）

```ts
interface myInter {
    name: string,
    age: number
}
interface myInter {
    sayHello(): void
}
// 使用接口定义对象
let myObj: myInter = {
    name: '小马',
    age: 12,
    sayHello(): void {
        console.log('你好')
    }
}
console.log(myObj)
```

接口申明（接口定义类）

```ts
interface myInter {
    name: string,
    age: number
}
interface myInter {
    sayHello(): void
}
class myClass implements myInter {
    name: string
    age: number
    constructor(name: string, age: number) {
        this.name = name
        this.age = age
    }
    sayHello(): void {
        throw new Error("Method not implemented.")
    }
}
let my = new myClass('李四', 12)
console.log(my)
```

**interface和type的区别**

- 写法不同

  - ```js
    interface hello {}
    ```

  - ```js
    type hello = {}
    ```

- interface不能定义基本类型

- interface可以重复定义会合并， type重复定义会报错



##### 2.2.2.5 泛型

- 函数泛型

定义泛型

```ts
function fn<T>(a: T): T{
    return a
}

function fn2<T, K>(a: T, b: K) {
    return b
}
```

使用泛型

```ts
fn<number>(1) // 添加类型限制
fn('hello world') // 直接调用，自动判断类型

fn2('hello', 12) // 直接调用，自动判断类型
fn2<string, number>('hello', 12) // 添加类型限制
```

- class 的泛型

定义泛型

```ts
class Person<T, K> {
    public name: T
    public age: K
    constructor(name: T, age: K) {
        this.name = name
        this.age = age 
    }
}
```

使用泛型

```ts
let p = new Person<string, number>('张三', 12)
console.log(p)
```



##### 2.2.2.6 装饰器

一个方法，可以注入到**类，方法，属性，参数**上，来扩展**类，属性，方法，参数**的功能



类装饰器

```ts
function decorator(target: any){  // target就是这个类 Person
    target.prototype.getUser = function() {
        console.log(1)
    }
}
@decorator
class Person {

}
let per = new Person()
console.log(per)
```



装饰器工厂（可传参）

```js
function decorator(options: any) {
    return function(target: any) {
        target.prototype.name = options.name
        target.prototype.age = options.age
        target.hobby = [1,2]
    }
}
@decorator({
    name: '张三',
    age: 12
})
class Person {
    readonly eat = 1
}
let per = new Person()
console.log(per)
```



装饰器组合

```ts
function decorator1(target: any){
    3
    target.prototype.sum = function(a:number,b: number):number{return a+ b}
}

function decorator2(options: any) {
    1
    return function(target: any) {
        2
        target.prototype.name = options.name
        target.prototype.age = options.age
        target.hobby = [1,2]
    }
}

@decorator2({
    name: '张三',
    age: 12
})
@decorator1

class Person {
    readonly eat = 1
}
let per = new Person()
console.log(per)
```

几个装饰器函数执行顺序：先自上而下执行装饰器工厂，再自下而上执行所有的装饰器



属性装饰器

```ts
function decorator5(val: any) {
    return function(target: any, key: any) {
        target[key] = val
    }
}

class Person {
    @decorator5(5)
    //@ts-ignore
    eat: string;
}
let per = new Person()
console.log(per)
```



方法装饰器

```ts
function decorator5(target: any, key: any) {
    console.log(target, key)
}
class Person {
    @decorator5
    add() {
        console.log('add')
    }
}
let per = new Person()
per.add()
```







#### 2.2.3 类的继承

#### 

```ts
class Person {
  public name: string
  age: number
  protected other: string = 'other'
  static readonly say = 'hello world'
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  sayHello(): void {
    console.log('say hello')
  }
}
const p = new Person('张三', 12)
console.log(p)

class Student extends Person {
  corse: number
  constructor(name: string, age: number, corse: number) {
    super(name, age)
    this.corse = corse
    console.log(this.other)
  }
}

const s = new Student('小明', 6, 100)
console.log(s)
s.sayHello()
console.log(Student.say)
```

##### 2.2.3.1 抽象类

```ts
abstract class Person {
    // 专门用来被继承的类，不能被实例化
    constructor() {}
    // 抽象类中可以定义抽象方法，抽象方法，子类必须对抽象方法进行重写
    abstract sayhello()
}
const p = new Person() // 无法创建抽象类的实例
class Student extends Person {
    constructor() {
        super()
    }
    sayHello(): void {
		// 重写父类的抽象方法，如果没有，报错
        console.log('重写方法')
    }
}
```

##### 2.2.3.2 属性的封装

```ts
class Person {
    private name: string
    private age: number
    constructor(name: string, age: number) {
        this.name = name
        this.age = age
    }
    getAge(): number {
        return this.age
    }
    setAge(val: number) {
        if(val < 0) {
            throw `属性age不能小于0`
        }
        this.age = val
    }
}
let p = new Person('张三', 12)
p.setAge(-1)
console.log(p)
```

```ts
class Person {
    private _name: string
    private _age: number
    constructor(name: string, age: number) {
        this._name = name
        this._age = age
    }
    get age(): number {
        return this._age
    }
    set age(value) {
        if(value < 0) {
            throw `属性age不能小于0`
        }
        this._age = value
    }
}
let p = new Person('张三', 12)
p.age = 1
console.log(p.age)
```



## 3. 项目中怎么使用



### 3.1 命名空间

```ts
export namespace num {
  export function add(a: number, b: number): number {
    return a + b
  }
  console.log(add(1,2))
}

namespace str {
  export function add(a: string, b: string): string {
    return a + b
  }
  
}
console.log(str.add('1','2'))

```



```ts
import {num} from './utils/global'
console.log(num)

```



### 3.2 描述文件声明







## 4. 编译选项

配置文件

```shell
tsc -init
```



```json
{
    "include": ["./*.ts"], // 包含，**表示任意目录，*表示任意文件
    "exclude": ["./helloWorld.ts"], // 不包含
    "extends": "./xxx.json", // 继承与其他的json文件
    "files": [ // 详细设置需要编译的文件
        "./helloWorld.ts"
    ],
    "compilerOptions": { // 编译器的配置
        "target": "ES3", // ts被编译成js的版本
        	// 'es3', 'es5', 'es6', 'es2015', 'es2016', 'es2017', 'es2018', 'es2019', 				'es2020', 'es2021', 'es2022', 'esnext'
        "module": 'none',
        	// 'none', 'commonjs', 'amd', 'system', 'umd', 'es6', 'es2015', 'es2020', 				'es2022', 'esnext', 'node12', 'nodenext'
        "lib": [""],
        	// 'es5', 'es6', 'es2015', 'es7', 'es2016', 'es2017', 'es2018', 'es2019', 'es2020', 'es2021', 'es2022', 'esnext', 'dom', 'dom.iterable', 'webworker', 'webworker.importscripts', 'webworker.iterable', 'scripthost', 'es2015.core', 'es2015.collection', 'es2015.generator', 'es2015.iterable', 'es2015.promise', 'es2015.proxy', 'es2015.reflect', 'es2015.symbol', 'es2015.symbol.wellknown', 'es2016.array.include', 'es2017.object', 'es2017.sharedmemory', 'es2017.string', 'es2017.intl', 'es2017.typedarrays', 'es2018.asyncgenerator', 'es2018.asynciterable', 'es2018.intl', 'es2018.promise', 'es2018.regexp', 'es2019.array', 'es2019.object', 'es2019.string', 'es2019.symbol', 'es2020.bigint', 'es2020.promise', 'es2020.sharedmemory', 'es2020.string', 'es2020.symbol.wellknown', 'es2020.intl', 'es2021.promise', 'es2021.string', 'es2021.weakref', 'es2021.intl', 'es2022.array', 'es2022.error', 'es2022.object', 'es2022.string', 'esnext.array', 'esnext.symbol', 'esnext.asynciterable', 'esnext.intl', 'esnext.bigint', 'esnext.string', 'esnext.promise', 'esnext.weakref'
        "outDir": "./dist", // 输出文件目录
        "allowJs": true, // 是否允许编辑js，默认为false
        "checkJs": false, // 是否检查js语法
        "removeComments": true,  // 编译的时候是否移除注释
        "noEmit": false,  // 不生成编译后的文件，默认false
        "strict": true,  // 严格检查的总开关
        "noEmitOnError": false, // 有错时不生成编译文件
        "alwaysStrict": true,  // 启用严格模式
        "noImplicitAny": true,  //禁止隐式的any
        "strictNullChecks": true  // 严格检查空值
    }
}
```

## 4. webpack打包ts代码

初始化

```shell
npm init -y
```

安装依赖

```shell
npm i webpack webpack-cli typescript ts-loader -D
npm i @babel/core @babel/preset-env babel-loader core-js -D
```

- @babel/core：主要是一些去对代码进行转换的核心方法
- babel-loader：babel加载器

webpack.config.js

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        clean: true,
        // 不使用箭头函数打包，ie不兼容箭头函数
        environment: {
            arrowFunction: false
        }
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                use: [
                    {
                        loader: 'babel-loader',
                        // babel配置项
                        options: {
                            // 设置预定义的环境
                            presets: [
                                [
                                    '@babel/preset-env',
                                    // 配置信息
                                    {
                                        // 兼容的浏览器的版本
                                        targets: {
                                            "ie": "9"
                                        },
                                        // 指定corejs版本
                                        "corejs": "3",
                                        // 按需加载
                                        // "useBuiltIns": "usage"
                                    }
                                ]
                            ]
                        }
                    },
                    'ts-loader'
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: 'index.html',
            title: 'hello world'
        })
    ],
    // ts和js结尾的文件可省略扩展名
    resolve: {
        extensions: ['.ts', '.js']
    },
    mode: 'production'
}
```

package.json

```json
{
    "name": "ts",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build": "webpack",
        "start": "webpack serve --open"
    },
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "@babel/core": "^7.17.8",
        "@babel/preset-env": "^7.16.11",
        "babel-loader": "^8.2.3",
        "core-js": "^3.21.1",
        "html-webpack-plugin": "^5.5.0",
        "ts-loader": "^9.2.8",
        "typescript": "^4.6.2",
        "webpack": "^5.70.0",
        "webpack-cli": "^4.9.2",
        "webpack-dev-server": "^4.7.4"
    }
}
```

## 5. 面向对象







## js数字进制问题

各种进制表现形式

- 二进制：0b1010
- 八进制：0o12

- 十进制：10
- 十六进制：0xa
