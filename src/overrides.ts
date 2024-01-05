/* eslint-disable no-console */
import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import { BigMapAbstraction } from '@taquito/taquito';

import { BigMapKeyType } from '@shared/types';

const originalGet = BigMapAbstraction.prototype.get;

BigMapAbstraction.prototype.get = async function <T>(
  keyToEncode: BigMapKeyType,
  block?: number
): Promise<T | undefined> {
  const promiseResponse = originalGet.call(this, keyToEncode, block) as Promise<T>;

  try {
    return await promiseResponse;
  } catch (error) {
    if (error instanceof HttpResponseError && error.status === STATUS_CODE.NOT_FOUND) {
      return undefined;
    }

    throw error;
  }
};
