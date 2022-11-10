import { BigNumber } from 'bignumber.js';

export interface Map<T> {
  [key: string]: T;
}

export type BooleansMap = Map<boolean>;
export type NumbersMap = Map<number>;
export type StringsMap = Map<string>;
export type BigNumbersMap = Map<BigNumber>;
