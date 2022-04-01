import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { unstakeAssetsApi } from '@modules/farming/api/unstake-assets.api';
import { FarmingItem } from '@modules/farming/interfaces';
import { useRootStore } from '@providers/root-store-provider';
import { defined } from '@shared/helpers';
import { useConfirmOperation, useToasts } from '@shared/utils';

export const useDoUnstake = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();

  const doUnstake = useCallback(
    async (farmingItem: FarmingItem, balance: BigNumber) => {
      try {
        const operation = await unstakeAssetsApi(
          defined(rootStore.tezos),
          defined(rootStore.authStore.accountPkh),
          defined(farmingItem).id,
          balance
        );
        await confirmOperation(operation.opHash, { message: 'Unstake successful' });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error', error);
        showErrorToast(error as Error);
      }
    },
    [rootStore.authStore.accountPkh, rootStore.tezos, showErrorToast, confirmOperation]
  );

  return { doUnstake };
};
