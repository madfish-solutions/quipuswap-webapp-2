import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { DEFAULT_STABLESWAP_POOL_ID } from '@config/constants';
import { stableswapFarmUnstakeApi } from '@modules/stableswap/api';
import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useToasts, useConfirmOperation } from '@shared/utils';
import { useTranslation } from '@translation';

import { useStableFarmItemStore } from '../store';

export const useStableswapFarmUnstake = () => {
  const { tezos } = useRootStore();
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { item } = useStableFarmItemStore();
  const { accountPkh } = useAuthStore();

  const stableswapFarmUnstake = useCallback(
    async (amount: BigNumber) => {
      if (isNull(tezos) || isNull(item) || isNull(accountPkh)) {
        return;
      }
      const { contractAddress } = item;

      const poolId = new BigNumber(DEFAULT_STABLESWAP_POOL_ID);

      try {
        const operation = await stableswapFarmUnstakeApi(tezos, contractAddress, amount, poolId, accountPkh);

        await confirmOperation(operation.opHash, { message: t('stableswap|sucessfullyStaked') });
      } catch (error) {
        showErrorToast(error as Error);
      }
    },
    [accountPkh, confirmOperation, item, showErrorToast, t, tezos]
  );

  return { stableswapFarmUnstake };
};
