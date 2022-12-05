import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { AppRootRoutes } from '@app.router';
import { IS_NETWORK_MAINNET } from '@config/config';
import { TESTNET_EXCHANGE_RATE } from '@config/constants';
import { BlockchainLiquidityV3Api } from '@modules/liquidity/api';
import { LiquidityRoutes, LiquiditySubroutes } from '@modules/liquidity/liquidity-routes.enum';
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
import { i18n } from '@translation';

import { calculateDeposit } from './calculate-deposit';
import { calculateFees } from './calculate-fees';
import { convertToAtomicPrice } from './convert-to-atomic-price';

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
  rangeLabelClasses: RangeLabelClasses,
  storage: BlockchainLiquidityV3Api.V3PoolStorage
) => {
  const { className: rangeLabelClassName, inRangeClassName } = rangeLabelClasses;
  const tokenXExchangeRate = IS_NETWORK_MAINNET ? getTokenExchangeRate(tokenX) : TESTNET_EXCHANGE_RATE;
  const tokenYExchangeRate = IS_NETWORK_MAINNET ? getTokenExchangeRate(tokenY) : TESTNET_EXCHANGE_RATE;
  const tokenPriceDecimals = getTokenDecimals(tokenY) - getTokenDecimals(tokenX);
  const tokensNames = getTokensNames([tokenY, tokenX]);

  return (position: LiquidityV3Position) => {
    const minRange = toReal(convertToAtomicPrice(position.lower_tick.sqrt_price), tokenPriceDecimals);
    const maxRange = toReal(convertToAtomicPrice(position.upper_tick.sqrt_price), tokenPriceDecimals);

    const { x: tokenXAtomicDeposit, y: tokenYAtomicDeposit } = calculateDeposit(position, storage);
    const { x: tokenXAtomicFees, y: tokenYAtomicFees } = calculateFees(storage, position);
    const tokenXDeposit = toReal(tokenXAtomicDeposit, tokenX);
    const tokenYDeposit = toReal(tokenYAtomicDeposit, tokenY);
    const tokenXFees = toReal(tokenXAtomicFees, tokenX);
    const tokenYFees = toReal(tokenYAtomicFees, tokenY);

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
      href: `${AppRootRoutes.Liquidity}${LiquidityRoutes.v3}/${poolId}/${
        LiquiditySubroutes.positions
      }/${position.id.toFixed()}`,
      inputToken: [tokenX, tokenY],
      status: null,
      isNew: false,
      labels: [
        {
          contentClassName: cx(rangeLabelClassName, isInRange && inRangeClassName),
          status: ActiveStatus.ACTIVE,
          label: isInRange ? i18n.t('liquidity|inRange') : i18n.t('liquidity|notActive')
        }
      ],
      itemStats: [
        {
          cellName: i18n.t('liquidity|minPrice'),
          amounts: {
            amount: minRange,
            dollarEquivalent: null,
            currency: tokensNames
          },
          DTI: 'minPrice',
          tooltip: i18n.t('liquidity|minPriceTooltip')
        },
        {
          cellName: i18n.t('liquidity|maxPrice'),
          amounts: {
            amount: maxRange,
            dollarEquivalent: null,
            currency: tokensNames
          },
          DTI: 'maxPrice',
          tooltip: i18n.t('liquidity|maxPriceTooltip')
        },
        {
          cellName: i18n.t('liquidity|Deposit'),
          amounts: {
            amount: depositUsd,
            dollarEquivalent: depositUsd,
            currency: tokensNames,
            dollarEquivalentOnly: true
          },
          DTI: 'deposit',
          tooltip: i18n.t('liquidity|depositTooltip')
        },
        {
          cellName: i18n.t('liquidity|collectedFees'),
          amounts: {
            amount: collectedFeesUsd,
            dollarEquivalent: collectedFeesUsd,
            currency: tokensNames,
            dollarEquivalentOnly: true
          },
          DTI: 'collectedFees',
          tooltip: i18n.t('liquidity|collectedFeesTooltip')
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
