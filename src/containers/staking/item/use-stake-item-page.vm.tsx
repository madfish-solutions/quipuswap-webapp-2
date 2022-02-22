import { useEffect, useMemo } from 'react';

import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { MS_IN_SECOND } from '@app.config';
import { DashPlug } from '@components/ui/dash-plug';
import stakingPageStyles from '@containers/staking/item/staking-item.page.module.sass';
import { useAuthStore } from '@hooks/stores/use-auth-store';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { useStakingListStore } from '@hooks/stores/use-staking-list-store';
import { useBakers, useIsLoading } from '@utils/dapp';
import { isNull, isUndefined } from '@utils/helpers';

const mockLastStaked = Date.now();

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useStakeItemPageViewModel = () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const { t } = useTranslation(['common', 'stake']);
  const stakingListStore = useStakingListStore();
  const stakingItemStore = useStakingItemStore();
  const isLoading = useIsLoading();
  const { data: bakers, loading: bakersLoading } = useBakers();

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
    if (stakeItem) {
      return stakeItem.stakedToken.metadata.symbol;
    }

    if (!isLoading && isNull(stakeItem)) {
      return t('stake|Failed to load staking');
    }

    return <DashPlug animation={true} className={stakingPageStyles.titleLoader} zoom={1.45} />;
  };

  const [currentDelegate, nextDelegate, myDelegate] = useMemo(() => {
    if (stakeItem) {
      const { currentDelegate, nextDelegate, myDelegate } = stakeItem;

      return [currentDelegate, nextDelegate, myDelegate].map(
        delegateAddress => bakers.find(({ address }) => address === delegateAddress) ?? null
      );
    }

    return [null, null, null];
  }, [stakeItem, bakers]);

  const delegatesLoading = bakersLoading || !stakeItem;
  const endTimestamp = stakeItem ? mockLastStaked + stakeItem.timelock * MS_IN_SECOND : null;

  return {
    currentDelegate,
    endTimestamp,
    isLoading,
    myDelegate,
    nextDelegate,
    stakeItem,
    getTitle,
    delegatesLoading
  };
};
