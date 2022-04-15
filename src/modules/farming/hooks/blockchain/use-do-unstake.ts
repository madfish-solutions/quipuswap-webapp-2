import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { unstakeAssetsApi } from '@modules/farming/api/unstake-assets.api';
import { FarmingItem } from '@modules/farming/interfaces';
import { useRootStore } from '@providers/root-store-provider';
import { defined } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { clearFarmingItem } from '../../mapping';

export const useDoUnstake = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();

  const doUnstake = useCallback(
    async (farmingItem: FarmingItem, balance: BigNumber) => {
      const logData = { farming: { ...clearFarmingItem(farmingItem), balance: balance.toFixed() } };
      try {
        amplitudeService.logEvent('UNSTAKE', logData);
        const operation = await unstakeAssetsApi(
          defined(rootStore.tezos),
          defined(rootStore.authStore.accountPkh),
          defined(farmingItem).id,
          balance
        );
        await confirmOperation(operation.opHash, { message: 'Unstake successful' });
        amplitudeService.logEvent('UNSTAKE_SUCCESS', logData);
      } catch (error) {
        showErrorToast(error as Error);
        amplitudeService.logEvent('UNSTAKE_FAILED', {
          ...logData,
          error
        });
      }
    },
    [rootStore.authStore.accountPkh, rootStore.tezos, showErrorToast, confirmOperation]
  );

  return { doUnstake };
};
