import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { unstakeAssetsApi } from '@modules/farming/api/unstake-assets.api';
import { FarmingItemV1WithBalances } from '@modules/farming/pages/list/types';
import { useRootStore } from '@providers/root-store-provider';
import { defined } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { useFarmingTimeout } from './use-farming-timeout';
import { getStakeUnstakeLogData } from '../../helpers';

export const useDoUnstake = () => {
  const { t } = useTranslation();
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();
  const { timeout, isUnlocked } = useFarmingTimeout();

  const doUnstake = useCallback(
    async (farmingItem: FarmingItemV1WithBalances, balance: BigNumber) => {
      const logData = getStakeUnstakeLogData(farmingItem, balance, timeout, isUnlocked);

      try {
        amplitudeService.logEvent('UNSTAKE', logData);
        const operation = await unstakeAssetsApi(
          defined(rootStore.tezos),
          defined(rootStore.authStore.accountPkh),
          defined(farmingItem).id,
          balance
        );
        await confirmOperation(operation.opHash, { message: t('farm|Unstake successful') });
        amplitudeService.logEvent('UNSTAKE_SUCCESS', logData);
      } catch (error) {
        showErrorToast(error as Error);
        amplitudeService.logEvent('UNSTAKE_FAILED', {
          ...logData,
          error
        });
      }
    },
    [timeout, isUnlocked, rootStore.tezos, rootStore.authStore.accountPkh, confirmOperation, t, showErrorToast]
  );

  return { doUnstake };
};
