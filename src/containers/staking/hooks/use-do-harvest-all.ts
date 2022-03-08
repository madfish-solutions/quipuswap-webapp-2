import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { useToasts } from '@hooks/use-toasts';
import { StakingItem } from '@interfaces/staking.interfaces';
import { useRootStore } from '@providers/root-store-provider';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { defined } from '@utils/helpers';

import { harvestAllAssets } from '../../../api/staking/harvest-all-assets.api';
const ZERO_AMOUNT = 0;

export const useDoHarvestAll = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();

  const doHarvestAll = useCallback(
    async (stakeList: StakingItem[]) => {
      const stakingIsd: BigNumber[] = [];

      stakeList.forEach(({ id, earnBalance }) => {
        if (earnBalance?.gt(ZERO_AMOUNT)) {
          stakingIsd.push(id);
        }
      });

      try {
        const operation = await harvestAllAssets(
          defined(rootStore.tezos),
          stakingIsd,
          defined(rootStore.authStore.accountPkh)
        );

        await confirmOperation(operation.opHash, { message: 'Stake successful' });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error', error);
        showErrorToast(error as Error);
      }
    },
    [rootStore.authStore.accountPkh, rootStore.tezos, showErrorToast, confirmOperation]
  );

  return { doHarvestAll };
};
