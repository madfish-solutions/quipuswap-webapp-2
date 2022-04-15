import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { FarmingItem } from '@modules/farming/interfaces';
import { useRootStore } from '@providers/root-store-provider';
import { defined, isNull } from '@shared/helpers';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { harvestAllAndRestake } from '../../api';
import { getUserInfoLastStakedTime, getEndTimestamp, getIsHarvestAvailable } from '../../helpers';
import { useFarmingListStore } from '../stores';

const ZERO_AMOUNT = 0;

export const useDoHarvestAllAndRestake = () => {
  const { t } = useTranslation();
  const rootStore = useRootStore();
  const { showErrorToast } = useToasts();
  const farmingListStore = useFarmingListStore();
  const confirmOperation = useConfirmOperation();

  const doHarvestAllAndRestake = useCallback(
    async (stakeList: FarmingItem[]) => {
      if (isNull(farmingListStore)) {
        return;
      }

      const rewardsInQuipu = await farmingListStore.getQuipuPendingRewards();

      const farmingIds: BigNumber[] = stakeList
        .filter(({ earnBalance }) => earnBalance?.gt(ZERO_AMOUNT))
        .filter(farmingItem => {
          const userInfo = farmingListStore.findUserInfo(farmingItem);
          const lastStakedTime = getUserInfoLastStakedTime(userInfo);
          const endTimestamp = getEndTimestamp(farmingItem, lastStakedTime);

          return getIsHarvestAvailable(endTimestamp);
        })
        .map(({ id }) => id);

      try {
        const operation = await harvestAllAndRestake(
          defined(rootStore.tezos),
          farmingIds,
          defined(rootStore.authStore.accountPkh),
          rewardsInQuipu
        );

        await confirmOperation(operation.opHash, { message: t('farm|Stake successful') });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error', error);
        showErrorToast(error as Error);
      }
    },
    [farmingListStore, rootStore.tezos, rootStore.authStore.accountPkh, confirmOperation, t, showErrorToast]
  );

  return { doHarvestAllAndRestake };
};
