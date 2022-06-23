import { useEffect, useRef } from 'react';

import { BigNumber } from 'bignumber.js';
import { useParams } from 'react-router-dom';

import { YOUVES_FARMINGS } from '@config/config';
import { useFarmingItemStore } from '@modules/farming/hooks';
import { useGetFarmingItem } from '@modules/farming/hooks/loaders/use-get-farming-item';
import { useAccountPkh, useReady } from '@providers/use-dapp';
import { DashPlug } from '@shared/components';
import { getTokensNames, isNull, isUndefined } from '@shared/helpers';
import { Nullable } from '@shared/types';
import { useTranslation } from '@translation';

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
      return `Farming ${getTokensNames(farmingItem.tokens)}`;
    }

    if (!isLoading && isNull(farmingItem)) {
      return t('farm|Failed to load farming');
    }

    return <DashPlug animation={true} className={styles.titleLoader} zoom={1.45} />;
  };

  const isYouves = YOUVES_FARMINGS.includes(`${farmingItem?.id}`);

  return { isLoading, farmingItem, getTitle, isYouves };
};
