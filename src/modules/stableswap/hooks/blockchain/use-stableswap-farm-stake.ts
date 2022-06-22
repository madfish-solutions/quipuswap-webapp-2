import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { stableswapFarmStakeApi } from '@modules/stableswap/api';
import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useToasts, useConfirmOperation } from '@shared/utils';
import { useTranslation } from '@translation';

import { useStableFarmItemStore } from '../store';

export const useStableswapFarmStake = () => {
  const { tezos } = useRootStore();
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { item } = useStableFarmItemStore();
  const { accountPkh } = useAuthStore();

  const stableswapFarmStake = useCallback(
    async (amount: BigNumber) => {
      if (isNull(tezos) || isNull(item) || isNull(accountPkh)) {
        return;
      }
      const { contractAddress } = item;

      try {
        const operation = await stableswapFarmStakeApi(tezos, contractAddress, amount, accountPkh);

        await confirmOperation(operation.opHash, { message: t('stableswap|sucessfullyStaked') });
      } catch (error) {
        showErrorToast(error as Error);
      }
    },
    [accountPkh, confirmOperation, item, showErrorToast, t, tezos]
  );

  return { stableswapFarmStake };
};
