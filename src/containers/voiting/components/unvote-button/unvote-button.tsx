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

const EMPTY_POOL = 0;

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

    await unvoteOrRemoveVeto(currentTab.id, tezos, dex, showErrorToast, confirmOperation, updateBalances, candidate);
  };

  const isVoteTab = currentTab.id === VotingTabs.vote;
  const value = isVoteTab ? vote : veto;
  const isButtonDisabled = new BigNumber(value ?? '0').eq(EMPTY_POOL);

  return (
    <Button onClick={handleUnvoteOrRemoveVeto} className={className} theme="secondary" disabled={isButtonDisabled}>
      {isVoteTab ? 'Unvote' : 'Remove veto'}
    </Button>
  );
};
