import { useCallback } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useToasts, useConfirmOperation } from '@shared/utils';
import { useTranslation } from '@translation';

import { stableDividendsHarvestApi } from '../../api';
import { useStableDividendsItemStore } from '../store';

export const useStableDividendsHarvest = () => {
  const { tezos } = useRootStore();
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { accountPkh } = useAuthStore();
  const { item } = useStableDividendsItemStore();

  const harvest = useCallback(async () => {
    if (isNull(tezos) || isNull(accountPkh) || isNull(item)) {
      return;
    }

    const { contractAddress } = item;

    try {
      const operation = await stableDividendsHarvestApi(tezos, contractAddress);

      await confirmOperation(operation.opHash, { message: t('stableswap|sucessfullyHarvested') });
    } catch (error) {
      showErrorToast(error as Error);
    }
  }, [accountPkh, confirmOperation, item, showErrorToast, t, tezos]);

  return { harvest };
};
