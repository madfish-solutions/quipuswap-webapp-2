import { FoundDex, TransferParams, voteForBaker } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { LP_TOKEN_DECIMALS } from '@config/config';
import { toDecimals } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { LiquidityShareResult } from '../../hooks';

export const getVotingParams = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  accountPkh: string,
  lpTokenInputBN: BigNumber,
  shares: Nullable<LiquidityShareResult>
): Promise<TransferParams[]> => {
  if (shares && lpTokenInputBN.gt(shares.unfrozen) && dex.storage) {
    const { total } = shares;
    const delta = total.minus(lpTokenInputBN);
    const deltaWithDecimals = toDecimals(delta, LP_TOKEN_DECIMALS);

    const { candidate } = await dex.storage.storage.voters.get(accountPkh);

    return await voteForBaker(tezos, dex, candidate, deltaWithDecimals);
  }

  return [];
};
