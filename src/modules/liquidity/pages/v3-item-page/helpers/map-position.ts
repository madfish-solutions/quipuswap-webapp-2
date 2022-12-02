import BigNumber from 'bignumber.js';

import { IS_NETWORK_MAINNET } from '@config/config';
import { TESTNET_EXCHANGE_RATE, ZERO_AMOUNT_BN } from '@config/constants';
import { LiquidityV3Position } from '@modules/liquidity/types';
import { getSumOfNumbers, getTokenDecimals, isExist, multipliedIfPossible, toAtomic, toReal } from '@shared/helpers';
import { Optional, Token } from '@shared/types';

import { convertToAtomicPrice } from './convert-to-atomic-price';

const MOCK_NON_ZERO_TOKEN_X_REAL_DEPOSIT = new BigNumber('0.15');
const MOCK_NON_ZERO_TOKEN_Y_REAL_DEPOSIT = new BigNumber('0.3');
const MOCK_TOKEN_X_REAL_FEES = new BigNumber('0.01');
const MOCK_TOKEN_Y_REAL_FEES = new BigNumber('0.02');

export const mapPosition = (
  tokenX: Token,
  tokenY: Token,
  currentRealPrice: Optional<BigNumber>,
  getTokenExchangeRate: (token: Token) => Optional<BigNumber>,
  poolId: Optional<string>
) => {
  const tokenXExchangeRate = IS_NETWORK_MAINNET ? getTokenExchangeRate(tokenX) : TESTNET_EXCHANGE_RATE;
  const tokenYExchangeRate = IS_NETWORK_MAINNET ? getTokenExchangeRate(tokenY) : TESTNET_EXCHANGE_RATE;
  const tokenPriceDecimals = getTokenDecimals(tokenY) - getTokenDecimals(tokenX);

  return (position: LiquidityV3Position) => {
    const minRange = toReal(convertToAtomicPrice(position.lower_tick.sqrt_price), tokenPriceDecimals);
    const maxRange = toReal(convertToAtomicPrice(position.upper_tick.sqrt_price), tokenPriceDecimals);

    // TODO (not a tech debt): https://madfish.atlassian.net/browse/QUIPU-712
    const mockTokenXAtomicDeposit = toAtomic(
      isExist(currentRealPrice) && currentRealPrice.gt(maxRange) ? ZERO_AMOUNT_BN : MOCK_NON_ZERO_TOKEN_X_REAL_DEPOSIT,
      tokenX
    );
    const mockTokenYAtomicDeposit = toAtomic(
      isExist(currentRealPrice) && currentRealPrice.lt(minRange) ? ZERO_AMOUNT_BN : MOCK_NON_ZERO_TOKEN_Y_REAL_DEPOSIT,
      tokenY
    );
    const tokenXDeposit = toReal(mockTokenXAtomicDeposit, tokenX);
    const tokenYDeposit = toReal(mockTokenYAtomicDeposit, tokenY);
    const tokenXFees = MOCK_TOKEN_X_REAL_FEES;
    const tokenYFees = MOCK_TOKEN_Y_REAL_FEES;

    const depositUsd = getSumOfNumbers([
      multipliedIfPossible(tokenXDeposit, tokenXExchangeRate),
      multipliedIfPossible(tokenYDeposit, tokenYExchangeRate)
    ]);
    const collectedFeesUsd = getSumOfNumbers([
      multipliedIfPossible(tokenXFees, tokenXExchangeRate),
      multipliedIfPossible(tokenYFees, tokenYExchangeRate)
    ]);
    const isInRange = isExist(currentRealPrice) && currentRealPrice.gte(minRange) && currentRealPrice.lte(maxRange);

    return {
      collectedFeesUsd,
      depositUsd,
      minRange,
      maxRange,
      isInRange,
      tokenX,
      tokenY,
      tokenXDeposit,
      tokenYDeposit,
      tokenXFees,
      tokenYFees,
      poolId,
      id: position.id
    };
  };
};
