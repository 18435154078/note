<center><h1>react</h1></center>

中文官网：https://react.docschina.org/

英文官网：https://reactjs.org/

在线CDN

```HTML
<!-- react核心库 -->
<script src="https://unpkg.com/react@16/umd/react.development.js"></script>
<!-- react dom 操作库 -->
<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
<!-- 识别jsx的Babel 生产环境中不建议使用 -->
<script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
```

## 一、核心概念

### 1. hello world

#### 1.1 JSX写法

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <!-- 生产环境中不建议使用 -->
  <script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
  
</head>
<body>
  <div id="root"></div>
</body>
<script type="text/babel">
  ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('root')
  )
</script>
</html>
```

- 三个CDN顺序
- `ReactDOM` 的render方法用来渲染虚拟DOM
- script类型用`type="text/babel"`
- `jsx`写法用来表示虚拟DOM

#### 1.2 虚拟DOM写法

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <!-- 生产环境中不建议使用 -->
  <script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
  
</head>
<body>
  <div id="root"></div>
</body>
<script type="text/javascript">
  ReactDOM.render(
    React.createElement('h1', { id: 'test', style: { color: 'red' }}, [
      React.createElement('div', {}, 'div'),
      React.createElement('span', {}, 'span')
    ]),
    document.getElementById('root')
  )
</script>
</html>
```

- 通过`React.createElement`来创建虚拟DOM
  - 第一个参数：标签名
  - 第二个参数：属性
  - 第三个参数：标签内容



### 2. JSX语法规则

#### 2.1 JSX语法

- 不能有多个根节点，类似有vue2.0的组件
- 标签必须闭合

- react中定义虚拟DOM时，不要用引号

- 标签中混入变量时，用 `{}` 代替 `""` 来包裹变量

  ```jsx
  const myClass = 'hello'
  ReactDOM.render(
      <h1 className={ myClass }>
      	hello world
      </h1>
  , document.getElementById('root'))
  ```

- `class` 为 `ES6` 中的关键字，`class` 统一用 `className` 表示

- 行内 `style` 样式的写法

  ```jsx
  const myClass = 'hello'
    ReactDOM.render(
      <h1 className={ myClass } style={{ color: 'yellow', fontSize: '40px' }}>
        hello world
      </h1>
    , document.getElementById('root'))
  ```

  两层大括号的含义

  - 第一层表示里面是个表达式
  - 第二层表示对象最外层的大括号

- 标签首字母
  - 若以小写字母开头，则将标签转为html中同名的元素，若html中五同类元素，则报错
  - 若以大写字母开头，react去渲染对应的组件，若组件未定义，则报错。

#### 2.2 JSX遍历

```jsx
const myData = ['Angular', 'React', 'Vue']
ReactDOM.render(
    <h1>
        <ul>
            { myData.map((item, index) => <li key={ index }>{ item }</li>) }  
        </ul>
    </h1>
, document.getElementById('root'))
```



### 3. 组件

#### 3.1 创建组件的方式

##### 3.1.1 函数是组件

```jsx
function Vdom() {
    console.log(this) // 这里的this的值是undefined，因为Babel翻译后会开启严格模式，
    return <div>
        <div>
            <span>hello</span>
            <b>world</b>
        </div>
    </div>
}
ReactDOM.render(<Vdom />, document.querySelector('#root'))
```

**执行 `ReactDOM.rende`发生的事情 **

- `react` 会解析组件标签`Vdom`，找到`Vdom`组件，若找不到，则报错
- 发现组件是使用函数定义的，随后调用函数，将返回的虚拟`DOM`转为真实`DOM`，渲染到页面中

**Babel翻译完代码之后会自动开启严格模式**

- 全局函数中的 `this` 不在指向 `window`

##### 3.1.2 类式组件

```jsx
class Vdom extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <span>hello</span>
                    <b>world</b>
                </div>
            </div>
        )
    }
}
ReactDOM.render(<Vdom />, document.querySelector('#root'))
```

- 关键字`class`
- 继承一个react内置的类`React.Component`

**执行 `render`发生的事情 **

- `react` 会解析组件标签`Vdom`，找到`Vdom`组件，若找不到，则报错

- 发现组件使用 `class` 定义的，随后 `new` 出来该类的实例，并通过该实例调用原型上的 `render` 方法

- 将 `render` 返回的虚拟 `DOM` 转化为真实 `DOM` 渲染到页面上

#### 3.2 组件实例的三大属性

##### 3.2.1 state

**基本结构**

```jsx
class Vdom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hello: '中国!!!',
            world: '世界!!!',
            isFalse: false
        }
        this.handleclick = this.handleclick.bind(this)
    }
    render() {
        return (
            <div>
                <div onClick={ this.handleclick }>
                    <span>hello</span>
                    <b>world</b>
                    <i>{ this.state.isFalse ? this.state.hello :  this.state.world }</i>
                </div>
            </div>
        )
    }
    handleclick() {
        // setState的参数为对象
        this.setState({
            isFalse: !this.state.isFalse
        })
    }
}
ReactDOM.render(<Vdom />, document.querySelector('#root'))
```

- `props` 是 `new` 实例传的参数

- `state` 作为组件实例的三大属性，是必须的，不能是其他的名字，因为只能通过 `this.setState({})` 的方式来修改state中的状态，`this.setState` 内部只认 `state`

  **setState的参数为函数**

  ```js
  handleclick = (e) => {
      this.setState((state, props) => ({
          isFalse: !state.isFalse
      }))
  }
  ```

- this指向问题，由于实例对象没有直接调用原型上的方法，而是将原型上的方法赋予 `onClick`， 让 `onClick` 帮忙去调用。所以`this`指向的不是`实例对象`，而是 `undefined`，可以用 `bind` 来修改函数 `this` 指向

  **解决绑定this的方法**

  - 通过`bind` 来绑定

  - 定义时使用箭头函数

    ```js
    handleclick = (e) => {
        this.setState((state, props) => ({
            isFalse: !state.isFalse
        }))
    }
    ```

  - 调用时使用箭头函数，需要加`()`调用

    ```jsx
    return (
        <div { ...person }>
            {this.props.person.name}
            <HelloWorld />
            <div onClick={ () => this.handleclick() }>
                <span>hello</span>
                <b>world</b>
                <i>{ this.state.isFalse ? this.state.hello : this.state.world }</i>
            </div>
        </div>
    )
    ```

    

- 所有的时间均用行内绑定，并并用驼峰命名法

**精简形式**

```jsx
class Vdom extends React.Component {
    state = {
        hello: '中国!!!',
        world: '世界!!!',
        isFalse: false
    }
    that = this
    render() {
        console.log(this.that)
        return (
            <div>
                <div onClick={ this.handleclick }>
                    <span>hello</span>
                    <b>world</b>
                    <i>{ this.state.isFalse ? this.state.hello : this.state.world }</i>
                </div>
            </div>
        )
    }
    handleclick = (e) => {
        this.setState({
            isFalse: !this.state.isFalse
        })
    }
}
ReactDOM.render(<Vdom />, document.querySelector('#root'))
```

- class中直接赋值相当于在构造器中添加了一个 属性
- this指向问题可以用箭头函数解决



`this.setState` 更新问题

- react18版本是异步更新
- react16版本







##### 3.2.2 props

组件接受的参数，以键值对的形式存在

`propsCDN`: https://cdn.bootcdn.net/ajax/libs/prop-types/15.8.1/prop-types.js

构造器中是否传入`props`，是否传给`super`，取决于在构造器中是否使用`this.props`，如果使用，必须要传入，否则`this.props`为`undefined`

对 `props` 限定

```js
Vdom.propTypes = {
    // 函数比较特殊，由于function时关键字，所以这里函数形式用func
    person: PropTypes.object.isRequired
}
Vdom.defaultProps = {
    person: {}
}
```

- 对props做限制需要引入额外的插件
- props时只读的，不能在子组件中修改
- `function`时关键字，用`func`

- `defaultProps`和`propTypes`加在了类本身，而不是加在实例对象上

**简写**------把`defaultProps`和`propTypes`放到类中

```jsx
class Vdom extends React.Component {
    constructor(props){
        super(props)
    }
    state = {
        hello: '中国!!!',
        world: '世界!!!',
        isFalse: false
    }
    static propTypes = {
        person: PropTypes.object.isRequired
    }
    static defaultProps = {
        person: {}
    }
    render() {
        return (
            <div { ...person }>
                {this.props.person.name}
                <HelloWorld />
                <div onClick={ () => this.handleclick() }>
                    <span>hello</span>
                    <b>world</b>
                    <i>{ this.state.isFalse ? this.state.hello : this.state.world }</i>
                </div>
            </div>
        )
    }
    handleclick (e) {
        this.setState((state, props) => ({
            isFalse: !state.isFalse
        }))
    }
}
ReactDOM.render(<Vdom person={{ name: 'xiaoming', age: 12 }} />, document.querySelector('#root'))
```

##### 3.2.3 refs

###### 3.2.3.1 字符串形式（不太推荐）

同vue

###### 3.2.3.2 回调函数形式

```jsx
render() {
    return (
        <div>
            <input type="text" ref={c => this.input1 = c} onBlur={this.handleblur} />
        </div>
    )
}
handleblur = () => {
    console.log(this.input1.value)
}
```

```jsx
render() {
    return (
        <div>
            <input type="text" ref={this.saveInput} onBlur={this.handleblur} />
        </div>
    )
}
saveInput = c => {
    this.input1 = c 
}
handleblur = () => {
    console.log(this.input1.value)
}
```



###### 3.2.3.3 createRef（官方推荐）

`React.createRef `返回一个容器，该容器 可返回被ref包裹的节点，该容器只能存一个，如果是多个节点需要多个容器

```jsx
myRef = React.createRef()
render() {
    return (
        <div>
            <input type="text" ref={this.myRef} onBlur={this.handleblur} />
        </div>
    )
}
handleblur = () => {
    console.log(this.myRef.current)
}
```

行内回调会有一些问题，在页面更新的时候会调用两次，不过影响不大，一般用行内

用途总结：

- 给标签加`ref` ，得到dom结构

- 给类组件加`ref` ，得到组件实例对象

- 给函数组件加`ref`，报错，解决方法？

  - 用 `React.forwardRef`包裹函数

    ```jsx
    const Home =  React.forwardRef(function Home(props, ref) {
      return <div>
        <div ref={ ref }>内容</div>
      </div>
    })
    export default Home
    ```

  - 函数需要接收两个参数（props, ref）

  - 父组件得到的 ref DOM是子组件中指定的dom元素 `<div ref={ ref }>内容</div>`



##### 3.2.4 context

- 注册

  utils/context.js

  ```js
  import React from 'react'
  export const MyContext = React.createContext()
  ```

- 引入

  home/index.jsx

  ```jsx
  import React, { Component } from 'react'
  import Hello from '../../components/Hello'
  import B from '../../components/B'
  import { MyContext } from '../../utils/context'
  
  const { Provider } = MyContext
  
  export default class index extends Component {
    state = {
      username: '张三',
      age: 12
    }
    render() {
      const { username } = this.state
      return (
        <div>
          home
          <Provider value={ username }>
            <Hello>
              <B />
            </Hello>
          </Provider>
        </div>
      )
    }
  }
  ```

- 使用

  B/index.jsx

  - `static contextType = MyContext`：只能在类中使用

    ```jsx
    import React, { Component } from 'react'
    import { MyContext } from '../../utils/context'
    
    export default class index extends Component {
      static contextType = MyContext
      render() {
        console.log(this)
        return (
          <div className="b">
            B组件
            <span>{ this.context }</span>
          </div>
        )
      }
    }
    ```

  - 通用

    类式组件

    ```jsx
    import React, { Component } from 'react'
    import { MyContext } from '../../utils/context'
    
    const { Consumer } = MyContext
    
    export default class index extends Component {
      render() {
        return (
          <div className="b">
            B组件
            <Consumer>
              { value => <span>{ value }</span>) }
            </Consumer>
          </div>
        )
      }
    }
    ```

    函数式组件

    ```jsx
    import React from 'react'
    import { MyContext } from '../../utils/context'
    
    const { Consumer } = MyContext
    
    export default function index() {
      return (
        <div>
          B组件
          <Consumer>
            { value => <li>{value}</li>) }
          </Consumer>
        </div>
      )
    }
    ```

  



#### 3.3 事件处理

- react中使用的是自定义事件，而不是使用原生事件-----------------为了更好的兼容性
- react的事件都是利用事件委托的方式，把所有事件都加在了组件最外层的div上-------------为了高效

**高阶函数**：如果一个函数符合下面2个规范中的任何一个，那该函数就是高阶函数。

- 若A函数，接收的参数是一个函数，那么A就可以称之为高阶函数。
- 若A函数，调用的返回值依然是一个函数，那么A就可以称之为高阶函数。常见的高阶函数有:Promise、 setTimeout、arr.map()等等

**函数的柯里化**：通过函数调用继续返回函数的方式，实现多次接收参数最后统一处理的函数编码形式。

##### 3.3.1 表单双向绑定

**双向绑定单个控件**

```jsx
class Vdom extends React.Component {
    state = {
        value: '12'
    }
    render() {
        return (
            <div>
                <input value={this.state.value} type="text" onChange={this.changeValue} />
            </div>
        )
    }
    changeValue = (event) => {
        this.setState({
            value: event.target.value
        })
    }
}
ReactDOM.render(<Vdom />, document.querySelector('#root'))
```

**双向绑定多个控件**

- 属性传值

  ```jsx
  class Vdom extends React.Component {
      state = {
          username: '12',
          password: '12'
      }
      render() {
          return (
              <div>
                用户名：<input value={this.state.username} type="text" name="username" onChange={this.changeValue} />
                密码<input value={this.state.password} type="password" name="password" onChange={this.changeValue} />
              </div>
          )
      }
      changeValue = () => {
          this.setState({
            [event.target.name]: event.target.value
          })
      }
  }
  ReactDOM.render(<Vdom />, document.querySelector('#root'))
  ```

  - 对象中key值为变量时，用`[]`包裹

- 函数传值

  ```jsx
  class Vdom extends React.Component {
      state = {
          username: '12',
          password: '12'
      }
      render() {
          return (
              <div>
                用户名：<input value={this.state.username} type="text" onChange={this.changeValue('username')} />
                密码：<input value={this.state.password} type="password" onChange={this.changeValue('password')} />
              </div>
          )
      }
      // 函数柯里化
      changeValue = dataType => {
        return () => {
          this.setState({
            [dataType]: event.target.value
          })
        }
      }
  }
  ReactDOM.render(<Vdom />, document.querySelector('#root'))
  
  
  class Vdom extends React.Component {
      state = {
          username: '12',
          password: '12'
      }
      render() {
          return (
              <div>
                  用户名：<input value={this.state.username} type="text" onChange={event => this.changeValue('username', event.target.value)} />
                  密码：<input value={this.state.password} type="password" onChange={event => this.changeValue('password', event.target.value)} />
              </div>
          )
      }
      changeValue = (dataType, value) => {
          this.setState({
              [dataType]: value
          })
      }
  }
  ReactDOM.render(<Vdom />, document.querySelector('#root'))
  ```

  - `changeValue`返回值为一个函数，让`change`事件触发时，react调用
  - 对象中key值为变量时，用`[]`包裹

#### 3.4 生命周期

##### 3.4.1 16.0以及之前版本

<img src="https://uploadbeta.com/share-image/hfH" style="width: 800px" />

###### 3.4.1.1 挂载

`constructor`：初始化构造器

`componentWillMount`：组件将要挂载

`render`：组件挂载

`componentDidMount`：组件挂载之后

`componentWillUnmount`：组件将要被卸载

###### 3.4.1.2 更新

**`setState`更新**

- this.setState({})：更新
- shouldComponentUpdate：询问组件是否允许被更新
  - 返回值有两个`true/false`
  - 默认返回true
- componentWillUpdate：组件将要被更新
- render：挂载组件
- componentDidUpdate：组件已被更新

 **forceUpdate更新**

- this.forceUpdate()：强制更新
- componentWillUpdate：组件将要被更新
- render：挂载组件
- componentDidUpdate：组件已被更新
  - 可以接收三个参数
    - `props`
    - `prestate`
    - `getSnapshotBeforeUpdate`返回的快照值

**父组件数据更新导致子组件更新**

- 父组件调用render
- componentWillReceiveProps：传递新属性时调用
  - **注**：第一次挂载时不调用

- shouldComponentUpdate：询问组件是否允许被更新
  - 返回值有两个`true/false`
  - 默认返回true
- componentWillUpdate：组件将要被更新
- render：挂载组件
- componentDidUpdate：组件已被更新

##### 3.4.2 17.0版本

<img src="https://uploadbeta.com/share-image/hfX" style="width: 800px" />

- 即将弃用`componentWillMount`、`componentWillUpdate`、`componentWillReceiveProps`，可在前面加`UNSAFE_`使用，但新版本已不推荐使用
- 新增两个生命周期
  - `static getDerivedStateFromProps()`
    - 有两个参数，props和state
    - 必须有返回值，返回值为`null`或其他除`undefined`以外的值
    - `getDerivedStateFromProps`返回的状态对象将替换组件本身的状态对象，并且不能被更改
  - `getSnapshotBeforeUpdate()`
    - 必须有返回值，返回值为`null`或

### 4. Diff算法

虚拟DOM中key的作用:

- 简单的说：key是虚拟DOM对象的标识，在更新显示时key起着极其重要的作用。

- 详细的说：当状态中的数据发生变化时，react会根据【新数据】生成【新的虚拟DOM】

  React进行【新虚拟DOM】与【旧虚拟DOM】的diff批较，比较规则如下:

  - 旧虚拟DOM中找到了与新虚拟DOM相同的key:
    - 若虚拟DOM中内容没变，直接使用之前的真实DOM
    - 若虚拟DOM中内容变了，则生成新的真实DOM，随后替换掉页面中之前的真实DOM
  - 旧虚拟DOM中未找到与新虚拟DOM相同的key
    - 根据数据创建新的真实DOM，随后渲染到到页面


用index作为key可能会引发的问题:

- 若对数据进行:逆序添加、逆序删除等破坏顺序操作：会产生没有必要的真实DOM更新 ==> 界面效果没问题，但效率低。
- 如果结构中还包含输入类的DOM：会产生错误DOM更新 ==> 界面有问题。
- **注意**：如果不存在对数据的逆序添加、逆序删除等破坏顺序操作，仅用于渲染列表用于展示，使用index作为key是没有问题的。

最好使用每条数据的唯一标识作为key，比如id、手机号、身份证号、学号等唯一值。2.如果确定只是简单的展示数据,用index也是可以的。



### 5. react脚手架

**全局安装脚手架**

```shell
npm i create-react-app -g
```

创建react项目

```shell
create-react-app my-react
```

#### 5.1 todolist案例

<img src="https://uploadbeta.com/share-image/hh1" style="width: 500px" />

##### 5.1.1 目录结构

- src

  - index.js

    ```js
    import React from 'react';
    import ReactDOM from 'react-dom';
    import './index.css';
    import App from './App';
    import reportWebVitals from './reportWebVitals';
    
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root')
    );
    reportWebVitals();
    ```

    **React.StrictMode**：检查整个app内部的代码

  - index.css

  - App.js

    ```js
    import React, { Component } from 'react';
    import Header from './components/Header'
    import List from './components/List'
    import Footer from './components/Footer'
    import './App.css';
    
    export default class App extends Component {
      state = {
        todos: [
          {id: 1, value: '吃饭', done: true},
          {id: 2, value: '睡觉', done: true},
          {id: 3, value: '打豆豆', done: false}
        ]
      }
      // 添加任务
      addTask = value => {
        const { todos } = this.state
        const id = Math.random().toString().split('.')[1]
        this.setState({
          todos: [{id, value, done: false}, ...todos]
        })
      }
      // 修改任务状态
      changeTask = (id, isChecked) => {
        const newTodos = this.state.todos
        const index = newTodos.findIndex( item => item.id === id )
        newTodos[index].done = isChecked
        this.setState({
          todos: newTodos
        })
      }
      // 删除指定任务
      deleteTask = id => {
        const newTodos = this.state.todos
        const index = newTodos.findIndex( item => item.id === id )
        newTodos.splice(index, 1)
        this.setState({
          todos: newTodos
        })
      }
      // 清除以完成的任务
      deleteDone = () => {
        const newTodos = this.state.todos.filter(item => !item.done)
        this.setState({
          todos: newTodos
        })
      }
      // 全选
      allCheck = isChecked => {
        const newTodos = this.state.todos
        newTodos.forEach(item => item.done = isChecked)
        this.setState({
          todos: newTodos
        })
      }
      render() {
        const { todos } = this.state
        return (
          <div className="App">
            <Header addTask={this.addTask} />
            <List todos={ todos } changeTask={this.changeTask} deleteTask={this.deleteTask} />
            <Footer todos={ todos } deleteDone={ this.deleteDone } allCheck={ this.allCheck } />
          </div>
        )
      }
    }
    
    ```

    

  - App.css

  - components

    - Header

      - index.js

        ```js
        import { Component } from "react"
        import './index.css'
        export default class Header extends Component {
          render() {
            return (
              <div className="header">
                <input type="text" onKeyUp={ this.handleKeyUp } />
              </div>
            )
          }
          handleKeyUp = (e) => {
            const key = e.keyCode
            const value = e.target.value.trim()
            if(!value) return
            if(key !== 13) return
            this.props.addTask(value)
            e.target.value = ''
          }
        }
        ```

        

      - index.css

    - List

      - index.js

        ```js
        import { Component } from "react"
        import Item from '../Item'
        import './index.css'
        export default class List extends Component {
          render() {
            const { todos, changeTask, deleteTask } = this.props
            return <div className="list">
              {
                todos.map(item => {
                  return <Item key={ item.id } {...item} changeTask={ changeTask } deleteTask={ deleteTask } />
                })
              }
            </div>
          }
        }
        ```

        

      - index.css

    - Item

      - index.js

        ```js
        import { Component } from "react"
        import './index.css'
        export default class Item extends Component {
          render() {
            const {id, value, done} = this.props
            return <div className="item">
              <input type="checkbox" checked={done} onChange={this.changeDone(id)} />
              <span>{ value }</span>
              <button onClick={ this.deleteItem(id) }>删除</button>
            </div>
          }
          changeDone = id => {
            return e => {
              debugger
              this.props.changeTask(id, e.target.checked)
            }
          }
          deleteItem = id => {
            return () => {
              const confirm = window.confirm('确认删除任务吗？')
              if (!confirm) return
              this.props.deleteTask(id)
            }
          }
        }
        ```

        

      - index.css

    - Footer

      - index.js

        ```js
        import { Component } from "react"
        import './index.css'
        export default class Footer extends Component {
          render() {
            const {todos} = this.props
            const count = todos.length
            const doneCount = todos.filter(item => item.done).length
            return <div className="footer">
              <input type="checkbox" onChange={ this.allChecked } checked={ count > 0 && count === doneCount } />
              已完成 { doneCount } / 全部 { count }
              <button onClick={ this.deleteDone }>清除已完成任务</button>
            </div>
          }
          deleteDone = () => {
            const confirm = window.confirm('确认删除已完成任务吗？')
            if (!confirm) return
            this.props.deleteDone()
          }
          allChecked = e => {
            const isChecked = e.target.checked
            this.props.allCheck(isChecked)
          }
        }
        ```

        

      - index.css

##### 5.1.2 总结

- **父组件传子组件** 用 **属性**，**子组件传父组件** 是 **父组件将方法传给子组件，子组件调用方法，并传参**

- 数组常用方法`filter`、`map`、`reduce`方法

- react中复选框 `defaultChecked` 和 `checked` 的区别
  - `defaultChecked`：页面初始化时起作用
  - `checked`：必须配合 `onChange` 使用，否则会别警告
  - `defaultValue` 和 `value`

#### 5.2 代理配置

##### package.json配置

```json
{
    "proxy": "http://localhost:5000"
}
```

```js
axios.get('http://localhost:3000/student').then(res => {
    console.log(res.data)
})
```

**注意：**

- `package.json` 中只能配置一个代理
- 相当于在`public`目录下开一个服务器，`axios`请求地址如果`public`目录下有，则返回 `localhost:3000`下的数据，若没有，返回`localhost:3000` 下的数据

##### setupProxy.js配置

```js
const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    createProxyMiddleware('/api', {  //`api`是需要转发的请求 
      target: 'http://localhost:5000',  // 这里是接口服务器地址
      changeOrigin: true,  //修改请求host，让服务器认为时同源发出的请求
      pathRewrite: {'^/api': ''}  // 重写请求路径，不写的话api就会混入请求路径中
    })
  )
}
```

```js
getData = () => {
    axios.get('/api/student').then(res => {
        console.log(res.data)
    })
}
// 或
getData = () => {
    axios.get('http://localhost:3000/api/student').then(res => {
      console.log(res.data)
    })
  }
```

#### 5.3 消息订阅与发布

##### 5.3.1 github搜索案例

app.js

```jsx
import React, { Component } from 'react';
import Header from './components/Header'
import Content from './components/Content'
import axios from 'axios'
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div>
        <Header changeAppState={ this.changeAppState } />
        <Content {...this.state} />
      </div>
    )
  }
  state = {
    isFirst: true,
    isLoading: false,
    users: [],
    err: ''
  }
  changeAppState = state => {
    this.setState({ ...state })
  }
  getData = () => {
    axios.get('/api/student').then(res => {
      console.log(res.data)
    })
  }
}

```

Header/index.js

```jsx
import React, { Component } from 'react';
import './index.css'
import axios from 'axios'

export default class Header extends Component {
  render() {
    return <div>
      <input type="text" ref={ element => this.keyWord = element } />
      <button onClick={ this.getData }>搜索</button>
    </div>;
  }
  getData = () => {
    const keyWord = this.keyWord.value
    this.props.changeAppState({
      isFirst: false,
      isLoading: true
    })
    axios.get(`https://api.github.com/search/users?q=${keyWord}`)
      .then(res => {
        const { data: { items } } = res
        this.props.changeAppState({
          isLoading: false,
          users: items
        })
      })
      .catch(err => {
        const { message } = err
        this.props.changeAppState({
          isLoading: false,
          err: message
        })
      })
  }
}

```



Content/index.js

```jsx
import React, { Component } from 'react';
import './index.css'

export default class Content extends Component {
  render() {
    const { isFirst, isLoading, users,err } = this.props
    return <div>
      {
        isFirst ? <h1>欢迎</h1> :
        isLoading ? <h2>加载中...</h2> :
        err ? <div style={{ color: 'red' }}>{ err }</div> :
        users.map(item => {
          return <div key={ item.id }>
            <a href={ item.html_url }>{ item.login }</a>
          </div>
        })
      }
    </div>;
  }
}
```

##### 5.3.2 pubsub-js

```shell
npm i pubsub-js -S
```

app.js

```jsx
import React, { Component } from 'react';
import Header from './components/Header'
import Content from './components/Content'
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Content />
      </div>
    )
  }
}
```

Header/index.js

```jsx
import React, { Component } from 'react';
import './index.css'
import PubSub from 'pubsub-js';

export default class Header extends Component {
  render() {
    return <div>
      <input type="text" ref={ element => this.keyWord = element } />
      <button onClick={ this.getData }>搜索</button>
    </div>;
  }
  getData = () => {
    const keyWord = this.keyWord.value
    PubSub.publish('keyWord', keyWord)
  }
}
```

Content/index.js

```jsx
import React, { Component } from 'react';
import './index.css'
import PubSub from 'pubsub-js';
import axios from 'axios'

export default class Content extends Component {
  state = {
    isFirst: true,
    isLoading: false,
    users: [],
    err: ''
  }
  componentDidMount() {
    this.token = PubSub.subscribe('keyWord', (_, data) => {
      this.getData(data)
      console.log(this)
    })
  }
  componentWillUnmount() {
    // 卸载组件时，取消订阅
    PubSub.unsubscribe(this.token)
  }
  getData = keyWord => {
    this.setState({
      isFirst: false,
      isLoading: true
    })
    axios.get(`https://api.github.com/search/users?q=${keyWord}`)
      .then(res => {
        const { data: { items } } = res
        this.setState({
          isLoading: false,
          users: items
        })
      })
      .catch(err => {
        const { message } = err
        this.setState({
          isLoading: false,
          err: message
        })
      })
  }
  render() {
    const { isFirst, isLoading, users,err } = this.state
    return <div>
      {
        isFirst ? <h1>欢迎</h1> :
        isLoading ? <h2>加载中...</h2> :
        err ? <div style={{ color: 'red' }}>{ err }</div> :
        users.map(item => {
          return <div key={ item.id }>
            <a href={ item.html_url }>{ item.login }</a>
          </div>
        })
      }
    </div>;
  }
}
```

### 6. 路由

react-router分为两种：

- `react-router-dom` ：web应用
- `react-router-native` ：React Native使用

#### 6.1 5.x 版本

```shell
cnpm i react-router-dom@5.1.2 -S
```

##### 6.1.2 常用组件及其功能

**BrowserRouter**：浏览器路由器，整个应用都需要用一个路由器去管理，因此一般包裹在根组件外层的路由器

**HashRouter**：哈希路由器，整个应用都需要用一个路由器去管理，因此一般包裹在根组件外层的路由器

**Link**：路由链接

- `to`：去哪个路由
- `children`：标签体内容

**NavLink**：路由链接，被激活的路由链接会加上一个`class="active"`，这个active可以用过属性修改

- `to`：去哪个路由

- `children`：标签体内容

- `activeClassName`：激活的class

- NavLink的二次封装

  **注意**：标签体时特殊的props，key值为`children`

  ```jsx
  import React, { Component } from 'react'
  import { NavLink } from 'react-router-dom'
  
  export default class MyNavLink extends Component {
    render() {
      return (
        <NavLink activeClassName="active" className="list-item" { ...this.props } />
      )
    }
  }
  ```

  ```jsx
  <MyNavLink to="about">about</MyNavLink>
  ```

**Switch**：包裹`Route`组件，匹配到一个就不往下找了

**Route**：渲染组件

- `path`：匹配的路径名
- `component`：路径匹配成功需要展示的组件

**Redirect**：重定向

- `to`： 去哪

##### 6.2.2 组件分类

- 路由组件
  
  - 可以接受到内置的 `props` 值
  
- 一般组件

  - 传什么接收什么

  - 如果需要路由组件传的内置history对象，可以用 `withRouter `包裹一般组件

    ```jsx
    import React, { Component } from 'react'
    import { withRouter } from 'react-router-dom'
    
    const detail = class Detail extends Component {
      render() {
        console.log(this.props)
        return (
          <div>Detail</div>
        )
      }
    }
    export default withRouter(detail)
    ```

##### 6.2.3 路由分类

- 普通路由

  ```jsx
  export default class App extends Component {
    render() {
      return (
        <div>
          {/* 导航区 */}
          <MyNavLink to="/home" children="home" />
          <MyNavLink to="/about" children="about" />
  
          <br/><br/>
  
          {/* 路由注册区 */}
          <Switch>
            <Route path="/home" component={ Home } />
            <Route path="/about" component={ About } />
            <Redirect to="home" />
          </Switch>
        </div>
      )
    }
  }
  ```

- 嵌套路由

  app.jsx

  ```jsx
  export default class App extends Component {
    render() {
      return (
        <div>
          {/* 导航区 */}
          <MyNavLink to="/home" children="home" />
          <MyNavLink to="/about" children="about" />
  
          <br/><br/>
  
          {/* 路由注册区 */}
          <Switch>
            <Route path="/home" component={ Home } />
            <Route path="/about" component={ About } />
            <Redirect to="home" />
          </Switch>
        </div>
      )
    }
  }
  ```

  home.jsx

  ```jsx
  export default class Header extends Component {
    render() {
      return <div>
        React router demo
        <MyNavLink to="/home" children="home1" />
        <MyNavLink to="/home/home2" children="home2" />
  
        <br/><br/>
        <Switch>
          <Route path="/home" component={Home1}/>
          <Route path="/home/home2" component={Home2}/>
        </Switch>
      </div>;
    }
  }
  ```

- 动态路由

  ```jsx
  export default class Header extends Component {
    render() {
      return <div>
        React router demo
        <MyNavLink to="/home/home1/2/张三" children="home1" />
        <MyNavLink to="/home/home2" children="home2" />
  
        <br/><br/>
        <Switch>
          <Route path="/home/home1/:id/:name" component={Home1}/>
          <Route path="/home/home2" component={Home2}/>
          <Redirect to="/home/home1" />
        </Switch>
      </div>;
    }
  }
  ```

  ```jsx
  export default class Home1 extends Component {
    render() {
      return (
        <div>Home1</div>
      )
    }
    componentDidMount() {
      // this.props.match.params 接收
      console.log(this.props)
    }
  }
  
  ```

  

##### 6.2.4 传参分类

- params（动态路由）

  ```jsx
  export default class Header extends Component {
    render() {
      return <div>
        <MyNavLink to="/home/home1/2/张三" children="home1" />
            
        <Switch>
          <Route path="/home/home1/:id/:name" component={Home2} />
        </Switch>
      </div>;
    }
  }
  ```

  

- search（query）

  ```jsx
  export default class Header extends Component {
    render() {
      return <div>
        <MyNavLink to="/home/home1?id=1" children="home1" />
        { // 或 }
        <MyNavLink to={{ pathname: '/home/home1', search: '?id=1' }} children="home1" />
  
        <Switch>
          <Route path="/home/home1" component={Home1}/>
        </Switch>
      </div>;
    }
  }
  ```

  接收需要自己转成对象------qs

- state（不止state，其实key值可以是任意值)

  ```jsx
  export default class Header extends Component {
    render() {
      return <div>
        <MyNavLink to={{ pathname: '/home/home1', state: {name: 1} }} children="home1" />
  
        <Switch>
          <Route path="/home/home1" component={Home1}/>
        </Switch>
      </div>;
    }
  }
  ```

##### 6.2.2 路由懒加载

```jsx
import { NavLink, Switch, Route, Redirect } from 'react-router-dom';
import { lazy, Suspense } from 'react'
import './App.css';

const About = lazy(() => import('./views/About'))
const Home = lazy(() => import('./views/Home'))

export default function App() {
  return (
    <div className="App">
      <NavLink to='/home' children="home" /> &nbsp;
      <NavLink to='/about' children="about" />
      <br/><br/>
      <Suspense fallback={ <h1>加载中</h1>}>
        <Switch>
          <Route path="/home" component={ Home } />
          <Route path="/about" component={ About } />
          <Redirect to="home" />
        </Switch>
      </Suspense>
    </div>
  );
}
```

- `lazy`：在`react`身在，不在`react-router-dom`身上

- 需要`Suspense`组件指定加载加载中的组件或虚拟dom，类似于`vue3`中 `Suspense` 组件的 `fallback` 插槽



#### 6.2 6.x 版本





### 7. UI组件库

antd





### 8. 状态管理（redux）

#### 8.1 redux

/redux

redux/index.js

```js
import { combineReducers, legacy_createStore as createStore, applyMiddleware }  from 'redux'

// 用于异步action
import thunk from 'redux-thunk'

// count组件的reducer
import countReducer from './count/reducer'

// person组件的reducer
import personReducer from './person/reducer'

// 合并reducer
const reducers = combineReducers({
  count: countReducer,
  person: personReducer
})

export default createStore(reducers, applyMiddleware(thunk))
```

- `legacy_createStore`：创建store
- `combineReducers`：合并resucer
- `applyMiddleware | thunk`：异步action和中间件



redux/count/action.js

```js
export const incuse = (val) => ({type: 'incuse', data: val})
export const decuse = (val) => ({type: 'decuse', data: val})

// 异步action,返回一个函数，这个时候需要中间件加工
export const incurseAsync = (val) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(incuse(val))
    }, 500)
  }
}
```

redux/count/reducer.js

```js
// 初始化
const state = 0
export default function countReducer(preState = state, action) {
  const { data, type } = action
  switch (type) {
    case 'incuse':
      return preState + data
    case 'decuse':
      return preState - data
    default:
      return preState
  }
}
```



redux/person/action.js

```js
export const addPerson = data => ({ type: 'addPerson', data })
```

redux/person/reducer.js

```js
// 初始化
const state  = [{ id: '001', name: '张三', age: 12 }]
export default function personReducer(preState = state, action) {
  const { type, data } = action
  switch (type) {
    case 'addPerson':
      return [data, ...preState]
    default:
      return preState;
  }
}
```

- action本质是个函数
- reducer是个纯函数
  - 纯函数：
    - 同样的输入和同样的输出
    - 不能改写参数数据
    - 不能产生副作用，例如网络请求，输入输出设备
    - 不能调用产生不固定结果的方法，例如Date.now()，Math.random()





组件

Count/index.jsx

```jsx
import React, { Component } from 'react'
import store from '../../redux'
import {incuse, decuse, incurseAsync} from '../../redux/count/action'

export default class Count extends Component {
  render() {
    return (
      <div>
        <h2>我是Count</h2>
        <div>{ store.getState().count }</div>
        <div>
          <select ref={ e => this.selectEl = e }>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
          <button onClick={ this.handleIncurse }>+</button>
          <button onClick={ this.handleDecurse }>-</button>
          <button onClick={ this.handleIncurseAsync }>异步加</button>
        </div>
        <div>下面的输出{ JSON.stringify(store.getState().person) }</div>
      </div>
    )
  }
  handleIncurse = () => {
    const { value } = this.selectEl
    // 分发action
    store.dispatch(incuse(+value))
  }
  handleDecurse = () => {
    const { value } = this.selectEl
    // 分发action
    store.dispatch(decuse(+value))
  }
  handleIncurseAsync = () => {
    const { value } = this.selectEl
    // 分发action
    store.dispatch(incurseAsync(+value))
  }
}
```



Person/index.jsx

```jsx
import React, { Component } from 'react'
import store from '../../redux'
import { addPerson } from '../../redux/person/action'

export default class Person extends Component {
  render() {
    return (
      <div>
        <h2>我是Person</h2>
        <div>上面的输出{ store.getState().count }</div>
        <div>
          <input type="text" placeholder='姓名' ref={ e => this.addName = e } />
          <input type="text" placeholder='年龄' ref={ e => this.addAge = e } />
          <button onClick={ this.handleClick }>添加</button>
          <ul>
            { store.getState().person.map(item => <li key={item.id}>{item.name}---{item.age}</li>) }
          </ul>
        </div>
      </div>
    )
  }
  handleClick = () => {
    const { value: name } = this.addName
    const { value: age } = this.addAge
    store.dispatch(addPerson({
      id: window.crypto.randomUUID(),
      name,
      age
    }))
  }
}
```



入口文件

index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'
import store from './redux'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
     <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

store.subscribe(() => {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
       <App />
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
  );
})
reportWebVitals();
```

- `store.subscribe`：监听redux变化，即使更新页面





#### 8.2 react-redux + redux

- redux 的文件内容都没变

- 只优化组件中的内容

Count/index.jsx

```jsx
import React, { Component } from 'react'
import store from '../../redux'
import {incuse, decuse, incurseAsync} from '../../redux/count/action'
// 引入connect
import { connect } from 'react-redux'

class Count extends Component {
  render() {
    const { count, person } = this.props
    return (
      <div>
        <h2>我是Count</h2>
        <div>{ count }</div>
        <div>
          <select ref={ e => this.selectEl = e }>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
          <button onClick={ this.handleIncurse }>+</button>
          <button onClick={ this.handleDecurse }>-</button>
          <button onClick={ this.handleIncurseAsync }>异步加</button>
        </div>
        <div>下面的输出{ JSON.stringify(person) }</div>
      </div>
    )
  }
  handleIncurse = () => {
    const { value } = this.selectEl
    this.props.incuse(+value)
  }
  handleDecurse = () => {
    const { value } = this.selectEl
    this.props.decuse(+value)
  }
  handleIncurseAsync = () => {
    const { value } = this.selectEl
    this.props.incurseAsync(+value)
  }
}

// 调用connect链接ui组件和容器组件
export default connect(state => ({...state}), {
  incuse,
  decuse,
  incurseAsync
})(Count)
```



Person/index.jsx

```jsx
import React, { Component } from 'react'
import store from '../../redux'
import { addPerson } from '../../redux/person/action'
import { connect } from 'react-redux'

class Person extends Component {
  render() {
    const { count, person } = this.props
    console.log(person)
    return (
      <div>
        <h2>我是Person</h2>
        <div>上面的输出{ count }</div>
        <div>
          <input type="text" placeholder='姓名' ref={ e => this.addName = e } />
          <input type="text" placeholder='年龄' ref={ e => this.addAge = e } />
          <button onClick={ this.handleClick }>添加</button>
          <ul>
            {
              person.map(item => <li key={item.id}>{item.name}---{item.age}</li>) 
            }
          </ul>
        </div>
      </div>
    )
  }
  handleClick = () => {
    const { value: name } = this.addName
    const { value: age } = this.addAge
    this.props.addPerson({
      id: window.crypto.randomUUID(),
      name,
      age
    })
  }
}

export default connect(state => ({...state}), {addPerson})(Person)
```

- `connect`：连接接ui组件和容器组件，有两个参数：
  - props
    - state：状态
    - action：方法
  - ui组件
- ui组件就能通过`this.props`来使用容器组件传过来的状态和修改状态的方法了



入口文件

index.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'
import store from './redux'
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
  ,
  document.getElementById('root')
);
reportWebVitals();

```

**用`Provider`包裹，将`store`传入，这样App组件的所有容器组件就都会收到store**



### 9. Hooks

#### 9.1 State Hook

在函数式组件中定义状态

```jsx
import React from "react"

export default function About() {
  // 定义hooks
  const [count, changeCount] = React.useState(0)
  //  点击修改状态
  function changeNum() {
    // changeCount(count + 1)
   	// 或
    changeCount(count => count + 1)
  }

  return (
    <div>
      <h1>{ count }</h1>
      <button onClick={ changeNum }>click</button>
    </div>
  )
}
```

- `useState`：有两个参数
  - `state`：数据状态
  - `setState`：修改数据的方法，有两中修改当时
    - 直接传修改后的数据
    - 回调函数，参数为之前的状态
- 每个变量对应一个 `React.useState`

#### 9.2 Effect Hook

`React.useEffect` 的几种使用方式

- 组件挂载时调用，相当于 `componentDidMount`

  ```jsx
  React.useEffect(() => {
      console.log('挂载')
  }, [])
  ```

- 组件卸载时调用，相当于 `componentWillUnmount`

  ```jsx
  React.useEffect(() => {
      return () => {
        	console.log('卸载')
      }
  }, [])
  ```

- 监听某一个或几个变量，相当于 `componentDidUpdate`

  ```jsx
  React.useEffect(() => {
     console.log('监听')
  }, [count, ...])
  ```

`React.useEffect` 有两个参数：

- 回调函数，触发时要执行的代码
- 数组，默认监听所有变量



#### 9.3 ref Hook

```jsx
import React, { useRef } from "react"

export default function About() {
  const myRef = useRef()
  function handleBlur() {
    const el = myRef.current
    console.log(el.value)
  }
  return (
    <div>
      <input ref={ myRef } onBlur={ handleBlur } />
    </div>
  )
}
```



### 10. `PureComponent` 和 `Component`

- `PureComponent` 重写了shouldComponentUpdate()方法，只有 `state` 或 `props` 发生变化时才会返回true，才会调用 `render`
- 项目中一般用 `PureComponent` 来做优化
- 不能直接修改state中的值，而是要产生新数据，才会触发 `shouldComponentUpdate` 阀门开启

浅比较：





### 11. react中的插槽

Home/index.jsx

```jsx
import React, { Component } from 'react'
import Hello from '../../components/Hello'
import B from '../../components/B'

export default class index extends Component {
  state = {
    username: '张三',
    age: 12
  }
  render() {
    const { username } = this.state
    return (
      <div>
        home
        <Hello
          render={ car => <B car={ car } /> }
          render1={ () => '我是render1的插槽' }
        >
          <h1>我是childrenProps</h1>
        </Hello>
      </div>
    )
  }
}
```

Hello/index.jsx

```jsx
import React, { Component } from 'react'

export default class Hello extends Component {
  state = {
    car: '迈巴赫'
  }
  render() {
    return (
      <div>
        {/* 名为render1的插槽 */}
        { this.props.render1() }
        hello
        {/* 名为render的插槽 */}
        { this.props.render(this.state.car) }
        {/* children插槽 */}
        { this.props.children }
      </div>
    )
  }
}
```

- `childrenProps` 只能有一个，`renderProps` 可以有多个
- 可以同时使用
- `renderProps`可以时任意名





### 12. ErrorBoundary(错误边界)





### Fragment

空标签，类似template

- 编译时会被丢掉
- `Fragment`只可以写一个属性，就是`key`
- 可以用`<></>`代替，但是不能写`key`属性

```jsx
import React, { Fragment } from "react"
export default   function About() {
  return (
    <Fragment>       
      <h1>H1</h1>
    </Fragment> 
  )
}  
```







## 扩展

### 1. fetch

**传统xhr发请求**

```js
var xhr = new XMLHttpRequest();
// 请求地址
xhr.open('GET', url);
// 指定返回数据的格式为json
xhr.responseType = 'json';
// 成功回调
xhr.onload = function() {
  console.log(xhr.response);
};
// 失败回调
xhr.onerror = function() {
  console.log("Oops, error");
};
// 发送请求
xhr.send();
```

**fetch请求**

```js
(async function() {
    try {
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
    } catch(e) {
        console.log("Oops, error", e);
    }
})()
```

```js
try {
    const options = await fetch(`https://api.github.com/search/users?q=${keyWord}`)
    if(!options.ok) {
        throw { message: '请求参数错误' }
    }
    const { items } = await options.json()
    this.setState({
        isLoading: false,
        users: items
    })
} catch (err) {
    console.log('错误', err)
    const { message } = err
    this.setState({
        isLoading: false,
        err: message
    })
}
```



### 2. 数组

react中指定循环次数

```jsx
{
  new Array(10).fill(null).map((_, index) => <li key={ index + 1 }>{ index + 1 }</li>)
}
```

- `new Array(10)`：创建一个长度为10的稀疏型数组
- `Array(10).fill(null)`：填充稀疏型数组，转为密集型数组

### 3. jsx底层渲染机制

for...in...性能差的原因：可迭代私有的（自身）属性，也可迭代公共（原型）的属性，只能迭代可枚举的，非Symbol类型的属性

获取对象所有私有属性的方法：

- `[...Object.getOwnPropertyNames(arr), ...Object.getOwnPropertySymbols(arr)]`
  - `Object.getOwnPropertyNames(arr)`：获取所有可枚举非Symbol属性
  - `Object.getOwnPropertySymbols(arr)`：获取所有可枚举Symbol属性

- `Reflect.ownKeys(arr)`
  - 没有办法兼容ie

封装一个each函数

```js
Object.prototype.each = function (cb) {
    if(typeof cb !== 'function') throw new TypeError('cb is not a function')
    let arrs = Reflect.ownKeys(this)
    arrs.forEach((i, k) => cb(i, this[i]))
}
```

#### 3.1 createElememt函数

```js
function createElememt(name, props, ...arg) {
  let virtualDOM = {
    $$typeof: Symbol('react.element'),
    key: null,
    props: {},
    type: null
  }
  // 如果是字符串，将name， props，children赋值给virtualDOM
  if(typeof name === 'string') {
    virtualDOM.type = name
    virtualDOM.props = {...props}
    if(arg.length == 1) {
      virtualDOM.props['children'] = arg[0]
    } else if(arg.length > 1) {
      virtualDOM.props['children'] = arg
    }
  } else {
    // name是个函数，调用得到返回值（虚拟dom）
    virtualDOM = name()
    virtualDOM.type = name
    virtualDOM.props = { ...virtualDOM.props, ...props }
  }
  return virtualDOM
}
```

#### 3.2 render函数

```js
function render(virtualDOM, root) {
  // virtualDOM.type是字符串(标签名),创建标签
  if(typeof virtualDOM.type === 'string') {
    let el = document.createElement(virtualDOM.type)
    // 将props属性追加到el元素中
    let props = virtualDOM.props.each((item, i) => {
      // className的处理
      if(item === 'className') {
        item = 'class'
      }
      // children的处理
      if(item === 'children') {
        let children = []
        if(i instanceof Array) {
          children = i
        } else {
          children = [i]
        }
        children.each((_, child) => {
          if(child && child.$$typeof) {
            render(child, el)
          } else {
            let text = document.createTextNode(child)
            el.appendChild(text)
          }
        })
        return
      }
      // style的处理
      if(item === 'style') {
        let styles = i.each((k, style) => {
          el.style[k] = style
        })
        return
      }
      // 普通属性的处理
      el.setAttribute(item, i)
    })
    // 追加节点
    root.appendChild(el)
  } else {
    /**
     * 函数组件的处理:
     * 1. 先获取到函数 virtualDOM.type
     * 2. 调用函数，将props传给这个函数
     * 3. 调用render函数
    */
    let a = virtualDOM.type
    let virtualD = a(virtualDOM.props)
    virtualD.props = {...virtualD.props, ...virtualDOM.props}
    render(virtualD, root)
  }
}
```

#### 3.3 整体

```js
Object.prototype.each = function (cb) {
  if(typeof cb !== 'function') throw new TypeError('cb is not a function')
  let arrs = Reflect.ownKeys(this)
  arrs.forEach((i, k) => {
    if(i !== 'length') {
      cb(i, this[i])
    }
  })
}

function createElememt(name, props, ...arg) {
  let virtualDOM = {
    $$typeof: Symbol('react.element'),
    key: null,
    props: {},
    type: null
  }
  // 如果是字符串，将name， props，children赋值给virtualDOM
  if(typeof name === 'string') {
    virtualDOM.type = name
    virtualDOM.props = {...props}
    if(arg.length == 1) {
      virtualDOM.props['children'] = arg[0]
    } else if(arg.length > 1) {
      virtualDOM.props['children'] = arg
    }
  } else {
    // name是个函数，调用得到返回值（虚拟dom）
    virtualDOM = name()
    virtualDOM.type = name
    virtualDOM.props = { ...virtualDOM.props, ...props }
  }
  return virtualDOM
}

// home组件
function Home(props) {
  console.log('Home', props)
  return createElememt('div', {id: 'home'}, 'home组件')
}

// about组件
function About(props) {
  console.log('About', props)
  return createElememt('span', {id: 'about', className: 'abt', style: { 'font-size': '20px' }}, 'About组件')
}

function render(virtualDOM, root) {
  // virtualDOM.type是字符串(标签名),创建标签
  if(typeof virtualDOM.type === 'string') {
    let el = document.createElement(virtualDOM.type)
    // 将props属性追加到el元素中
    virtualDOM.props.each((item, i) => {
      // className的处理
      if(item === 'className') {
        item = 'class'
      }
      // children的处理
      if(item === 'children') {
        let children = []
        if(i instanceof Array) {
          children = i
        } else {
          children = [i]
        }
        children.each((_, child) => {
          if(child && child.$$typeof) {
            render(child, el)
          } else {
            let text = document.createTextNode(child)
            el.appendChild(text)
          }
        })
        return
      }
      // style的处理
      if(item === 'style') {
        i.each((k, style) => {
          el.style[k] = style
        })
        return
      }
      // 普通属性的处理
      el.setAttribute(item, i)
    })
    // 追加节点
    root.appendChild(el)
  } else {
    /**
     * 函数组件的处理:
     * 1. 先获取到函数 virtualDOM.type
     * 2. 调用函数，将props传给这个函数
     * 3. 调用render函数
    */
    let a = virtualDOM.type
    let virtualD = a(virtualDOM.props)
    virtualD.props = {...virtualD.props, ...virtualDOM.props}
    render(virtualD, root)
  }
}

let virtualDOM = createElememt('div', {
  className: 'hello',
  style: {
    color: 'red'
  }
}, createElememt(Home, { id: 'world', style: { color: 'blue' } }, '子节点'), '\n证据', createElememt(About, {}))

render(virtualDOM, document.querySelector('#root'))
```

#### 3.4 冻结，密封，不可扩展

- 冻结
  - 怎么冻结：`Object.freeze(obj)`
  - 检测对象是否被冻结：`Object.isFreeze(obj)`
  - 有什么特点：不能修改，不能新增，不能删除，不能劫持
- 密封
  - 怎么密封：`Object.seal(obj)`
  - 检测对象是否被密封：`Object.isSeal(obj)`
  - 有什么特点：可以修改，不能新增，不能删除，不能劫持
- 不可扩展
  - 怎么不可扩展：`Object.preventExtensions(obj)`
  - 检测对象是否扩展：`Object.isExtensiable(obj)`
  - 有什么特点：可以修改，不能新增，可以删除，可以劫持

关联：

- 冻结的对象是密封的，也是不可扩展的
- 密封对象是不可扩展的



### 4. `React.StrictMode`

StrictMode 是一个用来检查项目中潜在问题的工具。与 [Fragment](https://so.csdn.net/so/search?q=Fragment&spm=1001.2101.3001.7020) 一样，StrictMode 不会渲染任何可见的 UI。它为其后代元素触发额外的检查和警告。

StrictMode 目前有助于：

- 识别不安全的生命周期
- 关于使用过时字符串 ref API 的警告
- 关于使用废弃的 findDOMNode 方法的警告
- 检测意外的副作用
- 检测过时的 context API

### 5. `create-react-app环境变量以及打包配置`

#### 5.1 `.env` 配置

- `.env.development`

  ```.env.development
  NODE_ENV = development
  REACT_APP_BASE_URL = localhost:8080/api/
  ```

- `.env.production`

  ```.env.production
  NODE_ENV = production
  BUILD_PATH = dist
  PUBLIC_URL = /dist
  ```

#### 5.2 scripts配置

需要将webpack配置暴露 `yarn eject`

- `scripts/start.js`

  ```js
  'use strict';
  
  // Do this as the first thing so that any code reading it knows the right env.
  process.env.BABEL_ENV = 'development';
  process.env.NODE_ENV = 'development';
  ```

- `scripts/build.js`

  ```js
  'use strict';
  
  // Do this as the first thing so that any code reading it knows the right env.
  process.env.BABEL_ENV = 'production';
  process.env.NODE_ENV = 'production';
  process.env.BUILD_PATH = 'dist'
  process.env.PUBLIC_URL = '/dist'
  ```

- `scripts/test.js`

  ```js
  'use strict';
  
  // Do this as the first thing so that any code reading it knows the right env.
  process.env.BABEL_ENV = 'test';
  process.env.NODE_ENV = 'test';
  process.env.BUILD_PATH = 'test'
  process.env.PUBLIC_URL = '/test';
  ```

  

### 6. sass常见用法

#### 6.1 嵌套规则

#### 6.2 父选择器 `&`

#### 6.3 属性嵌套

```scss
.funky {
  font: {
    family: fantasy;
    size: 30em;
    weight: bold;
  }
}
```

会编译成：

```scss
.funky {
  font-family: fantasy;
  font-size: 30em;
  font-weight: bold;
}
```

#### 6.4 占位符选择器 `%`

定义 `%`

```scss
%font-style {
  font: {
    size: 24px;
    weight: 600;
  }
}
```

使用 `@extend`

```scss
.hello {
  color: red;
  @extend %font-style;
}
```

#### 6.5 变量 `$`

定义 `$`

```scss
$color: green;
```

使用变量

```scss
.hello {
  color: $color;
}
```

支持块级作用域

```scss
.hello {
  $color: green;
  color: $color;
  @extend %font-style
}
.world {
  color: $color; // 直接报错
}
```

此时加 `!global`可运行

```scss
.hello {
  $color: green !global;
  color: $color;
  @extend %font-style
}
.world {
  color: $color;
}
```

#### 6.6 数据类型

##### 6.6.1 字符串

定义：`@mixin`

```scss
@mixin show-color($color) {
  color: $color
}
```

使用：`@include`

```scss
.hello {
  @extend %font-style;
  @include show-color(green)
}
.world {
  @include show-color(#cfcfcf)
}
```



### 7. less常见语法

#### 7.1 嵌套语法

#### 7.2 父选择器 `&`

#### 7.3 变量 `@`

定义 `@`

```scss
@color: green;
```

使用变量

```scss
.hello {
  color: @color;
}
```

#### 7.4 混合

和scss 的 % 选择器类似

定义

```less
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
```

使用

```less
.hello {
  .bordered();
}
```

#### 7.5 转义

转移符 `~`

```less
@min768: ~"(min-width: 768px)";
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
```

编译为：

```less
@media (min-width: 768px) {
  .element {
    font-size: 1.2rem;
  }
}
```



### 8. react合成事件

#### 触发传播机制

- 先捕获，从window开始，window -> document -> html -> body -> ... -> 事件源，可阻止
- 后冒泡，从事件源开始，事件源 -> ... -> body -> html -> document -> window，可阻止



#### react中合成事件的处理原则

不是给当前元素基于 `addEventListener` 单独添加事件，而是基于事件委托处理的

- 在react17版本之后，都是委托给 `#root` 这个容器（捕获阶段和冒泡阶段都做了委托）
- react17之前，都是委托给 `document` 容器（只有冒泡阶段做了委托）
- 没有事件传播机制的事件，做单独之间绑定



#### 手动实现合成事件

1. render时用赋值的方式

   ```jsx
   el[item] = i
   // 而不是
   el.setAttribute(item, i)
   ```

2. 给 `#root` 添加事件

   ```jsx
   rootDom.addEventListener('click', ev => {
     let path = ev.composedPath() //  获取到所有事件传递的路径，默认是从里到外，如果是监听事件捕获阶段，需要先反转path
     path.forEach(pa => {  // 循环，哪一层有 onClick 属性，直接执行
       let handler = pa['onClick']
    	//  将ev做特殊处理，将其传入
       if (handler) handler(ev)
     })
   }, false)
   ```

   - 视图渲染时，只是把合成事件作为属性
   - 所以当函数是普通函数时，`this` 指向 `undefined`（babel编译开启严格模式）
   - 









