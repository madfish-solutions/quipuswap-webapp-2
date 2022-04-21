import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { harvestAssetsApi } from '@modules/farming/api';
import { FarmingItem } from '@modules/farming/interfaces';
import { useRootStore } from '@providers/root-store-provider';
import { defined } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';

const ZERO = 0;
const ZERO_BN = new BigNumber(ZERO);

export const useDoHarvest = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();

  const doHarvest = useCallback(
    async (farmingItem: FarmingItem) => {
      const rewardsInToken =
        farmingItem.earnBalance?.decimalPlaces(farmingItem.stakedToken.metadata.decimals) ?? ZERO_BN;
      const exchangeRate = farmingItem.earnExchangeRate ?? ZERO_BN;
      const logData = {
        harvestAll: {
          farmingId: farmingItem.id.toFixed(),
          rewardToken: `${farmingItem.rewardToken.contractAddress}_${farmingItem.rewardToken.fa2TokenId}`,
          rewardsInToken: rewardsInToken.toFixed(),
          rewardsInUsd: rewardsInToken.multipliedBy(exchangeRate).toFixed()
        }
      };

      try {
        amplitudeService.logEvent('HARVEST', logData);
        const operation = await harvestAssetsApi(
          defined(rootStore.tezos),
          farmingItem.id,
          defined(rootStore.authStore.accountPkh)
        );

        await confirmOperation(operation.opHash, { message: 'Harvest successful' });
        amplitudeService.logEvent('HARVEST_SUCCESS', logData);
      } catch (error) {
        showErrorToast(error as Error);
        amplitudeService.logEvent('HARVEST_FAILED', { ...logData, error });
      }
    },
    [rootStore.authStore.accountPkh, rootStore.tezos, showErrorToast, confirmOperation]
  );

  return { doHarvest };
};
