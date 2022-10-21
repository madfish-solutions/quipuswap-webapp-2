import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { useRootStore } from '@providers/root-store-provider';
import { defined } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { BlockchainYouvesFarmingApi } from '../../api/blockchain/youves-farming.api';
import { useGetYouvesFarmingItem } from '../loaders';

export const useDoYouvesFarmingWithdraw = () => {
  const { tezos } = useRootStore();
  const { accountPkh } = useAuthStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();
  const { delayedGetFarmingItem } = useGetYouvesFarmingItem();

  const doWithdraw = useCallback(
    async (contractAddress: string, stakeId: BigNumber.Value, balance: BigNumber) => {
      const logData = {
        accountPkh,
        stakeId: new BigNumber(stakeId).toNumber(),
        balance: new BigNumber(stakeId).toFixed()
      };
      try {
        amplitudeService.logEvent('YOUVES_FARMING_WITHDRAW', logData);
        const operation = await BlockchainYouvesFarmingApi.withdraw(
          defined(tezos),
          defined(accountPkh),
          contractAddress,
          new BigNumber(stakeId),
          balance
        );

        await confirmOperation(operation.opHash, { message: 'Withdraw successful' });
        amplitudeService.logEvent('YOUVES_FARMING_WITHDRAW_SUCCESS', logData);
        await delayedGetFarmingItem(contractAddress);
      } catch (error) {
        showErrorToast(error as Error);
        amplitudeService.logEvent('YOUVES_FARMING_WITHDRAW_FAILED', {
          ...logData,
          error
        });
      }
    },
    [tezos, accountPkh, confirmOperation, showErrorToast, delayedGetFarmingItem]
  );

  return { doWithdraw };
};
