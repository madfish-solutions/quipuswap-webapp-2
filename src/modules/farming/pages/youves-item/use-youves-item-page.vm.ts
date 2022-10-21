import { useEffect, useRef } from 'react';

import { useParams } from 'react-router-dom';

import { useFarmingYouvesItemStore } from '@modules/farming/hooks';
import { useGetYouvesFarmingItem } from '@modules/farming/hooks/loaders/use-get-youves-farming-item';
import { useReady } from '@providers/use-dapp';
import { getTokensNames, isEmptyArray, isNull, isUndefined } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { Token } from '@shared/types';
import { useTranslation } from '@translation';

const DEFAULT_TOKENS: Token[] = [];

export const useYouvesItemPageViewModel = (): { title: string } => {
  const { t } = useTranslation();
  const { accountPkh } = useAuthStore();
  const dAppReady = useReady();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);

  const { contractAddress } = useParams();

  const { getFarmingItem } = useGetYouvesFarmingItem();
  const farmingYouvesItemStore = useFarmingYouvesItemStore();
  const { item } = farmingYouvesItemStore;
  const tokens = item?.tokens ?? DEFAULT_TOKENS;

  useEffect(() => {
    if ((!dAppReady || isUndefined(contractAddress)) && prevAccountPkhRef.current === accountPkh) {
      return;
    }

    void getFarmingItem(contractAddress);
    prevAccountPkhRef.current = accountPkh;
  }, [getFarmingItem, dAppReady, contractAddress, accountPkh]);

  /*
    Liveable Rewards
   */
  useEffect(() => {
    if (isNull(farmingYouvesItemStore)) {
      return;
    }

    void farmingYouvesItemStore.makePendingRewardsLiveable();

    return () => farmingYouvesItemStore.clearIntervals();
  }, [farmingYouvesItemStore]);

  /* eslint-disable no-console */
  useEffect(() => {
    console.log('rewards', {
      claimableRewards: farmingYouvesItemStore.claimableRewards?.toFixed(),
      longTermRewards: farmingYouvesItemStore.longTermRewards?.toFixed()
    });
  }, [farmingYouvesItemStore.claimableRewards, farmingYouvesItemStore.longTermRewards]);
  /* eslint-enable no-console */

  const title = t('farm|farmingTokens', { tokens: isEmptyArray(tokens) ? '...' : getTokensNames(tokens) });

  return {
    title
  };
};
