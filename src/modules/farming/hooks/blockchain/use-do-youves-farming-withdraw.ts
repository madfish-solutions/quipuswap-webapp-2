import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { defined } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { BlockchainYouvesFarmingApi } from '../../api/blockchain/youves-farming.api';
import { useGetYouvesFarmingItem } from '../loaders';

export const useDoYouvesFarmingWithdraw = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
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

        await confirmOperation(operation.opHash, { message: 'Stake successful' });
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
