import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { stakeTokenApi } from '@modules/farming/api/stake-token.api';
import { FarmingItem } from '@modules/farming/interfaces';
import { useRootStore } from '@providers/root-store-provider';
import { defined, fromDecimals } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { Token, WhitelistedBaker } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { mapFarmingLog } from '../../mapping';
import { useFarmingTimeout } from './use-farming-timeout';

export const useDoStake = () => {
  const rootStore = useRootStore();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();
  const { timeout, isUnlocked } = useFarmingTimeout();

  const doStake = useCallback(
    async (farmingItem: FarmingItem, balance: BigNumber, tokenAddress: Token, selectedBaker: WhitelistedBaker) => {
      const token = defined(farmingItem).stakedToken;
      const inputAmountWithDecimals = fromDecimals(balance, token);
      const logData = { farming: { ...mapFarmingLog(farmingItem, inputAmountWithDecimals), timeout, isUnlocked } };
      try {
        amplitudeService.logEvent('STAKE', logData);
        const operation = await stakeTokenApi(
          defined(rootStore.tezos),
          tokenAddress,
          defined(rootStore.authStore.accountPkh),
          defined(farmingItem).id,
          balance,
          defined(selectedBaker).address
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
