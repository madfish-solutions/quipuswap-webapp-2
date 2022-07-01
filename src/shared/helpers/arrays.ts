import { FISRT_INDEX } from '@config/constants';

import { Nullable } from '../types';

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

export const isEmptyArray = (array: Nullable<unknown[]>) => (array ? array.length === 0 : true);
export const isNotEmptyArray = <T>(array: Nullable<T[]>): array is T[] => (array ? array.length !== 0 : false);
export const isSingleElement = (array: Nullable<unknown[]>) => (array ? array.length === 1 : true);

export const lastElementIndex = <T>(array: T[]) => array.length - 1;

export const isLastElementIndex = (index: number, array: unknown[]) => index === lastElementIndex(array);
export const isFirstElementIndex = (index: number) => index === FISRT_INDEX;

export const getFirstElement = <T>(array: T[]): T => array[FISRT_INDEX];

export const toArray = <T>(entity: T | Array<T>): Array<T> => (Array.isArray(entity) ? entity : [entity]);

export const isInArray = <T>(item: T, list: Array<T>): boolean => list.includes(item);

export const isSomeInArray = <T>(list: Array<T>, items: Array<T>): boolean => list.some(item => isInArray(item, items));
