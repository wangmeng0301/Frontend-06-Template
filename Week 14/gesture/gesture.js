// listen => recognize => dispatch

// new Listener(new Recognize(dispatch))

export class Listener {
  constructor(element, recognize) {
    let isListeningMouse = false;

    let contexts = new Map();

    element.addEventListener('mousedown', event => {
  
      let context = Object.create(null);
    
      contexts.set('mouse' + (1 << event.button), context);
      
      recognize.start(event, context);
      let mousemove = event => {
        let button = 1;
    
        while(button <= event.buttons) {
          if (button && event.buttons) {
            let key;
            if (button === 2) {
              key = 4;
            } else if (button === 4) {
              key = 2;
            } else {
              key = button
            }
            let context = contexts.get('mouse' + key);
            recognize.move(event, context);
          }
          button = button << 1; 
        }
      }
      let mouseup = event => {
        let context = contexts.get('mouse' + (1 << event.button));
        recognize.end(event, context);
        contexts.delete('mouse' + (1 << event.button));
    
        if (event.buttons === 0) {
          document.removeEventListener('mousemove', mousemove);
          document.removeEventListener('mouseup', mouseup);
          isListeningMouse = false;
        }
      }
    
      if(!isListeningMouse) {
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        isListeningMouse = true;
      }
    })
    
    element.addEventListener('touchstart', event => {
      for(let touch of event.changedTouches) {
        let context = Object.create(null);
        contexts.set(touch.identifier, context);
        recognize.start(touch, context);
      }
    })
    
    element.addEventListener('touchmove', event => {
      for(let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognize.move(touch, context);
      }
    })
    
    element.addEventListener('touchend', event => {
      for(let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognize.end(touch, context);
      }
    })
    
    element.addEventListener('touchcancel', event => {
      for(let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognize.cancel(touch, context);
        contexts.delete(touch.identifier);
      }
    })
  }
}

// let hander;
// let startX, startY;
// let isPan = false;
// let isTap = true;
// let isPress = false;
export class Recognize {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }
  start(point, context) {
    context.startX = point.clientX, context.startY = point.clientY;
    context.points = [{
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    }];

    context.isPan = false;
    context.isTap = true;
    context.isPress = false;

    context.hander= setTimeout(() => {
      context.isPan = false;
      context.isTap = false;
      context.isPress = true;
      context.hander = null;
      this.dispatcher.dispatch('perss', {});
    }, 500);
  }
  move (point, context) {
    let dx = point.clientX - context.startX;
    let dy = point.clientY - context.startY;

    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isTap = false;
      context.isPress = false;
      context.isPan = true;
      context.isVertical =  Math.abs(dx) < Math.abs(dy),
      this.dispatcher.dispatch('panStart', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      });
      clearTimeout(context.hander);
    }
    if (context.isPan) {
      this.dispatcher.dispatch('pan', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      });
    }

    context.points = context.points.filter(point => Date.now() - point.t < 500);

    context.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    })
  }
  end(point, context) {
    if (context.isTap) {
      this.dispatcher.dispatch('tap', {})
      clearTimeout(context.hander);
    }
    if (context.isPress) {
      this.dispatcher.dispatch('pressend', {})
    }
    context.points = context.points.filter(point => Date.now() - point.t < 500);
    let v;

    if (!context.points.length) {
      v = 0;
    } else {
      // 移动的距离，默认是正数
      let d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2);
      // 离开时的速度
      v = d / (Date.now() - context.points[0].t);
    }

    // 像素每毫秒
    if (v > 1.5) {
      context.isFlick = true;
      this.dispatcher.dispatch('flick', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v,
      });
    } else {
      context.isFlick = false;
    }

    if (context.isPan) {
      this.dispatcher.dispatch('panend', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
      });
    }
  }
  cancel(point, context) {
    clearTimeout(context.hander);
    this.dispatcher.dispatch('cancel', {});
  }
}

export class Dispatcher {
  constructor(element){
    this.element = element;
  }
  dispatch(type, properties) {
    // let event = new CustomEvent(type, {});
    let event = new Event(type);
    for (let name in properties) {
      event[name] = properties[name];
    }
  
    this.element.dispatchEvent(event);
  }
}

export function enableGesture(element) {
  debugger;
  new Listener(element, new Recognize(new Dispatcher(element)));
}