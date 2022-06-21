import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { stableswapFarmUnstakeApi } from '@modules/stableswap/api';
import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';
import { useToasts, useConfirmOperation } from '@shared/utils';
import { useTranslation } from '@translation';

import { useStableFarmItemStore } from '../store';

export const useStableswapFarmUnstake = () => {
  const { tezos } = useRootStore();
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { item } = useStableFarmItemStore();

  const stableswapFarmUnstake = useCallback(
    async (amount: BigNumber) => {
      if (isNull(tezos) || isNull(item)) {
        return;
      }
      const { contractAddress } = item;

      try {
        const operation = await stableswapFarmUnstakeApi(tezos, contractAddress, amount);

        await confirmOperation(operation.opHash, { message: t('stableswap|sucessfullyUnstaked') });
      } catch (error) {
        showErrorToast(error as Error);
      }
    },
    [confirmOperation, item, showErrorToast, t, tezos]
  );

  return { stableswapFarmUnstake };
};
