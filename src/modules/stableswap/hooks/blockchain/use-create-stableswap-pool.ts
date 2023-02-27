import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import {
  DEFAULT_STABLESWAP_INTERFACE_FEE_WITH_PRECISION,
  DEFAULT_STABLESWAP_STAKERS_FEE_WITH_PRECISION,
  STABLESWAP_PRECISION_FEE
} from '@config/constants';
import { STABLESWAP_FACTORY_CONTRACT_ADDRESS, STABLESWAP_V2_FACTORY_ADDRESS } from '@config/environment';
import { StableswapVersion } from '@modules/stableswap/types';
import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { Nullable } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { createStableswapPoolApi, CreationParams, Fees } from '../../api';

interface Params {
  creationPrice: Nullable<BigNumber>;
  amplificationParameter: BigNumber;
  fee: Pick<Fees, 'liquidityProvidersFee'>;
  creationParams: Array<CreationParams>;
  version: StableswapVersion;
}

const stableswapFactories = {
  [StableswapVersion.V1]: STABLESWAP_FACTORY_CONTRACT_ADDRESS,
  [StableswapVersion.V2]: STABLESWAP_V2_FACTORY_ADDRESS!
};

const prepareFee = ({ liquidityProvidersFee }: Pick<Fees, 'liquidityProvidersFee'>): Fees => {
  return {
    liquidityProvidersFee: liquidityProvidersFee.multipliedBy(STABLESWAP_PRECISION_FEE),
    stakersFee: DEFAULT_STABLESWAP_STAKERS_FEE_WITH_PRECISION,
    interfaceFee: DEFAULT_STABLESWAP_INTERFACE_FEE_WITH_PRECISION
  };
};

export const useCreateStableswapPool = () => {
  const { tezos } = useRootStore();
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { accountPkh } = useAuthStore();

  const createStableswapPool = useCallback(
    async ({ amplificationParameter, fee, creationParams, creationPrice, version }: Params) => {
      if (isNull(tezos) || isNull(accountPkh)) {
        return;
      }
      const fees = prepareFee(fee);

      try {
        const operation = await createStableswapPoolApi(
          tezos,
          stableswapFactories[version],
          creationParams,
          amplificationParameter,
          fees,
          accountPkh,
          creationPrice
        );

        await confirmOperation(operation.opHash, { message: t('stableswap|successfullyCreated') });
      } catch (error) {
        showErrorToast(error as Error);
        throw error;
      }
    },
    [accountPkh, confirmOperation, showErrorToast, t, tezos]
  );

  return { createStableswapPool };
};
