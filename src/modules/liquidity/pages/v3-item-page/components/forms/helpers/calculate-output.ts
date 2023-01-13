import BigNumber from 'bignumber.js';

import { PERCENT_100 } from '@config/constants';
import { V3LiquidityPoolApi } from '@modules/liquidity/api';
import { LiquidityV3Position } from '@modules/liquidity/types';
import { toReal, toFixed } from '@shared/helpers';
import { Token } from '@shared/types';

import { calculateDeposit } from '../../../helpers';

export const calculateOutput = (
  inputAmount: string,
  position: LiquidityV3Position,
  poolStorage: V3LiquidityPoolApi.V3PoolStorage,
  tokenX: Token,
  tokenY: Token
) => {
  const { x: tokenXAtomicDeposit, y: tokenYAtomicDeposit } = calculateDeposit(position, poolStorage);

  const realTokenXAtomicDeposit = toReal(tokenXAtomicDeposit, tokenX.metadata.decimals).decimalPlaces(
    tokenX.metadata.decimals,
    BigNumber.ROUND_DOWN
  );

  const realTokenYAtomicDeposit = toReal(tokenYAtomicDeposit, tokenY.metadata.decimals).decimalPlaces(
    tokenY.metadata.decimals,
    BigNumber.ROUND_DOWN
  );

  const calculatedTokenXDeposit = toFixed(
    realTokenXAtomicDeposit.dividedBy(PERCENT_100).multipliedBy(new BigNumber(inputAmount))
  );
  const calculatedTokenYDeposit = toFixed(
    realTokenYAtomicDeposit.dividedBy(PERCENT_100).multipliedBy(new BigNumber(inputAmount))
  );

  return { tokenXDeposit: calculatedTokenXDeposit, tokenYDeposit: calculatedTokenYDeposit };
};
