import cx from 'classnames';

import { IS_NETWORK_MAINNET } from '@config/config';
import { DAYS_IN_YEAR, MS_IN_SECOND, NO_TIMELOCK_VALUE } from '@config/constants';
import { FARMING_CONTRACT_ADDRESS, TZKT_EXPLORER_URL } from '@config/enviroment';
import { getDailyDistribution } from '@modules/farming/helpers';
import { useFarmingItemStore } from '@modules/farming/hooks';
import { useBakers } from '@providers/dapp-bakers';
import { useReady } from '@providers/use-dapp';
import { bigNumberToString, getTokenSymbol, getDollarEquivalent, getTimeLockDescription } from '@shared/helpers';
import { ActiveStatus } from '@shared/types';
import s from '@styles/CommonContainer.module.scss';

import { canDelegate, makeBaker } from '../../helpers';
import styles from './farming-details.module.scss';

const NO_WITHDRAWAL_FEE_VALUE = 0;

export const useFarmingDetailsViewModel = () => {
  const farmingItemStore = useFarmingItemStore();
  const dAppReady = useReady();
  const {
    data: farmingItem,
    isLoading: dataLoading,
    isInitialized: dataInitialized,
    error
  } = farmingItemStore.itemStore;
  const isLoading = dataLoading || !dataInitialized || !dAppReady;
  const { data: bakers } = useBakers();

  const CardCellClassName = cx(s.cellCenter, s.cell, styles.vertical);

  if (!farmingItem) {
    return {
      shouldShowDelegates: true,
      shouldShowLockPeriod: true,
      shouldShowWithdrawalFee: true,
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
      stakeStatus: ActiveStatus.DISABLED
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
  } = farmingItem;

  const dailyDistribution = bigNumberToString(getDailyDistribution(rewardPerSecond, rewardToken));
  const distributionDollarEquivalent = IS_NETWORK_MAINNET
    ? getDollarEquivalent(dailyDistribution, earnExchangeRate)
    : null;
  const currentDelegate = makeBaker(farmingItem.currentDelegate, bakers);
  const nextDelegate = makeBaker(farmingItem.nextDelegate, bakers);

  const timeLockLabel = getTimeLockDescription(timelock);

  const shouldShowLockPeriod = timelock !== NO_TIMELOCK_VALUE;
  const shouldShowWithdrawalFee = !withdrawalFee?.isEqualTo(NO_WITHDRAWAL_FEE_VALUE);

  const shouldShowTags = shouldShowLockPeriod || shouldShowWithdrawalFee;

  return {
    shouldShowDelegates: canDelegate(farmingItem),
    shouldShowLockPeriod,
    shouldShowWithdrawalFee,
    endTime: new Date(endTime).getTime(),
    tvlDollarEquivalent: tvlDollarEquivalent && bigNumberToString(tvlDollarEquivalent),
    dailyDistribution,
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
