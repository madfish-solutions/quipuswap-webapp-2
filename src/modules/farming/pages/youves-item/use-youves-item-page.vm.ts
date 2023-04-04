import { useEffect, useRef } from 'react';

import { useParams } from 'react-router-dom';

import { useFarmingYouvesItemStore } from '@modules/farming/hooks';
import { useGetYouvesFarmingItem } from '@modules/farming/hooks/loaders/use-get-youves-farming-item';
import { useReady } from '@providers/use-dapp';
import {
  getTokensNames,
  isEmptyArray,
  isNotFoundError,
  isNull,
  isUndefined,
  useRedirectionCallback
} from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { Nullable, Token } from '@shared/types';
import { useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { makeNotFoundPageUrl, mapFarmVersion } from '../../helpers';

const DEFAULT_TOKENS: Token[] = [];

export const useYouvesItemPageViewModel = (): { title: string } => {
  const { t } = useTranslation();
  const { accountPkh } = useAuthStore();
  const dAppReady = useReady();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);

  const { id, version } = useParams();
  const { showErrorToast } = useToasts();
  const redirectToNotFoundPage = useRedirectionCallback(makeNotFoundPageUrl);

  const { getFarmingItem } = useGetYouvesFarmingItem();
  const farmingYouvesItemStore = useFarmingYouvesItemStore();
  const { item, itemApiError } = farmingYouvesItemStore;
  const tokens = item?.tokens ?? DEFAULT_TOKENS;

  /*
    Load Farming Item
   */
  useEffect(() => {
    if ((!dAppReady || isUndefined(id)) && prevAccountPkhRef.current === accountPkh) {
      return;
    }

    void getFarmingItem(id, mapFarmVersion(version));
    prevAccountPkhRef.current = accountPkh;
  }, [getFarmingItem, dAppReady, id, version, accountPkh]);

  useEffect(() => {
    if (itemApiError && isNotFoundError(itemApiError)) {
      redirectToNotFoundPage();
    } else if (itemApiError) {
      showErrorToast(itemApiError);
    }
  }, [itemApiError, redirectToNotFoundPage, showErrorToast]);

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

  useEffect(() => {
    return () => {
      farmingYouvesItemStore.itemStore.resetData();
      farmingYouvesItemStore.stakesStore.resetData();
    };
  }, [farmingYouvesItemStore]);

  const title = t('farm|farmingTokens', { tokens: isEmptyArray(tokens) ? '...' : getTokensNames(tokens) });

  return {
    title
  };
};
