import { BigNumber } from 'bignumber.js';

import { useCurrentTick, useTickSpacing } from '@modules/liquidity/pages/v3-item-page/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { defined, toAtomic } from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { V3Positions } from '../../api/blockchain/v3-liquidity-pool-positions';
import { useLiquidityV3ItemTokens, useV3PoolPriceDecimals } from '../helpers';
import { useLiquidityV3PoolStore } from '../store';

export const useV3NewPosition = () => {
  const { tezos } = useRootStore();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { t } = useTranslation();
  const {
    settings: { transactionDeadline, liquiditySlippage }
  } = useSettingsStore();
  const accountPkh = useAccountPkh();
  const liquidityV3PoolStore = useLiquidityV3PoolStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const currentTick = useCurrentTick();
  const priceDecimals = useV3PoolPriceDecimals();
  const tickSpacing = useTickSpacing();

  const createNewV3Position = async (
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
      amplitudeService.logEvent('DEX_V3_NEW_POSITION', logData);
      const operation = await V3Positions.doNewPositionTransaction(
        tezos,
        accountPkh,
        liquidityV3PoolStore.contractAddress,
        tickSpacing,
        tokenX,
        tokenY,
        transactionDeadline,
        liquiditySlippage,
        currentTick!.index,
        toAtomic(minPrice, priceDecimals),
        toAtomic(maxPrice, priceDecimals),
        toAtomic(xTokenAmount, tokenX),
        toAtomic(yTokenAmount, tokenY)
      );
      if (!operation) {
        return;
      }
      await confirmOperation(operation.opHash, { message: t('liquidity|successfullyAdded') });
      amplitudeService.logEvent('DEX_V3_NEW_POSITION_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);
      amplitudeService.logEvent('DEX_V3_NEW_POSITION_FAILED', { ...logData, error });
    }
  };

  return { createNewV3Position };
};
