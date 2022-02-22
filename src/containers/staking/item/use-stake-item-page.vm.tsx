import { useEffect } from 'react';

import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { DashPlug } from '@components/ui/dash-plug';
import { useGetStakingItem } from '@containers/staking/hooks/use-get-staking-item';
import stakingPageStyles from '@containers/staking/item/staking-item.page.module.sass';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { useIsLoading } from '@utils/dapp';
import { isNull, isUndefined } from '@utils/helpers';

export const useStakeItemPageViewModel = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'stake']);
  const stakingItemStore = useStakingItemStore();
  const isLoading = useIsLoading();
  const { getStakingItem } = useGetStakingItem();

  /*
   Load data
  */
  useEffect(() => {
    const stakeId = router.query['id'];
    if (isLoading || isUndefined(stakeId)) {
      return;
    }
    void getStakingItem(new BigNumber(`${stakeId}`));
  }, [getStakingItem, isLoading, router.query]);

  const { data: stakeItem } = stakingItemStore.itemStore;

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
