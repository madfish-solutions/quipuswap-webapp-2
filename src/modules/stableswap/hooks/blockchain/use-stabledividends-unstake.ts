import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { stableDividendsUnstakeApi } from '@modules/stableswap/api';
import { useRootStore } from '@providers/root-store-provider';
import { fromDecimals, isNull, placeUSDDecimals } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useToasts, useConfirmOperation } from '@shared/utils';
import { useTranslation } from '@translation';

import { useStableDividendsItemStore } from '../store';

export const useStableDividendsUnstake = () => {
  const { tezos } = useRootStore();
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { item } = useStableDividendsItemStore();

  const stableDividendsUnstake = useCallback(
    async (amount: BigNumber) => {
      if (isNull(tezos) || isNull(item)) {
        return;
      }
      const { contractAddress, id, apr, stakedToken, stakedTokenExchangeRate, tvl } = item;
      const logData = {
        stableswapDividendsUnstake: {
          poolId: id.toNumber(),
          apr: apr.toNumber(),
          amount: fromDecimals(amount, stakedToken).toNumber(),
          amountUsd: placeUSDDecimals(
            fromDecimals(amount, stakedToken).multipliedBy(stakedTokenExchangeRate)
          ).toNumber(),
          tvl: tvl.toNumber(),
          tvlUsd: placeUSDDecimals(tvl.multipliedBy(stakedTokenExchangeRate)).toNumber()
        }
      };

      try {
        amplitudeService.logEvent('STABLESWAP_DIVIDENDS_UNSTAKE', logData);
        const operation = await stableDividendsUnstakeApi(tezos, contractAddress, amount);

        await confirmOperation(operation.opHash, { message: t('stableswap|sucessfullyUnstaked') });
        amplitudeService.logEvent('STABLESWAP_DIVIDENDS_UNSTAKE_SUCCESS', logData);
      } catch (error) {
        showErrorToast(error as Error);
        amplitudeService.logEvent('STABLESWAP_DIVIDENDS_UNSTAKE_FAILED', { ...logData, error });
      }
    },
    [confirmOperation, item, showErrorToast, t, tezos]
  );

  return { stableDividendsUnstake };
};
