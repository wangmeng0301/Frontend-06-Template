# 学习笔记

## 1. 组件的基本知识 | 组件的基本概念和基本组成部分

### 对象和组件的区别
  对象
    Properties
    Methods
    Inherit

  组件
    Properties
    Methods
    Inherit
    Attribut
    Config && State
    Event
    Lifycycle
    Children
例1： 
```html
<a href="//m.taobao.com"></a>
<script>
var a = document.getElementsByTagName('a')[0];

  a.href  // http://m.taobao.com; 找个 url 是 resolve 后的结果
  a.getAttribute('href') // //m.taobao.com // 找个跟 html 的一致
</script>
```

例2： 
```html
<input value='cute'>
<script>
  var input = document.getElementsByTagName('input')[0];
  input.value // cute
  input.getAttribute('value') // cute 若是没有设置 input 的值， attribue 和 property 都是 cute

  input.value = 'hello';
  input.value // hello
  input.getAttribute('value') // cute 若是已经设置 input 的值， 则attribue不变，value 相当于默认值， property 变化，元素上的效果以 property 优先
  input.setAttribute('value', '11111111111') // cute 若是已经设置 input 的值， 则attribue不变，value 相当于默认值， property 变化，元素上的效果以 property 优先
  input.getAttribute('value')// 11111111111 setAttribue 也只能改变 html 上的 value， property 不变
  input.value // hello
</script>
```

## 2. 组件的基本知识 | 为组件添加 jsx 语法
