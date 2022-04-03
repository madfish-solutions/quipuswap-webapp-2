import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { HIDE_ANALYTICS, QUIPUSWAP_ANALYTICS_PAIRS, TZKT_EXPLORER_URL } from '@config/config';
import { fromDecimals, getTokenSymbol, isTezIncluded, isTokenFa2, isUndefined } from '@shared/helpers';
import { Nullable, Optional, Token } from '@shared/types';

import { PairInfo } from '../add-liquidity-form';
import { calculatePoolAmount, checkIsPoolNotExists } from '../helpers';
import { usePairInfo } from '../hooks';

const ONE_TOKEN = 1;
const ONE_TOKEN_BN = new BigNumber(ONE_TOKEN);

const getPoolFixed = (token: Nullable<Token>, pool: Nullable<BigNumber>) => token && pool && fromDecimals(pool, token);

const getPairLink = (
  dex: Optional<FoundDex>,
  tokenA: Nullable<Token>,
  tokenB: Nullable<Token>,
  pairInfo: Optional<PairInfo>
) =>
  !HIDE_ANALYTICS && dex && isTezIncluded([tokenA, tokenB]) && !isUndefined(pairInfo) && !checkIsPoolNotExists(pairInfo)
    ? `${QUIPUSWAP_ANALYTICS_PAIRS}/${dex.contract.address}`
    : null;

const getPairId = (
  dex: Optional<FoundDex>,
  tokenA: Nullable<Token>,
  tokenB: Nullable<Token>,
  pairInfo: Optional<PairInfo>,
  isPoolNotExists: boolean
) => {
  if (!dex || isPoolNotExists) {
    return null;
  }

  if (pairInfo?.id) {
    return pairInfo?.id?.toFixed();
  }

  if ((tokenA && isTokenFa2(tokenA)) || (tokenB && isTokenFa2(tokenB))) {
    return '0';
  }

  return null;
};

export const useLiquidityDetailsViewModel = (
  dex: Optional<FoundDex>,
  tokenA: Nullable<Token>,
  tokenB: Nullable<Token>
) => {
  const { pairInfo, tokenAPool, tokenBPool, isPoolExists, isPoolNotExists } = usePairInfo(dex, tokenA, tokenB);

  const fixedTokenAPoll = getPoolFixed(tokenA, tokenAPool);
  const fixedTokenBPoll = getPoolFixed(tokenB, tokenBPool);

  const tokenASymbol = tokenA ? getTokenSymbol(tokenA) : null;
  const tokenBSymbol = tokenB ? getTokenSymbol(tokenB) : null;

  const sellPrice = calculatePoolAmount(ONE_TOKEN_BN, tokenA, tokenB, tokenAPool, tokenBPool);
  const buyPrice = calculatePoolAmount(ONE_TOKEN_BN, tokenB, tokenA, tokenBPool, tokenAPool);

  const pairLink = getPairLink(dex, tokenA, tokenB, pairInfo);

  const contractLink = dex ? `${TZKT_EXPLORER_URL}/${dex.contract.address}` : null;

  const contractAddress = dex && contractLink && isPoolExists ? dex.contract.address : null;

  const pairId = getPairId(dex, tokenA, tokenB, pairInfo, isPoolNotExists);

  return {
    fixedTokenAPoll,
    fixedTokenBPoll,
    tokenASymbol,
    tokenBSymbol,
    sellPrice,
    buyPrice,
    pairLink,
    contractLink,
    isPoolNotExists,
    contractAddress,
    pairId
  };
};
