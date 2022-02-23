import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { unstakeAssetsApi } from '@api/staking/unstake-assets.api';
import { useToasts } from '@hooks/use-toasts';
import { StakingItem } from '@interfaces/staking.interfaces';
import { useRootStore } from '@providers/RootStoreProvider';
import { defined } from '@utils/helpers';
import { Token } from '@utils/types';

export const useDoUnstake = () => {
  const rootStore = useRootStore();

  const { showErrorToast, showSuccessToast } = useToasts();

  const doUnstake = useCallback(
    async (stakeItem: StakingItem, balance: BigNumber, token: Token) => {
      try {
        await unstakeAssetsApi(
          defined(rootStore.tezos),
          defined(rootStore.authStore.accountPkh),
          defined(stakeItem).id.toNumber(),
          token,
          balance
        );
        showSuccessToast('Stake successful');
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
