import { Nullable, Undefined } from '@utils/types';

export const isNull = <T>(value: Nullable<T>): value is null => value === null;

export const isUndefined = <T>(value: Undefined<T>): value is undefined => value === undefined;

/*
  Check to empty value
 */
export const isExist = <T>(value: Undefined<Nullable<T>>): value is T => !isNull(value) && !isUndefined(value);
