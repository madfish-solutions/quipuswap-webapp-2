import cx from 'classnames';

import { useReady } from '@providers/use-dapp';
import { getTokenSymbol, isExist } from '@shared/helpers';
import commonContainerStyles from '@styles/CommonContainer.module.scss';

import { useStableswapItemStore } from '../../../../../hooks';
import { TokenLockedProps } from '../token-locked';
import styles from './details.module.scss';

export const useDetailsVievModel = () => {
  const dAppReady = useReady();
  const { itemStore } = useStableswapItemStore();

  const { data: item, isLoading: isDataLoading, isInitialized: isDataInitialized } = itemStore;

  const isLoading = isDataLoading || !isDataInitialized || !dAppReady;
  const CardCellClassName = cx(commonContainerStyles.cellCenter, commonContainerStyles.cell, styles.vertical);
  let tokensLockedData: Array<TokenLockedProps> = [];

  if (isExist(item)) {
    tokensLockedData = item.tokensInfo.map(({ token, reserves }) => ({
      tokenSymbol: getTokenSymbol(token),
      amount: reserves,
      className: CardCellClassName,
      isLoading
    }));

    return {
      ...item,
      CardCellClassName,
      isLoading,
      tokensLockedData
    };
  }

  return {
    id: null,
    contractAddress: null,
    tokensInfo: null,
    totalLpSupply: null,
    tvlInUsd: null,
    poolContractUrl: undefined,
    stableswapItemUrl: null,
    isWhitelisted: null,
    liquidityProvidersFee: null,
    stakersFee: null,
    interfaceFee: null,
    devFee: null,
    CardCellClassName,
    isLoading,
    tokensLockedData
  };
};
