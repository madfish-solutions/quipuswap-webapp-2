import BigNumber from 'bignumber.js';

import { FEE_BASE_POINTS_PRECISION } from '@config/constants';
import { V3LiquidityPoolApi } from '@modules/liquidity/api';
import { calculateV3PoolPriceDecimals } from '@modules/liquidity/helpers';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { defined, isNull, toAtomic, toFraction } from '@shared/helpers';
import { useAmplitudeService } from '@shared/hooks';
import { Token } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { calculateTickIndex } from './helpers';
import { getCreateV3PoolLogData } from './helpers/get-create-v3-pool-log-data';

const INVERSION_DIVIDEND = 1;

const tickSpacingDictionary = {
  '0.01': 1,
  '0.05': 10,
  '0.3': 60,
  '1': 200
};

export const useDoCreateV3Pool = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();
  const { log } = useAmplitudeService();

  const doCreatePool = async (feeRate: BigNumber, token0: Token, token1: Token, initialPrice: BigNumber) => {
    if (isNull(tezos) || isNull(accountPkh)) {
      return;
    }
    const tickSpacing = new BigNumber(
      defined(tickSpacingDictionary[feeRate.toFixed() as keyof typeof tickSpacingDictionary], "Can't find tick spacing")
    );

    const logData = getCreateV3PoolLogData(accountPkh, token0, token1, initialPrice, feeRate);

    try {
      log('CREATE_V3_POOL', logData);
      const operation = await V3LiquidityPoolApi.createPool(
        tezos,
        token0,
        token1,
        calculateTickIndex(
          toAtomic(new BigNumber(INVERSION_DIVIDEND).div(initialPrice), calculateV3PoolPriceDecimals(token0, token1))
        ),
        toFraction(feeRate).multipliedBy(FEE_BASE_POINTS_PRECISION),
        tickSpacing
      );

      await confirmOperation(operation.opHash, { message: 'Pool was successfully created' });
      log('CREATE_V3_POOL_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);
      log('CREATE_V3_POOL_ERROR', { ...logData, error });
    }
  };

  return { doCreatePool };
};
