<center><h1>ES6</h1></center>

## 一、ES6介绍

ECMAScript 6.0（简称ES6），是2015年6月正式上线，ES6既是一个历史名词，也是一个泛指，含义是5.1版本以后的JavaScript的下一代标准，涵盖了ES2015，ES2016，ES2017，ES6又叫ES2015，特指该年发布的语言标准。

## 二、ES6新特性

### 1. let和const定义

#### 共同点

- **不存在变量提升**
- **块级作用域**

```js
var a = []
for (var i = 0; i < 10; i++){
    a[i] = function () {
        console.log(i)
    }
}
a[5]() //10

var a = []
for (let i = 0; i < 10; i++){
    a[i] = function () {
        console.log(i)
    }
}
a[5]() //5
```

- **不能重复声明**

#### 不同点

- **const只能声明常量，一旦定义，将无法修改**
- **const不能修改，当const定义一个对象时，可以修改对象中的内容**

```js
const person = {
    name: '小米'
}
person.name = '华为'
person.age = 12
console.log(person) //{name: "华为", age: 12}
```

- **用const定义不会污染全局变量**

```js
let Object = 10;
console.log(Object) // 10
console.log(window.Object) // ƒ Object() { [native code] }
```

### 2. 模板字符串

- 整体用 反引号`` 包裹
- 变量用 `${}` 包裹

### 3. 函数默认值

ES5中函数默认值添加：

```js
function add(a,b){
    a = a || 10
    b = b || 20
    return a + b
}
add(a,b) //30
```

ES6中函数默认值添加：

```js
function add(a = 10,b = 20){
    return a + b
}
add(a,b) //30
```

### 4. 剩余参数

剩余参数：由三个点和一个紧跟着的具体参数指定的 `...key` (key可以是随意的)

**是把多个独立的参数合并成一个数组**

ES5中

```js
function pick(obj){
  let result = {};
  for(var i=1;i<arguments.length;i++){
    result[arguments[i]] = obj[arguments[i]]
  }
  return result
}
let book = {
  title: 'es6教程',
  auther: '小马',
  year: 2019
}
let bookData = pick(book, 'auther', 'year')
console.log(bookData) // {auther: "小马", year: 2019}
```

ES6中

```js
function pick(obj, ...keys){
  console.log(keys)  // ["auther", "year"]
  let result = {};
  for(var i=0;i<keys.length;i++){
    result[keys[i]] = obj[keys[i]]
  }
  return result
}
```

### 5. 扩展运算符

**是把一个数组分割成单个的参数传给函数**

ES5中将数组转为参数

```js
let arr = [3,6,8,1,0,4]
console.log(Math.max.apply(null,arr))
```

ES6中将数组转为参数

```js
let arr = [3,6,8,1,0,4]
console.log(Math.max(...arr)) // 8
```

### 6. 箭头函数



```js
let fn = (() => {
    return () => {
        console.log('hello world')
    }
})()
fn() // hello world
```

箭头函数没有this指向，箭头函数内部this值只能通过查找作用域链来决定，**包含箭头函数的整块代码都没有作用域链**，只能向上查找

使用箭头函数注意事项：

- 箭头函数内部不存在arguments
- 箭头函数不能用 `new` 关键字来实例化对象（不能用来当做构造函数）

### 7. 解构赋值

对赋值运算符的一种扩展

对象结构

```js
let person = {
  name: 'xiaohua',
  age: 10,
  sex: '男'
}
//修改变量可以用:来修改
let {name: a, age} = person
console.log(a,age) // xiaohua 10
```

数组结构

```js
let arr = [1,4,[5],8]
let [a,b,[c],d] = arr
console.log(a,b,c,d) // 1 4 5 8
```

### 8. 对象扩展功能

es5写法

```js
let name = '小马'
let age = 25
let person = {
    name: name,
    age: age,
    sayName: function(){
        console.log(this.name)
    }
}
person.sayName() // 小马
```

es6写法

```js
let name = '小马'
let age = 25
let person = {
    name,
    age,
    sayName(){
        console.log(this.name)
    }
}
person.sayName() // 小马
```

将输入的值以对象的形式存起来

```js
function fn(a, b) {
  return {a,b}
}
console.log(fn(10,20)) // {a: 10, b: 20}
```

新增的连个对象方法

```js
//is方法,类似于===
console.log(Object.is(NaN,NaN))
//assign方法,将多个对象合并在一起，返回组合的新对象
console.log(Object.assign({c: 1}, {a: 1}, {b: 2})) // {c: 1, a: 1, b: 2}
```

### 9. Symbol类型

一旦声明，就表示独一无二的值，最大的用途就是用来定义对象的私有变量，

```js
let person = {}
let s1 = Symbol('name')
person[s1] = '小马'
console.log(person) // {Symbol(name): "小马"}
// 这里取值的之后只能用[]，来取值，不能用.来取值
```

**symbol类型作为key用 `for...in` 循环是遍历不出来的，如果想得到对应的key，可用以下方法：**

```js
console.log(Object.getOwnPropertySymbols(person)) //可以获取到所有用symbol类型作为key的值
// 通过反射
console.log(Reflect.ownKeys(person)) // 可以获取到所有的key的值，包含用symbol类型
```

### 10. Set类型

表示无重复元素的有序列表

```js
// 创建一个set对象
let set = new Set()
// 添加一个成员
set.add(2);
set.add('4');
set.add([1,2,3,4])
// 删除一个成员
set.delete('4')
// 判断是否存在某个值
console.log(set.has(2)); //true
console.log(set) // Set(2) {2, Array(4)}
set.forEach((val,key) => {
  console.log(val) // 2  2
  console.log(key) // [1, 2, 3, 4]  [1, 2, 3, 4]
})
```

Set类型forEach中key就是起本身的value值，就是说key和val值是一样的，就是组成set集合的成员

**将set转换为数组**

```js
let set = new Set([1,2,3,4]);
console.log([...set])
```

**set中对象的应用无法被释放**

```js
let set = new Set()
let obj = {}
set.add(obj)
obj = null
console.log(set) // obj依然存在
```

**解决方法**

```js
let set = new WeakSet()
let obj = {}
set.add(obj)
obj = null
console.log(set) // 
```

**WeakSet注意事项：**

- 不能传入非对象类型的参数
- 不可迭代
- 没有forEach方法
- 没有size属性

### 11. Map类型

表示键值对的有序列表，键和值可以是任意类型

```js
let map = new Map()
// 添加一个键值对
map.set('name', '张三')
map.set('age', 20)
map.set('sex', '男')
// 获取指定的值
console.log(map.get('age')) // 20
// 判断是否有某个属性
console.log(map.has('name')); // true
// 删除一个
map.delete('sex')
// 清空map
map.clear()
console.log(map)
```

**初始化一个map**

```js
let map = new Map([['name', '李四'], ['age', 19]])
console.log(map); // Map(2) {"name" => "李四", "age" => 19}
```

### 12. 数组的新增方法

#### 1. from()方法（将伪数组转为数组）

用法： Array.from(伪数组)

参数：第一个参数是接受一个伪数组，第二个参数是一个回调函数，第一个参数是遍历的元素，第二个参数是索引值

**一个参数**

```js
function fn() {
  Array.from(arguments).forEach(item => {
    console.log(item); // 2  3  5  6
  });
}
fn(2,3,5,6)
```

**两个参数**

```js
function fn() {
  let arr = Array.from(arguments, (item, index) => {
    console.log(item, index) // 2 0    3 1     5 2      6 3
  })
}
fn(2,3,5,6)
```

**其他转换方法（扩展运算符）**

```js
function fn() {
  [...arguments].forEach(item => {
    console.log(item);
  });
}
fn(2,3,5,6)
```

#### 2. of()方法（将一组值放到数组中）

```js
var arr = Array.of(11,'12',[1,2],{id:1});
console.log(arr); // [11, "12", Array(2), {…}]
```

感觉这个方法很鸡肋

#### 3. copyWithin() （复制替换）

参数：第一个参数是要替换的索引，第二个参数是要截取的索引

```js
let arr = [1,2,3,8,9]
let newArr = arr.copyWithin(2,3)
console.log(newArr) // [1, 2, 8, 9, 9]
```

感觉这个方法很鸡肋

#### 4. find()和findIndex()（查找符合条件的值和索引）

均是返回第一个符合条件的元素

find()

```js
let arr = [1,4,6,10,100]
let result = arr.find(item => item >= 100)
console.log(result) // 100
```

findIndex()

```js
let arr = [1,4,6,10,100]
let result = arr.findIndex(item => item >= 100)
console.log(result) // 4
```

#### 5. keys()、values()和entries()（数组的遍历器）

keys()、values()、entries()均返回一个遍历器，可以使用 `for...of  ` 来进行遍历

`arr.keys()` 、`arr.values()`、 `arr.entries()` 都会返回一个遍历器，这时就可以用`for...of  `进行遍历

keys()（遍历数组的key值，也就是索引值）

```js
let arr = [3,2,1]
console.log(arr.keys()) // Array Iterator {}
for(let key of arr.keys()){
  console.log(key) // 0  1  2
}
```

values()（遍历数组的value值）

```js
let arr = [3,2,1]
console.log(arr.values()) // Array Iterator {}
for(let value of arr.values()){
  console.log(value) // 3  2  1
}
```

entries() （遍历数组的索引和元素）

**注意：第一个参数是index，第二个参数是value**

```js
let arr = [3,2,1]
console.log(arr.entries()) // Array Iterator {}
for(let [index, value] of arr.entries()){
  console.log(index) // 0  1  2
  console.log(value) // 3  2  1
}
```

#### 6. includes()（判断数组中是否有某个元素）

类似于indexOf

```js
let arr = [2,4,6]
console.log(arr.includes(4)) //true
```

### 13. 迭代器（Iterator）

**Iterator，即遍历器，是一种新的遍历机制**

- 迭代器是一个接口，能快速的访问数据，通过 `Symbol.iterator` 创建迭代器，通过迭代器的 `next()`  方法来获取迭代之后的结果
- 迭代器是用于遍历数据结构的指针

创建一个迭代器

```js
let arr = ['one', 'two', 'three']
console.log(arr[Symbol.iterator]()); // Array Iterator {}
```

此时就可以通过调用迭代器的 `next` 方法来进行遍历，调一下执行一次，直到全部遍历结束时，value为undefined，done为true

```js
let arr = ['one', 'two', 'three']
let iter = arr[Symbol.iterator]();
console.log(iter.next()); // {value: "one", done: false}
console.log(iter.next()); // {value: "two", done: false}
console.log(iter.next()); // {value: "three", done: false}
console.log(iter.next()); // {value: undefined, done: true}
```

### 14. 生成器（Generator）

Generator函数，可以通过yield关键字将函数挂起，使函数停留在当前位置

生成器函数与普通函数的区别

- 生成器函数关键字 `function` 和函数名中间有一个 `*` ，表示这个函数是一个生成器函数
- 只有生成器函数内部可以使用 `yield` 关键字，使函数停留在当前位置

**Generator函数的基本用法**

```js
function* fn() {
  console.log('start')
  yield 2
  console.log('middle')
  yield 3
  console.log('end')
}
let f = fn()
console.log(f.next()) // start   {value: 2, done: false}
console.log(f.next()) // middle   {value: 3, done: false}
console.log(f.next()) // end   {value: undefined, done: true}
```

**总结：** Generator函数是分段执行的，`yield` 关键字是暂停执行，`next()` 方法是恢复执行

**Generator函数的高级用法（`next()` 传值）**

```js
function* fn() {
  console.log('one')
  // a不是yield的返回值，而是第二次调用next是传入的值
  let a = yield 2
  console.log(a)
  let b = yield 3
  console.log(b)
  return a + b
}
let f = fn()
console.log(f.next()) // one  {value: 2, done: false}
console.log(f.next(10)) // 10  {value: 3, done: false}
console.log(f.next(20)) // 20  {value: 30, done: true}
```

**使用场景**：为不具备Iterator接口的**对象**提供遍历操作

```js

function* fn(obj) {
  let objKeys = Object.keys(obj)
  for(let key of objKeys){
    yield [key, obj[key]]
  }
}
let obj = {
  name: '小马',
  age: 12
}
给对象添加一个
obj[Symbol.iterator] = fn(obj)
console.log(obj[Symbol.iterator])
for(let [key,value] of fn(obj)){
  console.log(key,value) // name 小马    age 12
}
```

**用生成器函数解决回调地狱**

```js
// Generator函数
function* main() {
  let res1 = yield request('http://127.0.0.1:8000/data')
  let res2 = yield request('http://127.0.0.1:8000/data1')
  console.log(res1)
  console.log(res2)
}
// 保存生成器函数
let m = main()
// 第一次对生成器函数使用next()方法
m.next()
// 发送请求的函数
function request(url) {
  $.ajax({
    url,
    method: 'get',
    data: {
    },
    success: function(res){
      // 调用Generator函数的next()方法，将得到的数据保存到res中
      m.next(res)
    }
  })
}
```

**用生成器函数模拟loading开启和关闭**

```js
function* loading() {
  console.log('开始loading')
  let res = yield request('http://127.0.0.1:8000/data1')
  console.log(res)
  console.log('关闭loading')
}
let load = loading()
load.next()
function request(url) {
  $.ajax({
    url,
    method: 'get',
    data: {
    },
    success: function(res){
      load.next(res)
    }
  })
}
```

**Generator函数作用：**可以部署ajax操作，让异步代码同步化。

### 15. promise

promise相当于是一个容器，它保存了一些可能未来才会结束的事件（异步操作），特点：

- promise对象的状态不收外界影响，有三种状态，Pending(进行)，Resolved(成功)，rejected(失败)
- 一旦状态改变，就不会在变化了，任何时候都可以得到这个结果

**用promise做ajax请求**

```js
// 创建一个promise对象
let promise = new Promise(function(resolve,reject){
  $.ajax({
    url: 'http://127.0.0.1:8000/data1',
    method: 'get',
    data: {
    },
    success: function(res){
      resolve(res)
    },
    error: function(err){
      reject(err)
    }
  })
})
// promise对象通过.then操作获取请求回来的数据，通过.catch抛出错误提示
promise.then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})
```

**用原生promise封装一个原生的ajax请求**

```js
function getJSON(url) {
  return new Promise(function(resolve,reject){
    // 创建ajax对象
    const xhr = new XMLHttpRequest()
    // 打开ajax对象
    xhr.open('GET', url)
    // 当请求对象的状态改变时触发
    xhr.onreadystatechange = function() {
      // 当状态readyState的状态===4时，此时请求的数据已被返回
      if(this.readyState === 4){
        if(this.status === 200){
          resolve(this.response)
        }else{
          reject(new Error(this.statusText))
        }
      }
    }
    // 设置返回的数据格式
    xhr.responseType = 'json'
    // 设置请求头
    xhr.setRequestHeader('Accept', 'application/json')
    // 发送
    xhr.send()
  })
}
getJSON('http://127.0.0.1:8000/data1').then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})
```

**promise解决回调地狱**

```js
getJSON('http://127.0.0.1:8000/data1').then(res => {
  console.log(res)
  return getJSON('http://127.0.0.1:8000/data')
})
.then(res => {
  // 这里res接受的参数是前面.then中return出去的值
  console.log(res)
  return getJSON('http://127.0.0.1:8000/data1')
})
.then(res => {
  console.log(res)
})
```

**resolve() / reject()方法**

- resolve()可将任意数据类型转为promise对象，并通过 `.then` 获取

- reject()可将任意数据类型转为promise的错误对象，并通过 `.catch` 获取

```js
let a = '12'
// Promise.resolve(a) 等价于 new Promise(resolve => resolve(a))
let promise = Promise.resolve(a)
promise.then(res => {
  console.log(res) // 12
})
```

**all()方法**

- 可以并发请求，同时发送多个ajax请求，可以解决回调地狱问题
- 一些游戏类网站必须等所有资源全部加载完之后才能进行一系列操作，所以需要所有请求都接收成功的情况下才能操作

```js
let promise1 = getJSON('http://127.0.0.1:8000/data')
let promise2 = getJSON('http://127.0.0.1:8000/data1')
let promise3 = getJSON('http://127.0.0.1:8000/data')
let promiseAll = Promise.all([promise1, promise2, promise3])
promiseAll.then(res => {
  console.log(res) // [Array(8), Array(6), Array(8)]
}).catch(err => {
  console.log(err)
})
```

**注意：**这里res返回的是所有接收的数据组成的一个数组，当有一条数据接收失败是，就会跳到catch中，抛出异常

**race()方法**

- race()方法是一个竞态方法，race中的传入的状态哪一个率先改变，整个promise对象就会改变成哪一种状态
- 用途，可以用来做图片加载超时效果，当图片3秒内没有加载出来是，将不会再加载

```js
// 加载图片的函数
function loadImg(url){
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.src = url
    img.onload = function(){
      resolve(img)
    }
  })
}
// 图片超时的函数
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('图片加载超时'))
    }, ms)
  })
}
// race中有两个状态，一个加载图片的状态，一个加载超时的状态
let p = Promise.race([
	loadImg('https://img1.baidu.com/it/u=1485012388,2380514454&fm=26&fmt=auto&gp=0.jpg'), 		timeout(2000)
])
p.then(res => {
   // 两秒后图片加载，进入这里
  document.querySelector('.box').appendChild(res)
}).catch(err => {
  // 两秒后超时，进入这里
  console.log(err)
})
```

**done() / finally()方法**

暂时没什么用，用的时候再看吧

### 16. async ... await

函数前面加上async 是，这个函数会返回一个promise对象，此时就可以用 `.then` 来获取函数中的值

**用async 函数发送ajax请求**

```js
async function fn(){
     // 这里直接返回
  return await $.ajax({
    url: 'http://127.0.0.1:8000/data',
    method: 'get',
    success: function(res){
      return res
    },
    error: function(err){
      return err
    }
  })
}
// 这里通过.then可以得到ajax请求回来的值
fn().then(res => {
  console.log(res)
}).catch(err => {
  console.log(err.statusText)
})
```

**async函数中有多个await**

```js
async function fn() {
  let s = await 'hello async'
  s = await s.split('')
  return await s
}
fn().then(res => {
  console.log(res) // ["h", "e", "l", "l", "o", " ", "a", "s", "y", "n", "c"]
})
```

如果async函数中有多个await，then会等待所有的await指令全部执行结束之后才去执行

**用async 函数发送ajax请求，并对获得的数据进行处理**

```js
// ajax封装
function getJSON(url) {
  return new Promise(function(resolve,reject){
    // 创建ajax对象
    const xhr = new XMLHttpRequest()
    // 打开ajax对象
    xhr.open('GET', url)
    // 当请求对象的状态改变时触发
    xhr.onreadystatechange = function() {
      // 当状态readyState的状态===4时，此时请求的数据已被返回
      if(this.readyState === 4){
        if(this.status === 200){
          resolve(this.response)
        }else{
          reject(new Error(this.statusText))
        }
      }
    }
    // 设置返回的数据格式
    xhr.responseType = 'json'
    // 设置请求头
    xhr.setRequestHeader('Accept', 'application/json')
    // 发送
    xhr.send()
  })
}
async function fn(url){
  // 得到res，取出数组中的第一个返回
  let res = await getJSON(url)
  let resFirst = await res[0]
  return await resFirst
}
fn('http://127.0.0.1:8000/data').then(res => {
  // 这里得到的就是经过处理的数据
  console.log(res)
}).catch(err => {
  console.log(err)
})

```

### 17. class类的用法

**es5中的造类**

```js
function Person(name, age) {
  this.name = name
  this.age = age
}
Person.prototype.sayName = function() {
  console.log(this.name)
}
let per = new Person('小马', 18)
per.sayName() // 小马
```

**es6中的类**

```js
class Person {
  // constructor是原型上的方法，当实例化的时候回被立即调用
  constructor(name, age){
    this.name = name;
    this.age = age
  }
  sayName(){
    console.log(this.name)
  }
}
let per = new Person('小马',19)
per.sayName()
```

**往原型上批量添加方法**

```js
class Person {
  constructor(name, age){
    this.name = name;
    this.age = age
  }
}
Object.assign(Person.prototype, {
  sayName(){
    console.log(this.name)
  },
  sayAge(){
    console.log(this.age);
  }
})
let per = new Person('小马',19)
per.sayName()
```

使用 `Object.assign` 方法批量往原型上添加方法

**类的继承**

```js
class Animal {
  constructor(name, age){
    this.name = name;
    this.age = age
  }
  sayName(){
    console.log(this.name)
  }
  sayAge(){
    console.log(this.age)
  }
}
// 继承关键字extends
class Dog extends Animal{
  constructor(name, age, color){
    // 继承属性关键字super
    super(name,age)
    // Animal.call(this,name,age)
    this.color = color
  }
}
let dog = new Dog('大黄', 5, 'yellow')
console.log(dog)
dog.sayName()
```

类继承关键字`extends` ，属性继承关键字`super` ，后面需要加上需要继承的属性的名称，此时，属性和方法都会继承父类，可以直接使用，如果不需要父类的某个方法，也可以在自己的原型上**重写**该方法

### 18. 模块化

- script类型必须是 `module` ，通过import引入模块
- `export` 导出的对象必须用**解构**来接收

```js
<script type="module">
  import {obj, fn} from './modules/index.js'
  console.log(obj) // {a: 1, b: 2}
</script>
```

- `export default` 一个模块只能有一个，而`export` 可以用多个`export default`接收是不需要解构，直接给变量即可

```js
<script type="module">
  // 解构
  import {obj, fn} from './modules/index.js'
  // 直接用变量代替
  import arr from './modules/index.js'
  console.log(arr) // [1, 2, 3]
</script>
```

- 获取到该模块输出的所有对象的方法

```javascript
<script type="module">
  import * as module from './modules/index.js'
  console.log(module) // 所有值都可以获取到，包括default
</script>
```



### 19 事件循环

代码执行顺序：

- 同步
- 异步
  - 微任务：Premise，process.nextTick，Object.observe，MutationObserver
  - 宏任务：setTimeout，setInterval，requsetAnimationFrame， I/O

先同步，将异步任务放到任务队列中，然后先执行完微任务，在执行宏任务

