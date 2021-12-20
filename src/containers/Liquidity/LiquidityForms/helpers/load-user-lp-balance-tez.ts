import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

import { findNotTezTokenInPair } from '@containers/Liquidity/liquidutyHelpers';
import { getUserBalance } from '@utils/dapp';
import { WhitelistedToken } from '@utils/types';

export const loadUserLpBalanceTez = async (
  tezos: TezosToolkit,
  accountPkh: string,
  dex: FoundDex,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken
) => {
  const notTezToken = findNotTezTokenInPair(tokenA, tokenB);

  const { address } = dex.contract;
  const { type, fa2TokenId } = notTezToken;

  return getUserBalance(tezos, accountPkh, address, type, fa2TokenId);
};
