import { BigNumber } from 'bignumber.js';

import { Optional } from '@shared/types';

import { fromDecimals } from './bignumber';

const WHOLE_ITEM_PERCENT = 100;
const EMPTY_OUTPUT_AMOUNT = 0;
const WHOLE_ITEM = 1;
const RAW_TOKEN_ATOM_AMOUNT = 1;

export const getMinimalOutput = (
  outputAmount: Optional<BigNumber>,
  slippage: Optional<BigNumber>,
  tokenDecimals: number
) =>
  slippage && outputAmount?.gt(EMPTY_OUTPUT_AMOUNT)
    ? BigNumber.maximum(
        outputAmount
          .times(new BigNumber(WHOLE_ITEM).minus(slippage.div(WHOLE_ITEM_PERCENT)))
          .decimalPlaces(tokenDecimals, BigNumber.ROUND_FLOOR),
        fromDecimals(new BigNumber(RAW_TOKEN_ATOM_AMOUNT), tokenDecimals)
      )
    : null;
