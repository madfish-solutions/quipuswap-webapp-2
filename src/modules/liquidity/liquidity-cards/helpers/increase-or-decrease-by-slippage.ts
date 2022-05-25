import BigNumber from 'bignumber.js';

import { decreaseBySlippage, increaseBySlippage } from '@shared/helpers';

import { LiquiditySlippageType } from '../../slippage-info';

export const increaseOrDecreaseBySlippage = (
  liquidityType: LiquiditySlippageType,
  tokenAmount: BigNumber,
  decimals: number,
  slippage: BigNumber
) => {
  if (liquidityType === LiquiditySlippageType.ADD) {
    return increaseBySlippage(tokenAmount, decimals, slippage);
  }

  return decreaseBySlippage(tokenAmount, decimals, slippage);
};
