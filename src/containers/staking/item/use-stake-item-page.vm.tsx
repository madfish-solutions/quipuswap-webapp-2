import { useEffect } from 'react';

import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { getUserTokenBalance } from '@api/get-user-balance';
import { getStakingListApi } from '@api/staking';
import { DashPlug } from '@components/ui/dash-plug';
import stakingPageStyles from '@containers/staking/item/staking-item.page.module.sass';
import { useAuthStore } from '@hooks/stores/use-auth-store';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { useStakingListStore } from '@hooks/stores/use-staking-list-store';
import { useToasts } from '@hooks/use-toasts';
import { useRootStore } from '@providers/RootStoreProvider';
import { useIsLoading } from '@utils/dapp';
import { isNull, isUndefined } from '@utils/helpers';

export const useStakeItemPageViewModel = () => {
  const router = useRouter();
  const rootStore = useRootStore();
  const authStore = useAuthStore();
  const { showErrorToast } = useToasts();
  const { t } = useTranslation(['common', 'stake']);
  const stakingListStore = useStakingListStore();
  const stakingItemStore = useStakingItemStore();
  const isLoading = useIsLoading();

  /*
   Load data
  */
  useEffect(() => {
    const load = async () => {
      const stakeId = router.query['id'];
      if (rootStore.tezos && authStore.accountPkh && !isLoading && !isUndefined(stakeId)) {
        try {
          stakingListStore.list.startLoading();
          const rowList = await getStakingListApi(authStore.accountPkh);
          stakingListStore.list.setData(rowList);
          const stakeItem = stakingItemStore.findStakeItem(new BigNumber(`${stakeId}`));
          const balance = await getUserTokenBalance(rootStore.tezos, authStore.accountPkh, stakeItem.tokenA);
          stakingItemStore.setAvailableBalance(balance);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log('error', error);
          showErrorToast(error as Error);
        } finally {
          stakingListStore.list.finishLoading();
        }
      }
    };

    void load();
  }, [
    stakingItemStore,
    authStore.accountPkh,
    isLoading,
    router.query,
    stakingListStore.list,
    rootStore.tezos,
    showErrorToast
  ]);

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
