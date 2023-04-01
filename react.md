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

行内回调会有一些问题，在页面更新的时候会调用两次，不过影响不大，一般用行内

###### 3.2.3.3 createRef（官方推荐）

`React.createRef `返回一个容器，该容器 可返回被ref包裹的节点，该容器只能存一个，如果是多个节点需要多个容器

```jsx
myRef = React.createRef()
render() {
    return (
        <div>
            <input type="text" ref={this.saveInput} onBlur={this.handleblur} />
        </div>
    )
}
handleblur = () => {
    console.log(this.myRef.current)
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

#### 路由分类

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

  

#### 传参分类

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



#### 6.2 6.x 版本





### UI组件库

antd





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

