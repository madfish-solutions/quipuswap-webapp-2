import BigNumber from 'bignumber.js';

import { Nullable, Optional, Undefined } from '@shared/types';

import { isEmptyString } from '../strings';
import { isExist } from '../type-checks';

export function saveBigNumber(candidate: BigNumber.Value, replacer: null): Nullable<BigNumber>;
export function saveBigNumber(candidate: BigNumber.Value, replacer: BigNumber): BigNumber;
export function saveBigNumber(candidate: BigNumber.Value, replacer: undefined): Undefined<BigNumber>;
export function saveBigNumber(candidate: BigNumber.Value, replacer: null | undefined): Optional<BigNumber>;
export function saveBigNumber(candidate: Optional<BigNumber.Value>, replacer: null): Nullable<BigNumber>;
export function saveBigNumber(candidate: Optional<BigNumber.Value>, replacer: null | undefined): Optional<BigNumber>;
export function saveBigNumber(candidate: Optional<BigNumber.Value>, replacer: BigNumber): BigNumber;
export function saveBigNumber(candidate: Optional<BigNumber.Value>, replacer: Optional<BigNumber>) {
  return !isExist(candidate) ||
    (typeof candidate === 'string' && isEmptyString(candidate)) ||
    (typeof candidate === 'number' && candidate !== candidate)
    ? replacer
    : new BigNumber(candidate);
}
