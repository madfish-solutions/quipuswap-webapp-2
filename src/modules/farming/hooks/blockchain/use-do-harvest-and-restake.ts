import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { useRootStore } from '@providers/root-store-provider';
import { defined } from '@shared/helpers';
import { Nullable, WhitelistedBaker } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { harvestAndRestake } from '../../api';
import { FarmingItem } from '../../interfaces';

export const useDoHarvestAndRestake = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();

  const doHarvestAndRestake = useCallback(
    async (
      farmingItem: Nullable<FarmingItem>,
      rewardsInToken: Nullable<BigNumber>,
      selectedBaker: Nullable<WhitelistedBaker>
    ) => {
      try {
        const farmingIntemDefined = defined(farmingItem);

        const operation = await harvestAndRestake(
          defined(rootStore.tezos),
          farmingIntemDefined.id,
          defined(rootStore.authStore.accountPkh),
          defined(rewardsInToken),
          defined(selectedBaker).address,
          farmingIntemDefined.rewardToken
        );

        await confirmOperation(operation.opHash, { message: 'Harvest successful' });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error', error);
        showErrorToast(error as Error);
      }
    },
    [rootStore.authStore.accountPkh, rootStore.tezos, showErrorToast, confirmOperation]
  );

  return { doHarvestAndRestake };
};
