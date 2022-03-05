import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { unstakeAssetsApi } from '@api/staking/unstake-assets.api';
import { useToasts } from '@hooks/use-toasts';
import { StakingItem } from '@interfaces/staking.interfaces';
import { useRootStore } from '@providers/root-store-provider';
import { defined } from '@utils/helpers';

export const useDoUnstake = () => {
  const rootStore = useRootStore();

  const { showErrorToast, showSuccessToast } = useToasts();

  const doUnstake = useCallback(
    async (stakeItem: StakingItem, balance: BigNumber) => {
      try {
        await unstakeAssetsApi(
          defined(rootStore.tezos),
          defined(rootStore.authStore.accountPkh),
          defined(stakeItem).id.toNumber(),
          balance
        );
        showSuccessToast('Unstake successful');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error', error);
        showErrorToast(error as Error);
      }
    },
    [rootStore.authStore.accountPkh, rootStore.tezos, showErrorToast, showSuccessToast]
  );

  return { doUnstake };
};
