import { useCallback } from 'react';

import { harvestAllAssets } from '@modules/farming/api';
import { useRootStore } from '@providers/root-store-provider';
import { defined } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { useHarvestReadyFarmsIds } from '../use-harvest-ready-farms-ids';
import { useRewards } from '../use-rewards';

export const useDoHarvestAll = () => {
  const { t } = useTranslation();
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();
  const { getHarvestReadyFarmsIds } = useHarvestReadyFarmsIds();
  const { claimablePendingRewardsInUsd } = useRewards();

  const doHarvestAll = useCallback(async () => {
    const fullClaimableRewardsFarmIds = getHarvestReadyFarmsIds();
    const logData = {
      harvestAll: {
        farmingIds: fullClaimableRewardsFarmIds,
        rewardsInUsd: defined(claimablePendingRewardsInUsd).toNumber()
      }
    };

    try {
      amplitudeService.logEvent('HARVEST_ALL', logData);
      const operation = await harvestAllAssets(
        defined(rootStore.tezos),
        fullClaimableRewardsFarmIds,
        defined(rootStore.authStore.accountPkh)
      );

      await confirmOperation(operation.opHash, { message: t('farm|Stake successful') });
      amplitudeService.logEvent('HARVEST_ALL_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);
      amplitudeService.logEvent('HARVEST_ALL_FAILED', { ...logData, error });
    }
  }, [
    getHarvestReadyFarmsIds,
    claimablePendingRewardsInUsd,
    rootStore.tezos,
    rootStore.authStore.accountPkh,
    confirmOperation,
    t,
    showErrorToast
  ]);

  return { doHarvestAll };
};
