import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { defined } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { YouvesFarmingApi } from '../../api/blockchain/youves-farming.api';

export const useDoYouvesFarmingDeposit = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();

  const doDeposit = useCallback(
    async (stakeId: BigNumber.Value, balance: BigNumber.Value) => {
      const logData = {
        accountPkh,
        stakeId: new BigNumber(stakeId).toNumber(),
        balance: new BigNumber(stakeId).toFixed()
      };
      try {
        amplitudeService.logEvent('YOUVES_FARMING_DEPOSIT', logData);
        const operation = await YouvesFarmingApi.deposit(
          defined(tezos),
          defined(accountPkh),
          new BigNumber(stakeId),
          new BigNumber(balance)
        );

        await confirmOperation(operation.opHash, { message: 'Stake successful' });
        amplitudeService.logEvent('YOUVES_FARMING_DEPOSIT_SUCCESS', logData);
      } catch (error) {
        showErrorToast(error as Error);
        amplitudeService.logEvent('YOUVES_FARMING_DEPOSIT_FAILED', {
          ...logData,
          error
        });
      }
    },
    [tezos, accountPkh, confirmOperation, showErrorToast]
  );

  return { doDeposit };
};
