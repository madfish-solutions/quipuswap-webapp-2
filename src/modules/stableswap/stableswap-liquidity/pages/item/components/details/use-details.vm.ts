import cx from 'classnames';

import { useReady } from '@providers/use-dapp';
import { getTokenSymbol, isExist } from '@shared/helpers';
import commonContainerStyles from '@styles/CommonContainer.module.scss';

import { useStableswapItemStore } from '../../../../../hooks';
import styles from './details.module.scss';

const DEFAULT_DECIMALS = 2;

export const useDetailsViewModel = () => {
  const dAppReady = useReady();
  const { itemStore } = useStableswapItemStore();
  const { model: item, isLoading: isDataLoading, isInitialized: isDataInitialized } = itemStore;

  const isLoading = isDataLoading || !isDataInitialized || !dAppReady;
  const cardCellClassName = cx(commonContainerStyles.cellCenter, commonContainerStyles.cell, styles.vertical);

  if (isExist(item)) {
    const { providersFee, stakersFee, devFee, interfaceFee, totalLpSupply, tvlInUsd, poolContractUrl, tokensInfo } =
      item;

    const pieChartData = tokensInfo.map(({ token, reserves }) => ({
      value: reserves.decimalPlaces(DEFAULT_DECIMALS).toNumber(),
      tokenSymbol: getTokenSymbol(token)
    }));

    return {
      isLoading,
      cardCellClassName,
      tvlInUsd,
      totalLpSupply,
      feesRate: providersFee.plus(stakersFee.plus(devFee.plus(interfaceFee))),
      apr: null,
      pieChartData,
      weeklyVolume: null,
      poolContractUrl
    };
  }

  return {
    isLoading,
    cardCellClassName,
    tvlInUsd: null,
    totalLpSupply: null,
    feesRate: null,
    apr: null,
    pieChartData: [],
    weeklyVolume: null,
    poolContractUrl: undefined
  };
};
