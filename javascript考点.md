<center><h1>javascript考点</h1></center>

## 1、 this问题

调用一个函数会暂停当前函数的执行，传递控制权和参数给新函数。除了声明时定义的形式参数，每个函数还接收两个附加的参数：this和arguments。参数this在面向对象编程中非常重要，它的值取决于调用的模式。

### 1.1 this是如何工作的

在`JavaScript`中一个有4中调用模式：**方法调用模式**、**函数调用模式**、**构造器调用模式**和**apply调用模式**。这些模式在如何初始化关键参数this上存在差异。

#### 1.1.1 方法调用模式

当一个函数被保存为一个对象的属性时，我们称它为一个方法。当一个方法被调用时，this被绑定到该对象。如果调用表达式包含一个提取属性的动作（即包含一个 . 点表达式或[subscript]下标表达式），那么它就是被当做一个方法来调用。

```js
var obj = {
    name: 'foo',
    sayName: function(int) {
        this.name = typeof int === 'number' ? int : 0
    }
}
obj.sayName(1)
```

当方法调用时this指向方法所在的对象，可以获取到该对象中的属性和方法，**this到对象的绑定发生在方法调用的时候**。这个“超级”延迟绑定(very late binding)使得函数可以对this高度复用。通过this可以取得它们所属对象的上下文的方法称为公共方法(public method)。

#### 1.1.2 函数调用模式

当一个函数并非一个对象的属性时，那么它就是被当做一个函数来调用的：以此模式调用函数时，**this被绑定到全局对象**。

```js
let sum = add(3, 4)
```

**注**： 这是语言设计上的一个错误。倘若语言设计正确，那么当内部函数调用时，this应该仍然绑定到外部函数的this变量。这个错误设计的后果就是方法不能利用内部函数来帮助它工作，因为内部函数的this被绑定了错误的值，所以不能共享该方法对对象的访问权。幸运的是，有一个很容易的解决方案：如果该方法定义一个变量并给它赋值为this，那么内部函数就可以通过那个变量访问到this。按照约定，我把那个变量命名为that。

```js
var obj = {
    name: '11',
    foo: function() {
        console.log(this.name)
        let that = this
        var fn = function() {
            console.log(that.name)
        }
        fn()
    }
}
obj.foo()
```

#### 1.1.3 构造器调用模式

一个函数，如果创建的目的就是希望结合new前缀来调用，那它就被称为构造器函数。按照约定，它们保存在以大写格式命名的变量里。如果调用构造器函数时没有在前面加上new，可能会发生非常糟糕的事情，既没有编译时警告，也没有运行时警告，所以大写约定非常重要。如果在一个函数面前带上new来调用，那么背地里将会创建一个连接到该函数的prototype成员的新对象（新对象为构造函数的一个实例），同时this会被绑定到那个新对象上。

```js
function Person(name) {
    this.name = name
}
Person.prototype.sayName = function () {
    console.log(this.name)
}
let person = new Person('mary')
person.sayName() // mary
```

#### 1.1.4 Apply/call调用模式

因为JavaScript是一门函数式的面向对象编程语言，所以函数可以拥有方法。apply方法让我们构建一个参数数组传递给调用函数。它允许我们选择this的值。apply方法接收两个参数，第1个是要绑定给this的值，第2个就是一个参数数组。call方法与apply类似，将apply第二参数拆开为单个的参数。

### 1.2 this指向问题

#### 1.2.1 对象中的方法

this指向该对象

```js
var o = {
    user:"追梦子",
    fn:function(){
        console.log(this.user);  //追梦子
    }
}
o.fn();
```

```js
var o = {
    a:10,
    b:{
        a:12,
        fn:function(){
            console.log(this.a); //12
        }
    }
}
o.b.fn();
```

```js
var o = {
    a:10,
    b:{
        // a:12,
        fn:function(){
            console.log(this.a); //undefined
        }
    }
}
o.b.fn();
```

```js
var o = {
    a:10,
    b:{
        a:12,
        fn:function(){
            console.log(this.a); //undefined
            console.log(this); //window
        }
    }
}
var j = o.b.fn;
j();
```

#### 1.2.2 全局函数

this指向window

```js
function a(){
    var user = "追梦子";
    console.log(this.user); //undefined
    console.log(this); //Window
}
a();
```

#### 1.2.3 构造函数

this指向构造器

```js
function Fn(){
    this.user = "追梦子";
}
var a = new Fn();
console.log(a.user); //追梦子
```

为什么this会指向a？首先new关键字会创建一个空的对象，然后会自动调用一个函数apply方法，将this指向这个空对象，这样的话函数内部的this就会被这个空的对象替代。

**注**：构造函数遇到`return`时：

```js
function fn()  {  
    this.user = '追梦子';  
    return {};  
}
var a = new fn;  
console.log(a.user); //undefined
```

```js
function fn()  {  
    this.user = '追梦子';  
    return function(){};
}
var a = new fn;  
console.log(a.user); //undefined
```

```js
function fn()  {  
    this.user = '追梦子';  
    return 1;
}
var a = new fn;  
console.log(a.user); //追梦子
```

```js
function fn()  {  
    this.user = '追梦子';  
    return undefined;
}
var a = new fn;  
console.log(a.user); //追梦子
```

**如果返回值是一个对象，那么this指向的就是那个返回的对象（不包括null），如果返回值不是一个对象那么this还是指向函数的实例。**

### 1.3 改变this指向（call, apply, bind用法）

#### 1.3.1 call

```js
var obj = {
  name: 'hello'
}
var name = 'world'
function fn(num1, num2) {
  console.log(this.name, num1 + num2)
}
fn.call(obj, 1, 2) // hello 3
```

#### 1.3.2 apply

```js
var obj = {
  name: 'hello'
}
var name = 'world'
function fn(num1, num2) {
  console.log(this.name, num1 + num2)
}
fn.apply(obj, [1, 2]) // hello 3
```

#### 1.3.3 bind

```js
var obj = {
  name: 'hello'
}
var name = 'world'
function fn(num1, num2) {
  console.log(this.name, num1 + num2)
}
fn.bind(obj)(1, 2) // hello 3
```

**注**： `call, apply, bind`都是原型链 `Function` 原型上的方法，apply和call都是直接改变函数的this指向并执行函数，bind指修改函数的指正，需要再次调用才能执行，参数在3个以内，apply和call应能相差不大，3个参数以上，call性能比apply相对好一点

## 2. 性能测试

测试一段代码运行的时间

```js
console.time('A')
for(let i = 0; a < 100000; i++){}
console.timeEnd('A') // A: 1.093994140625 ms
```

火狐浏览器中安装FireBug可以通过 `console.profile()` 来获取指定代码段执行的时间

## 3. 函数

### 1.1 手动封装forEach方法

#### 1.1.1 数组的遍历方法

forEach

```js
// 方法
Array.prototype.each = function(cb) {
    for(let i = 0, len = this.length; i < len; i++) {
        let flag = cb(arr, arr[i], i)
        if(flag === false) {
            break
        }
    }
}
// 数组
var arr = [1,2,3,4]
// 调用
arr.each((item, index) => {
    if(item == 3) {
        return false
    }
    console.log(item, index)
})
```

jquery的each方法（可遍历伪数组）

```js
function each(arr, cb) {
    for(let i = 0, len = arr.length; i < len; i++) {
        let flag = cb.call(arr, arr[i], i)
        if(flag === false) {
            break
        }
    }
}
each(arr, function(item, index) {
    // this指向当前数组
    console.log(item, index)
})
```



#### 1.1.2 对象的迭代方法

```js
// 方法
Object.prototype.each = function(cb) {
    for(let k in this) {
        let flag = cb(k, this[k])
        if(flag === false) {
            break
        }
    }
}
// 对象
let obj = {
    name: 'hello', 
    age: 12,
    hobby: function() {
        console.log(this.name + '今年' + this.age + '岁了')
    }
}
// 调用
obj.each((k, v) => {
    if(k == 'age') {
        return false
    }
    console.log(k, v)
})
```

### 3.2 箭头函数

#### 3.2.1 特点

- 箭头函数中的this取决于上下文

- 箭头中没有 `argument` 属性，想要获取到参数属性，可以用 `...arg` 

  ```js
  let fn = () => {
      console.log(argument) // argument is not defined
  }
  let fn = (...arg) => {
      console.log(arg) // [1, 3, 4]
  }
  fn(1, 3, 4)
  ```

- 箭头函数不能用作构造函数，不能用 `new` 实例化，因为构造函数没有原型，没有 `prototype` 属性

## 4. 图片懒加载







## 5. substr,substring, spice

作用：提取一个字符串

用法：

- slice：slice(start, end)

- substring：substring(start, end)

- substr：substr(start, length)

不同点：

- slice和substring接收的是起始位置和结束位置(不包括结束位置)，而substr接收的则是起始位置和所要返回的字符串长度。
- substring是以两个参数中较小一个作为起始位置，较大的参数作为结束位置
- slice支持负数

## 6. 滚动条位置兼容问题

<a href="https://blog.csdn.net/z591102/article/details/107839324">https://blog.csdn.net/z591102/article/details/107839324</a>

- `IE6/7/8`：

  对于没有`doctype`声明的页面里可以使用`**document.body.scrollTop**`来获取 `scrollTop`高度**；**

  对于有`doctype`声明的页面则可以使用`document.documentElement.scrollTop`

- Safari:

  safari 比较特别，有自己获取`scrollTop`的函数 ：`window.pageYOffset`

- Firefox，Chrome `IE9+`：

  火狐谷歌等等相对标准些的浏览器就省心多了，直接用`document.documentElement.scrollTop`

总结：

- `document.body.scrollTop`
- `document.documentElement.scrollTop`
- `window.pageYOffset`

