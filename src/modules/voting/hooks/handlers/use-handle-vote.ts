import { submitForm } from '@modules/voting/helpers/blockchain/voting';
import { useVotingDex, useVotingRouting } from '@modules/voting/helpers/voting.provider';
import { useTezos } from '@providers/use-dapp';
import { useToasts } from '@shared/hooks';
import { VoteFormValues } from '@shared/types';
import { useConfirmOperation } from '@shared/utils';

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
