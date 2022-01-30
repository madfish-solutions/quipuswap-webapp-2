import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { Button } from '@components/ui/elements/button';
import { unvoteOrRemoveVeto } from '@containers/voiting/helpers';
import {
  useVoter,
  useVotingDex,
  useVotingHandlers,
  useVotingRouting
} from '@containers/voiting/helpers/voting.provider';
import { VotingTabs } from '@containers/voiting/tabs.enum';
import { useToasts } from '@hooks/use-toasts';
import { useTezos } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { isNull } from '@utils/helpers';

export interface UnvoteButtonProps {
  className: string;
}

export const UnvoteButton: FC<UnvoteButtonProps> = ({ className }) => {
  const tezos = useTezos();
  const { showErrorToast } = useToasts();
  const { vote, veto, candidate } = useVoter();
  const confirmOperation = useConfirmOperation();
  const { currentTab } = useVotingRouting();
  const { dex } = useVotingDex();
  const { updateBalances } = useVotingHandlers();

  const handleUnvoteOrRemoveVeto = async () => {
    if (!tezos || !dex || isNull(candidate)) {
      return;
    }

    unvoteOrRemoveVeto(currentTab.id, tezos, dex, showErrorToast, confirmOperation, updateBalances, candidate);
  };

  const isButtonDisabled =
    currentTab.id === VotingTabs.vote ? new BigNumber(vote ?? '0').eq(0) : new BigNumber(veto ?? '0').eq(0);

  return (
    <Button onClick={handleUnvoteOrRemoveVeto} className={className} theme="secondary" disabled={isButtonDisabled}>
      {currentTab.id === VotingTabs.vote ? 'Unvote' : 'Remove veto'}
    </Button>
  );
};
