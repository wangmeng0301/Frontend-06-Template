# 学习笔记

## 运算符和表达式

  ### 表达式
  表达式语句实际就是表达式，是由运算符连接变量或直接量构成的
  一般来说，表达式语句通常是函数调用，赋值，自增，自减，否则表达式计算结果没有任何意义
  但从语法上来说，任何合法的表达式语句都可以当作表达式语句使用。

  Expressions (优先级最末的一个结构)
  PrimaryExpression 原子表达式
    表达式的原子项：Primary Expression。它是表达式的最小单位，它所涉及的语法结构也是优先级最高的。
  MemberExpression 成员表达式
    a.b
    a[b]
    foo`string`
    super.b
    suoer[b]
    new.target
    new Foo()
  LeftHandSideExpression 左值表达式
    New Expression 和 Call Expression 统称 LeftHandSideExpression，左值表达式。

    NewExpression NEW 表达式
      new Foo
      Example: new a()() = (new a())() new new a() = new (new a())
    CallExpression  函数调用表达式
      foo()
      super()
      foo()['b'] Member Expression 这里会被拉低优先级
      foo().b
      foo()`abc`
      Example: new a()['b'] = (new a())['b']

  UpdateExpression (从 Update 开始就是 RH 了) 更新表达式
    a ++
    a --
    -- a
    ++ a
    Example: ++ a ++ = ++ (a++) 但他们语法和运行时都是不合法的

  UnaryExpression 一元运算表达式  
    delete a.b (a.b 是 Reference 类型)
    void foo() (void 是把不管后面什么东西都变成 undefined)
    typeof a
    +a (类型转换)
    -a
    ~a (按位取反)
    !a
    await a

  ExponentiationExpression 乘方表达式 (右结合，其他大部分是左结合)

    **
    Example: 3 ** 2 ** 3 = 3 ** ( 2 ** 3 )
  MultiplicativeExpression 乘法表达式 
    * / %
  AdditiveExpression 加法表达式
    + -
  ShiftExpression 位移表达式
    << >> >>>
  RelationalExpression 关系表达式
    < > <= >= instanceof
    in
  EqualityExpression 相等表达式
    ==
    !=
    ===
    !==
  BitwiseExporession 表达式
    & 按位与
    ^ 亦或
    | 按位或
  LogicalExpression 逻辑与表达式和逻辑或表达式 (短路逻辑)
    &&
    ||
  ConditionalExpression 条件表达式  (也有短路逻辑)
    ? :

### 事件循环&宏任务&微任务
  js执行粒度（运行时）
    宏任务（MacroTask）:传给 JS 引擎的任务，最大粒度，一般包括整体代码script，setTimeout，setInterval、setImmediate。
    微任务（Promise）: 宏任务内部的任务，一般包括原生Promise(有些实现的promise将then方法放到了宏任务中)、process.nextTick、Object.observe(已废弃)、 MutationObserver 
    函数调用
    语句/声明
    表达式
    直接量/变量/this
  事件循环（event loop）
    事件循环是浏览器执行任务的机制，它会不断循环判断消息队列中是否有任务，队列中的任务都是指宏任务，而宏任务中包含微任务队列，在宏任务结束前后执行微任务队列，直到微任务队列中为空才结束这个宏任务。


### realm
  原版标准:
    Before it is evaluated, all ECMAScript code must be associated with a realm. Conceptually, a realm consists of a set of intrinsic objects, an ECMAScript global environment, all of the ECMAScript code that is loaded within the scope of that global environment, and other associated state and resources.

  组成：
    a set of intrinsic objects(一组内置对象)
    global environment （一个全局环境）
    code （在上面这个全局环境中加载的所有代码）
    state and resources （状态和资源）