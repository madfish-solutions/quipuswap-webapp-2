import { FoundDex, getLiquidityShare } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { EMPTY_POOL_AMOUNT, LP_TOKEN_DECIMALS } from '@app.config';
import { fromDecimals, isTezIncluded } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

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
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken
): Promise<Nullable<LiquidityShares>> => {
  const addresses = sortTokensContracts(tokenA, tokenB);
  if (!addresses) {
    return null;
  }

  const michelData = getValidMichelTemplate(addresses);
  const key = Buffer.from(MichelCodec.packData(michelData)).toString('hex');
  const pairId = await dex.storage.storage.token_to_id.get(key);
  if (!pairId) {
    return null;
  }

  const userLpTokenBalance = await dex.storage.storage.ledger.get([accountPkh, pairId]);

  if (!userLpTokenBalance) {
    return null;
  }

  const unfrozen = fromDecimals(userLpTokenBalance.balance, LP_TOKEN_DECIMALS);

  return {
    unfrozen,
    frozen: new BigNumber(EMPTY_POOL_AMOUNT),
    total: unfrozen
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

  const unfrozen = fromDecimals(liquidityShares.unfrozen, LP_TOKEN_DECIMALS);
  const frozen = fromDecimals(liquidityShares.frozen, LP_TOKEN_DECIMALS);
  const total = unfrozen.plus(frozen);

  return {
    total,
    frozen,
    unfrozen
  };
};

export const loadUserLiquidiytShares = async (
  tezos: TezosToolkit,
  accountPkh: string,
  dex: FoundDex,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken
) => {
  const isTezosToTokenDex = isTezIncluded([tokenA, tokenB]);

  const balance: Nullable<LiquidityShares> = isTezosToTokenDex
    ? await loadUserLpBalanceTez(tezos, accountPkh, dex)
    : await loadUserLpBalanceTokens(tezos, accountPkh, dex, tokenA, tokenB);

  return balance;
};
