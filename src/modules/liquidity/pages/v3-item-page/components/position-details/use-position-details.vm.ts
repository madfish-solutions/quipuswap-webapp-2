import { EMPTY_STRING, FEE_BASE_POINTS_PRECISION, SLASH, ZERO_AMOUNT_BN } from '@config/constants';
import { TZKT_EXPLORER_URL } from '@config/environment';
import { getSymbolsString, isExist } from '@shared/helpers';
import { fractionToPercentage } from '@shared/helpers/percentage';

import { getCurrentPrice, getSymbolsStringByActiveToken } from '../../../../helpers';
import {
  useLiquidityV3CurrentPrice,
  useLiquidityV3PoolStore,
  useLiquidityV3ItemTokens,
  useLiquidityV3PositionStore
} from '../../../../hooks';
import { convertToAtomicPrice, findUserPosition } from '../../helpers';
import { usePositionsWithStats } from '../../hooks';

export const usePositionDetailsViewModel = () => {
  const store = useLiquidityV3PoolStore();
  const { positionId } = useLiquidityV3PositionStore();
  const { contractAddress, feeBps } = useLiquidityV3PoolStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const currentPrice = useLiquidityV3CurrentPrice();
  const { positionsWithStats } = usePositionsWithStats();

  const position = findUserPosition(positionsWithStats, positionId);

  const isInRange = position?.stats.isInRange ?? false;

  const feeBpsPercentage = isExist(feeBps) ? fractionToPercentage(feeBps.dividedBy(FEE_BASE_POINTS_PRECISION)) : null;
  const _currentPrice = isExist(currentPrice) ? getCurrentPrice(currentPrice, store.activeTokenIndex) : null;

  const tokensSymbols = getSymbolsStringByActiveToken([tokenX, tokenY], store.activeTokenIndex);

  const handleButtonClick = (index: number) => store.setActiveTokenIndex(index);

  const minPrice = convertToAtomicPrice(position?.lower_tick.sqrt_price ?? ZERO_AMOUNT_BN);
  const maxPrice = convertToAtomicPrice(position?.upper_tick.sqrt_price ?? ZERO_AMOUNT_BN);
  const priceRangeSymbols = getSymbolsString([tokenY, tokenX]);

  return {
    id: positionId,
    poolContractUrl: `${TZKT_EXPLORER_URL}${SLASH}${contractAddress}`,
    feeBps: feeBpsPercentage,
    currentPrice: _currentPrice,
    tokensSymbols,
    tokenXSymbol: tokenX?.metadata.symbol ?? EMPTY_STRING,
    tokenYSymbol: tokenY?.metadata.symbol ?? EMPTY_STRING,
    tokenActiveIndex: store.activeTokenIndex,
    handleButtonClick,
    minPrice,
    maxPrice,
    priceRangeSymbols,
    isInRange
  };
};
