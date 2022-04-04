import { Dispatch, SetStateAction } from 'react';

import { FoundDex, findDex, estimateReward, getLiquidityShare } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { FACTORIES } from '@config/config';
import { LP_TOKEN_DECIMALS } from '@config/constants';
import { TEZOS_TOKEN } from '@config/tokens';
import { fromDecimals } from '@shared/helpers';
import { UseToasts } from '@shared/hooks';
import { VoterType, QSNets, Nullable, TokenPair } from '@shared/types';

export interface HandleTokenPairSelectReturnType {
  tokenPair: TokenPair;
  rewards: Nullable<string>;
  dex: Nullable<FoundDex>;
  voter: VoterType;
}

export const handleTokenPairSelect = async (
  pair: TokenPair,
  setTokenPair: Dispatch<SetStateAction<Nullable<TokenPair>>>,
  showErrorToast: UseToasts['showErrorToast'],
  tezos: Nullable<TezosToolkit>,
  accountPkh: Nullable<string>,
  networkId: QSNets
): Promise<Nullable<HandleTokenPairSelectReturnType>> => {
  const result: HandleTokenPairSelectReturnType = {} as HandleTokenPairSelectReturnType;

  if (!tezos || !networkId) {
    setTokenPair(pair);

    return null;
  }

  try {
    const secondAsset: { contract: string; id?: number } = {
      contract: pair.token2.contractAddress,
      id: pair.token2.fa2TokenId
    };

    const foundDex = await findDex(tezos, FACTORIES[networkId], secondAsset);

    result.dex = foundDex;

    if (accountPkh) {
      const res = await estimateReward(tezos, foundDex, accountPkh);
      const rewards = fromDecimals(res, TEZOS_TOKEN.metadata.decimals).toString();

      result.rewards = rewards;

      const voter = await foundDex.storage.storage.voters.get(accountPkh);

      if (voter) {
        result.voter = {
          veto: fromDecimals(voter.veto, LP_TOKEN_DECIMALS),
          candidate: voter.candidate,
          vote: fromDecimals(voter.vote, LP_TOKEN_DECIMALS)
        };
      } else {
        result.voter = {
          veto: new BigNumber(0),
          candidate: null,
          vote: new BigNumber(0)
        };
      }

      const share = await getLiquidityShare(tezos, foundDex, accountPkh);
      const frozenBalance = fromDecimals(share.frozen, LP_TOKEN_DECIMALS).toString();
      const totalBalance = fromDecimals(share.total, LP_TOKEN_DECIMALS).toString();

      result.tokenPair = {
        ...pair,
        frozenBalance,
        balance: totalBalance,
        dex: foundDex
      };
    } else {
      result.tokenPair = {
        ...pair,
        frozenBalance: null,
        balance: null,
        dex: foundDex
      };
    }

    return result;
  } catch (err) {
    showErrorToast(err as Error);

    return null;
  }
};
