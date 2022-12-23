import BigNumber from 'bignumber.js';

import { decreaseByPercentage, increaseByPercentage } from '@shared/helpers';

import { LiquiditySlippageType } from '../../slippage-info';

export const increaseOrDecreaseBySlippage = (
  liquidityType: LiquiditySlippageType,
  tokenAmount: BigNumber,
  slippage: BigNumber
) => {
  if (liquidityType === LiquiditySlippageType.ADD) {
    return increaseByPercentage(tokenAmount, slippage);
  }

  return decreaseByPercentage(tokenAmount, slippage);
};
