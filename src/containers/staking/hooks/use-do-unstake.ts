import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { unstakeAssetsApi } from '@api/staking/unstake-assets.api';
import { useToasts } from '@hooks/use-toasts';
import { StakingItem } from '@interfaces/staking.interfaces';
import { useRootStore } from '@providers/root-store-provider';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { defined } from '@utils/helpers';

import { useGetStakingItem } from './use-get-staking-item';

export const useDoUnstake = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();
  const { getStakingItem } = useGetStakingItem();

  const doUnstake = useCallback(
    async (stakeItem: StakingItem, balance: BigNumber) => {
      try {
        const operation = await unstakeAssetsApi(
          defined(rootStore.tezos),
          defined(rootStore.authStore.accountPkh),
          defined(stakeItem).id,
          balance
        );
        await confirmOperation(operation.opHash, { message: 'Unstake successful' });

        await getStakingItem(defined(stakeItem).id);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error', error);
        showErrorToast(error as Error);
      }
    },
    [rootStore.authStore.accountPkh, rootStore.tezos, showErrorToast, confirmOperation, getStakingItem]
  );

  return { doUnstake };
};
