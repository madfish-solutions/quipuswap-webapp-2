import BigNumber from 'bignumber.js';

import { Optional } from '@utils/types';

import { fromDecimals } from './fromDecimals';

const WHOLE_ITEM_PERCENT = 100;
const EMPTY_OUTPUT_AMOUNT = 0;

export const getMinimalOutput = (
  outputAmount: Optional<BigNumber>,
  slippage: Optional<BigNumber>,
  tokenDecimals: number
) =>
  slippage && outputAmount?.gt(EMPTY_OUTPUT_AMOUNT)
    ? BigNumber.maximum(
        outputAmount
          .times(new BigNumber(1).minus(slippage.div(WHOLE_ITEM_PERCENT)))
          .decimalPlaces(tokenDecimals, BigNumber.ROUND_FLOOR),
        fromDecimals(new BigNumber(1), tokenDecimals)
      )
    : null;
