import BigNumber from 'bignumber.js';

import { FEE_BASE_POINTS_PRECISION } from '@config/constants';
import { V3LiquidityPoolApi } from '@modules/liquidity/api';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { isNull, toAtomic, toFraction } from '@shared/helpers';
import { useAmplitudeService } from '@shared/hooks';
import { Standard, Token } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { calculateTickIndex, calculateTokenPriceDecimals } from './helpers';
import { getCreateV3PoolLogData } from './helpers/get-create-v3-pool-log-data';

const MOCK_PRICE = new BigNumber('0.044');
const MOCK_FEE_PERCENTAGE = new BigNumber('3');
const MOCK_TOKEN_X = {
  type: Standard.Fa12,
  metadata: {
    decimals: 18,
    name: 'Test Kolibri USD',
    symbol: 'kUSD2',
    thumbnailUri: 'https://kolibri-data.s3.amazonaws.com/logo.png',
    categories: ['stablecoin']
  },
  isWhitelisted: false,
  contractAddress: 'KT1Q1qqJAzzxzGzQB6RmxnAKgxttf7Hntceg'
};
const MOCK_TOKEN_Y: Token = {
  type: Standard.Fa2,
  metadata: {
    decimals: 6,
    name: 'Grape Token',
    symbol: 'GRP',
    thumbnailUri: 'https://pngicon.ru/file/uploads/vinogradnyye-grozdi.png',
    categories: []
  },
  isWhitelisted: false,
  contractAddress: 'KT1Q1qqJAzzxzGzQB6RmxnAKgxttf7Hntceg'
};

const INVERSION_DIVIDEND = 1;

export const useCreateNewPoolPageViewModel = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();
  const { log } = useAmplitudeService();

  const handleCreatePoolClick = async () => {
    if (isNull(tezos) || isNull(accountPkh)) {
      return;
    }

    const logData = getCreateV3PoolLogData(accountPkh, MOCK_TOKEN_X, MOCK_TOKEN_Y, MOCK_PRICE, MOCK_FEE_PERCENTAGE);

    try {
      log('CREATE_V3_POOL', logData);
      const operation = await V3LiquidityPoolApi.createPool(
        tezos,
        MOCK_TOKEN_X,
        MOCK_TOKEN_Y,
        calculateTickIndex(
          toAtomic(
            new BigNumber(INVERSION_DIVIDEND).div(MOCK_PRICE),
            calculateTokenPriceDecimals(MOCK_TOKEN_X, MOCK_TOKEN_Y)
          )
        ),
        toFraction(MOCK_FEE_PERCENTAGE).multipliedBy(FEE_BASE_POINTS_PRECISION)
      );

      await confirmOperation(operation.opHash, { message: 'Pool was successfully created' });
      log('CREATE_V3_POOL_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);
      log('CREATE_V3_POOL_ERROR', { ...logData, error });
    }
  };

  return { handleCreatePoolClick };
};
