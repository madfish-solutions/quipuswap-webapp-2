import { BigNumber } from 'bignumber.js';

import { PERCENT, ZERO_AMOUNT_BN } from '@config/constants';
import { ListItemCardProps } from '@shared/components';
import { getTokenSymbol, isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';
import { i18n } from '@translation';

import { getFarmingLabel, getFarmItemUrl } from '../../helpers';
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
    farmingItem.old &&
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
