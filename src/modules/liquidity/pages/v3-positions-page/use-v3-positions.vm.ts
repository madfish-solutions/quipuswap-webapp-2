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

// TODO: replace mock values with those from item store
const MOCK_LIQUIDITY_AMOUNT = 10000;
const MOCK_TOKEN_X_AMOUNT = new BigNumber('1e18');
const MOCK_TOKEN_Y_AMOUNT = new BigNumber('1e6');
const MOCK_PRICE_SQUARE = new BigNumber('1208925819614629174706176');
const MOCK_FEE_FRACTION = new BigNumber('5e-4');

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

  const tokenPriceDecimals = getTokenDecimals(tokenX) - getTokenDecimals(tokenY);
  const currentPrice = useMemo(
    () => toReal(MOCK_PRICE_SQUARE.squareRoot().integerValue(), tokenPriceDecimals),
    [tokenPriceDecimals]
  );

  const positions = useMemo(() => {
    if (isNull(item) || isNull(rawPositions) || isNull(tokenX) || isNull(tokenY)) {
      return [];
    }

    return rawPositions.map(position => {
      const tokenXDeposit = toReal(
        position.liqAmount.times(MOCK_TOKEN_X_AMOUNT).dividedToIntegerBy(MOCK_LIQUIDITY_AMOUNT),
        tokenX
      );
      const tokenYDeposit = toReal(
        position.liqAmount.times(MOCK_TOKEN_Y_AMOUNT).dividedToIntegerBy(MOCK_LIQUIDITY_AMOUNT),
        tokenY
      );
      const tokenXFees = toReal(position.tokenXFees, tokenX);
      const tokenYFees = toReal(position.tokenYFees, tokenY);
      const minRange = toReal(position.minRange, tokenPriceDecimals);
      const maxRange = toReal(position.maxRange, tokenPriceDecimals);

      return {
        tokens: [tokenX, tokenY],
        minRange,
        maxRange,
        isInRange: currentPrice.gte(minRange) && currentPrice.lte(maxRange),
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

  return {
    currentPrice,
    isLoading,
    positions,
    tvlInUsd,
    feeRatePercentage: fractionToPercentage(MOCK_FEE_FRACTION)
  };
};
