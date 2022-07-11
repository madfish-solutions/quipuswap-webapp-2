import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { ZERO_AMOUNT } from '@config/constants';
import { stableDividendsStakeApi } from '@modules/stableswap/api';
import { useStableDividendsStakerBalance } from '@modules/stableswap/stabledividends/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { fromDecimals, isNull, placeUSDDecimals } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { amplitudeService } from '@shared/services';
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
  const stakerBalance = useStableDividendsStakerBalance();

  const stableDividendsStake = useCallback(
    async (amount: BigNumber) => {
      if (isNull(tezos) || isNull(item) || isNull(accountPkh)) {
        return;
      }
      const { contractAddress, id, apr, stakedToken, stakedTokenExchangeRate, tvl } = item;
      const logData = {
        stableswapStake: {
          poolId: id.toNumber(),
          apr: apr.toNumber(),
          amount: fromDecimals(amount, stakedToken).toNumber(),
          amountUsd: placeUSDDecimals(
            fromDecimals(amount, stakedToken).multipliedBy(stakedTokenExchangeRate)
          ).toNumber(),
          tvl: tvl.toNumber(),
          tvlUsd: placeUSDDecimals(tvl.multipliedBy(stakedTokenExchangeRate)).toNumber(),
          hadStakeBefore: stakerBalance?.gt(ZERO_AMOUNT) ?? false
        }
      };

      try {
        amplitudeService.logEvent('STABLESWAP_DIVIDENDS_STAKE', logData);
        const operation = await stableDividendsStakeApi(tezos, contractAddress, amount, accountPkh);

        await confirmOperation(operation.opHash, { message: t('stableswap|sucessfullyStaked') });
        amplitudeService.logEvent('STABLESWAP_DIVIDENDS_STAKE_SUCCESS', logData);
      } catch (error) {
        showErrorToast(error as Error);
        amplitudeService.logEvent('STABLESWAP_DIVIDENDS_STAKE_FAILED', { ...logData, error });
      }
    },
    [accountPkh, confirmOperation, item, showErrorToast, stakerBalance, t, tezos]
  );

  return { stableDividendsStake };
};
