import { useCallback } from 'react';

import BigNumber from 'bignumber.js';

import { DEX_TWO_CONTRACT_ADDRESS } from '@config/environment';
import { createNewLiquidityPoolApi } from '@modules/new-liquidity/api';
import { useRootStore } from '@providers/root-store-provider';
import { getTransactionDeadline, isEqual, isNull, isTokenFa2, saveBigNumber } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { AmountToken, Token } from '@shared/types';
import { useToasts, useConfirmOperation } from '@shared/utils';
import { useTranslation } from '@translation';

const FIRST_TOKEN = 0;

enum TokenChar {
  a = 'a',
  b = 'b'
}

export const mapTokenToBlockchainToken = (token: Token, index: number) => {
  const tokenSymbol = isEqual(index, FIRST_TOKEN) ? TokenChar.a : TokenChar.b;

  if (isTokenFa2(token)) {
    return {
      [`token_${tokenSymbol}`]: {
        fa2: {
          token: token.contractAddress,
          id: saveBigNumber(token.fa2TokenId, new BigNumber(0))
        }
      }
    };
  } else {
    return {
      [`token_${tokenSymbol}`]: {
        fa12: token.contractAddress
      }
    };
  }
};

export const useCreateNewLiquidityPool = () => {
  const { tezos } = useRootStore();
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { accountPkh } = useAuthStore();
  const {
    settings: { transactionDeadline }
  } = useSettingsStore();

  const createNewLiquidityPool = useCallback(
    async (tokensAndAmounts: AmountToken[], candidate: string) => {
      if (isNull(tezos) || isNull(accountPkh)) {
        return;
      }

      const [token_a_in, token_b_in] = tokensAndAmounts.map(({ amount }) => amount);
      const tokensPairParams = tokensAndAmounts.map(({ token }, index) => mapTokenToBlockchainToken(token, index));

      const deadline = await getTransactionDeadline(tezos, transactionDeadline);

      try {
        const operation = await createNewLiquidityPoolApi(
          tezos,
          DEX_TWO_CONTRACT_ADDRESS,
          tokensAndAmounts,
          tokensPairParams,
          token_a_in,
          token_b_in,
          accountPkh,
          candidate,
          deadline
        );

        await confirmOperation(operation.opHash, { message: t('newLiquidity|succsess') });
      } catch (error) {
        showErrorToast(error as Error);
        throw error;
      }
    },
    [accountPkh, confirmOperation, showErrorToast, t, tezos, transactionDeadline]
  );

  return { createNewLiquidityPool };
};
