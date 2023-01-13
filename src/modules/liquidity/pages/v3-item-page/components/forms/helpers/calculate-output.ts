import BigNumber from 'bignumber.js';

import { V3LiquidityPoolApi } from '@modules/liquidity/api';
import { LiquidityV3Position } from '@modules/liquidity/types';
import { toReal, getPercentageFromNumber, toFixed } from '@shared/helpers';
import { Token } from '@shared/types';

import { calculateDeposit } from '../../../helpers';

const PERCENT_DECIMAL_PRECISION = 1e2;

export const calculateOutput = (
  inputAmount: string,
  position: LiquidityV3Position,
  poolStorage: V3LiquidityPoolApi.V3PoolStorage,
  tokenX: Token,
  tokenY: Token
) => {
  const { x: tokenXAtomicDeposit, y: tokenYAtomicDeposit } = calculateDeposit(position, poolStorage);

  const atomicCalculatedTokenXDeposit = getPercentageFromNumber(
    tokenXAtomicDeposit.multipliedBy(PERCENT_DECIMAL_PRECISION),
    new BigNumber(inputAmount).multipliedBy(PERCENT_DECIMAL_PRECISION)
  );

  const atomicCalculatedTokenYDeposit = getPercentageFromNumber(
    tokenYAtomicDeposit.multipliedBy(PERCENT_DECIMAL_PRECISION),
    new BigNumber(inputAmount).multipliedBy(PERCENT_DECIMAL_PRECISION)
  );

  const realTokenXAtomicDeposit = toFixed(
    toReal(atomicCalculatedTokenXDeposit, tokenX.metadata.decimals).decimalPlaces(
      tokenX.metadata.decimals,
      BigNumber.ROUND_DOWN
    )
  );

  const realTokenYAtomicDeposit = toFixed(
    toReal(atomicCalculatedTokenYDeposit, tokenY.metadata.decimals).decimalPlaces(
      tokenY.metadata.decimals,
      BigNumber.ROUND_DOWN
    )
  );

  return { tokenXDeposit: realTokenXAtomicDeposit, tokenYDeposit: realTokenYAtomicDeposit };
};
