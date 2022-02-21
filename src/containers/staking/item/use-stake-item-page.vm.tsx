import { useEffect } from 'react';

import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { DashPlug } from '@components/ui/dash-plug';
import stakingPageStyles from '@containers/staking/item/staking-item.page.module.sass';
import { useAuthStore } from '@hooks/stores/use-auth-store';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { useStakingListStore } from '@hooks/stores/use-staking-list-store';
import { useIsLoading } from '@utils/dapp';
import { isNull, isUndefined } from '@utils/helpers';

export const useStakeItemPageViewModel = () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const { t } = useTranslation(['common', 'stake']);
  const stakingListStore = useStakingListStore();
  const stakingItemStore = useStakingItemStore();
  const isLoading = useIsLoading();

  /*
   Load data
  */
  useEffect(() => {
    const load = async () => {
      if (!isLoading) {
        await stakingListStore.list.load();
        const stakeId = router.query['id'];
        if (!isUndefined(stakeId)) {
          await stakingItemStore.loadStakeItem(new BigNumber(`${stakeId}`));
        }
      }
    };

    void load();
  }, [stakingItemStore, authStore.accountPkh, isLoading, router.query, stakingListStore.list]);

  const { stakeItem } = stakingItemStore;

  const getTitle = () => {
    if (stakeItem?.tokenB) {
      return `Staking ${stakeItem.tokenA.metadata.symbol}/${stakeItem.tokenB.metadata.symbol}`;
    }

    if (stakeItem) {
      return `Staking ${stakeItem.tokenA.metadata.symbol}`;
    }

    if (!isLoading && isNull(stakeItem)) {
      return t('stake|Failed to load staking');
    }

    return <DashPlug animation={true} className={stakingPageStyles.titleLoader} zoom={1.45} />;
  };

  return { isLoading, stakeItem, getTitle };
};
