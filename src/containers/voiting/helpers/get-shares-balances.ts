import { FoundDex, getLiquidityShare } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

import { LP_TOKEN_DECIMALS } from '@app.config';
import { fromDecimals } from '@utils/helpers';
import { Nullable } from '@utils/types';

export const getShareBalances = async (
  tezos: Nullable<TezosToolkit>,
  dex: Nullable<FoundDex>,
  accountPkh: Nullable<string>
): Promise<Nullable<{ frozenBalance: string; totalBalance: string }>> => {
  if (!tezos || !dex || !accountPkh) {
    return null;
  }
  const share = await getLiquidityShare(tezos, dex, accountPkh);
  const frozenBalance = fromDecimals(share.frozen, LP_TOKEN_DECIMALS).toString();
  const totalBalance = fromDecimals(share.total, LP_TOKEN_DECIMALS).toString();

  return {
    frozenBalance,
    totalBalance
  };
};
