import { FoundDex, getLiquidityShare } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { EMPTY_POOL_AMOUNT, LP_TOKEN_DECIMALS } from '@config/constants';
import { toReal, isTezIncluded } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';

import { getValidMichelTemplate, sortTokensContracts } from '../../helpers';

interface LiquidityShares {
  frozen: BigNumber;
  unfrozen: BigNumber;
  total: BigNumber;
}

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const MichelCodec = require('@taquito/michel-codec');

const loadUserLpBalanceTokens = async (
  tezos: TezosToolkit,
  accountPkh: string,
  dex: FoundDex,
  tokenA: Token,
  tokenB: Token
): Promise<Nullable<LiquidityShares>> => {
  const addresses = sortTokensContracts(tokenA, tokenB);
  if (!addresses) {
    return null;
  }

  const michelData = getValidMichelTemplate(addresses);
  const key = Buffer.from(MichelCodec.packData(michelData)).toString('hex');
  const pairId = await dex.storage.storage.token_to_id?.get(key);
  if (!pairId) {
    return null;
  }

  const userLpTokenBalance = await dex.storage.storage.ledger.get([accountPkh, pairId]);

  if (!userLpTokenBalance) {
    return null;
  }

  const realUnfrozenLpTokenBalance = toReal(userLpTokenBalance.balance, LP_TOKEN_DECIMALS);

  return {
    unfrozen: realUnfrozenLpTokenBalance,
    frozen: new BigNumber(EMPTY_POOL_AMOUNT),
    total: realUnfrozenLpTokenBalance
  };
};

const loadUserLpBalanceTez = async (
  tezos: TezosToolkit,
  accountPkh: string,
  dex: FoundDex
): Promise<Nullable<LiquidityShares>> => {
  const liquidityShares = await getLiquidityShare(tezos, dex, accountPkh);

  if (!liquidityShares) {
    return null;
  }

  const realUnfrozenShares = toReal(liquidityShares.unfrozen, LP_TOKEN_DECIMALS);
  const realFrozenShares = toReal(liquidityShares.frozen, LP_TOKEN_DECIMALS);
  const total = realUnfrozenShares.plus(realFrozenShares);

  return {
    total,
    frozen: realFrozenShares,
    unfrozen: realUnfrozenShares
  };
};

export const loadUserLiquidiytShares = async (
  tezos: TezosToolkit,
  accountPkh: string,
  dex: FoundDex,
  tokenA: Token,
  tokenB: Token
) => {
  const isTezosToTokenDex = isTezIncluded([tokenA, tokenB]);

  const balance: Nullable<LiquidityShares> = isTezosToTokenDex
    ? await loadUserLpBalanceTez(tezos, accountPkh, dex)
    : await loadUserLpBalanceTokens(tezos, accountPkh, dex, tokenA, tokenB);

  return balance;
};
