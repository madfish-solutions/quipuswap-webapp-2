import { Nullable, Undefined } from '@utils/types';

export const isExist = <T>(value: Undefined<Nullable<T>>): value is T => value !== null && value !== undefined;

export const isNull = <T>(value: Nullable<T>): value is T => value === null;

export const isUndefined = <T>(value: Undefined<T>): value is T => value === undefined;
