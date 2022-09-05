import { useCallback } from 'react';

import { DEX_TWO_CONTRACT_ADDRESS } from '@config/environment';
import { createNewLiquidityPoolApi } from '@modules/new-liquidity/api';
import { useRootStore } from '@providers/root-store-provider';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { getTokenSlug, getTokenSymbol, getTransactionDeadline, isNull } from '@shared/helpers';
import { useAmplitudeService, useAuthStore } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { AmountToken } from '@shared/types';
import { useToasts, useConfirmOperation } from '@shared/utils';
import { useTranslation } from '@translation';

const FIRST_TOKEN = 0;
const SECOND_TOKEN = 1;

export const useCreateNewLiquidityPool = () => {
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

      const logData = {
        tezos,
        contractAddress: DEX_TWO_CONTRACT_ADDRESS,
        tokenASlug: getTokenSlug(tokensAndAmounts[FIRST_TOKEN].token),
        tokenBSlug: getTokenSlug(tokensAndAmounts[SECOND_TOKEN].token),
        tokenASymbol: getTokenSymbol(tokensAndAmounts[FIRST_TOKEN].token),
        tokenBSymbol: getTokenSymbol(tokensAndAmounts[SECOND_TOKEN].token),
        tokenAInput: tokensAndAmounts[FIRST_TOKEN].token,
        tokenBInput: tokensAndAmounts[SECOND_TOKEN].token,
        tokenAAmount: tokensAndAmounts[FIRST_TOKEN].amount,
        tokenBAmount: tokensAndAmounts[SECOND_TOKEN].amount,
        tokenAInUsd: tokensExchangeRates[FIRST_TOKEN] ?? 'testnet',
        tokenBInUsd: tokensExchangeRates[SECOND_TOKEN] ?? 'testnet',
        poolCreator: accountPkh,
        baker: candidate,
        transactionDeadline: Number(transactionDeadline.toFixed()),
        liquiditySlippage: Number(liquiditySlippage.toFixed())
      };

      log('CREATE_POOL', logData);

      const deadline = await getTransactionDeadline(tezos, transactionDeadline);

      try {
        const operation = await createNewLiquidityPoolApi(
          tezos,
          DEX_TWO_CONTRACT_ADDRESS,
          tokensAndAmounts,
          accountPkh,
          candidate,
          deadline
        );

        log('CREATE_POOL_SUCCESSFULL', logData);
        await confirmOperation(operation.opHash, { message: t('newLiquidity|succsess') });
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
