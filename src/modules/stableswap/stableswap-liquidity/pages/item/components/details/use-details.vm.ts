import cx from 'classnames';

import { EMPTY_STRING } from '@config/constants';
import { useReady } from '@providers/use-dapp';
import { getTokenSymbol, isExist } from '@shared/helpers';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from './details.module.scss';
import { useStableswapItemStore } from '../../../../../hooks';

const DEFAULT_DECIMALS = 2;
const DEFAULT_COUNT_OF_TOKENS_IN_POOL = 2;

export const useDetailsViewModel = () => {
  const { t } = useTranslation();
  const dAppReady = useReady();
  const { itemStore } = useStableswapItemStore();
  const { model: item, isLoading: isDataLoading, isInitialized: isDataInitialized } = itemStore;

  const isLoading = isDataLoading || !isDataInitialized || !dAppReady;
  const cardCellClassName = cx(commonContainerStyles.cellCenter, commonContainerStyles.cell, styles.vertical);

  if (isExist(item)) {
    const { providersFee, stakersFee, devFee, interfaceFee, totalLpSupply, tvlInUsd, poolContractUrl, tokensInfo } =
      item;

    const poolContractButtonText =
      tokensInfo.length > DEFAULT_COUNT_OF_TOKENS_IN_POOL ? t('liquidity|Pool Contract') : t('liquidity|Pair Contract');

    const pieChartData = tokensInfo.map(({ token, reserves }) => {
      const tokenValue = reserves.decimalPlaces(DEFAULT_DECIMALS).toNumber();

      return {
        value: tokenValue,
        tokenValue,
        tokenSymbol: getTokenSymbol(token)
      };
    });

    return {
      isLoading,
      cardCellClassName,
      tvlInUsd,
      totalLpSupply,
      feesRate: providersFee.plus(stakersFee.plus(devFee.plus(interfaceFee))),
      apr: null,
      pieChartData,
      weeklyVolume: null,
      poolContractUrl,
      poolContractButtonText
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
    poolContractUrl: undefined,
    poolContractButtonText: EMPTY_STRING
  };
};
