import { useMemo } from 'react';

import cx from 'classnames';

import { HOURS_IN_DAY, IS_NETWORK_MAINNET, MINUTES_IN_HOUR, MS_IN_SECOND, SECONDS_IN_MINUTE } from '@app.config';
import styles from '@containers/staking/item/components/staking-details/staking-details.module.sass';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import s from '@styles/CommonContainer.module.sass';
import { useBakers, useIsLoading } from '@utils/dapp';
import { bigNumberToString, defined, getDollarEquivalent } from '@utils/helpers';

// TODO: Remove copy/past
const mockLastStaked = Date.now();

export const useStakingDetailsViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const isLoading = useIsLoading();
  const { stakeItem } = stakingItemStore;
  const { data: bakers } = useBakers();

  const CardCellClassName = cx(s.cellCenter, s.cell, styles.vertical);

  // TODO: Remove Copy/past
  const [currentDelegate, nextDelegate] = useMemo(() => {
    if (stakeItem) {
      const { currentDelegate, nextDelegate, myDelegate } = stakeItem;

      return [currentDelegate, nextDelegate, myDelegate].map(
        delegateAddress => bakers.find(({ address }) => address === delegateAddress) ?? null
      );
    }

    return [null, null, null];
  }, [stakeItem, bakers]);

  const depositTokenDecimals = stakeItem?.stakedToken.metadata.decimals ?? 0;
  const tvlDollarEquivalent = stakeItem && IS_NETWORK_MAINNET ? stakeItem.tvl.toFixed() : null;
  const tokensTvl = stakeItem?.depositExchangeRate.gt(0)
    ? stakeItem.tvl.dividedBy(stakeItem.depositExchangeRate).decimalPlaces(depositTokenDecimals)
    : null;
  const dailyDistribution = stakeItem?.rewardPerSecond
    .times(SECONDS_IN_MINUTE)
    .times(MINUTES_IN_HOUR)
    .times(HOURS_IN_DAY);
  const distributionDollarEquivalent =
    stakeItem && IS_NETWORK_MAINNET
      ? getDollarEquivalent(
          bigNumberToString(defined(dailyDistribution)),
          bigNumberToString(stakeItem.earnExchangeRate)
        )
      : null;

  const endTimestamp = stakeItem ? mockLastStaked + stakeItem.timelock * MS_IN_SECOND : null;

  return {
    stakeItem,
    currentDelegate,
    nextDelegate,
    endTimestamp,
    tvlDollarEquivalent,
    CardCellClassName,
    tokensTvl,
    depositTokenDecimals,
    distributionDollarEquivalent,
    dailyDistribution,
    isLoading
  };
};
