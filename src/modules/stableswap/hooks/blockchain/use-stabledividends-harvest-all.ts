import { useCallback } from 'react';

import { useTotalStableDividendsPendingRewards } from '@modules/stableswap/stabledividends/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { isNull, placeUSDDecimals } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { amplitudeService } from '@shared/services';
import { useToasts, useConfirmOperation } from '@shared/utils';
import { useTranslation } from '@translation';

import { stableDividendsHarvestApi } from '../../api';

export const useStableDividendsHarvestAll = () => {
  const { tezos } = useRootStore();
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { accountPkh } = useAuthStore();
  const { claimablePendingRewards } = useTotalStableDividendsPendingRewards();

  const harvestAll = useCallback(
    async (contractAdresses: Array<string>) => {
      if (isNull(tezos) || isNull(accountPkh)) {
        return;
      }

      const logData = {
        poolsCount: contractAdresses.length,
        rewardUsd: placeUSDDecimals(claimablePendingRewards).toNumber()
      };

      try {
        amplitudeService.logEvent('STABLESWAP_DIVIDENDS_HARVEST_ALL', logData);
        const operation = await stableDividendsHarvestApi(tezos, contractAdresses);

        await confirmOperation(operation.opHash, { message: t('stableswap|sucessfullyHarvested') });
        amplitudeService.logEvent('STABLESWAP_DIVIDENDS_HARVEST_ALL_SUCCESS', logData);
      } catch (error) {
        showErrorToast(error as Error);

        amplitudeService.logEvent('STABLESWAP_DIVIDENDS_HARVEST_ALL_FAILED', { ...logData, error });
      }
    },
    [accountPkh, claimablePendingRewards, confirmOperation, showErrorToast, t, tezos]
  );

  return { harvestAll };
};
