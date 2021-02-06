import { linear } from './easy.js';

const TICK = Symbol('tick');

const TICK_HANDLER = Symbol('tick-handler');

const ANIMATIONS = Symbol('animations');

const START_TIME = Symbol('START_TIME');

const PAUSE_START = Symbol('pause-start');

const PAUSE_TIME = Symbol('pause-time');

export class TimeLine {
  constructor() {
    this.state = 'Inited';
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
  }

  // 开始star
  start() {
    if (this.state !== 'Inited') {
      return;
    }
    this.state = 'started';
    let startTime = Date.now();
    this[PAUSE_TIME] = 0;
    this[TICK] = () => {
      let now = Date.now();
      for(let animation of this[ANIMATIONS]) {
        let t;

        if (this[START_TIME].get(animation) < startTime) {
          t = now - startTime - this[PAUSE_TIME] - animation.delay;
        } else {
          t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay;
        }

        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          t = animation.duration;
        }
        if (t > 0)
          animation.receive(t);
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
    }
    this[TICK]();
  }

  // // 播放速率
  // get rate() {
 
  // }
  // // 播放速率
  // set rate() {

  // }

  // 暂停和恢复是一组
  pause() {
    if (this.state !== 'started') {
      return;
    }
    this.state = 'paused';
    this[PAUSE_START] = Date.now();
    cancelAnimationFrame(this[TICK_HANDLER]);
  }
  resume() {
    if (this.state !== 'paused') {
      return;
    }
    this.state = 'started';
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
    this[TICK]();
  }


  // 重启。针对时间线做清理和复用
  reset() {
    this.pause();
    this.state = 'inited';
    let startTime = Date.now();
    this[PAUSE_TIME] = 0;
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
    this[PAUSE_START] = 0;
    this[TICK_HANDLER] = null;
  }

  add(animation, startTime) {
    if (arguments.length < 2) {
      startTime = Date.now();
    }
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime);
  }
}

export class Animation {
  constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
    timingFunction = timingFunction || linear;
    template = template || linear;
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
    this.delay = delay;
    this.template = template;
  }

  receive(time) {
    let range = this.endValue - this.startValue;

    let progress = this.timingFunction(time / this.duration);

    this.object[this.property] = this.template(this.startValue + range * progress);
  }
}