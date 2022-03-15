import BigNumber from 'bignumber.js';
import cx from 'classnames';

import {
  DAYS_IN_YEAR,
  IS_NETWORK_MAINNET,
  MS_IN_SECOND,
  SECONDS_IN_DAY,
  STAKING_CONTRACT_ADDRESS,
  TZKT_EXPLORER_URL
} from '@app.config';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { ActiveStatus } from '@interfaces/active-statuts-enum';
import s from '@styles/CommonContainer.module.sass';
import { useBakers, useIsLoading } from '@utils/dapp';
import { bigNumberToString, fromDecimals, getDollarEquivalent, getTokenSymbol } from '@utils/helpers';

import { canDelegate, makeBaker } from '../../helpers';
import styles from './staking-details.module.sass';

const NO_WITHDRAWAL_FEE_VALUE = 0;
const NO_TIMELOCK_VALUE = '0';

export const useStakingDetailsViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const dAppLoading = useIsLoading();
  const { data: stakeItem, isLoading: dataLoading, isInitialized: dataInitialized, error } = stakingItemStore.itemStore;
  const isLoading = dataLoading || !dataInitialized || dAppLoading;
  const { data: bakers } = useBakers();

  const CardCellClassName = cx(s.cellCenter, s.cell, styles.vertical);

  if (!stakeItem) {
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
      CardCellClassName,
      depositTokenDecimals: 0,
      stakeUrl: `${TZKT_EXPLORER_URL}/${STAKING_CONTRACT_ADDRESS}`,
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
  } = stakeItem;

  const dailyDistribution = bigNumberToString(
    fromDecimals(rewardPerSecond.times(SECONDS_IN_DAY).integerValue(BigNumber.ROUND_DOWN), rewardToken)
  );
  const distributionDollarEquivalent = IS_NETWORK_MAINNET
    ? getDollarEquivalent(dailyDistribution, earnExchangeRate)
    : null;
  const currentDelegate = makeBaker(stakeItem.currentDelegate, bakers);
  const nextDelegate = makeBaker(stakeItem.nextDelegate, bakers);

  return {
    shouldShowDelegates: canDelegate(stakeItem),
    shouldShowLockPeriod: timelock !== NO_TIMELOCK_VALUE,
    shouldShowWithdrawalFee: !withdrawalFee?.isEqualTo(NO_WITHDRAWAL_FEE_VALUE),
    endTime: new Date(endTime).getTime(),
    tvlDollarEquivalent: tvlDollarEquivalent && bigNumberToString(tvlDollarEquivalent),
    dailyDistribution,
    distributionDollarEquivalent,
    apr: apr ? bigNumberToString(apr) : null,
    dailyApr: apr ? bigNumberToString(apr.dividedBy(DAYS_IN_YEAR)) : null,
    currentDelegate,
    nextDelegate,
    timelock: Number(timelock) * MS_IN_SECOND,
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
