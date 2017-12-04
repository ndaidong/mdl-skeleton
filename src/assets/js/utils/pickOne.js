// utils / pickOne

import {
  random,
} from 'bellajs';

export default (arr = []) => {
  let vals = [...arr];
  let rand = random(0, vals.length - 1);
  return vals[rand];
};
