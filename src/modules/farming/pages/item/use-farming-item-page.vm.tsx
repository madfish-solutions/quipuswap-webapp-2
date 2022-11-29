import { useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { YOUVES_FARMINGS } from '@config/config';
import { makeNotFoundPageUrl } from '@modules/farming/helpers';
import { useFarmingItemStore } from '@modules/farming/hooks';
import { useGetFarmingItem } from '@modules/farming/hooks/loaders/use-get-farming-item';
import { useAccountPkh, useReady } from '@providers/use-dapp';
import { DashPlug } from '@shared/components';
import { getTokensNames, isNull, isUndefined, useRedirectionCallback } from '@shared/helpers';
import { useTranslation } from '@translation';

import { FarmVersion } from '../../interfaces';
import styles from './farming-item.page.module.scss';

export const useFarmingItemPageViewModel = () => {
  const { t } = useTranslation(['common', 'farm']);
  const farmingItemStore = useFarmingItemStore();
  const dAppReady = useReady();
  const { getFarmingItem } = useGetFarmingItem();
  const accountPkh = useAccountPkh();
  const { id: rawStakeId } = useParams();
  const redirectToNotFoundPage = useRedirectionCallback(makeNotFoundPageUrl);

  /*
    Load data
  */
  useEffect(() => {
    (async () => {
      if (!dAppReady || isUndefined(rawStakeId)) {
        return;
      }
      await getFarmingItem(rawStakeId, FarmVersion.v1, true);
    })();
  }, [getFarmingItem, dAppReady, rawStakeId, accountPkh]);

  useEffect(() => {
    if (isNull(farmingItemStore)) {
      return;
    }

    farmingItemStore.makePendingRewardsLiveable();

    return () => farmingItemStore.clearIntervals();
  }, [farmingItemStore]);

  const { isLoading: dataLoading, isInitialized: dataInitialized } = farmingItemStore.itemStore;
  const farmingItem = farmingItemStore.item;
  const itemApiError = farmingItemStore.itemApiError;

  const isLoading = dataLoading || !dataInitialized || !dAppReady;

  useEffect(() => {
    // TODO: https://madfish.atlassian.net/browse/QUIPU-701
    if (itemApiError) {
      redirectToNotFoundPage();
    }
  }, [itemApiError, redirectToNotFoundPage]);

  const getTitle = () => {
    if (farmingItem) {
      return `Farming ${getTokensNames(farmingItem.tokens)}`;
    }

    if (!isLoading && isNull(farmingItem)) {
      return t('farm|Failed to load farming');
    }

    return <DashPlug animation={true} className={styles.titleLoader} zoom={1.45} />;
  };

  const isYouves = YOUVES_FARMINGS.includes(`${farmingItem?.id}`);

  return { isLoading, farmingItem, title: getTitle(), isYouves };
};
