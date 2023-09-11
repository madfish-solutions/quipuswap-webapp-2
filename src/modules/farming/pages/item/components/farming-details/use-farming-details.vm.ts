import cx from 'classnames';

import { IS_NETWORK_MAINNET } from '@config/config';
import { DAYS_IN_YEAR, MS_IN_SECOND, NO_TIMELOCK_VALUE, NO_WITHDRAWAL_FEE_VALUE } from '@config/constants';
import { FARMING_CONTRACT_ADDRESS, TZKT_EXPLORER_URL } from '@config/environment';
import { getFarmingLabel, getRealDailyDistribution } from '@modules/farming/helpers';
import { useFarmingItemStore } from '@modules/farming/hooks';
import { useBakers } from '@providers/dapp-bakers';
import { useReady } from '@providers/use-dapp';
import { bigNumberToString, getDollarEquivalent, getTimeLockDescription, getTokenSymbol } from '@shared/helpers';
import s from '@styles/CommonContainer.module.scss';

import styles from './farming-details.module.scss';
import { canDelegate, makeBaker } from '../../helpers';

export const useFarmingDetailsViewModel = () => {
  const farmingItemStore = useFarmingItemStore();
  const dAppReady = useReady();
  const { isLoading: dataLoading, isInitialized: dataInitialized, error } = farmingItemStore.itemStore;
  const { item } = farmingItemStore;
  const isLoading = dataLoading || !dataInitialized || !dAppReady;
  const { data: bakers } = useBakers();

  const CardCellClassName = cx(s.cellCenter, s.cell, styles.vertical);

  if (!item) {
    return {
      shouldShowDelegates: true,
      shouldShowLockPeriod: true,
      shouldShowWithdrawalFee: true,
      labels: [],
      endTime: null,
      tvlDollarEquivalent: null,
      dailyDistribution: null,
      distributionDollarEquivalent: null,
      apr: null,
      dailyApr: null,
      currentDelegate: null,
      nextDelegate: null,
      timelock: null,
      timeLockLabel: '',
      shouldShowTags: false,
      CardCellClassName,
      depositTokenDecimals: 0,
      stakeUrl: `${TZKT_EXPLORER_URL}/${FARMING_CONTRACT_ADDRESS}`,
      stakedTokenSymbol: null,
      rewardTokenSymbol: null,
      rewardTokenDecimals: 0,
      tvl: null,
      withdrawalFee: null,
      harvestFee: null,
      isLoading,
      isError: false,
      stakeStatus: undefined
    };
  }

  const {
    apr,
    rewardToken,
    stakedToken,
    tvlInUsd: tvlDollarEquivalent,
    tvlInStakedToken: tvl,
    earnExchangeRate,
    rewardPerSecond,
    endTime,
    timelock,
    stakeUrl,
    withdrawalFee,
    harvestFee,
    depositTokenUrl,
    stakeStatus
  } = item;

  const realDailyDistribution = bigNumberToString(getRealDailyDistribution(rewardPerSecond, rewardToken));
  const distributionDollarEquivalent = IS_NETWORK_MAINNET
    ? getDollarEquivalent(realDailyDistribution, earnExchangeRate)
    : null;
  const currentDelegate = makeBaker(item.currentDelegate, bakers);
  const nextDelegate = makeBaker(item.nextDelegate, bakers);

  const timeLockLabel = getTimeLockDescription(timelock);

  const shouldShowLockPeriod = timelock !== NO_TIMELOCK_VALUE;
  const shouldShowWithdrawalFee = !withdrawalFee?.isEqualTo(NO_WITHDRAWAL_FEE_VALUE);

  const labels = getFarmingLabel(item);

  const shouldShowTags = shouldShowLockPeriod || shouldShowWithdrawalFee;

  return {
    shouldShowDelegates: canDelegate(item),
    labels,
    shouldShowLockPeriod,
    shouldShowWithdrawalFee,
    endTime: new Date(endTime).getTime(),
    tvlDollarEquivalent: tvlDollarEquivalent && bigNumberToString(tvlDollarEquivalent),
    dailyDistribution: realDailyDistribution,
    distributionDollarEquivalent,
    apr: apr ? bigNumberToString(apr) : null,
    dailyApr: apr ? bigNumberToString(apr.dividedBy(DAYS_IN_YEAR)) : null,
    currentDelegate,
    nextDelegate,
    // TODO: Move it to mapping
    timelock: Number(timelock) * MS_IN_SECOND,
    timeLockLabel,
    shouldShowTags,
    CardCellClassName,
    depositTokenDecimals: stakedToken.metadata.decimals,
    stakeUrl,
    stakedTokenSymbol: getTokenSymbol(stakedToken),
    rewardTokenSymbol: getTokenSymbol(rewardToken),
    rewardTokenDecimals: rewardToken.metadata.decimals,
    tvl,
    withdrawalFee,
    harvestFee,
    depositTokenUrl,
    isLoading,
    isError: Boolean(error),
    stakeStatus
  };
};
