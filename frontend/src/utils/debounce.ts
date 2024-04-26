import { setTimeout, clearTimeout } from 'timers';

// eslint-disable-next-line no-unused-vars
export const debounce = (
  func: (...args: any[]) => void,
  delay: number,
  setIsLoading?: (loadingState: boolean) => void,
) => {
  let timer: NodeJS.Timeout;

  return function (this: any, ...args: any[]) {
    if (setIsLoading !== undefined) {
      setIsLoading(true);
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
      if (setIsLoading !== undefined) {
        setIsLoading(false);
      }

      func.apply(this, args);
    }, delay);
  };
};
