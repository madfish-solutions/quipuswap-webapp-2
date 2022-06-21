import { useCallback } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useToasts, useConfirmOperation } from '@shared/utils';
import { useTranslation } from '@translation';

import { stableFarmHarvestApi } from '../../api';
import { useStableFarmItemStore } from '../store';

export const useStableFarmHarvest = () => {
  const { tezos } = useRootStore();
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { accountPkh } = useAuthStore();
  const { item } = useStableFarmItemStore();

  const harvest = useCallback(async () => {
    if (isNull(tezos) || isNull(accountPkh) || isNull(item)) {
      return;
    }

    const { contractAddress } = item;

    try {
      const operation = await stableFarmHarvestApi(tezos, contractAddress);

      await confirmOperation(operation.opHash, { message: t('stableswap|sucessfullyHarvested') });
    } catch (error) {
      showErrorToast(error as Error);
    }
  }, [accountPkh, confirmOperation, item, showErrorToast, t, tezos]);

  return { harvest };
};
