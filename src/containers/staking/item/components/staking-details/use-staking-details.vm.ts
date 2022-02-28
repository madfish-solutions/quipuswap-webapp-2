import BigNumber from 'bignumber.js';
import cx from 'classnames';

import {
  DAYS_IN_YEAR,
  IS_NETWORK_MAINNET,
  MS_IN_SECOND,
  SECONDS_IN_DAY,
  STAKING_CONTRACT_ADDRESS,
  TZKT_EXPLORER_URL,
  USD_DECIMALS
} from '@app.config';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import s from '@styles/CommonContainer.module.sass';
import { useBakers, useIsLoading } from '@utils/dapp';
import { bigNumberToString, fromDecimals, getDollarEquivalent, getTokenSymbol } from '@utils/helpers';

import { makeBaker } from '../helpers';
import styles from './staking-details.module.sass';

export const useStakingDetailsViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const dAppLoading = useIsLoading();
  const { data: stakeItem, isLoading: dataLoading, isInitialized: dataInitialized, error } = stakingItemStore.itemStore;
  const isLoading = dataLoading || !dataInitialized || dAppLoading;
  const { data: bakers } = useBakers();

  const CardCellClassName = cx(s.cellCenter, s.cell, styles.vertical);

  if (!stakeItem) {
    return {
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
      isError: false
    };
  }

  const {
    apr,
    rewardToken,
    stakedToken,
    tvl,
    depositExchangeRate,
    earnExchangeRate,
    rewardPerSecond,
    endTime,
    timelock,
    stakeUrl,
    withdrawalFee,
    harvestFee,
    depositTokenUrl
  } = stakeItem;

  const tvlDollarEquivalent = IS_NETWORK_MAINNET
    ? bigNumberToString(tvl.multipliedBy(depositExchangeRate).decimalPlaces(USD_DECIMALS))
    : null;
  const dailyDistribution = bigNumberToString(
    fromDecimals(new BigNumber(rewardPerSecond), rewardToken).times(SECONDS_IN_DAY)
  );
  const distributionDollarEquivalent = IS_NETWORK_MAINNET
    ? getDollarEquivalent(dailyDistribution, bigNumberToString(earnExchangeRate))
    : null;
  const currentDelegate = makeBaker(stakeItem.currentDelegate, bakers);
  const nextDelegate = makeBaker(stakeItem.nextDelegate, bakers);

  return {
    endTime: new Date(endTime).getTime(),
    tvlDollarEquivalent,
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
    tvl: bigNumberToString(tvl),
    withdrawalFee,
    harvestFee,
    depositTokenUrl,
    isLoading,
    isError: Boolean(error)
  };
};
