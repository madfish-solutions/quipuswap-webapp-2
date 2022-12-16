import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { BlockchainYouvesFarmingApi } from '@modules/farming/api/blockchain/youves-farming.api';
import { YouvesFarmingItemWithBalances } from '@modules/farming/pages/youves-item/types';
import { useRootStore } from '@providers/root-store-provider';
import { defined } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';

const ZERO = 0;
const ZERO_BN = new BigNumber(ZERO);

export const useDoYouvesHarvest = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();

  const doHarvest = useCallback(
    async (farmingItem: YouvesFarmingItemWithBalances, stakeId: BigNumber) => {
      const rewardsInToken =
        farmingItem.earnBalance?.decimalPlaces(farmingItem.stakedToken.metadata.decimals) ?? ZERO_BN;
      const exchangeRate = farmingItem.earnExchangeRate ?? ZERO_BN;
      const logData = {
        harvest: {
          farmAddress: farmingItem.contractAddress,
          rewardToken: `${farmingItem.rewardToken.contractAddress}_${farmingItem.rewardToken.fa2TokenId}`,
          rewardsInToken: rewardsInToken.toNumber(),
          rewardsInUsd: rewardsInToken.multipliedBy(exchangeRate).toNumber(),
          stakeId: stakeId.toNumber()
        }
      };

      try {
        amplitudeService.logEvent('YOUVES_HARVEST', logData);
        const operation = await BlockchainYouvesFarmingApi.harvest(
          defined(rootStore.tezos),
          farmingItem.contractAddress,
          stakeId
        );

        await confirmOperation(operation.hash, { message: 'Harvest successful' });
        amplitudeService.logEvent('YOUVES_HARVEST_SUCCESS', logData);
      } catch (error) {
        showErrorToast(error as Error);
        amplitudeService.logEvent('YOUVES_HARVEST_FAILED', { ...logData, error });
      }
    },
    [rootStore, showErrorToast, confirmOperation]
  );

  return { doHarvest };
};
