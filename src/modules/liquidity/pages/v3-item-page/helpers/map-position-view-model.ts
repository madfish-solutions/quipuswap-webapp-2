import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { DexLink } from '@modules/liquidity/helpers';
import { LiquidityV3PositionWithStats } from '@modules/liquidity/types';
import { getTokensNames } from '@shared/helpers';
import { ActiveStatus, Token } from '@shared/types';
import { i18n } from '@translation';

interface RangeLabelClasses {
  className: string;
  inRangeClassName: string;
}

export const mapPositionViewModel = (
  rangeLabelClasses: RangeLabelClasses,
  tokenX: Token,
  tokenY: Token,
  poolId: BigNumber
) => {
  return (positionWithStats: LiquidityV3PositionWithStats) => {
    const { stats, id } = positionWithStats;
    const { collectedFeesUsd, depositUsd, minRange, maxRange, isInRange } = stats;
    const { className: rangeLabelClassName, inRangeClassName } = rangeLabelClasses;
    const tokensNames = getTokensNames([tokenY, tokenX]);

    return {
      href: DexLink.getLiquidityV3PositionLink(poolId, id),
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
      itemDTI: `liquidity-item-v3-${id.toFixed()}`
    };
  };
};
