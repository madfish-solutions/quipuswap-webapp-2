export const debounce = (fn: (...args: never[]) => void, ms: number) => {
  let timer: ReturnType<typeof setTimeout> | null;

  return () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      // @ts-ignore
      fn.apply(this, arguments);
    }, ms);
  };
};
