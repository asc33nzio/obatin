import { setTimeout, clearTimeout } from 'timers';

// eslint-disable-next-line no-unused-vars
export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout;

  return function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};
