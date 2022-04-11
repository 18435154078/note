<center><h1>ts</h1></center>

## 1. 环境搭建

全局安装typescript

```shell
npm i typescript -g
```

编译ts

```shell
tsc 编译文件 -w
```

```typescript
function sum(a: number, b: number): string {
  return a + b + ''
}
console.log(sum(123, 456))
```

## 2. ts中的类型

定义多种类型：

```js
let double: number | string = '1'
```



- 布尔值（boolean）

  ```ts
  let isDone: boolean = false
  ```

- 数字（number ）`十进制和十六进制字面量，二进制和八进制字面量。`

  ```ts
  let decLiteral: number = 6
  ```

- 字符串（string）

  ```ts
  let name: string = "bob"
  ```

- 数组

  ```ts
  let arr: number[] = [1,2,3]
  let arr: Array<number> = [1,2,3]
  ```

- 任意（any）不建议

  ```ts
  let decLiteral: any = 6
  decLiteral = '6'
  ```

- `unknow`

  ```ts
  let a: unknown = '1'
  let b: number
  b = a as number
  ```

  `unknow` 和 `any` 的区别：

  - 都可以任意赋值
  - 赋值变量的时候any不会有任何提示，而 `unknow` 会有提示

- void：函数返回空值，

  ```ts
  function add(): void {
  	// return false  这里不能有返回值，有返回值就会提示
      // return null  可以返回 null
      // return undefined   可以返回 undefined
  }
  ```

- never：函数没有返回值，使用场景，报错提示

  ```ts
  function neverFn(): never {
    throw '报错了'
    console.log('err')
  }
  ```

- object：可以是数组，函数，对象

  ```ts
  let obj: {}
  obj = function() {
    return 1
  }
  // obj = {a: 1}
  // obj = [1,2,3]
  console.log(obj)
  ```

- {}：可以是数组，函数，对象

  ```ts
  let obj: {}
  obj = function() {
    return 1
  }
  // obj = {a: 1}
  // obj = [1,2,3]
  console.log(obj)
  ```

  可以指定对象的属性及类型

  ```ts
  let obj: {name: string, age?: number, [propName: string]: any}
  ```

  - 赋值的对象与指定的属性及类型必须一致，多一个少一个都不行
  - `?` 表示可选
  - `[propName: string]: any`：表示属性名的类型是字符串，属性值的类型任意

- 元组 Tuple：固定长度的数组

  ```ts
  // 元组
  let arrs: [number, string]
  arrs = [12, 'hello']
  ```

  - 数据类型必须符合
  - 数组元素类型顺序必须符合

- 枚举 enum

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

- type

  ```ts
  type myNumber = 1 | 2 | 3
  let z: myNumber = 3
  ```



## 3. 编译选项

配置文件

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
    // 可以作为模块的文件
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

### 5.1 概念

面向对象：

### 5.2 class

#### 5.2.1 属性申明

- 静态：static

  ```ts
  class Person {
      static name: string = 'hello'
  }
  cosnole.log(Person.name)
  ```

- 只读：readonly

  ```ts
  class Person {
      readonly name: string = 'hello'
  }
  cosnole.log(Person.name)
  ```

  静态只读

  ```ts
  class Person {
      static readonly name: string = 'hello'
  }
  ```

- 公共属性：public，默认

  ```ts
  class Person {
    public name: string
    age: number
    constructor(name: string, age: number) {
      this.name = name
      this.age = age
    }
  }
  const p = new Person('张三', 12)
  console.log(p)  // Person {name: '张三', age: 12}
  ```

- 私有属性：private

  ```ts
  class Person {
    private other: string
    constructor() {
        console.log(this.other) // other
    }
  }
  const p = new Person()
  
  console.log(p.other)  // 属性“other”为私有属性，只能在类“Person”中访问
  ```

- 派生属性：protected

  ```ts
  class Person {
    protected other: string = 'other'
    constructor() {}
  }
  
  class Student extends Person {
    constructor() {
      console.log(this.other) // other
    }
  }
  const s = new Student('小明', 6, 100)
  ```

#### 5.2.2 继承

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

##### 5.2.2.1 抽象类

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

##### 5.2.2.2 属性的封装

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





#### 5.2.3 接口

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

#### 5.2.3 泛型

##### 5.2.3.1 函数泛型

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

##### 5.2.3.2 class 的泛型

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



```js
const path = require('path')
const htmlWebapckPlugin = require('html-webpack-plugin')


module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        clean: true,
        environment: {
            arrowFunction: false
        }
    },
    plugins: [
        new htmlWebapckPlugin({
            filename: 'index.html',
            template: './index.html',
            title: 'webpack'
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    // css兼容处理
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "postcss-preset-env",
                                        {
                                            browsers: 'last 2 versions'
                                        }
                                    ]
                                ]
                            }
                        }
                    },
                    'less-loader'
                ]
            }
        ]
    },

    mode: 'production'
}
```

#### 总结

- 类与类之间继承关系，用 `extends` 关键字
- 类继承接口，用 `implements` 关键字





## 6. 类型断言

```ts
function getString(str: number|string): number {
    return (<string>str).length ?
        (<string>str).length :
    	str.toString().length
    
    return (str as string).length
}
```







## 7. vue3.0+ts

















## js数字进制问题

10的各种进制表现形式

- 二进制：0b1010
- 八进制：0o12

- 十进制：10
- 十六进制：0xa

