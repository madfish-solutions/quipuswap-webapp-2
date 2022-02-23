import { useEffect } from 'react';

import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { DashPlug } from '@components/ui/dash-plug';
import { useGetStakingItem } from '@containers/staking/hooks/use-get-staking-item';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { useIsLoading } from '@utils/dapp';
import { getTokensName, isNull, isUndefined } from '@utils/helpers';

import stakingPageStyles from './staking-item.page.module.sass';

export const useStakeItemPageViewModel = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'stake']);
  const stakingItemStore = useStakingItemStore();
  const dAppLoading = useIsLoading();
  const { getStakingItem } = useGetStakingItem();

  /*
   Load data
  */
  useEffect(() => {
    const stakeId = router.query['id'];
    if (dAppLoading || isUndefined(stakeId)) {
      return;
    }
    void getStakingItem(new BigNumber(`${stakeId}`));
  }, [getStakingItem, dAppLoading, router.query]);

  const { data: stakeItem, error: stakeItemError } = stakingItemStore.itemStore;
  const isLoading = (!stakeItem && !stakeItemError) || dAppLoading;

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
