import BigNumber from 'bignumber.js';

import { decreaseBySlippage, increaseBySlippage } from '@shared/helpers';

import { LiquiditySlippageType } from '../../slippage-info';

export const increaseOrDecreaseBySlippage = (
  liquidityType: LiquiditySlippageType,
  tokenAmount: BigNumber,
  slippage: BigNumber
) => {
  if (liquidityType === LiquiditySlippageType.ADD) {
    return increaseBySlippage(tokenAmount, slippage);
  }

  return decreaseBySlippage(tokenAmount, slippage);
};
