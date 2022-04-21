import { useLocation } from 'react-router-dom';

import { submitForm } from '@modules/voting/helpers/blockchain/voting';
import { useVotingDex, useVotingRouting } from '@modules/voting/helpers/voting.provider';
import { useTezos } from '@providers/use-dapp';
import { useToasts } from '@shared/hooks';
import { amplitudeService } from '@shared/services';
import { VoteFormValues } from '@shared/types';
import { useConfirmOperation } from '@shared/utils';

const INDEX_OF_TOKEN_PAIR = 3;

export const useHandleVote = () => {
  const tezos = useTezos();
  const confirmOperation = useConfirmOperation();
  const { dex } = useVotingDex();
  const { currentTab } = useVotingRouting();
  const { showErrorToast } = useToasts();
  const location = useLocation();

  return async (values: VoteFormValues) => {
    if (!tezos || !dex) {
      return;
    }

    const logData = {
      [currentTab.id]: {
        asset: location.pathname.split('/')[INDEX_OF_TOKEN_PAIR],
        tab: currentTab.id,
        ...values,
        dex: dex.contract.address
      }
    };

    try {
      amplitudeService.logEvent(`${currentTab.id.toLocaleUpperCase()}`, logData);
      await submitForm({
        tezos,
        values,
        dex,
        tab: currentTab.id,
        confirmOperation
      });
      amplitudeService.logEvent(`${currentTab.id.toLocaleUpperCase()}_SUCCESS`, logData);
    } catch (error) {
      showErrorToast(error as Error);
      amplitudeService.logEvent(`${currentTab.id.toLocaleUpperCase()}_FAILED`, {
        ...logData,
        error
      });
    }
  };
};
