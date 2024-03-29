import { FC } from 'react';

import BigNumber from 'bignumber.js';
import { useLocation } from 'react-router-dom';

import { ZERO_BAKER_ADDRESS } from '@config/constants';
import { getCandidateInfo, unvoteOrRemoveVeto } from '@modules/voting/helpers';
import { useVoter, useVotingDex, useVotingHandlers, useVotingRouting } from '@modules/voting/helpers/voting.provider';
import { VotingTabs } from '@modules/voting/tabs.enum';
import { useBakers } from '@providers/dapp-bakers';
import { useTezos } from '@providers/use-dapp';
import { Button } from '@shared/components/button';
import { isExist } from '@shared/helpers';
import { useLoadingDecorator } from '@shared/hooks';
import { amplitudeService } from '@shared/services';
import { useToasts } from '@shared/utils';
import { useConfirmOperation } from '@shared/utils/confirm-operation';

export interface UnvoteButtonProps {
  className: string;
}

const EMPTY_POOL = 0;
const INDEX_OF_TOKEN_PAIR = 3;

export const UnvoteButton: FC<UnvoteButtonProps> = ({ className }) => {
  const tezos = useTezos();
  const { showErrorToast } = useToasts();
  const { vote, veto, candidate } = useVoter();
  const confirmOperation = useConfirmOperation();
  const { currentTab } = useVotingRouting();
  const { dex } = useVotingDex();
  const { updateBalances } = useVotingHandlers();
  const { data: bakers } = useBakers();
  const location = useLocation();

  const isVoteTab = currentTab.id === VotingTabs.vote;
  const { currentCandidate } = getCandidateInfo(dex, bakers);

  const wrapCandidate = isVoteTab ? candidate : currentCandidate?.address ?? ZERO_BAKER_ADDRESS;

  const isCandidateAbsent = !isExist(wrapCandidate);

  const [isSubmitting, handleUnvoteOrRemoveVeto] = useLoadingDecorator(async () => {
    if (!tezos || !dex || isCandidateAbsent) {
      return;
    }

    const logData = {
      unvote: {
        tab: currentTab.id,
        vote: Number(vote?.toFixed()),
        veto: Number(veto?.toFixed()),
        dex: dex.contract.address,
        candidate,
        currentCandidate: currentCandidate?.address,
        asset: location.pathname.split('/')[INDEX_OF_TOKEN_PAIR]
      }
    };

    try {
      amplitudeService.logEvent('UNVOTE', logData);
      await unvoteOrRemoveVeto(
        currentTab.id,
        tezos,
        dex,
        showErrorToast,
        confirmOperation,
        updateBalances,
        wrapCandidate
      );
      amplitudeService.logEvent('UNVOTE_SUCCESS', logData);
    } catch (error) {
      amplitudeService.logEvent('UNVOTE_FAILED', {
        ...logData,
        error
      });
    }
  });

  const value = isVoteTab ? vote : veto;

  const isButtonDisabled = new BigNumber(value ?? '0').eq(EMPTY_POOL) || isCandidateAbsent;

  return (
    <Button
      onClick={handleUnvoteOrRemoveVeto}
      className={className}
      theme="secondary"
      disabled={isButtonDisabled}
      loading={isSubmitting}
      data-test-id="unvoteButton"
    >
      {isVoteTab ? 'Unvote' : 'Remove veto'}
    </Button>
  );
};
