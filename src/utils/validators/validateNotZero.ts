import BigNumber from 'bignumber.js';
import {i18n} from 'next-i18next';

export const validateNotZero = (value1: string, value2: string) => () =>
  new BigNumber(value1).eq(0) && new BigNumber(value2).eq(0)
    ? i18n?.t('liquidity|Value has to be a greater than zero')
    : undefined;
