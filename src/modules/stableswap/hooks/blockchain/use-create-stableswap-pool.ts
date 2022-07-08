import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { STABLESWAP_FACTORY_CONTRACT_ADDRESS } from '@config/enviroment';
import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { createStableswapPoolApi, CreationParams, Fees } from '../../api';

interface Params {
  amplificationParameter: BigNumber;
  fee: Fees;
  creationParams: Array<CreationParams>;
}

export const useCreateStableswapPool = () => {
  const { tezos } = useRootStore();
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { accountPkh } = useAuthStore();

  const createStableswapPool = useCallback(
    async ({ amplificationParameter, fee, creationParams }: Params) => {
      if (isNull(tezos) || isNull(accountPkh)) {
        return;
      }

      try {
        const operation = await createStableswapPoolApi(
          tezos,
          STABLESWAP_FACTORY_CONTRACT_ADDRESS,
          creationParams,
          amplificationParameter,
          fee,
          accountPkh
        );

        await confirmOperation(operation.opHash, { message: t('stableswap|sucessfullyHarvested') });
      } catch (error) {
        showErrorToast(error as Error);
      }
    },
    [accountPkh, confirmOperation, showErrorToast, t, tezos]
  );

  return { createStableswapPool };
};
