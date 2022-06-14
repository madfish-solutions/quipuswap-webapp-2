import cx from 'classnames';

import { useReady } from '@providers/use-dapp';
import { getTokenSymbol, isExist } from '@shared/helpers';
import commonContainerStyles from '@styles/CommonContainer.module.scss';

import { useStableswapItemStore } from '../../../../../hooks';
import styles from './details.module.scss';

export const useDetailsVievModel = () => {
  const dAppReady = useReady();
  const { itemStore } = useStableswapItemStore();
  const { data: item, isLoading: isDataLoading, isInitialized: isDataInitialized } = itemStore;

  const isLoading = isDataLoading || !isDataInitialized || !dAppReady;
  const cardCellClassName = cx(commonContainerStyles.cellCenter, commonContainerStyles.cell, styles.vertical);

  if (isExist(item)) {
    const tokensLockedData = item.tokensInfo.map(({ token, reserves, exchangeRate }) => ({
      tokenSymbol: getTokenSymbol(token),
      amount: reserves,
      className: cardCellClassName,
      isLoading,
      dollarEquivalent: reserves.multipliedBy(exchangeRate)
    }));

    return {
      ...item,
      cardCellClassName,
      isLoading,
      tokensLockedData
    };
  }

  return {
    isLoading,
    cardCellClassName,
    id: null,
    tokensInfo: null,
    totalLpSupply: null,
    tvlInUsd: null,
    contractAddress: null,
    stableswapItemUrl: null,
    isWhitelisted: null,
    liquidityProvidersFee: null,
    stakersFee: null,
    interfaceFee: null,
    poolContractUrl: undefined,
    devFee: null,
    tokensLockedData: []
  };
};
