import { useCallback } from 'react';

import { DEX_TWO_CONTRACT_ADDRESS } from '@config/environment';
import { createLiquidityPoolApi } from '@modules/liquidity/api';
import { useRootStore } from '@providers/root-store-provider';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { getTokenSlug, getTransactionDeadline, isNull } from '@shared/helpers';
import { useAmplitudeService, useAuthStore } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { AmountToken } from '@shared/types';
import { useToasts, useConfirmOperation } from '@shared/utils';
import { useTranslation } from '@translation';

import { getLiquidityCreatePoolData } from '../../helpers';

export const useCreateLiquidityPool = () => {
  const { tezos } = useRootStore();
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { log } = useAmplitudeService();
  const { accountPkh } = useAuthStore();
  const {
    settings: { transactionDeadline, liquiditySlippage }
  } = useSettingsStore();
  const exchangeRates = useNewExchangeRates();

  const createNewLiquidityPool = useCallback(
    async (tokensAndAmounts: AmountToken[], candidate: string) => {
      if (isNull(tezos) || isNull(accountPkh)) {
        return;
      }

      const tokensExchangeRates = tokensAndAmounts.map(({ token }) => exchangeRates[getTokenSlug(token)]);

      const logData = getLiquidityCreatePoolData(
        tezos,
        DEX_TWO_CONTRACT_ADDRESS,
        tokensAndAmounts,
        tokensExchangeRates,
        candidate,
        accountPkh,
        transactionDeadline,
        liquiditySlippage
      );

      log('CREATE_POOL', logData);

      const deadline = await getTransactionDeadline(tezos, transactionDeadline);

      try {
        const operation = await createLiquidityPoolApi(
          tezos,
          DEX_TWO_CONTRACT_ADDRESS,
          tokensAndAmounts,
          accountPkh,
          candidate,
          deadline
        );

        log('CREATE_POOL_SUCCESSFULL', logData);
        await confirmOperation(operation.opHash, { message: t('liquidity|successful') });
      } catch (error) {
        log('CREATE_POOL_FAILED', { ...logData, error });
        showErrorToast(error as Error);
        throw error;
      }
    },
    [accountPkh, confirmOperation, exchangeRates, liquiditySlippage, log, showErrorToast, t, tezos, transactionDeadline]
  );

  return { createNewLiquidityPool };
};
