import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { FARMING_CONTRACT_ADDRESS_OLD, FARMING_CONTRACT_ADDRESS } from '@config/environment';
import { stakeTokenApi } from '@modules/farming/api/stake-token.api';
import { FarmingItemWithBalances } from '@modules/farming/pages/list/types';
import { useRootStore } from '@providers/root-store-provider';
import { defined } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { Token, WhitelistedBaker } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { getStakeUnstakeLogData } from '../../helpers';
import { useFarmingTimeout } from './use-farming-timeout';

export const useDoStake = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();
  const { timeout, isUnlocked } = useFarmingTimeout();

  const doStake = useCallback(
    async (
      farmingItem: FarmingItemWithBalances,
      balance: BigNumber,
      tokenAddress: Token,
      selectedBaker: WhitelistedBaker
    ) => {
      const logData = getStakeUnstakeLogData(farmingItem, balance, timeout, isUnlocked);
      const contractAddress = farmingItem.old ? FARMING_CONTRACT_ADDRESS_OLD : FARMING_CONTRACT_ADDRESS;
      try {
        amplitudeService.logEvent('STAKE', logData);
        const operation = await stakeTokenApi(
          defined(rootStore.tezos),
          tokenAddress,
          defined(rootStore.authStore.accountPkh),
          defined(farmingItem).id,
          balance,
          defined(selectedBaker).address,
          contractAddress
        );

        await confirmOperation(operation.opHash, { message: 'Stake successful' });
        amplitudeService.logEvent('STAKE_SUCCESS', logData);
      } catch (error) {
        showErrorToast(error as Error);
        amplitudeService.logEvent('STAKE_FAILED', {
          ...logData,
          error
        });
      }
    },
    [timeout, isUnlocked, rootStore.tezos, rootStore.authStore.accountPkh, confirmOperation, showErrorToast]
  );

  return { doStake };
};
