// modules / lightPoint

import {
  add,
  get,
} from 'realdom';

import {
  random,
} from 'bellajs';

import onTransitionEnd from '../utils/onTransitionEnd';
import pickOne from '../utils/pickOne';

let $space;

const getRandomColor = () => {
  let vals = ['fff', '6f6', 'ff8', '0f0', '0ff', 'f5f', 'ffd', 'aef', 'fed', '0f6', '3f0'];
  return `#${pickOne(vals)}`;
};

const getRandomTiming = () => {
  let vals = ['ease', 'ease-in-out', 'linear', 'ease-in-out', 'ease-in', 'ease-out', 'ease-in-out'];
  return pickOne(vals);
};

const animate = (elements, spaceWidth, spaceHeight) => {
  let t = 10;

  return elements.map((el) => {
    let x = random(0, spaceWidth);
    let y = spaceHeight + random(100, 200);
    let s = 0.1 + Math.random() * 4;
    let c = getRandomColor();
    el.style.zIndex = random(5, 12);
    el.style.backgroundColor = c;
    el.style.boxShadow = `0px 0px 2px 1px ${c}`;
    el.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    return el;
  }).map((el) => {
    t += 5;
    setTimeout(() => {
      el.addClass('circle');

      let timer = random(8, 16);
      let timing = getRandomTiming();
      el.style.transition = `transform ${timer}s ${timing}`;

      let x = random(100, spaceWidth - 100);
      let y = random(100, 200);
      let s = 0.5 + Math.random();
      el.setProperty({x, y, s});
      el.style.transform = `translate(${x}px, ${-y}px) scale(${s})`;
      onTransitionEnd(el, () => {
        el.destroy();
      });
    }, t);
  });
};

const makeDots = () => {
  let dots = [];
  let total = random(1, 8);

  while (dots.length < total) {
    let c = add('DIV', $space);
    c.addClass('dot');
    dots.push(c);
  }

  let ow = $space.offsetWidth;
  let oh = $space.offsetHeight;
  animate(dots, ow, oh);
};

export let init = () => {
  $space = get('space');
  makeDots();
  setInterval(makeDots, 5e3);
};
