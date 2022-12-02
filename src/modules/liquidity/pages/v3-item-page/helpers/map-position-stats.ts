import cx from 'classnames';

import { AppRootRoutes } from '@app.router';
import { LiquidityRoutes, LiquiditySubroutes } from '@modules/liquidity/liquidity-routes.enum';
import { getTokensNames } from '@shared/helpers';
import { ActiveStatus } from '@shared/types';
import { i18n } from '@translation';

import { mapPosition } from './map-position';

interface RangeLabelClasses {
  className: string;
  inRangeClassName: string;
}

export const mapPositionStats = (rangeLabelClasses: RangeLabelClasses) => {
  return (stats: ReturnType<ReturnType<typeof mapPosition>>) => {
    const { collectedFeesUsd, depositUsd, minRange, maxRange, isInRange, tokenX, tokenY, id, poolId } = stats;
    const { className: rangeLabelClassName, inRangeClassName } = rangeLabelClasses;
    const tokensNames = getTokensNames([tokenY, tokenX]);

    return {
      href: `${AppRootRoutes.Liquidity}${LiquidityRoutes.v3}/${poolId}/${LiquiditySubroutes.positions}/${id.toFixed()}`,
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
