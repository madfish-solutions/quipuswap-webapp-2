import { useEffect, useRef } from 'react';

import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { DashPlug } from '@components/ui/dash-plug';
import { useGetStakingItem } from '@containers/staking/hooks/use-get-staking-item';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { useAccountPkh, useIsLoading } from '@utils/dapp';
import { getTokensName, isNull, isUndefined } from '@utils/helpers';
import { Nullable } from '@utils/types';

import stakingPageStyles from './staking-item.page.module.sass';

export const useStakeItemPageViewModel = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'stake']);
  const stakingItemStore = useStakingItemStore();
  const dAppLoading = useIsLoading();
  const { getStakingItem } = useGetStakingItem();
  const accountPkh = useAccountPkh();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);

  /*
   Load data
  */
  useEffect(() => {
    const stakeId = router.query['id'];
    if ((dAppLoading || isUndefined(stakeId)) && prevAccountPkhRef.current === accountPkh) {
      return;
    }
    void getStakingItem(new BigNumber(`${stakeId}`));
    prevAccountPkhRef.current = accountPkh;
  }, [getStakingItem, dAppLoading, router.query, accountPkh]);

  const { data: stakeItem, isLoading: dataLoading, isInitialized: dataInitialized } = stakingItemStore.itemStore;
  const isLoading = dataLoading || !dataInitialized || dAppLoading;

  const getTitle = () => {
    if (stakeItem) {
      return `Staking ${getTokensName(stakeItem.tokenA, stakeItem.tokenB)}`;
    }

    if (!isLoading && isNull(stakeItem)) {
      return t('stake|Failed to load staking');
    }

    return <DashPlug animation={true} className={stakingPageStyles.titleLoader} zoom={1.45} />;
  };

  return { isLoading, stakeItem, getTitle };
};
