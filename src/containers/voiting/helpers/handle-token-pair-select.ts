import { Dispatch, SetStateAction } from 'react';

import { FoundDex, findDex, estimateReward, getLiquidityShare } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

import { FACTORIES, TEZOS_TOKEN } from '@app.config';
import { UseToasts } from '@hooks/use-toasts';
import { fromDecimals } from '@utils/helpers';
import { VoterType, QSMainNet, Nullable, WhitelistedTokenPair } from '@utils/types';

export const handleTokenPairSelect = async (
  pair: WhitelistedTokenPair,
  setTokenPair: Dispatch<SetStateAction<WhitelistedTokenPair>>,
  setDex: Dispatch<SetStateAction<Nullable<FoundDex>>>,
  setRewards: Dispatch<SetStateAction<string>>,
  setVoter: Dispatch<SetStateAction<Nullable<VoterType>>>,
  showErrorToast: UseToasts['showErrorToast'],
  tezos: Nullable<TezosToolkit>,
  accountPkh: Nullable<string>,
  networkId: QSMainNet
) => {
  if (!tezos || !networkId) {
    setTokenPair(pair);

    return;
  }

  try {
    const secondAsset: { contract: string; id?: number } = {
      contract: pair.token2.contractAddress,
      id: pair.token2.fa2TokenId
    };

    const foundDex = await findDex(tezos, FACTORIES[networkId], secondAsset);
    setDex(foundDex);

    if (accountPkh) {
      const res = await estimateReward(tezos, foundDex, accountPkh);
      const rewards = fromDecimals(res, TEZOS_TOKEN.metadata.decimals).toString();
      setRewards(rewards);

      const voter = await foundDex.storage.storage.voters.get(accountPkh);

      if (voter) {
        setVoter({
          veto: fromDecimals(voter.veto, TEZOS_TOKEN.metadata.decimals),
          candidate: voter.candidate,
          vote: fromDecimals(voter.vote, TEZOS_TOKEN.metadata.decimals)
        });
      } else {
        setVoter({} as VoterType);
      }

      const share = await getLiquidityShare(tezos, foundDex, accountPkh);
      const frozenBalance = fromDecimals(share.frozen, TEZOS_TOKEN.metadata.decimals).toString();
      const totalBalance = fromDecimals(share.total, TEZOS_TOKEN.metadata.decimals).toString();

      setTokenPair({
        ...pair,
        frozenBalance,
        balance: totalBalance,
        dex: foundDex
      });
    } else {
      setTokenPair({
        ...pair,
        frozenBalance: '0',
        balance: '0',
        dex: foundDex
      });
    }
  } catch (err) {
    showErrorToast(err as Error);
  }
};
