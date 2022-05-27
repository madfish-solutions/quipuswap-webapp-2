import { MichelsonMap } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { LP_INPUT_KEY } from '@config/constants';
import { isEmptyString, toDecimals } from '@shared/helpers';
import { Token } from '@shared/types';

import { RemoveLiqFormValues, AddLiqFormValues } from '../stableswap-liquidity/pages/item/components';
import { getIndexByInputSlug } from './get-input-slug-by-index';

export const createAmountsMichelsonMap = (
  values: RemoveLiqFormValues | AddLiqFormValues,
  tokens: Array<Token>,
  index: number,
  inputAmount: string
) => {
  const map = new MichelsonMap<BigNumber, BigNumber>();

  Object.entries(values).forEach(([inputSlug, value]) => {
    if (inputSlug !== LP_INPUT_KEY) {
      const inputIndex = getIndexByInputSlug(inputSlug);
      let amount = inputIndex === index.toString() ? inputAmount : value;

      if (isEmptyString(amount)) {
        amount = '0';
      }
      const fixedAmount = toDecimals(new BigNumber(amount), tokens[index]);
      map.set(new BigNumber(inputIndex), fixedAmount);
    }
  });

  return map;
};
