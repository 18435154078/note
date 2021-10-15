<center><h1>vue深入讲解</h1></center>

## 一、组价之间的传值

### 1. 隔代传值

父组件

```js
export default {
  provide () {
    return {
        foo: 'hello'
    }
  }
}
```

后代组件

```js
export default {
  inject: {
    foo: {
       type: String,
       default: ''
    }
  }
}
```



## 二、封装一个element表单组件

### 1. 实现父子组件数据的双向绑定

- 子组件通过`绑定属性`和`@input`实现数据的双向绑定
- 父组件通过v-model实现数据的双向绑定
- 子组件通过`v-bind="$attrs"`接收父组件传入的除value之外的属性，`inheritAttrs: false` 避免顶层容器继承属性

父组件

```vue
<template>
  <div>
    <!--v-model语法糖-->
    <Children v-model="value" type="submit" name="hello" />
      
    <Children :value="value" @input="onInput" />
    {{ value }}
  </div>
</template>

<script>
import Children from '@/components/Kinput'
export default {
  data() {
    return {
      value: ''
    }
  },
  components: { Children },
  methods: {
    onInput (e) {
      this.value = e
    }
  }
};
</script>

```

子组件

```vue
<template>
  <div id="children">
    <input
      v-bind="$attrs"
      :value="value"
      @input="$emit('input', $event.target.value)">
  </div>
</template>
<script>
export default {
  // 避免顶层容器继承属性
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: ''
    }
  }
}
</script>
```

### 2. 表单验证

验证规则：`async-validator`

<a href="https://www.cnblogs.com/wozho/p/10955525.html">async-validator</a>

- 使用：`index.vue`

  ```vue
  <template>
    <div>
      <Kform :model="model" :rules="rules" ref="Form">
        <KinputItem label="用户名" prop="username">
          <Kinput v-model="model.username" />
        </KinputItem>
        <KinputItem label="密码" prop="password">
          <Kinput v-model="model.password" type="password" />
        </KinputItem>
        <KinputItem>
          <Kinput type="submit" @click.native="handleSubmit" />
        </KinputItem>
      </Kform>
    </div>
  </template>
  
  <script>
  import Kinput from '@/components/input1/Kinput'
  import KinputItem from '@/components/input1/KinputItem'
  import Kform from '@/components/input1/Kform'
  export default {
    data() {
      return {
        model: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            {required: true, message: '请填写用户名', trigger: 'blur'},
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
          ],
          password: [
            {required: true, message: '请填写密码'}
          ]
        }
      }
    },
    components: {
      Kinput, KinputItem, Kform
    },
    methods: {
      handleSubmit () {
        this.$refs.Form.validata((isVal) => {
          console.log(isVal)
        })
      }
    }
  }
  </script>
  ```

- form组件：`Kform.vue`

  ```vue
  <template>
    <div>
      <slot></slot>
    </div>
  </template>
  
  <script>
  export default {
    provide() {
      return {
        form: this
      }
    },
    props: {
      model: {
        type: Object,
        required: true
      },
      rules: {
        type: Object
      }
    },
    methods: {
      validata (callback) {
        const tasks = this.$children.filter(item => item.prop).map(item => item.validata())
        Promise.all(tasks).then(res => {
          callback(true)
        })
        .catch(() => {
          callback(false)
        })
      }
    }
  }
  </script>
  ```

- formItem组件：`KformItem.vue`

  ```vue
  <template>
    <div>
      <label v-if="label">{{ label }}</label>
      <slot></slot>
      <span class="err" v-if="errMessage">{{ errMessage }}</span>
    </div>
  </template>
  
  <script>
  import Schema from 'async-validator'
  export default {
    inject: ['form'],
    data() {
      return {
        errMessage: ''
      }
    },
    props: {
      label: {
        type: String
      },
      prop: {
        type: String
      }
    },
    mounted() {
      this.$on('validata', () => {
        this.validata()
      })
    },
    methods: {
      validata() {
        const value = this.form.model[this.prop]
        const rule = this.form.rules[this.prop]
        const desc = {
          [this.prop]: rule
        }
        const schema = new Schema(desc)
        return schema.validate({[this.prop]: value}, (err) => {
          if(err) {
            this.errMessage = err[0].message
          } else {
            this.errMessage = ''
          }
        })
      }
    }
  }
  </script>
  
  <style lang="less" scoped>
  .err {
    font-size: 12px;
    color: red;
  }
  </style>
  ```

- input组件：`Kinput.vue`

  ```vue
  <template>
    <div>
      <input :value="value" @input="onInput" v-bind="$attrs">
    </div>
  </template>
  
  <script>
  export default {
    inheritAttrs: false,
    props: {
      value: {
        type: String
      }
    },
    methods: {
      onInput (e) {
        this.$emit('input', e.target.value)
        this.$parent.$emit('validata')
      }
    }
  }
  </script>
  ```

## 三、弹窗类组件

### 1. 代码段

`create.js`

```js
import Vue from 'vue'
// create函数接收两个参数，第一个是组件，第二个是属性
export default function create(component, props) {
  // 创建实例化组件
  const vm = new Vue({
    // 这里用render函数去渲染
    render: h => h(component, {props})
  }).$mount()

  // 获取弹窗组件
  const comp = vm.$children[0]

  // 将弹窗组件的dom挂载到body上
  document.body.appendChild(vm.$el)

  // 给弹窗组件注册remove方法，用来注销组件，避免内存泄漏
  comp.remove = () => {
    document.body.removeChild(vm.$el)
    vm.$destroy()
  }

  // 将得到的弹窗组件返回
  return comp
}
```

弹窗组件：`Notice.vue`

```vue
<template>
  <div class="notice">
    <h3>{{ title }}</h3>
    <q>{{ message }}</q>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false
    }
  },
  // props接受render函数传来的属性
  props: {
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 2000
    }
  },
  methods: {
    // show方法用来显示弹窗组件
    show() {
      this.isShow = true
      // 通过延时器确定通过多少秒自动关闭
      setTimeout(() => {
        this.hide()
      }, this.duration)
    },
    hide() {
      // 隐藏弹窗组件，并将组件进行销毁，防止内存泄漏
      this.isShow = false
      this.remove()
    }
  }
}
</script>

<style lang="less" scoped>
  .notice {
    // position: absolute;
    top: 10px;
    width: 200px;
    left: 300px;
    background: pink
  }
</style>

```

调用

```js
handleSubmit () {
    this.$refs.Form.validata((isVal) => {
        let notice
        if(isVal) {
            notice = create(Notice, {
                title: '标题',
                message: '登录成功',
                duration: 3000
            })
        } else {
            notice = create(Notice, {
                title: '标题',
                message: '登录失败',
                duration: 3000
            })
        }
        notice.show()
    })
}
```

### 2. 细写render函数







## 四、tree类组件（递归组件）



## 五、vue-router组件及原理







