import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { stakeTokenApi } from '@api/staking/stake-token.api';
import { useToasts } from '@hooks/use-toasts';
import { StakingItem } from '@interfaces/staking.interfaces';
import { useRootStore } from '@providers/root-store-provider';
import { defined } from '@utils/helpers';
import { Token, WhitelistedBaker } from '@utils/types';

export const useDoStake = () => {
  const rootStore = useRootStore();

  const { showErrorToast, showSuccessToast } = useToasts();

  const doStake = useCallback(
    async (stakeItem: StakingItem, balance: BigNumber, tokenAddress: Token, selectedBaker: WhitelistedBaker) => {
      try {
        await stakeTokenApi(
          defined(rootStore.tezos),
          tokenAddress,
          defined(rootStore.authStore.accountPkh),
          defined(stakeItem).id,
          balance,
          defined(selectedBaker).address
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

  return { doStake };
};
