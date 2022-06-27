import { NEW_FARMINGS } from '@config/config';
import { PERCENT } from '@config/constants';
import { getTimeLockDescription, getTokenSymbol, isNull } from '@shared/helpers';
import { i18n } from '@translation';

import { FarmingItem } from '../../interfaces';

const ZERO = 0;

export const farmingListDataHelper = (item: FarmingItem, accountPkh: Nullable<string>) => {
  const statedTokenSymbol = getTokenSymbol(item.stakedToken);
  const timeLockLabel = getTimeLockDescription(item.timelock);
  const withdrawalFeeLabel = item.withdrawalFee.toFixed();

  const shouldShowUserStats = !isNull(accountPkh) && (item.depositBalance?.gt(ZERO) || item.earnBalance?.gt(ZERO));
  const shouldShowLockPeriod = !!Number(item.timelock);
  const shouldShowWithdrawalFee = !item.withdrawalFee.eq(ZERO);

  const farmingItemDTI = `farming-item-${item.id}`;

  const labels = [];
  if (shouldShowLockPeriod) {
    labels.push({ status: item.stakeStatus, label: `${timeLockLabel} LOCK` });
  }

  if (shouldShowWithdrawalFee) {
    labels.push({ status: item.stakeStatus, label: `${withdrawalFeeLabel}% UNLOCK FEE` });
  }

  const itemStats = [
    {
      cellName: i18n.t('farm|tvl'),
      amounts: {
        amount: item.tvlInStakedToken,
        dollarEquivalent: item.tvlInUsd,
        currency: statedTokenSymbol,
        dollarEquivalentOnly: true
      }
    },
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
  ];

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
    href: `${item.id}`,
    inputToken: item.tokens,
    outputToken: item.rewardToken,
    isNew: NEW_FARMINGS.includes(item.id.toFixed()),
    status: { status: item.stakeStatus, filled: true },
    farmingItemDTI
  };
};
