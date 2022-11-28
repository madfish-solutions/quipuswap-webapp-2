import { useEffect, useMemo } from 'react';

import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';

import { IS_NETWORK_MAINNET } from '@config/config';
import { TESTNET_EXCHANGE_RATE } from '@config/constants';
import {
  useLiquidityV3ItemStore,
  useLiquidityV3ItemTokens,
  useLiquidityV3PositionsStore
} from '@modules/liquidity/hooks';
import {
  defined,
  getSumOfNumbers,
  getTokenDecimals,
  isExist,
  isNull,
  multipliedIfPossible,
  toReal
} from '@shared/helpers';
import { fractionToPercentage } from '@shared/helpers/percentage';
import { useTokenExchangeRate } from '@shared/hooks';

import { convertToRealPrice } from './helpers';

const FEE_PRECISION = 10000;

// TODO: replace mock values
const MOCK_TOKEN_X_AMOUNT = new BigNumber('6004');
const MOCK_TOKEN_Y_AMOUNT = new BigNumber('202000');

export const useV3PositionsViewModel = () => {
  const { id } = useParams();
  const v3ItemStore = useLiquidityV3ItemStore();
  const v3PositionsStore = useLiquidityV3PositionsStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { getTokenExchangeRate } = useTokenExchangeRate();

  const item = v3ItemStore.item;
  const rawPositions = v3PositionsStore.positions;

  useEffect(() => {
    v3PositionsStore.setPoolId(new BigNumber(defined(id, 'id')));
    void v3PositionsStore.positionsStore.load();
  }, [v3PositionsStore, id]);

  const isLoading =
    v3ItemStore.itemIsLoading || v3PositionsStore.positionsAreLoading || isNull(tokenX) || isNull(tokenY);

  const tokenXExchangeRate =
    IS_NETWORK_MAINNET && isExist(tokenX) ? getTokenExchangeRate(tokenX) : TESTNET_EXCHANGE_RATE;
  const tokenYExchangeRate =
    IS_NETWORK_MAINNET && isExist(tokenY) ? getTokenExchangeRate(tokenY) : TESTNET_EXCHANGE_RATE;

  const tokenPriceDecimals = getTokenDecimals(tokenY) - getTokenDecimals(tokenX);
  const currentPrice = useMemo(
    () => item && toReal(convertToRealPrice(item?.storage.sqrt_price), tokenPriceDecimals),
    [tokenPriceDecimals, item]
  );

  const positions = useMemo(() => {
    if (isNull(item) || isNull(rawPositions) || isNull(tokenX) || isNull(tokenY)) {
      return [];
    }

    return rawPositions.map(position => {
      const tokenXDeposit = toReal(new BigNumber('1000'), tokenX);
      const tokenYDeposit = toReal(new BigNumber('1000'), tokenY);
      const tokenXFees = toReal(new BigNumber('1'), tokenX);
      const tokenYFees = toReal(new BigNumber('1'), tokenY);
      const minRange = toReal(convertToRealPrice(position.lower_tick.sqrt_price), tokenPriceDecimals);
      const maxRange = toReal(convertToRealPrice(position.upper_tick.sqrt_price), tokenPriceDecimals);

      return {
        tokens: [tokenX, tokenY],
        minRange,
        maxRange,
        isInRange: currentPrice!.gte(minRange) && currentPrice!.lte(maxRange),
        depositUsd: getSumOfNumbers([
          multipliedIfPossible(tokenXDeposit, tokenXExchangeRate),
          multipliedIfPossible(tokenYDeposit, tokenYExchangeRate)
        ]),
        collectedFeesUsd: getSumOfNumbers([
          multipliedIfPossible(tokenXFees, tokenXExchangeRate),
          multipliedIfPossible(tokenYFees, tokenYExchangeRate)
        ])
      };
    });
  }, [item, rawPositions, tokenX, tokenY, tokenPriceDecimals, tokenXExchangeRate, tokenYExchangeRate, currentPrice]);

  const tvlInUsd = useMemo(
    () =>
      getSumOfNumbers([
        multipliedIfPossible(toReal(MOCK_TOKEN_X_AMOUNT, tokenX), tokenXExchangeRate),
        multipliedIfPossible(toReal(MOCK_TOKEN_Y_AMOUNT, tokenY), tokenYExchangeRate)
      ]),
    [tokenX, tokenXExchangeRate, tokenY, tokenYExchangeRate]
  );
  const feeRatePercentage = item && fractionToPercentage(item.storage.constants.fee_bps.dividedBy(FEE_PRECISION));

  return {
    currentPrice,
    isLoading,
    positions,
    tvlInUsd,
    tokenX,
    tokenY,
    feeRatePercentage
  };
};
