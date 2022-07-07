import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { stableDividendsStakeApi } from '@modules/stableswap/api';
import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useToasts, useConfirmOperation } from '@shared/utils';
import { useTranslation } from '@translation';

import { useStableDividendsItemStore } from '../store';

export const useStableDividendsStake = () => {
  const { tezos } = useRootStore();
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { item } = useStableDividendsItemStore();
  const { accountPkh } = useAuthStore();

  const stableDividendsStake = useCallback(
    async (amount: BigNumber) => {
      if (isNull(tezos) || isNull(item) || isNull(accountPkh)) {
        return;
      }
      const { contractAddress } = item;

      try {
        const operation = await stableDividendsStakeApi(tezos, contractAddress, amount, accountPkh);

        await confirmOperation(operation.opHash, { message: t('stableswap|sucessfullyStaked') });
      } catch (error) {
        showErrorToast(error as Error);
      }
    },
    [accountPkh, confirmOperation, item, showErrorToast, t, tezos]
  );

  return { stableDividendsStake };
};
