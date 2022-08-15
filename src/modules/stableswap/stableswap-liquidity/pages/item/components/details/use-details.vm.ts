import cx from 'classnames';

import { useReady } from '@providers/use-dapp';
import { getTokenSymbol, isExist } from '@shared/helpers';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { useStableswapItemStore } from '../../../../../hooks';
import styles from './details.module.scss';

export const useDetailsViewModel = () => {
  const { t } = useTranslation();
  const dAppReady = useReady();
  const { itemStore } = useStableswapItemStore();
  const { model: item, isLoading: isDataLoading, isInitialized: isDataInitialized } = itemStore;

  const isLoading = isDataLoading || !isDataInitialized || !dAppReady;
  const cardCellClassName = cx(commonContainerStyles.cellCenter, commonContainerStyles.cell, styles.vertical);

  if (isExist(item)) {
    const { providersFee, stakersFee, devFee, interfaceFee, totalLpSupply, tvlInUsd } = item;

    const tokensLockedData = item.tokensInfo.map(({ token, reserves, exchangeRate }) => ({
      tokenSymbol: getTokenSymbol(token),
      amount: reserves,
      className: cardCellClassName,
      isLoading,
      tooltipContent: t('stableswap|tokenAmountLocked', { tokenName: getTokenSymbol(token) }),
      dollarEquivalent: reserves.multipliedBy(exchangeRate)
    }));

    return {
      tvlInUsd,
      isLoading,
      totalLpSupply,
      tokensLockedData,
      cardCellClassName,
      apr: null,
      weeklyVolume: null,
      feesRate: providersFee.plus(stakersFee.plus(devFee.plus(interfaceFee)))
    };
  }

  return {
    isLoading,
    cardCellClassName,
    apr: null,
    tvlInUsd: null,
    feesRate: null,
    weeklyVolume: null,
    totalLpSupply: null,
    tokensLockedData: []
  };
};
