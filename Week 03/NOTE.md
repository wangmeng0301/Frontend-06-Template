## 学习笔记

### 本周学习了LL算法构建四则运算的AST(抽象语法树);

抽象语法树（abstract syntax code，AST）是源代码的抽象语法结构的树状表示，树上的每个节点都表示源代码中的一种结构，这所以说是抽象的，是因为抽象语法树并不会表示出真实语法出现的每一个细节，比如说，嵌套括号被隐含在树的结构中，并没有以节点的形式呈现。抽象语法树并不依赖于源语言的语法，也就是说语法分析阶段所采用的上下文无文文法，因为在写文法时，经常会对文法进行等价的转换（消除左递归，回溯，二义性等），这样会给文法分析引入一些多余的成分，对后续阶段造成不利影响，甚至会使合个阶段变得混乱。因些，很多编译器经常要独立地构造语法分析树，为前端，后端建立一个清晰的接口。


### 纯文本如何转换成 AST？
一般来说通常分成两步，词法分析 和 语法分析

#### 词法分析
``` js
const reg = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g; 

// 每一项对照着reg里面的每一项
const dictionary = ['Number', 'whitespace', 'LineTerminator', '*', '/', '+', '-' ];

// function* 才是 Generator 函数
function* tokensize(source) {
  let result = null;
  let lastIndex = 0;
  while(true) {
    lastIndex = reg.lastIndex;
    result = reg.exec(source);;
    if (!result)
      break;
    // 下次匹配的长度和上次匹配的长度 相减 再跟 result[0]的长度对比，就知道有没有不正常的值;
    if (reg.lastIndex - lastIndex > result[0].length) 
      break;
    let token = {
      type: null,
      value: null,
    }
    // 遍历字典，拿到对应的值
    for(let i = 0; i <= dictionary.length;i++) {
      if (result[i])
      token.type = dictionary[i - 1];
    }
    token.value = result[0];
    // getator
    yield token;
  }
  yield {
    type: 'EOF'
  };
}
```

#### 语法分析 (将词法分析的结果转换成结构树)
``` js
const reg = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g; 

    // 每一项对照着reg里面的每一项
    const dictionary = ['Number', 'whitespace', 'LineTerminator', '*', '/', '+', '-' ];

    // function* 才是 Generator 函数
    function* tokensize(source) {
      let result = null;
      let lastIndex = 0;
      while(true) {
        lastIndex = reg.lastIndex;
        result = reg.exec(source);;
        if (!result)
          break;
        // 下次匹配的长度和上次匹配的长度 相减 再跟 result[0]的长度对比，就知道有没有不正常的值;
        if (reg.lastIndex - lastIndex > result[0].length) 
          break;
        let token = {
          type: null,
          value: null,
        }
        // 遍历字典，拿到对应的值
        for(let i = 0; i <= dictionary.length;i++) {
          if (result[i])
          token.type = dictionary[i - 1];
        }
        token.value = result[0];
        // getator
        yield token;
      }
      yield {
        type: 'EOF'
      };
    }

    let source = [];

    for (let token of tokensize('1 + 2 + 3')) {
      if (token.type !== 'whitespace' && token.type !== 'LineTerminator')
        source.push(token);
    }

    function Expression(source) {
      if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === 'EOF') {
        let node = {
          type: 'Expression',
          children: [source.shift(), source.shift()]
        }
        source.unshift(node);
        return node;
      }
      AdditiveExpression(source);
      return Expression(source);
    }

    function AdditiveExpression(source) {
      if (source[0].type === 'MultiplicativeExpression' ) {
        let node = {
          type: 'AdditiveExpression',
          children: [source[0]]
        }
        source[0] = node;
        return AdditiveExpression(source);
      }
      if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === '+') {
        let node = {
          type: 'AdditiveExpression',
          operator: '+',
          children: [],
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        MultiplicativeExpression(source);
        node.children.push(source.shift());
        source.unshift(node);
        return AdditiveExpression(source);
      }
      if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === '-') {
        let node = {
          type: 'AdditiveExpression',
          operator: '-',
          children: [],
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        MultiplicativeExpression(source);
        node.children.push(source.shift());
        source.unshift(node);
        return AdditiveExpression(source);
      }
      if (source[0].type === 'AdditiveExpression')
        return source[0];
      MultiplicativeExpression(source);
      return AdditiveExpression(source);
    }

    function MultiplicativeExpression(source) {
      if (source[0].type === 'Number' ) {
        let node = {
          type: 'MultiplicativeExpression',
          children: [source[0]]
        }
        source[0] = node;
        return MultiplicativeExpression(source);
      }
      if (source[0].type === 'MultiplicativeExpression' && source[1] && source[1].type === '*') {
        let node = {
          type: 'MultiplicativeExpression',
          operator: '*',
          children: [],
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        node.children.push(source.shift());
        source.unshift(node);
        return MultiplicativeExpression(source);
      }
      if (source[0].type === 'MultiplicativeExpression' && source[1] && source[1].type === '/') {
        let node = {
          type: 'MultiplicativeExpression',
          operator: '/',
          children: [],
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        node.children.push(source.shift());
        source.unshift(node);
        return MultiplicativeExpression(source);
      }
      if (source[0].type === 'MultiplicativeExpression')
        return source[0];
      return MultiplicativeExpression(source);
    }

    console.log(Expression(source));
```