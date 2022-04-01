import { useCallback } from 'react';

import { harvestAssetsApi } from '@modules/farming/api';
import { FarmingItem } from '@modules/farming/interfaces';
import { useRootStore } from '@providers/root-store-provider';
import { defined } from '@shared/helpers';
import { Nullable } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';

export const useDoHarvest = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();

  const doHarvest = useCallback(
    async (farmingItem: Nullable<FarmingItem>) => {
      try {
        const operation = await harvestAssetsApi(
          defined(rootStore.tezos),
          defined(farmingItem).id,
          defined(rootStore.authStore.accountPkh)
        );

        await confirmOperation(operation.opHash, { message: 'Harvest successful' });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error', error);
        showErrorToast(error as Error);
      }
    },
    [rootStore.authStore.accountPkh, rootStore.tezos, showErrorToast, confirmOperation]
  );

  return { doHarvest };
};
