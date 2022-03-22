import { useEffect, useRef } from 'react';

import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { DashPlug } from '@components/ui/dash-plug';
import { useGetFarmingItem } from '@containers/farming/hooks/use-get-farming-item';
import { useFarmingItemStore } from '@hooks/stores/use-farming-item-store';
import { useAccountPkh, useReady } from '@utils/dapp';
import { getTokensName, isNull, isUndefined } from '@utils/helpers';
import { Nullable } from '@utils/types';

import stakingPageStyles from './farming-item.page.module.sass';

export const useFarmingItemPageViewModel = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'farm']);
  const farmingItemStore = useFarmingItemStore();
  const dAppReady = useReady();
  const { getFarmingItem } = useGetFarmingItem();
  const accountPkh = useAccountPkh();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);
  const rawStakeId = router.query['id'];

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

  const { data: stakeItem, isLoading: dataLoading, isInitialized: dataInitialized } = farmingItemStore.itemStore;
  const isLoading = dataLoading || !dataInitialized || !dAppReady;

  const getTitle = () => {
    if (stakeItem) {
      return `Farming ${getTokensName(stakeItem.tokenA, stakeItem.tokenB)}`;
    }

    if (!isLoading && isNull(stakeItem)) {
      return t('farm|Failed to load farming');
    }

    return <DashPlug animation={true} className={stakingPageStyles.titleLoader} zoom={1.45} />;
  };

  return { isLoading, stakeItem, getTitle };
};
