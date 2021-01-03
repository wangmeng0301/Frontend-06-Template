const { match } = require('assert');
const css = require('css');

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack = [{type: 'document', children: []}];


// 加入一个新的函数 addCssRules，这里我们把css规则暂存到一个数组里
let rules = []

function addCssRules(text) {
  var ast = css.parse(text);
  rules.push(...ast.stylesheet.rules); 
}  

function computeCSS(element) {
  var elements = stack.slice().reverse();
  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (let rule of rules) {
    var selectorParts = rule.selectors[0].split(" ").reverse();

    if (!match(element, selectorParts[0])) {
      continue;
    }

    let matched = false;


    // j 标识选择的位置
    var j = 1;
    // i 标识元素的位置
    for (var i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++; 
      }
    } 

    // 判断是否所有的选择器都匹配到了
    if (j >= selectorParts.length) {
      matched = true;
    }

    if (matched) {
      // 如果匹配到
      var sp = specificity(rule.selectors[0]);
      var computedStyle = element.computedStyle;
      for (const declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {}
        }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp
        } else if (comparer(computedStyle[declaration.property].specificity, sp) < 0) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp
        }
      }
      console.log(element.computedStyle)
    }
  }
}

function specificity(selector) {
  var p = [0, 0, 0, 0];
  var selectorParts = selector.split(" ");
  for (const part of selectorParts) {
      const ids = part.match(/\w+/g);
      const classS = part.match(/\.\w+/g);
      if (ids.length) {
          p[1] += ids.length;
      } else if (classS.length) {
          p[2] += classS.length;
      } else {
          p[3] += 1
      }
  }
  return p;
}

function comparer(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
      return sp1[0] - sp2[0];
  } else if (sp1[1] - sp2[1]) {
      return sp1[1] - sp2[1];
  } else if (sp1[2] - sp2[2]) {
      return sp1[2] - sp2[2];
  }
  return sp1[3] - sp2[3];
}

function match(element, selector) {
  if (!selector || !element || !element.attributes) {
    return false;
  }

  let idReg = /^\#\w|\#\w[\n\t\f ]\.\w|\#\w[\n\t\f ]\w$/;
  let classReg = /^\.\w|\#w[\n\t\f ]\.w|\#\w[\n\t\f ]\w$/;
  let tagReg = /^\w|\w[\n\t\f ]\#\w|$\w[\n\t\f ]\.\w$/;
  if (selector.match(idReg)) {
    var attr = element.attributes.filter(attr => attr.name === "id")[0];
    if (attr && attr.value === selector.replace("#", '')) {
      return true;
    }
  } else if (selector.match(classReg)) {
    var attr = element.attributes.filter(attr => attr.name === "class")[0];
    if (attr && attr.value === selector.replace(".", '')) {
      return true;
    }
  } else {
    if (element.tagName === selector) {
      return true;
    } else if (selector.match(tagReg)) {
      return true;
    }
  }
  return false;
}

function emit(token) {
  let top = stack[stack.length - 1]; 
  
  // 入栈操作
  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: [],
    }

    element.tagName = token.tagName;

    for (let p in token) {
      if (p != 'type' && p != 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p],
        });
      }
    }

    computeCSS(element);

    top.children.push(element);
    // element.parent = top;

    if (!token.isSelfClosing) {
      stack.push(element);
    }
    currentTextNode = null;
  } else if (token.type === 'endTag') {
    if (top.tagName != token.tagName) {
      throw new Error('Tag start end doesn’t match~');
    } else {
      // 遇到 style 标签，执行添加css规则的操作 
      if (top.tagName === 'style') {
        addCssRules(top.children[0].content);
      }
      stack.pop()
    }
    currentTextNode = null;
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: '',
      }
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

const EOF = Symbol('EOF');

function data(c) {
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: 'EOF',
    })
    return ;
  } else {
    emit({
      type: 'text',
      content: c,
    })
    return data;
  }
}

// 标签开始 不是开始标签
function tagOpen(c) {
  // 判断是不是结束标签，检测到 / 就是结束标签的开头
  if (c === '/') {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    // 开始标签或自封闭标签
    currentToken = {
      type: 'startTag',
      tagName: "",
    }
    return tagName(c);
  } else {
    return ;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: "",
    }
    return tagName(c);
  } else if (c === '>') {
    // 报错

  } else if (c === EOF) {
    // 报错

  } else {

  }
}

function tagName(c) {
  // tagname 以空白符结束 如：<html prop 空格后面跟属性了
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '/') {
    // <html/> 自封闭标签
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)){
    // 还是 tagname 里面
    currentToken.tagName += c;// toLowerCase();
    return tagName;
  } else if (c === '>') {
    // 结束当前标签
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

// <html mmaa = aa>
function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c);
  } else if (c === '=') {
    return ;
  } else {
    currentAttribute = {
      name: '', 
      value: '',
    }
    return attributeName(c);
  }  
}

// <div clasee="abcc" />
function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
    return afterAttributeName(c);
  } else if (c == '=') {
    return beforeAttributeValue;
  } else if (c == '\u0000') {
    
  } else if (c == '\"' || c == "'" || c == '<') {

  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
    return beforeAttributeValue(c);
  } else if (c == "\"") {
    return doubleQuotedAttributeValue;
  } else if (c == '\'') {
    return singleQuotedAttributeValue;
  } else if (c == '>') {

  } else {
    return UnquotedAttirbuteValue(c);
  }
}

function doubleQuotedAttributeValue(c) {
  if (c == '\"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === '\u0000') {

  } else if (c == EOF) {
    
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function singleQuotedAttributeValue(c) {
  if (c == '\'') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === '\u0000') {

  } else if (c == EOF) {
    
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function afterQuotedAttributeValue(c) {
  if(c.match(/^[\t\n\f ]$/)) {
      return beforeAttributeName;
  } else if (c === '/') {
      return selfClosingStartTag;
  } else if (c === '>') {
      currentToken[currentAttribute.name] = currentAttribute.value;
      emit(currentToken);
      return data;
  } else if (c === EOF) {

  } else {
      currentAttribute.value += c;
      return doubleQuotedAttributeValue;
  }
}

function UnquotedAttirbuteValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c == "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c == '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == '\u0000') {

  } else if (c == '\"' || c == "'" || c == '<' || c == '=' || c == '`') { 
    
  } else if (c == EOF) {

  } else {
    currentAttribute.value += c;
    return UnquotedAttirbuteValue;
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c == '=') {
    return beforeAttributeValue;
  } else if (c == '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {

  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute ={
      name: '',
      value: '',
    }
    return attributeName(c);
  }}

// <div/> 自封闭标签 / 之后只有 > 是有效的 其他都报错 
function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true;
    return data;
  } else if (c === EOF) {
  
  } else {

  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
  return stack[0];
}