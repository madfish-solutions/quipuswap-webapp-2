import { FoundDex, TransferParams, voteForBaker } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { LP_TOKEN_DECIMALS } from '@app.config';
import { LiquidityShareResult } from '@containers/liquidity/hooks/use-load-liquidity-share';
import { toDecimals } from '@utils/helpers';
import { Nullable } from '@utils/types';

export const getVotingParams = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  accountPkh: string,
  lpTokenInputBN: BigNumber,
  shares: Nullable<LiquidityShareResult>
): Promise<TransferParams[]> => {
  if (shares && lpTokenInputBN.gt(shares.unfrozen)) {
    const { total } = shares;
    const delta = total.minus(lpTokenInputBN);
    const deltaWithDecimals = toDecimals(delta, LP_TOKEN_DECIMALS);

    const { candidate } = await dex.storage.storage.voters.get(accountPkh);

    return await voteForBaker(tezos, dex, candidate, deltaWithDecimals);
  }

  return [];
};
