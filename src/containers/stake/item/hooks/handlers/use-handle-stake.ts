import { useToasts } from '@hooks/use-toasts';
import { useTezos } from '@utils/dapp';
import { StakeFormValues } from '@utils/types';

import { submitForm } from '../../helpers';
import { useStakingId, useStakingRouting } from '../../helpers/staking.provider';

export const useHandleStake = () => {
  const tezos = useTezos();
  const stakingId = useStakingId();
  const { currentTab } = useStakingRouting();
  const { showErrorToast } = useToasts();

  return async (values: StakeFormValues) => {
    if (!tezos || !stakingId) {
      return;
    }

    try {
      submitForm({
        values,
        stakingId,
        tab: currentTab.id
      });
    } catch (e) {
      showErrorToast(e as Error);
    }
  };
};
