import BigNumber from 'bignumber.js';

import { LiquiditySlippageType } from '../../liquidity-slippage';
import { decreaseBySlippage } from './decrease-by-slippage';
import { increaseBySlippage } from './increase-by-slippage';

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
