import { setTimeout, clearTimeout } from 'timers';

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

export const throttle = <T extends (...args: any[]) => void>(
  mainFunction: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timer: NodeJS.Timeout | null = null;
  let lastExecutedTime: number = 0;

  return (...args: Parameters<T>): void => {
    const currentTime = Date.now();

    if (timer === null || currentTime - lastExecutedTime >= delay) {
      mainFunction(...args);
      lastExecutedTime = currentTime;
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        timer = null;
      }, delay);
    }
  };
};
