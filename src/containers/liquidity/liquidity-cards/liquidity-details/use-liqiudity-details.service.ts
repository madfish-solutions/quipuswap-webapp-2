import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { QUIPUSWAP_ANALYTICS_PAIRS, TZKT_EXPLORER_URL } from '@app.config';
import { fromDecimals, getTokenSymbol } from '@utils/helpers';
import { Nullable, Token } from '@utils/types';

import { calculatePoolAmount } from '../helpers';
import { usePairInfo } from '../hooks';

const ONE_TOKEN = 1;
const ONE_TOKEN_BN = new BigNumber(ONE_TOKEN);

export const useLiquidityDetailsService = (
  dex: Nullable<FoundDex>,
  tokenA: Nullable<Token>,
  tokenB: Nullable<Token>
) => {
  const { pairInfo } = usePairInfo(dex, tokenA, tokenB);

  const isTokensOrderValid = tokenA?.contractAddress === pairInfo?.tokenA.contractAddress;

  const tokenAPool = isTokensOrderValid ? pairInfo?.tokenAPool ?? null : pairInfo?.tokenBPool ?? null;
  const tokenBPool = isTokensOrderValid ? pairInfo?.tokenBPool ?? null : pairInfo?.tokenAPool ?? null;

  const fixedTokenAPoll = tokenA && tokenAPool && fromDecimals(tokenAPool, tokenA);
  const fixedTokenBPoll = tokenB && tokenBPool && fromDecimals(tokenBPool, tokenB);

  const tokenAName = tokenA ? getTokenSymbol(tokenA) : null;
  const tokenBName = tokenB ? getTokenSymbol(tokenB) : null;

  const sellPrice = calculatePoolAmount(ONE_TOKEN_BN, tokenA, tokenB, tokenAPool, tokenBPool);
  const buyPrice = calculatePoolAmount(ONE_TOKEN_BN, tokenB, tokenA, tokenBPool, tokenAPool);

  const pairLink = dex ? `${QUIPUSWAP_ANALYTICS_PAIRS}/${dex.contract.address}` : null;
  const contractLink = dex ? `${TZKT_EXPLORER_URL}/${dex.contract.address}` : null;

  return {
    fixedTokenAPoll,
    fixedTokenBPoll,
    tokenAName,
    tokenBName,
    sellPrice,
    buyPrice,
    pairLink,
    contractLink
  };
};
