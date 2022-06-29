import cx from 'classnames';

import { useReady } from '@providers/use-dapp';
import { getTokenSymbol, isExist } from '@shared/helpers';
import { ActiveStatus } from '@shared/types';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { useStableDividendsItemStore } from '../../../hooks';
import styles from './details.module.scss';

export const useDetailsVievModel = () => {
  const { t } = useTranslation();
  const dAppReady = useReady();
  const { itemStore } = useStableDividendsItemStore();
  const { data: item, isLoading: isDataLoading, isInitialized: isDataInitialized } = itemStore;

  const isLoading = isDataLoading || !isDataInitialized || !dAppReady;
  const cardCellClassName = cx(commonContainerStyles.cellCenter, commonContainerStyles.cell, styles.vertical);

  if (isExist(item)) {
    const { tvl, apr, farmContractUrl, stakedToken, stakedTokenExchangeRate, isWhitelisted } = item;

    const whitelistedTag = isWhitelisted
      ? {
          status: ActiveStatus.ACTIVE,
          label: t('common|whiteListed')
        }
      : null;

    return {
      isLoading,
      cardCellClassName,
      tvl,
      apr,
      whitelistedTag,
      farmContractUrl,
      dollarEquivalent: tvl.multipliedBy(stakedTokenExchangeRate),
      tokenSymbol: getTokenSymbol(stakedToken)
    };
  }

  return {
    isLoading,
    cardCellClassName,
    tvl: null,
    apr: null,
    farmContractUrl: '',
    dollarEquivalent: null,
    tokenSymbol: null
  };
};
