import { useCallback } from 'react';

import { harvestAssetsApi } from '@api/staking/harvest-assets.api';
import { useToasts } from '@hooks/use-toasts';
import { StakingItem } from '@interfaces/staking.interfaces';
import { useRootStore } from '@providers/root-store-provider';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { defined } from '@utils/helpers';
import { Nullable } from '@utils/types';

import { useGetStakingItem } from './use-get-staking-item';

export const useDoHarvest = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();
  const { getStakingItem } = useGetStakingItem();

  const doHarvest = useCallback(
    async (stakeItem: Nullable<StakingItem>) => {
      try {
        const operation = await harvestAssetsApi(
          defined(rootStore.tezos),
          defined(stakeItem).id,
          defined(rootStore.authStore.accountPkh)
        );

        await confirmOperation(operation.opHash, { message: 'Harvest successful' });

        await getStakingItem(defined(stakeItem).id);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error', error);
        showErrorToast(error as Error);
      }
    },
    [rootStore.authStore.accountPkh, rootStore.tezos, showErrorToast, confirmOperation, getStakingItem]
  );

  return { doHarvest };
};
