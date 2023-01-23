import BigNumber from 'bignumber.js';
import { FormikValues } from 'formik';

import {
  useLiquidityV3ItemTokens,
  useLiquidityV3PoolStore,
  useLiquidityV3PositionStore
} from '@modules/liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { decreaseByPercentage, getTransactionDeadline, isNull } from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { V3AddLiquidityApi } from '../../../api/v3-add-liquidity';
import { findUserPosition, makeV3LiquidityOperationLogData } from '../../../helpers';
import { calculateLiquidity } from '../../../helpers/v3-liquidity-helpers';
import { useCurrentTick, usePositionsWithStats } from '../../../hooks';
import { getTokensValues } from '../helpers/get-tokens-values';
import { V3AddTokenInput } from '../interface';
import { usePositionTicks } from './use-position-ticks';

export const useV3AddLiquidity = () => {
  const { tezos } = useRootStore();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { t } = useTranslation();
  const {
    settings: { transactionDeadline, liquiditySlippage }
  } = useSettingsStore();
  const accountPkh = useAccountPkh();
  const poolStore = useLiquidityV3PoolStore();
  const { positionsWithStats } = usePositionsWithStats();
  const { positionId } = useLiquidityV3PositionStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const item = poolStore.item;
  const { lowerTick, upperTick } = usePositionTicks();
  const currentTick = useCurrentTick();

  const position = findUserPosition(positionsWithStats, positionId);

  const addLiquidity = async (inputAmounts: FormikValues) => {
    if (
      isNull(tezos) ||
      isNull(accountPkh) ||
      isNull(position) ||
      isNull(tokenX) ||
      isNull(tokenY) ||
      isNull(item) ||
      isNull(lowerTick) ||
      isNull(upperTick) ||
      isNull(currentTick)
    ) {
      return;
    }

    const tokensValues = getTokensValues(inputAmounts, tokenX, tokenY);
    const deadline = await getTransactionDeadline(tezos, transactionDeadline);

    const liquidity = calculateLiquidity(
      currentTick.index,
      lowerTick.index,
      upperTick.index,
      currentTick.price,
      lowerTick.price,
      upperTick.price,
      tokensValues.x,
      tokensValues.y
    );
    const liquidityWithSlippage = decreaseByPercentage(liquidity, liquiditySlippage).integerValue(BigNumber.ROUND_DOWN);

    const logData = {
      addLiquidity: makeV3LiquidityOperationLogData(
        position,
        liquiditySlippage,
        tokenX,
        tokenY,
        inputAmounts[V3AddTokenInput.firstTokenInput],
        inputAmounts[V3AddTokenInput.secondTokenInput]
      )
    };

    try {
      amplitudeService.logEvent('V3_LIQUIDITY_ADD', logData);
      const operation = await V3AddLiquidityApi(
        tezos,
        item.contractAddress,
        position.id,
        liquidityWithSlippage,
        accountPkh,
        deadline,
        tokenX,
        tokenY,
        tokensValues
      );
      await confirmOperation(operation.opHash, { message: t('liquidity|successfullyAdded') });
      amplitudeService.logEvent('V3_LIQUIDITY_ADD_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);
      amplitudeService.logEvent('V3_LIQUIDITY_ADD_FAILED', { ...logData, error });
    }
  };

  return { addLiquidity };
};
