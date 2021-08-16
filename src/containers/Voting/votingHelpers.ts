import {
  estimateReward, findDex, FoundDex, getLiquidityShare,
} from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { VoterType, WhitelistedTokenPair } from '@utils/types';
import { FACTORIES } from '@utils/defaults';

type QSMainNet = 'mainnet' | 'florencenet';

export const hanldeTokenPairSelect = (
  pair: WhitelistedTokenPair,
  setTokenPair: (pair: WhitelistedTokenPair) => void,
  setDex: (dex: FoundDex) => void,
  setRewards: (reward: string) => void,
  setVoter: (voter: VoterType) => any,
  tezos: TezosToolkit | null,
  accountPkh: string | null,
  networkId?: QSMainNet,
) => {
  const asyncFunc = async () => {
    if (!tezos || !accountPkh || !networkId) {
      setTokenPair(pair);
      return;
    }
    try {
      const secondAsset = {
        contract: pair.token2.contractAddress,
        id: pair.token2.fa2TokenId,
      };
      const foundDex = await findDex(tezos, FACTORIES[networkId], secondAsset);
      setDex(foundDex);
      const asyncRewards = async () => {
        const res = await estimateReward(tezos, foundDex, accountPkh);
        const rewards = res.div(new BigNumber(10).pow(new BigNumber(6))).toString();
        setRewards(rewards);
      };
      asyncRewards();
      const asyncVoter = async () => {
        const voter = await foundDex.storage.storage.voters.get(accountPkh);
        if (voter) {
          setVoter({
            veto: voter.veto.div(new BigNumber(10).pow(new BigNumber(6))).toString(),
            candidate: voter.candidate,
            vote: voter.vote.div(new BigNumber(10).pow(new BigNumber(6))).toString(),
          });
        } else setVoter({} as VoterType);
      };
      asyncVoter();
      const share = await getLiquidityShare(tezos, foundDex, accountPkh!!);

      const frozenBalance = share.frozen.div(
        new BigNumber(10)
          .pow(
            // TODO: allow token->token
            new BigNumber(6),
          ),
      ).toString();
      const totalBalance = share.total.div(
        new BigNumber(10)
          .pow(
            // new BigNumber(pair.token2.metadata.decimals),
            new BigNumber(6),
          ),
      ).toString();
      const res = {
        ...pair, frozenBalance, balance: totalBalance, dex: foundDex,
      };
      setTokenPair(res);
    } catch (err) {
      console.error(err);
    }
  };
  asyncFunc();
};
