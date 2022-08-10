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
    const tokensLockedData = item.tokensInfo.map(({ token, reserves, exchangeRate }) => ({
      tokenSymbol: getTokenSymbol(token),
      amount: reserves,
      className: cardCellClassName,
      isLoading,
      tooltipContent: t('stableswap|tokenAmountLocked', { tokenName: getTokenSymbol(token) }),
      dollarEquivalent: reserves.multipliedBy(exchangeRate)
    }));

    return {
      ...item,
      providersFee: item.providersFee,
      devFee: item.devFee,
      interfaceFee: item.interfaceFee,
      stakersFee: item.stakersFee,
      poolId: item.poolId.toFixed(),
      cardCellClassName,
      isLoading,
      tokensLockedData
    };
  }

  return {
    isLoading,
    cardCellClassName,
    poolId: null,
    tokensInfo: null,
    totalLpSupply: null,
    tvlInUsd: null,
    contractAddress: null,
    stableswapItemUrl: null,
    isWhitelisted: null,
    providersFee: null,
    stakersFee: null,
    interfaceFee: null,
    poolContractUrl: undefined,
    devFee: null,
    tokensLockedData: []
  };
};
