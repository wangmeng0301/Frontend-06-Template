export function createElement(type, attributes, ...children) {
  let element;
  console.log('type:', type)
  if (typeof type === 'string') {
    element = new ElementWrapper(type);
  } else {
    element = new type;
  }
  for (let name in attributes) {
    element.setAttribute(name, attributes[name]);
  }
  let processChildren = (children) => {
    for (let child of children) {
      if ((typeof child === 'object') && (child instanceof Array)) {
        processChildren(child);
        continue;
      }
      if (typeof child === 'string') {
        child = new TextWrapper(child);
      }
      element.appendChild(child);
    }
  }
  processChildren(children);
  return element;
}

export const STATE = Symbol('state');
export const ATTRIBUTES = Symbol('attributes');

export class Component {
  constructor(type) {
    this[STATE] = Object.create(null);
    this[ATTRIBUTES] = Object.create(null);
  }
  setAttribute(name, value) {
    this[ATTRIBUTES][name] = value;
  }
  appendChild(child) {
    child.mountTo(this.root);
  }
  mountTo(parent) {
    if (!this.root) {
      this.render();
    }
    parent.appendChild(this.root);
  }
  triggerEvent(type, args) {
    this[ATTRIBUTES]['on' + type.replace(/^[\s\S]/, s => s.toUpperCase())](new CustomEvent(type, { detail: args}));
  }
  render(){
    return this.root;
  };
}

class ElementWrapper extends Component {
  constructor(type) { 
    super();
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
}

class TextWrapper extends Component  {
  constructor(content) { 
    super();
    this.root = document.createTextNode(content);
  }
}
