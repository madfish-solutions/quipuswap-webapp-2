import { useCallback } from 'react';

import { batchify, FoundDex, withdrawReward } from '@quipuswap/sdk';

import { useToasts } from '@hooks/use-toasts';
import { Nullable } from '@interfaces/types';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';

export const useClaimRewards = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();

  return useCallback(
    async (dex: Nullable<FoundDex>) => {
      if (!tezos || !dex || !accountPkh) {
        return null;
      }

      try {
        const claimParams = await withdrawReward(tezos, dex, accountPkh);

        const op = await batchify(tezos.wallet.batch([]), claimParams).send();

        return await confirmOperation(op.opHash);
      } catch (e) {
        showErrorToast(e as Error);

        return null;
      }
    },
    [tezos, accountPkh, confirmOperation, showErrorToast]
  );
};
