import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';

import {
  HOURS_IN_DAY,
  IS_NETWORK_MAINNET,
  MINUTES_IN_HOUR,
  MS_IN_SECOND,
  SECONDS_IN_MINUTE,
  STAKING_CONTRACT_ADDRESS,
  TZKT_EXPLORER_URL,
  ZERO_ADDRESS
} from '@app.config';
import styles from '@containers/staking/item/components/staking-details/staking-details.module.sass';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import s from '@styles/CommonContainer.module.sass';
import { useBakers, useIsLoading } from '@utils/dapp';
import { bigNumberToString, defined, fromDecimals, getDollarEquivalent, isNull } from '@utils/helpers';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useStakingDetailsViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const dAppLoading = useIsLoading();
  const { data: stakeItem, error: stakeItemError } = stakingItemStore.itemStore;
  const isLoading = (!stakeItem && !stakeItemError) || dAppLoading;
  const { data: bakers } = useBakers();

  const CardCellClassName = cx(s.cellCenter, s.cell, styles.vertical);

  // TODO: Remove Copy/past
  const [currentDelegate, nextDelegate] = useMemo(() => {
    if (stakeItem) {
      return [stakeItem.currentDelegate, stakeItem.nextDelegate].map(delegateAddress =>
        isNull(delegateAddress) || delegateAddress === ZERO_ADDRESS
          ? null
          : bakers.find(({ address }) => address === delegateAddress) ?? { address: defined(delegateAddress) }
      );
    }

    return [null, null];
  }, [stakeItem, bakers]);

  const depositTokenDecimals = stakeItem?.stakedToken.metadata.decimals ?? 0;
  const tvlDollarEquivalent =
    stakeItem && IS_NETWORK_MAINNET
      ? stakeItem.tvl.multipliedBy(stakeItem.depositExchangeRate).decimalPlaces(2).toFixed()
      : null;
  const dailyDistribution = stakeItem
    ? fromDecimals(new BigNumber(stakeItem.rewardPerSecond), stakeItem.rewardToken)
        .times(SECONDS_IN_MINUTE)
        .times(MINUTES_IN_HOUR)
        .times(HOURS_IN_DAY)
    : null;
  const distributionDollarEquivalent =
    stakeItem && IS_NETWORK_MAINNET
      ? getDollarEquivalent(
          bigNumberToString(defined(dailyDistribution)),
          bigNumberToString(stakeItem.earnExchangeRate)
        )
      : null;

  const dailyApr = stakeItem?.apr?.dividedBy(365).toFixed() ?? null;

  return {
    endTime: stakeItem ? new Date(stakeItem.endTime).getTime() : null,
    tvlDollarEquivalent,
    dailyDistribution,
    distributionDollarEquivalent,
    dailyApr,
    currentDelegate,
    nextDelegate,
    timelock: stakeItem ? Number(stakeItem.timelock) * MS_IN_SECOND : null,
    CardCellClassName,
    depositTokenDecimals,
    stakeUrl: stakeItem?.stakeUrl ?? `${TZKT_EXPLORER_URL}/${STAKING_CONTRACT_ADDRESS}`,
    stakeItem,
    isLoading
  };
};
