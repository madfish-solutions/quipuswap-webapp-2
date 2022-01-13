import { Nullable, Undefined } from '@utils/types';

export const isExist = <T>(value: Undefined<Nullable<T>>): value is T => value !== null && value !== undefined;
