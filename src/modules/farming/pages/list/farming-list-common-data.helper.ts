import { BigNumber } from 'bignumber.js';

import { AppRootRoutes } from '@app.router';
import { PERCENT, ZERO_AMOUNT_BN } from '@config/constants';
import { ListItemCardProps } from '@shared/components';
import { getTokenSymbol, isNull, isUndefined } from '@shared/helpers';
import { i18n } from '@translation';

import { FarmingRoutes } from '../../farming.router';
import { getFarmingLabel } from '../../helpers';
import { isNewFarming } from '../../helpers/is-new-farming';
import { FarmingListItemWithBalances } from './types';

interface StateCurrAmount {
  cellName: string;
  amounts: {
    currency: string;
    amountDecimals?: number;
    amount: Nullable<BigNumber>;
    dollarEquivalentOnly?: boolean;
    dollarEquivalent?: Nullable<BigNumber>;
  };
}

export const farmingListCommonDataHelper = (
  farmingItem: FarmingListItemWithBalances,
  accountPkh: Nullable<string>
): ListItemCardProps => {
  const labels = getFarmingLabel(farmingItem);

  const shouldShowUserStats =
    !isNull(accountPkh) &&
    (farmingItem.depositBalance?.gt(ZERO_AMOUNT_BN) || farmingItem.earnBalance?.gt(ZERO_AMOUNT_BN));

  const itemStats: Array<StateCurrAmount> = [
    {
      cellName: i18n.t('farm|tvl'),
      amounts: {
        amount: farmingItem.tvlInUsd,
        dollarEquivalent: farmingItem.tvlInUsd,
        currency: farmingItem.stakedToken.metadata.symbol,
        dollarEquivalentOnly: true
      }
    },
    {
      cellName: i18n.t('farm|apr'),
      amounts: {
        amount: farmingItem.apr,
        currency: PERCENT,
        amountDecimals: 2
      }
    },
    {
      cellName: i18n.t('farm|apy'),
      amounts: {
        amount: farmingItem.apy,
        currency: PERCENT,
        amountDecimals: 2
      }
    }
  ];

  const userStats = shouldShowUserStats
    ? [
        {
          cellName: i18n.t('farm|yourDeposit'),
          amounts: {
            amount: farmingItem.depositBalance,
            dollarEquivalent: farmingItem.depositBalance?.multipliedBy(
              farmingItem.depositExchangeRate ?? ZERO_AMOUNT_BN
            ),
            currency: getTokenSymbol(farmingItem.stakedToken),
            dollarEquivalentOnly: true
          }
        },
        {
          cellName: i18n.t('farm|yourEarned'),
          amounts: {
            amount: farmingItem.earnBalance,
            dollarEquivalent: farmingItem.earnBalance?.multipliedBy(farmingItem.earnExchangeRate ?? ZERO_AMOUNT_BN),
            currency: getTokenSymbol(farmingItem.rewardToken),
            dollarEquivalentOnly: true
          }
        }
      ]
    : undefined;

  return {
    labels,
    itemStats,
    userStats,
    href:
      farmingItem.old || isUndefined(farmingItem.old)
        ? `${AppRootRoutes.Farming}${FarmingRoutes.VersionOne}/${farmingItem.id}`
        : `${AppRootRoutes.Farming}${FarmingRoutes.VersionTwo}/${farmingItem.id}`,
    inputToken: farmingItem.tokens,
    isNew: isNewFarming(farmingItem),
    status: { status: farmingItem.stakeStatus, filled: true },
    outputToken: farmingItem.rewardToken
  };
};
