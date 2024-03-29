import { BigNumber } from 'bignumber.js';

import { PERCENT } from '@config/constants';
import { ListItemCardProps } from '@shared/components';
import { getTokenSymbol, isNull, multipliedIfPossible } from '@shared/helpers';
import { Nullable } from '@shared/types';
import { i18n } from '@translation';

import { FarmingListItemWithBalances } from './types';
import { getFarmingLabel, getFarmItemUrl } from '../../helpers';
import { isNewFarming } from '../../helpers/is-new-farming';

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

export const mapFarmingItemForView =
  (accountPkh: Nullable<string>, userStatsAreLoading: boolean) =>
  (farmingItem: FarmingListItemWithBalances): ListItemCardProps => {
    const labels = getFarmingLabel(farmingItem);

    const shouldShowUserStats =
      !isNull(accountPkh) && (!farmingItem.depositBalance?.isZero() || !farmingItem.earnBalance?.isZero());

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
              dollarEquivalent: multipliedIfPossible(farmingItem.depositBalance, farmingItem.depositExchangeRate),
              currency: getTokenSymbol(farmingItem.stakedToken),
              dollarEquivalentOnly: true,
              loading: userStatsAreLoading
            }
          },
          {
            cellName: i18n.t('farm|yourEarned'),
            amounts: {
              amount: farmingItem.earnBalance,
              dollarEquivalent: multipliedIfPossible(farmingItem.earnBalance, farmingItem.earnExchangeRate),
              currency: getTokenSymbol(farmingItem.rewardToken),
              dollarEquivalentOnly: true,
              loading: userStatsAreLoading
            }
          }
        ]
      : undefined;

    const href = getFarmItemUrl(farmingItem);

    return {
      labels,
      itemStats,
      userStats,
      href,
      inputToken: farmingItem.tokens,
      isNew: isNewFarming(farmingItem),
      status: { status: farmingItem.stakeStatus, filled: true },
      outputToken: farmingItem.rewardToken
    };
  };
