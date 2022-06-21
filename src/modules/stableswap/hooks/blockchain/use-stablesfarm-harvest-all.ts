import { useCallback } from 'react';

import { stableFarmHarvestApi } from '@modules/stableswap/api';
import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useToasts, useConfirmOperation } from '@shared/utils';
import { useTranslation } from '@translation';

export const useStableFarmHarvestAll = () => {
  const { tezos } = useRootStore();
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { accountPkh } = useAuthStore();

  const harvestAll = useCallback(
    async (contractAdresses: Array<string>) => {
      if (isNull(tezos) || isNull(accountPkh)) {
        return;
      }

      try {
        const operation = await stableFarmHarvestApi(tezos, contractAdresses);

        await confirmOperation(operation.opHash, { message: t('stableswap|sucessfullyStaked') });
      } catch (error) {
        showErrorToast(error as Error);
      }
    },
    [accountPkh, confirmOperation, showErrorToast, t, tezos]
  );

  return { harvestAll };
};
