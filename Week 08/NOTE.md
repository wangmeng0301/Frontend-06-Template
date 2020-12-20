# 学习笔记

## 浏览器的工作原理 
  从一个 url 得到一个 bitmap 的过程
  Url (http) => html (parse) => DOM (css computing) =>  DOM with css (layout) => DOM width positon (render) => bitmap

## 有限状态机
  每一个状态都是一个机器
    每个机器里面，可以做计算，存储，输出，
    所有的机器接受的输入是一致的，
    状态机的每一个机器本身是没有状态的，如果用函数表示，应该是一个纯函数（无副作用）
  每一个状态机知道下一个状态
    每个状态机有确定的下一个状态(Moore)
    每个机器有确定的下一个状态（Mealy）
``` js
// 每个函数是一个状态
 function state(input) {// 接受一个输入就是入参
  // 函数中可以自由的编写代码，处理每个状态的逻辑，
   return next； // 返回值作为下一个状态，必须是一个函数
 }
 while(input) {
   // 循环调用
   state = state(input); // 把状态机的返回值作为下一个状态
 }
```

## Http 请求

1. 设计一个 http 请求的类
2. contetn-type 是一个必要的，要有默认值，
3. body 是 KV 格式
4. 不同改的 Content-type 会影响 不同的 body 的格式

## send 函数
在 Request 的构造器中必要的信息
设计 send 函数把信息发送到服务器，异步的返回 promise

## 发送请求
设计已有的 connection 或者自己新建 connection
收到数据传给parser
根据 paeser 的状态 resolve Promise

## ResponseParser 
Response 必须分段构造，所以我们要用一个 ResponseParser 来装配
ResponseParser 分段处理 ResponseText, 用状态机来分析文本的结构

## bodyParse
Response 的 body 可能根据 Content-Type 有不同的结构，因此我们会采用子 Parse 的结构来解决
以 TrunkedBodyParser 为例，我们同样用状态机来处理 body 的格式