import { estimateReward, FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

import { TEZOS_TOKEN } from '@app.config';
import { fromDecimals } from '@utils/helpers';
import { Nullable } from '@utils/types';

export const getRewards = async (
  tezos: Nullable<TezosToolkit>,
  dex: Nullable<FoundDex>,
  accountPkh: Nullable<string>
): Promise<Nullable<string>> => {
  if (!tezos || !dex || !accountPkh) {
    return null;
  }
  const res = await estimateReward(tezos, dex, accountPkh);

  return fromDecimals(res, TEZOS_TOKEN.metadata.decimals).toString();
};
