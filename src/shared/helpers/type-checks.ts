import { UnexpectedEmptyValueError } from '@shared/errors';

import { Nullable, Optional, Undefined } from '../types/types';

export const isNull = <T>(value: Nullable<T>): value is null => value === null;

export const isUndefined = <T>(value: Undefined<T>): value is undefined => value === undefined;

/*
  Check to empty value
 */
export const isExist = <T>(value: Optional<T>): value is T => !isNull(value) && !isUndefined(value);

export const defined = <T>(value: Optional<T>, message?: string): T => {
  if (!isExist(value)) {
    throw new UnexpectedEmptyValueError(message);
  }

  return value;
};
