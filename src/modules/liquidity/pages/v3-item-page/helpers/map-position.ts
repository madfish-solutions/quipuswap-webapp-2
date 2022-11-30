import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { AppRootRoutes } from '@app.router';
import { IS_NETWORK_MAINNET } from '@config/config';
import { TESTNET_EXCHANGE_RATE, ZERO_AMOUNT_BN } from '@config/constants';
import { LiquidityRoutes } from '@modules/liquidity/liquidity-routes.enum';
import { LiquidityV3Position } from '@modules/liquidity/types';
import {
  getSumOfNumbers,
  getTokenDecimals,
  getTokensNames,
  isExist,
  multipliedIfPossible,
  toAtomic,
  toReal
} from '@shared/helpers';
import { ActiveStatus, Optional, Token } from '@shared/types';

import { convertToAtomicPrice } from './convert-to-atomic-price';

const MOCK_NON_ZERO_TOKEN_X_REAL_DEPOSIT = new BigNumber('0.15');
const MOCK_NON_ZERO_TOKEN_Y_REAL_DEPOSIT = new BigNumber('0.3');
const MOCK_TOKEN_X_REAL_FEES = new BigNumber('0.01');
const MOCK_TOKEN_Y_REAL_FEES = new BigNumber('0.02');

interface RangeLabelClasses {
  className: string;
  inRangeClassName: string;
}

export const mapPosition = (
  tokenX: Token,
  tokenY: Token,
  currentRealPrice: Optional<BigNumber>,
  getTokenExchangeRate: (token: Token) => Optional<BigNumber>,
  poolId: Optional<string>,
  rangeLabelClasses: RangeLabelClasses
) => {
  const { className: rangeLabelClassName, inRangeClassName } = rangeLabelClasses;
  const tokenXExchangeRate = IS_NETWORK_MAINNET ? getTokenExchangeRate(tokenX) : TESTNET_EXCHANGE_RATE;
  const tokenYExchangeRate = IS_NETWORK_MAINNET ? getTokenExchangeRate(tokenY) : TESTNET_EXCHANGE_RATE;
  const tokenPriceDecimals = getTokenDecimals(tokenY) - getTokenDecimals(tokenX);
  const tokensNames = getTokensNames([tokenY, tokenX]);

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
      href: `${AppRootRoutes.Liquidity}${LiquidityRoutes.v3}/${poolId}/position/${position.id.toFixed()}`,
      inputToken: [tokenX, tokenY],
      status: null,
      isNew: false,
      labels: [
        {
          contentClassName: cx(rangeLabelClassName, isInRange && inRangeClassName),
          status: ActiveStatus.ACTIVE,
          label: isInRange ? 'In range' : 'Not active'
        }
      ],
      itemStats: [
        {
          cellName: 'Min. price',
          amounts: {
            amount: minRange,
            dollarEquivalent: null,
            currency: tokensNames
          },
          DTI: 'minPrice',
          tooltip: 'Minimal price'
        },
        {
          cellName: 'Max. price',
          amounts: {
            amount: maxRange,
            dollarEquivalent: null,
            currency: tokensNames
          },
          DTI: 'maxPrice',
          tooltip: 'Maximal price'
        },
        {
          cellName: 'Deposit',
          amounts: {
            amount: depositUsd,
            dollarEquivalent: depositUsd,
            currency: tokensNames,
            dollarEquivalentOnly: true
          },
          DTI: 'deposit',
          tooltip: 'Deposit'
        },
        {
          cellName: 'Collected fees',
          amounts: {
            amount: collectedFeesUsd,
            dollarEquivalent: collectedFeesUsd,
            currency: tokensNames,
            dollarEquivalentOnly: true
          },
          DTI: 'collectedFees',
          tooltip: 'Collected fees'
        }
      ],
      itemDTI: `liquidity-item-v3-${position.id.toFixed()}`,
      collectedFeesUsd,
      depositUsd,
      minRange,
      maxRange,
      isInRange,
      tokenXDeposit,
      tokenYDeposit,
      tokenXFees,
      tokenYFees
    };
  };
};
