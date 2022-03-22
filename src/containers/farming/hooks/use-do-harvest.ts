import { useCallback } from 'react';

import { harvestAssetsApi } from '@api/farming/harvest-assets.api';
import { useToasts } from '@hooks/use-toasts';
import { FarmingItem } from '@interfaces/farming.interfaces';
import { useRootStore } from '@providers/root-store-provider';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { defined } from '@utils/helpers';
import { Nullable } from '@utils/types';

export const useDoHarvest = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();

  const doHarvest = useCallback(
    async (stakeItem: Nullable<FarmingItem>) => {
      try {
        const operation = await harvestAssetsApi(
          defined(rootStore.tezos),
          defined(stakeItem).id,
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
