import { DexTypeEnum, Trade, TradeOperation } from 'swap-router-sdk';

import { UnsupportedDexType } from '@shared/errors/unsupported-dex-type.error';
import { getTokenIdFromSlug } from '@shared/helpers';
import { TokensMap } from '@shared/store/tokens.store';
import { DexPair, DexPairType, Token } from '@shared/types';

// TODO: add full Stableswap DEXes support
const mapDexType = (dexType: DexTypeEnum): DexPairType => {
  switch (dexType) {
    case DexTypeEnum.QuipuSwap:
      return DexPairType.TokenToXtz;
    case DexTypeEnum.QuipuSwapTokenToTokenDex:
      return DexPairType.TokenToToken;
    default:
      throw new UnsupportedDexType();
  }
};

const DEFAULT_DEX_ID = 0;

const mapTradeToDexPair = (operation: TradeOperation, token1: Token, token2: Token): DexPair => {
  const { aTokenPool, bTokenPool, dexType, dexAddress, dexId } = operation;

  const dex = {
    token1Pool: aTokenPool,
    token2Pool: bTokenPool,
    token1,
    token2
  };

  const type = mapDexType(dexType);

  if (type === DexPairType.TokenToXtz) {
    return {
      ...dex,
      id: dexAddress,
      type
    };
  }

  return {
    ...dex,
    id: dexId?.toNumber() ?? DEFAULT_DEX_ID,
    type: DexPairType.TokenToToken
  };
};

export const mapTradeToDexPairs = (trade: Nullable<Trade>, tokens: TokensMap) =>
  trade
    ? trade.map(operation => {
        const { aTokenSlug, bTokenSlug } = operation;
        const { contractAddress: aTokenAddress } = getTokenIdFromSlug(aTokenSlug);
        const { contractAddress: bTokenAddress } = getTokenIdFromSlug(bTokenSlug);
        const token1 = tokens.get(aTokenSlug) ?? tokens.get(aTokenAddress);
        const token2 = tokens.get(bTokenSlug) ?? tokens.get(bTokenAddress);

        if (!token1) {
          throw new Error(`No Token Metadata of ${token1}`);
        }
        if (!token2) {
          throw new Error(`No Token Metadata of ${token2}`);
        }

        return mapTradeToDexPair(operation, token1, token2);
      })
    : [];
