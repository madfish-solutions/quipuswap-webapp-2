import BigNumber from 'bignumber.js';
import { FormikValues } from 'formik';

import {
  useLiquidityV3ItemTokens,
  useLiquidityV3PoolStore,
  useLiquidityV3PositionStore
} from '@modules/liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { getTransactionDeadline, isNull, getPercentageFromNumber } from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { V3RemoveLiquidityApi } from '../../../api';
import { findUserPosition } from '../../../helpers';
import { usePositionsWithStats } from '../../../hooks';
import { V3RemoveTokenInput } from '../interface';

// TODO: logData

export const useV3RemoveLiquidity = () => {
  const { tezos } = useRootStore();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { t } = useTranslation();
  const {
    settings: { transactionDeadline }
  } = useSettingsStore();
  const accountPkh = useAccountPkh();
  const poolStore = useLiquidityV3PoolStore();
  const { positionsWithStats } = usePositionsWithStats();
  const { positionId } = useLiquidityV3PositionStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const item = poolStore.item;

  const position = findUserPosition(positionsWithStats, positionId);

  const removeLiquidity = async (inputAmounts: FormikValues) => {
    if (isNull(tezos) || isNull(accountPkh) || isNull(position) || isNull(tokenX) || isNull(tokenY) || isNull(item)) {
      return;
    }

    const percantage = new BigNumber(inputAmounts[V3RemoveTokenInput.percantageInput]);
    const liquidity = getPercentageFromNumber(position.liquidity, percantage).integerValue(BigNumber.ROUND_DOWN);
    const deadline = await getTransactionDeadline(tezos, transactionDeadline);

    const logData = {};

    try {
      amplitudeService.logEvent('V3_LIQUIDITY_REMOVE', logData);
      const operation = await V3RemoveLiquidityApi(
        tezos,
        item.contractAddress,
        position.id,
        liquidity,
        accountPkh,
        deadline
      );
      await confirmOperation(operation.opHash, { message: t('liquidity|successfullyRemoved') });
      amplitudeService.logEvent('V3_LIQUIDITY_REMOVE_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);
      amplitudeService.logEvent('V3_LIQUIDITY_REMOVE_FAILED', { ...logData, error });
    }
  };

  return { removeLiquidity };
};
