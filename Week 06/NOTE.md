# 学习笔记

## 语言按语法分类

  非形式语言
    中文，英文
  形式语言（乔姆斯基谱系）
    0型 无限制文法
    1型 上下文相关文法
    2型 上下文无关文法
    3型 正则文法

## 产生式
  在计算机中指 Tiger 编译器将源程序经过词法分析（Lexical Analysis）和语法分析（Syntax Analysis）后得到的一系列符合文法规则（Backus-Naur Form，BNF）的语句 巴科斯诺尔范式: 即巴科斯范式（英语：Backus Normal Form，缩写为 BNF）是一种用于表示上下文无关文法的语言，上下文无关文法描述了一类形式语言。它是由约翰·巴科斯（John Backus）和彼得·诺尔（Peter Naur）首先引入的用来描述计算机语言语法的符号集。 终结符: 最终在代码中出现的字符（終結符與非終結符)
  用尖括号括起来的名称来表示语法结构名
  语法结构分成基础结构和需要用其他语法结构定义的复合结构
    基础结构称终结符
    复合结构称非终结符
  引号和中间的字符表示终结符
  可以有括号
    表示重复多次
  | 表示或
    表示至少一次

## 编程语言特性

  需要实现图灵完备性（可计算性）
    命令式
    声明式
  动态、静态
  强类型、弱类型
  复合类型
    结构体
    函数签名
  子类型
  泛型
    协变/逆变
## Number
  ### 运行时
    JS中没有int 和 float 类型 所有的 number 类型都是基于 ieee754 的标准以 double float 的形式存储的
    64bit 进行存储
    分为三个部分
    第一部分是符号位(S): 第一位是正负数符号位(sign), 0表示正数，1表示负数。这也是为什么会出现+0和-0的原因。
    第二部分是指数位(E): 中间的11位存储指数(exponent），用来表示次方数
    第三部分是尾数位(M)：最后的52位是尾数(mantissa), 超出的部分采用进1舍0.
    会有精度损失 如 0.1 + 0.2 !== 0.3
  ### 语法
      . 的前后都可以省略 .2 和 2. 都是正确的
      0.toString() 会报错，引 .toString() 的 . 会被当作小数部分处理，正确写法为 0 .toString() 或 0..toString()

## String

  ### 字符串转UTF8编码输出
  ``` js
  function UTF8_Encoding(string) {
    const res = []
    for (let char of string) {
      const codePoint = char.charCodeAt(0)
      let encoding = ''
      if (codePoint < 2 ** 7) {
        encoding = `0${(codePoint).toString(2).padStart(7, 0)}`
      } else if (codePoint < 2 ** 11) {
        const tmp = codePoint.toString(2).padStart(11, 0)
        encoding = `110${tmp.substr(0, 5)} 10${tmp.substr(5, 6)}`
      } else if (codePoint < 2 ** 16) {
        const tmp = codePoint.toString(2).padStart(16, 0)
        encoding = `1110${tmp.substr(0, 4)} 10${tmp.substr(4, 6)} 10${tmp.substr(10, 6)}`
      } else {
        const tmp = codePoint.toString(2).padStart(21, 0)
        encoding = `11110${tmp.substr(0, 3)} 10${tmp.substr(3, 6)} 10${tmp.substr(9, 6)} 10${tmp.substr(15, 6)}`
      }
      res.push(encoding)
    }
    return res

  ```

## Symbol
  Symbol 是 ES6 中引入的新类型，它是一切非字符串的对象 key 的集合，在 ES6 规范中，整个对象系统被用 Symbol 重塑。

  我们创建 Symbol 的方式是使用全局的 Symbol 函数(无法用new调用)。例如：
  ``` js
  var isSymbol = Symbol("is symbol");
  ```

## Null & Undefined
  不对 undefined 赋值，用 void 0 来代替 undefined 

## Object 
  任何一个对象都是唯一的，与它本身的状态无关；即使状态完全一致的两个对象也并不相等

  状态改变即是行为

  对象的组成：唯一性标识，状态，行为

  在设计对象的状态和行为时，应遵循“行为改变状态”的原则

  ### 描述对象的方式

  #### 1. class
    归类：​ 一个对象可以归为多个类（多继承）

    分类: ​ 单继承，从顶层 Object 一层一层向下分，每个对象仅有一个归属
  #### 2. Prototype 原型
    ​ 任何对象只需要描述自己和原型的区别即可，更符合人类原始认识

  ###  JavaScript内置特殊对象
    Array：Array 的 length 属性根据最大的下标自动发生变化。 注意，Array 的 length 属性也是可以手动修改的，会造成实际数组元素个数与 length 属性不匹配的情况。
    String：为了支持下标运算，String 的正整数属性访问会去字符串里查找。
    Object.prototype：作为所有正常对象的默认原型，不能再给它设置原型了。
    bind 后的 function
    arguments 参数绑定