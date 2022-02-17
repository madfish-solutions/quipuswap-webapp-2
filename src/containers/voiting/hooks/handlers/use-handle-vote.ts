import { useToasts } from '@hooks/use-toasts';
import { VoteFormValues } from '@interfaces/types';
import { useTezos } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';

import { submitForm } from '../../helpers';
import { useVotingDex, useVotingRouting } from '../../helpers/voting.provider';

export const useHandleVote = () => {
  const tezos = useTezos();
  const confirmOperation = useConfirmOperation();
  const { dex } = useVotingDex();
  const { currentTab } = useVotingRouting();
  const { showErrorToast } = useToasts();

  return async (values: VoteFormValues) => {
    if (!tezos || !dex) {
      return;
    }

    try {
      await submitForm({
        tezos,
        values,
        dex,
        tab: currentTab.id,
        confirmOperation
      });
    } catch (e) {
      showErrorToast(e as Error);
    }
  };
};
