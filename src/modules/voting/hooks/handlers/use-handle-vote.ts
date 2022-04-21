import { TEZOS_TOKEN } from '@config/tokens';
import { submitForm } from '@modules/voting/helpers/blockchain/voting';
import { useVotingDex, useVotingRouting } from '@modules/voting/helpers/voting.provider';
import { useTezos } from '@providers/use-dapp';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { getDollarEquivalent } from '@shared/helpers';
import { useToasts } from '@shared/hooks';
import { amplitudeService } from '@shared/services';
import { VoteFormValues } from '@shared/types';
import { useConfirmOperation } from '@shared/utils';

export const useHandleVote = () => {
  const tezos = useTezos();
  const confirmOperation = useConfirmOperation();
  const { dex } = useVotingDex();
  const { currentTab } = useVotingRouting();
  const { showErrorToast } = useToasts();
  const exchangeRates = useNewExchangeRates();

  return async (values: VoteFormValues) => {
    if (!tezos || !dex) {
      return;
    }

    const logData = {
      vote: {
        tab: currentTab.id,
        balance: Number(values.balance1),
        balanceUsd: Number(getDollarEquivalent(values.balance1, exchangeRates[TEZOS_TOKEN.contractAddress])),
        dex: dex.contract.address
      }
    };

    try {
      amplitudeService.logEvent('VOTE', logData);
      await submitForm({
        tezos,
        values,
        dex,
        tab: currentTab.id,
        confirmOperation
      });
      amplitudeService.logEvent('VOTE_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);
      amplitudeService.logEvent('VOTE_FAILED', {
        ...logData,
        error
      });
    }
  };
};
