import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { stakeTokenApi } from '@api/farming/stake-token.api';
import { useToasts } from '@hooks/use-toasts';
import { FarmingItem } from '@interfaces/farming.interfaces';
import { useRootStore } from '@providers/root-store-provider';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { defined } from '@utils/helpers';
import { Token, WhitelistedBaker } from '@utils/types';

export const useDoStake = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();

  const doStake = useCallback(
    async (farmingItem: FarmingItem, balance: BigNumber, tokenAddress: Token, selectedBaker: WhitelistedBaker) => {
      try {
        const operation = await stakeTokenApi(
          defined(rootStore.tezos),
          tokenAddress,
          defined(rootStore.authStore.accountPkh),
          defined(farmingItem).id,
          balance,
          defined(selectedBaker).address
        );

        await confirmOperation(operation.opHash, { message: 'Stake successful' });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error', error);
        showErrorToast(error as Error);
      }
    },
    [rootStore.authStore.accountPkh, rootStore.tezos, showErrorToast, confirmOperation]
  );

  return { doStake };
};
