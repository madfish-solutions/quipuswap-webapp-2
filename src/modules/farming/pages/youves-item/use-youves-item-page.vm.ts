import { useCallback, useEffect, useRef } from 'react';

import { useParams } from 'react-router-dom';

import { useFarmingYouvesItemStore } from '@modules/farming/hooks';
import { useGetYouvesFarmingItem } from '@modules/farming/hooks/loaders/use-get-youves-farming-item';
import { useReady } from '@providers/use-dapp';
import { getTokensNames, isEmptyArray, isNull, isUndefined } from '@shared/helpers';
import { useAuthStore, useOnBlock } from '@shared/hooks';
import { Token } from '@shared/types';
import { useTranslation } from '@translation';

const DEFAULT_TOKENS: Token[] = [];

export const useYouvesItemPageViewModel = (): { title: string } => {
  const { t } = useTranslation();
  const { accountPkh } = useAuthStore();
  const dAppReady = useReady();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);

  const { id } = useParams();

  const { getFarmingItem } = useGetYouvesFarmingItem();
  const farmingYouvesItemStore = useFarmingYouvesItemStore();
  const { item } = farmingYouvesItemStore;
  const tokens = item?.tokens ?? DEFAULT_TOKENS;

  /*
    Load Farming Item
   */
  useEffect(() => {
    if ((!dAppReady || isUndefined(id)) && prevAccountPkhRef.current === accountPkh) {
      return;
    }

    void getFarmingItem(id);
    prevAccountPkhRef.current = accountPkh;
  }, [getFarmingItem, dAppReady, id, accountPkh]);

  /*
    Liveable Rewards.
   */
  useEffect(() => {
    if (isNull(farmingYouvesItemStore)) {
      return;
    }

    void farmingYouvesItemStore.makePendingRewardsLiveable();

    return () => farmingYouvesItemStore.clearIntervals();
  }, [farmingYouvesItemStore]);

  const updateFarmingItem = useCallback(() => {
    if (isUndefined(id)) {
      return;
    }

    void getFarmingItem(id);
  }, [getFarmingItem, id]);

  useOnBlock(updateFarmingItem);

  const title = t('farm|farmingTokens', { tokens: isEmptyArray(tokens) ? '...' : getTokensNames(tokens) });

  return {
    title
  };
};
