import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { getUserBalance } from '@api/get-user-balance';
import { LP_TOKEN_DECIMALS } from '@app.config';
import { fromDecimals, isTezIncluded } from '@utils/helpers';
import { Nullable, Token } from '@utils/types';

import { findNotTezToken, getValidMichelTemplate, sortTokensContracts } from '../../helpers';

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const MichelCodec = require('@taquito/michel-codec');

const loadUserLpBalanceTokens = async (
  tezos: TezosToolkit,
  accountPkh: string,
  dex: FoundDex,
  tokenA: Token,
  tokenB: Token
): Promise<Nullable<BigNumber>> => {
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

  return userLpTokenBalance?.balance || null;
};

const loadUserLpBalanceTez = async (tezos: TezosToolkit, accountPkh: string, dex: FoundDex, notTezToken: Token) => {
  const { address } = dex.contract;
  const { type, fa2TokenId } = notTezToken;

  return getUserBalance(tezos, accountPkh, address, type, fa2TokenId);
};

export const loadUserLpBalance = async (
  tezos: TezosToolkit,
  accountPkh: string,
  dex: FoundDex,
  tokenA: Token,
  tokenB: Token
) => {
  const isTezosToTokenDex = isTezIncluded([tokenA, tokenB]);
  const notTezToken = findNotTezToken([tokenA, tokenB]);

  const balance: Nullable<BigNumber> =
    isTezosToTokenDex && notTezToken
      ? await loadUserLpBalanceTez(tezos, accountPkh, dex, notTezToken)
      : await loadUserLpBalanceTokens(tezos, accountPkh, dex, tokenA, tokenB);

  return balance ? fromDecimals(balance, LP_TOKEN_DECIMALS) : null;
};
