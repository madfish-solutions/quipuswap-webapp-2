import { BigNumber } from 'bignumber.js';

import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { defined } from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { V3Positions } from '../../api/blockchain/v3-liquidity-pool-positions';
import { getLiquidityTicks } from '../../api/v3-liquidity-ticks';
import { useLiquidityV3ItemTokens } from '../helpers';
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
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  const createNewV3Pool = async (
    minPrice: BigNumber,
    maxPrice: BigNumber,
    xTokenAmount: BigNumber,
    yTokenAmount: BigNumber
  ) => {
    if (
      !tezos ||
      !accountPkh ||
      !liquidityV3PoolStore.item ||
      !liquidityV3PoolStore.contractAddress ||
      !tokenX ||
      !tokenY
    ) {
      return (
        defined(tezos, 'tezos'),
        defined(accountPkh, 'accountPkh'),
        defined(liquidityV3PoolStore.item, 'liquidityV3PoolStore.item'),
        defined(liquidityV3PoolStore.contractAddress, 'liquidityV3PoolStore.contractAddress'),
        defined(tokenX, 'tokenX'),
        defined(tokenY, 'tokenY')
      );
    }
    const logData = {
      liquiditySlippage,
      transactionDeadline,
      item: liquidityV3PoolStore.item,
      contractAddress: liquidityV3PoolStore.contractAddress,
      minPrice: minPrice.toFixed(),
      maxPrice: maxPrice.toFixed(),
      xTokenAmount: xTokenAmount.toFixed(),
      yTokenAmount: yTokenAmount.toFixed()
    };

    try {
      amplitudeService.logEvent('DEX_V3_NEW_POOL', logData);
      const ticks = await getLiquidityTicks(liquidityV3PoolStore.contractAddress);
      const operation = await V3Positions.doNewPositionTransaction(
        tezos,
        accountPkh,
        liquidityV3PoolStore.contractAddress,
        tokenX,
        tokenY,
        transactionDeadline,
        liquiditySlippage,
        liquidityV3PoolStore.item.storage.cur_tick_index,
        minPrice,
        maxPrice,
        xTokenAmount,
        yTokenAmount,
        ticks
      );
      if (!operation) {
        return;
      }
      await confirmOperation(operation.opHash, { message: t('liquidity|successfullyAdded') });
      amplitudeService.logEvent('DEX_V3_NEW_POOL_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);
      amplitudeService.logEvent('DEX_V3_NEW_POOL_FAILED', { ...logData, error });
    }
  };

  return { createNewV3Pool };
};
