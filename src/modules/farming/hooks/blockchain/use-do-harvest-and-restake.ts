/* eslint-disable no-console */
import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { useRootStore } from '@providers/root-store-provider';
import { defined } from '@shared/helpers';
import { Nullable } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { harvestAndRestake } from '../../api';
import { FarmingItem } from '../../interfaces';

export const useDoHarvestAndRestake = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();
  const { t } = useTranslation();

  const doHarvestAndRestake = useCallback(
    async (farmingItem: Nullable<FarmingItem>, rewardsInToken: Nullable<BigNumber>) => {
      try {
        const farmingIntemDefined = defined(farmingItem);

        const operation = await harvestAndRestake(
          defined(rootStore.tezos),
          farmingIntemDefined.id,
          defined(rootStore.authStore.accountPkh),
          defined(rewardsInToken),
          farmingIntemDefined.rewardToken
        );

        await confirmOperation(operation.opHash, { message: t('farm|Harvest successful') });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error', error);
        showErrorToast(error as Error);
      }
    },
    [rootStore.tezos, rootStore.authStore.accountPkh, confirmOperation, t, showErrorToast]
  );

  return { doHarvestAndRestake };
};
