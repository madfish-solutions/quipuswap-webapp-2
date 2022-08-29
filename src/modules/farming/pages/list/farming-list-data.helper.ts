import { BigNumber } from 'bignumber.js';

import { NEW_FARMINGS } from '@config/config';
import { PERCENT } from '@config/constants';
import { getFarmingLabel } from '@modules/farming/helpers';
import { getTokenSymbol, isNull } from '@shared/helpers';
import { ActiveStatus } from '@shared/types';
import { i18n } from '@translation';

import { FarmingListItemWithBalances } from './types';

const ZERO = 0;

export const farmingListDataHelper = (item: FarmingListItemWithBalances, accountPkh: Nullable<string>) => {
  const statedTokenSymbol = getTokenSymbol(item.stakedToken);

  const shouldShowUserStats = !isNull(accountPkh) && (item.depositBalance?.gt(ZERO) || item.earnBalance?.gt(ZERO));

  const farmingItemDTI = item.old ? `farming-item-v1-${item.id}` : `farming-item-${item.id}`;

  const labels = getFarmingLabel(item);

  const itemStats: Array<{
    cellName: string;
    amounts: {
      currency: string;
      amountDecimals?: number;
      amount: Nullable<BigNumber>;
      dollarEquivalentOnly?: boolean;
      dollarEquivalent?: Nullable<BigNumber>;
    };
  }> = [
    {
      cellName: i18n.t('farm|tvl'),
      amounts: {
        amount: item.tvlInStakedToken,
        dollarEquivalent: item.tvlInUsd,
        currency: statedTokenSymbol,
        dollarEquivalentOnly: true
      }
    }
  ];

  if (item.stakeStatus === ActiveStatus.ACTIVE) {
    itemStats.push(
      {
        cellName: i18n.t('farm|apr'),
        amounts: {
          amount: item.apr,
          currency: PERCENT,
          amountDecimals: 2
        }
      },
      {
        cellName: i18n.t('farm|apy'),
        amounts: {
          amount: item.apy,
          currency: PERCENT,
          amountDecimals: 2
        }
      }
    );
  }

  const userStats = shouldShowUserStats
    ? [
        {
          cellName: i18n.t('farm|yourDeposit'),
          amounts: {
            amount: item.depositBalance,
            dollarEquivalent: item.depositBalance?.multipliedBy(item.depositExchangeRate ?? ZERO),
            currency: statedTokenSymbol,
            dollarEquivalentOnly: true
          }
        },
        {
          cellName: i18n.t('farm|yourEarned'),
          amounts: {
            amount: item.earnBalance,
            dollarEquivalent: item.earnBalance?.multipliedBy(item.earnExchangeRate ?? ZERO),
            currency: getTokenSymbol(item.rewardToken),
            dollarEquivalentOnly: true
          }
        }
      ]
    : undefined;

  return {
    labels,
    itemStats,
    userStats,
    href: item.old ? `v1/${item.id}` : `${item.id}`,
    inputToken: item.tokens,
    outputToken: item.rewardToken,
    isNew: NEW_FARMINGS.includes(item.id.toFixed()),
    status: { status: item.stakeStatus, filled: true },
    farmingItemDTI
  };
};
