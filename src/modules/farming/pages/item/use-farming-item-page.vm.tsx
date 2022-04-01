import { useEffect, useRef } from 'react';

import { BigNumber } from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { useParams } from 'react-router-dom';

import { useFarmingItemStore } from '@modules/farming/hooks';
import { useGetFarmingItem } from '@modules/farming/hooks/loaders/use-get-farming-item';
import { useAccountPkh, useReady } from '@providers/use-dapp';
import { DashPlug } from '@shared/components';
import { getTokensName, isNull, isUndefined } from '@shared/helpers';
import { Nullable } from '@shared/types';

import styles from './farming-item.page.module.scss';

export const useFarmingItemPageViewModel = () => {
  const { t } = useTranslation(['common', 'farm']);
  const farmingItemStore = useFarmingItemStore();
  const dAppReady = useReady();
  const { getFarmingItem } = useGetFarmingItem();
  const accountPkh = useAccountPkh();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);
  const params = useParams();

  const rawStakeId = params.farmId;
  // eslint-disable-next-line no-console
  console.log(rawStakeId);
  /*
   Load data
  */
  useEffect(() => {
    if ((!dAppReady || isUndefined(rawStakeId)) && prevAccountPkhRef.current === accountPkh) {
      return;
    }
    void getFarmingItem(new BigNumber(`${rawStakeId}`));
    prevAccountPkhRef.current = accountPkh;
  }, [getFarmingItem, dAppReady, rawStakeId, accountPkh]);

  useEffect(() => {
    if (isNull(farmingItemStore)) {
      return;
    }

    farmingItemStore.makePendingRewardsLiveable();

    return () => farmingItemStore.clearIntervals();
  }, [farmingItemStore]);

  const { data: farmingItem, isLoading: dataLoading, isInitialized: dataInitialized } = farmingItemStore.itemStore;
  const isLoading = dataLoading || !dataInitialized || !dAppReady;

  const getTitle = () => {
    if (farmingItem) {
      return `Farming ${getTokensName(farmingItem.tokenA, farmingItem.tokenB)}`;
    }

    if (!isLoading && isNull(farmingItem)) {
      return t('farm|Failed to load farming');
    }

    return <DashPlug animation={true} className={styles.titleLoader} zoom={1.45} />;
  };

  return { isLoading, farmingItem, getTitle };
};
