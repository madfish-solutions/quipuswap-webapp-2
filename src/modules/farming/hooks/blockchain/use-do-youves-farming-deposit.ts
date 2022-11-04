import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { useRootStore } from '@providers/root-store-provider';
import { defined } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { BlockchainYouvesFarmingApi } from '../../api/blockchain/youves-farming.api';
import { useGetYouvesFarmingItem } from '../loaders';
import { useFarmingYouvesItemStore } from '../stores';

export const useDoYouvesFarmingDeposit = () => {
  const { tezos } = useRootStore();
  const { accountPkh } = useAuthStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();
  const { delayedGetFarmingItem } = useGetYouvesFarmingItem();
  const { id, version } = useFarmingYouvesItemStore();

  const doDeposit = useCallback(
    async (contractAddress: string, stakeId: BigNumber.Value, balance: BigNumber.Value) => {
      const logData = {
        accountPkh,
        stakeId: new BigNumber(stakeId).toNumber(),
        balance: new BigNumber(stakeId).toFixed()
      };
      try {
        amplitudeService.logEvent('YOUVES_FARMING_DEPOSIT', logData);
        const operation = await BlockchainYouvesFarmingApi.deposit(
          defined(tezos),
          defined(accountPkh),
          contractAddress,
          new BigNumber(stakeId),
          new BigNumber(balance)
        );

        await confirmOperation(operation.opHash, { message: 'Deposit successful' });
        amplitudeService.logEvent('YOUVES_FARMING_DEPOSIT_SUCCESS', logData);
        await delayedGetFarmingItem(id, defined(version, 'version'));
      } catch (error) {
        showErrorToast(error as Error);
        amplitudeService.logEvent('YOUVES_FARMING_DEPOSIT_FAILED', {
          ...logData,
          error
        });
      }
    },
    [accountPkh, tezos, confirmOperation, delayedGetFarmingItem, id, version, showErrorToast]
  );

  return { doDeposit };
};
