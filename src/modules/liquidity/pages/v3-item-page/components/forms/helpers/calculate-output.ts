import BigNumber from 'bignumber.js';

import { V3LiquidityPoolApi } from '@modules/liquidity/api';
import { LiquidityV3Position } from '@modules/liquidity/types';
import { toReal, getPercentageFromNumber, toFixed } from '@shared/helpers';
import { Token } from '@shared/types';

import { calculateDeposit } from '../../../helpers';

export const calculateOutput = (
  inputAmount: string,
  position: LiquidityV3Position,
  poolStorage: V3LiquidityPoolApi.V3PoolStorage,
  tokenX: Token,
  tokenY: Token
) => {
  const liquidity = getPercentageFromNumber(position.liquidity, new BigNumber(inputAmount)).integerValue(
    BigNumber.ROUND_DOWN
  );
  const { x: atomicCalculatedTokenXDeposit, y: atomicCalculatedTokenYDeposit } = calculateDeposit(
    { ...position, liquidity },
    poolStorage
  );

  const realTokenXAtomicDeposit = toFixed(toReal(atomicCalculatedTokenXDeposit, tokenX));
  const realTokenYAtomicDeposit = toFixed(toReal(atomicCalculatedTokenYDeposit, tokenY));

  return { tokenXDeposit: realTokenXAtomicDeposit, tokenYDeposit: realTokenYAtomicDeposit };
};
