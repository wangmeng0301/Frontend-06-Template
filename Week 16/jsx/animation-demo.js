import { TimeLine, Animation } from './animation.js';
import { linear, ease, easeIn, easeInOut, easeOut } from './ease.js';
// }
let tl = new TimeLine();

tl.start();

tl.add(new Animation(document.querySelector('#el').style, 'transform', 0, 500, 2000, 0, linear, v => `translateX(${v}px)`));

document.querySelector('#el2').style.transition = 'transform 2s linear';
document.querySelector('#el2').style.transform = 'translateX(500px)';

document.querySelector('#pause-btn').addEventListener('click', () => tl.pause());

document.querySelector('#resume-btn').addEventListener('click', () => tl.resume());

// document.querySelector('#reset-btn').addEventListener('click', () => tl.reset());