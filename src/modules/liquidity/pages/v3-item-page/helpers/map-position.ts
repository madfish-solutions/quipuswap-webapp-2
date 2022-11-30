import BigNumber from 'bignumber.js';

import { AppRootRoutes } from '@app.router';
import { LiquidityRoutes } from '@modules/liquidity/liquidity-routes.enum';
import { LiquidityV3Position } from '@modules/liquidity/types';
import {
  getSumOfNumbers,
  getTokenDecimals,
  getTokensNames,
  isExist,
  multipliedIfPossible,
  toReal
} from '@shared/helpers';
import { ActiveStatus, Optional, Token } from '@shared/types';

import { convertToAtomicPrice } from './convert-to-atomic-price';

export const mapPosition = (
  tokenX: Token,
  tokenY: Token,
  currentRealPrice: Optional<BigNumber>,
  tokenXExchangeRate: Optional<BigNumber.Value>,
  tokenYExchangeRate: Optional<BigNumber.Value>,
  poolId: Optional<string>
) => {
  const tokenPriceDecimals = getTokenDecimals(tokenY) - getTokenDecimals(tokenX);
  const tokensNames = getTokensNames([tokenY, tokenX]);

  return (position: LiquidityV3Position) => {
    // TODO (not a tech debt): https://madfish.atlassian.net/browse/QUIPU-712
    const tokenXDeposit = toReal(new BigNumber('1000'), tokenX);
    const tokenYDeposit = toReal(new BigNumber('1000'), tokenY);
    const tokenXFees = toReal(new BigNumber('1'), tokenX);
    const tokenYFees = toReal(new BigNumber('1'), tokenY);
    const minRange = toReal(convertToAtomicPrice(position.lower_tick.sqrt_price), tokenPriceDecimals);
    const maxRange = toReal(convertToAtomicPrice(position.upper_tick.sqrt_price), tokenPriceDecimals);
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
          status: ActiveStatus.ACTIVE,
          label: isInRange ? 'In range' : 'Out of range'
        }
      ],
      itemStats: [
        {
          cellName: 'Min. price',
          cellNameClassName: '',
          cardCellClassName: '',
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
          cellNameClassName: '',
          cardCellClassName: '',
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
          cellNameClassName: '',
          cardCellClassName: '',
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
          cellNameClassName: '',
          cardCellClassName: '',
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
