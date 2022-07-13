import { useCallback } from 'react';

import { useStableDividendsPendingRewards } from '@modules/stableswap/stabledividends/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { isNull, placeUSDDecimals } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { amplitudeService } from '@shared/services';
import { useToasts, useConfirmOperation } from '@shared/utils';
import { useTranslation } from '@translation';

import { stableDividendsHarvestApi } from '../../api';
import { useStableDividendsItemStore } from '../store';

export const useStableDividendsHarvest = () => {
  const { tezos } = useRootStore();
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { accountPkh } = useAuthStore();
  const { item } = useStableDividendsItemStore();
  const { claimablePendingRewards } = useStableDividendsPendingRewards();

  const harvest = useCallback(async () => {
    if (isNull(tezos) || isNull(accountPkh) || isNull(item)) {
      return;
    }

    const { contractAddress, id } = item;
    const logData = {
      stableswapDividendsHarvest: {
        poolId: id.toNumber(),
        rewardUsd: placeUSDDecimals(claimablePendingRewards).toNumber()
      }
    };

    try {
      amplitudeService.logEvent('STABLESWAP_DIVIDENDS_HARVEST', logData);
      const operation = await stableDividendsHarvestApi(tezos, contractAddress);

      await confirmOperation(operation.opHash, { message: t('stableswap|sucessfullyHarvested') });
      amplitudeService.logEvent('STABLESWAP_DIVIDENDS_HARVEST_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);
      amplitudeService.logEvent('STABLESWAP_DIVIDENDS_HARVEST_FAILED', { ...logData, error });
    }
  }, [accountPkh, claimablePendingRewards, confirmOperation, item, showErrorToast, t, tezos]);

  return { harvest };
};
