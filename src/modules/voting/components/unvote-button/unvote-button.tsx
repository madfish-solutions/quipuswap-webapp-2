import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { getCandidateInfo, unvoteOrRemoveVeto } from '@modules/voting/helpers';
import { useVoter, useVotingDex, useVotingHandlers, useVotingRouting } from '@modules/voting/helpers/voting.provider';
import { VotingTabs } from '@modules/voting/tabs.enum';
import { useBakers } from '@providers/dapp-bakers';
import { useTezos } from '@providers/use-dapp';
import { Button } from '@shared/components/button';
import { isExist } from '@shared/helpers';
import { useToasts } from '@shared/utils';
import { useConfirmOperation } from '@shared/utils/confirm-operation';

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
  const { data: bakers } = useBakers();

  const isVoteTab = currentTab.id === VotingTabs.vote;
  const { currentCandidate } = getCandidateInfo(dex, bakers);

  const wrapCandidate = isVoteTab ? candidate : currentCandidate?.address;

  const isCandidateAbsent = !isExist(wrapCandidate);

  const handleUnvoteOrRemoveVeto = async () => {
    if (!tezos || !dex || isCandidateAbsent) {
      return;
    }

    await unvoteOrRemoveVeto(
      currentTab.id,
      tezos,
      dex,
      showErrorToast,
      confirmOperation,
      updateBalances,
      wrapCandidate
    );
  };

  const value = isVoteTab ? vote : veto;

  const isButtonDisabled = new BigNumber(value ?? '0').eq(EMPTY_POOL) || isCandidateAbsent;

  return (
    <Button onClick={handleUnvoteOrRemoveVeto} className={className} theme="secondary" disabled={isButtonDisabled}>
      {isVoteTab ? 'Unvote' : 'Remove veto'}
    </Button>
  );
};
