

const vNodeType = {
  HTML: 'HTML', // html标签
  TEXT: 'TEXT', // text文本

  COMPONENT: 'COMPONENT', // 组件：vue组件
  CLASS_COMPONENT: 'CLASS_COMPONENT' // 类组件：vue-typeScript组件
}

const childType = {
  EMPTY: 'EMPTY', // 空
  SINGLE: 'SINGLE', //1个
  MULTIPLE: 'MULTIPLE' // 多个
}

// 创建虚拟dom
// 元素名称，属性，子元素
function createElement(tag, props, children = null) {

  // 判断tag标识
  let flag
  if(typeof tag === 'string') {
    // html标签
    flag = vNodeType.HTML
  } else if(typeof tag === 'function') {
    flag = vNodeType.COMPONENT
  } else {
    flag = vNodeType.TEXT
  }

  // 判断children标识
  let childrenFlag
  if(children === null) {
    childrenFlag = childType.EMPTY
  } else if (children instanceof Array) {
    let len = children.length
    if(len === 0) {
      childrenFlag = childType.EMPTY
    } else if(len > 1) {
      childrenFlag = childType.MULTIPLE
    }
  } else {
    childrenFlag = childType.SINGLE
    children = createTextVnode(children)
  }


  // 返回vNode
  return {
    flag, // vNode类型
    tag, // 标签： div  组件：函数
    props, // 属性
    children, // 子类
    childrenFlag
  }
}

// 新建文本节点
function createTextVnode(children) {
  return {
    flag: vNodeType.TEXT,
    tag: null,
    props: null,
    children,
    childrenFlag: childType.EMPTY,
  }
}

// 渲染
function render(vNode, container) {
  container = typeof container === 'string' ? document.querySelector(container) : container
  // 首次渲染和更新渲染
  if(container.vNode) {
    // 更新渲染
    patchData(container.vNode, vNode, container)
  } else {
    // 首次渲染
    mount(vNode, container)
  }
  container.vNode = vNode
}

// 首次挂载
function mount(vNode, container) {
  let { flag } = vNode
  if(flag === vNodeType.HTML) {
    mountElement(vNode, container)
  } else if(flag === vNodeType.TEXT) {
    mountText(vNode, container)
  }
}

// 渲染标签节点
function mountElement(vNode, container) {
  let { tag, props, children, childrenFlag } = vNode
  let elTag = document.createElement(tag)
  if(childrenFlag !== childType.EMPTY) {
    if(childrenFlag === childType.SINGLE) {
      mount(children, elTag)
    } else {
      for(let i = 0; i < children.length; i++) {
        mount(children[i], elTag)
        // console.log(children[i])
      }
    }
  }
  for(let prop in props) {
    patchData(elTag, prop, null, props[prop])
    // elTag.setAttribute(prop, props[prop])
  }
  container.appendChild(elTag)
}

// 渲染文本节点
function mountText(vNode, container) {
  // console.log(vNode)
  let { children } = vNode
  let dom = document.createTextNode(children)
  container.appendChild(dom)
}

// 属性渲染
function patchData(el, key, pre, next) {
  // 节点， 属性名， 老值， 新值
  switch (key) {
    case 'style':
      // console.log(next)
      for(let styleKey in next) {
        el.style[styleKey] = next[styleKey]
      }
    break;
    case '@click':
      el.addEventListener('click', next)
    break;
    default:
      el.setAttribute(key, next)
      break;
  }
}

// 更新渲染
function patchData(pre, next, container) {
  let preFlag = pre.flag
  let nextFlag = next.flag
  if(preFlag != nextFlag) {
    // 直接替换即可
    replaceVnode(pre, next, container)
  }
}

// 替换元素
function replaceVnode(pre, next, container) {
  // container.
}