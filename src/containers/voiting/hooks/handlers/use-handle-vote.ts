import { useToasts } from '@hooks/use-toasts';
import { useTezos } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { VoteFormValues } from '@utils/types';

import { submitForm } from '../../helpers';
import { useVotingDex, useVotingRouting } from '../../helpers/voting.provider';
import { VotingTabs } from '../../tabs.enum';

export const useHandleVote = (getBalance: () => void, cleanUp: (tab: VotingTabs) => void) => {
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

      getBalance();
      cleanUp(currentTab.id);
    } catch (e) {
      showErrorToast(e as Error);
    }
  };
};
