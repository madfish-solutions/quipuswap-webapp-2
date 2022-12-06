import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { defined } from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { V3Positions } from '../../api/blockchain/v3-liquidity-pool-positions';
import { useLiquidityV3ItemStore } from '../store';

export const useV3NewPool = () => {
  const { tezos } = useRootStore();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { t } = useTranslation();
  const {
    settings: { transactionDeadline, liquiditySlippage }
  } = useSettingsStore();
  const accountPkh = useAccountPkh();
  const liquidityV3PoolStore = useLiquidityV3ItemStore();

  // eslint-disable-next-line no-console
  console.log(liquidityV3PoolStore.item);

  const createNewV3Pool = async () => {
    const logData = {
      liquiditySlippage,
      transactionDeadline,
      item: liquidityV3PoolStore.item
    };

    try {
      amplitudeService.logEvent('DEX_V3_NEW_POOL', logData);
      const operation = await V3Positions.doNewPositionTransaction(
        defined(tezos, 'tezos'),
        defined(accountPkh, 'accountPkh'),
        defined(liquidityV3PoolStore.contractAddress, 'contractAddress')
      );
      await confirmOperation(operation.opHash, { message: t('liquidity|successfullyAdded') });
      amplitudeService.logEvent('DEX_V3_NEW_POOL_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);
      amplitudeService.logEvent('DEX_V3_NEW_POOL_FAILED', { ...logData, error });
    }
  };

  return { createNewV3Pool };
};
