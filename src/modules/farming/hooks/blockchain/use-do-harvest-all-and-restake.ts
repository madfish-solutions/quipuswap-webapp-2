import { useCallback } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { defined } from '@shared/helpers';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { harvestAllAndRestake } from '../../api';
import { useFarmingListStore } from '../stores';
import { useStakedOnlyFarmIds } from '../use-staked-only-farm-ids';

export const useDoHarvestAllAndRestake = () => {
  const { t } = useTranslation();
  const rootStore = useRootStore();
  const { showErrorToast } = useToasts();
  const farmingListStore = useFarmingListStore();
  const confirmOperation = useConfirmOperation();
  const { getStakedOnlyFarmIds } = useStakedOnlyFarmIds();

  const doHarvestAllAndRestake = useCallback(async () => {
    const rewardsInQuipu = await farmingListStore.getQuipuPendingRewards();
    const stakedOnlyFarmIds = getStakedOnlyFarmIds();

    try {
      const operation = await harvestAllAndRestake(
        defined(rootStore.tezos),
        stakedOnlyFarmIds,
        defined(rootStore.authStore.accountPkh),
        rewardsInQuipu
      );

      await confirmOperation(operation.opHash, { message: t('farm|Stake successful') });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
      showErrorToast(error as Error);
    }
  }, [
    farmingListStore,
    getStakedOnlyFarmIds,
    rootStore.tezos,
    rootStore.authStore.accountPkh,
    confirmOperation,
    t,
    showErrorToast
  ]);

  return { doHarvestAllAndRestake };
};
