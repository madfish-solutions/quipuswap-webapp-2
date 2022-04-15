import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { unstakeAssetsApi } from '@modules/farming/api/unstake-assets.api';
import { FarmingItem } from '@modules/farming/interfaces';
import { useRootStore } from '@providers/root-store-provider';
import { defined, fromDecimals } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { mapFarmingLog } from '../../mapping';
import { useFarmingTimeout } from './use-farming-timeout';

export const useDoUnstake = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();
  const { timeout, isUnlocked } = useFarmingTimeout();

  const doUnstake = useCallback(
    async (farmingItem: FarmingItem, balance: BigNumber) => {
      const token = defined(farmingItem).rewardToken;
      const inputAmountWithDecimals = fromDecimals(balance, token);
      const logData = { farming: { ...mapFarmingLog(farmingItem, inputAmountWithDecimals), timeout, isUnlocked } };
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
    [timeout, isUnlocked, rootStore.tezos, rootStore.authStore.accountPkh, confirmOperation, showErrorToast]
  );

  return { doUnstake };
};
