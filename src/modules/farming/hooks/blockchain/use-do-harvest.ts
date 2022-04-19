import { useCallback } from 'react';

import { harvestAssetsApi } from '@modules/farming/api';
import { FarmingItem } from '@modules/farming/interfaces';
import { useRootStore } from '@providers/root-store-provider';
import { defined } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';

export const useDoHarvest = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();

  const doHarvest = useCallback(
    async (farmingItem: FarmingItem) => {
      const logData = { harvestAll: { farmingId: farmingItem.id.toFixed() } };

      try {
        amplitudeService.logEvent('HARVEST', logData);
        const operation = await harvestAssetsApi(
          defined(rootStore.tezos),
          farmingItem.id,
          defined(rootStore.authStore.accountPkh)
        );

        await confirmOperation(operation.opHash, { message: 'Harvest successful' });
        amplitudeService.logEvent('HARVEST_SUCCESS', logData);
      } catch (error) {
        showErrorToast(error as Error);
        amplitudeService.logEvent('HARVEST_FAILED', { ...logData, error });
      }
    },
    [rootStore.authStore.accountPkh, rootStore.tezos, showErrorToast, confirmOperation]
  );

  return { doHarvest };
};
