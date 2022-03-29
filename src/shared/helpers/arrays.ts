/* eslint-disable @typescript-eslint/no-magic-numbers */
export const getUniqArray = <T>(list: T[], getKey: (el: T) => string): T[] => {
  const map: Record<string, boolean> = {};

  return list.filter(el => {
    const key = getKey(el);
    if (!(key in map)) {
      map[key] = true;

      return true;
    }

    return false;
  });
};

export const cloneArray = <T>(array: Array<T>): Array<T> => array.slice();

export const isFoundIndex = (index: number) => index !== -1;

export const isEmptyArray = (array: unknown[]) => array.length === 0;

export const isLastElementIndex = (index: number, array: unknown[]) => index === array.length - 1;
